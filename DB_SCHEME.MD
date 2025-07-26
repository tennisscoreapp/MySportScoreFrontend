# Схема базы данных для теннисного приложения

## Описание таблиц

### 1. tournaments (Турниры)

- id: первичный ключ
- name: название турнира
- year: год проведения
- start_date: дата начала
- end_date: дата окончания
- status: статус турнира (active, completed, cancelled)

### 2. groups (Группы)

- id: первичный ключ
- tournament_id: внешний ключ на tournaments
- name: название группы (A, B, C, etc.)
- status: статус группы (active, completed)

### 3. players (Игроки)

- id: первичный ключ
- first_name: имя
- last_name: фамилия
- email: email (уникальный)
- phone: телефон
- created_at: дата создания записи

### 4. group_players (Игроки в группах)

- id: первичный ключ
- group_id: внешний ключ на groups
- player_id: внешний ключ на players
- status: статус участия (active, withdrawn, disqualified)

### 5. matches (Матчи)

- id: первичный ключ
- group_id: внешний ключ на groups
- player1_id: внешний ключ на players (первый игрок)
- player2_id: внешний ключ на players (второй игрок)
- winner_id: внешний ключ на players (победитель, NULL если матч не завершен)
- status: статус матча (scheduled, in_progress, completed, cancelled)
- match_date: дата матча
- created_at: дата создания записи

### 6. sets (Сеты)

- id: первичный ключ
- match_id: внешний ключ на matches
- set_number: номер сета (1, 2, 3, etc.)
- player1_games: количество геймов первого игрока в сете
- player2_games: количество геймов второго игрока в сете
- winner_id: внешний ключ на players (победитель сета)

## SQL запросы для создания схемы

```sql
-- Создание таблицы турниров
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы групп
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, name)
);

-- Создание таблицы игроков
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы игроков в группах
CREATE TABLE group_players (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'disqualified')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, player_id)
);

-- Создание таблицы матчей
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    player1_id INTEGER NOT NULL REFERENCES players(id),
    player2_id INTEGER NOT NULL REFERENCES players(id),
    winner_id INTEGER REFERENCES players(id),
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    match_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (player1_id != player2_id)
);

-- Создание таблицы сетов
CREATE TABLE sets (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    player1_games INTEGER NOT NULL DEFAULT 0,
    player2_games INTEGER NOT NULL DEFAULT 0,
    winner_id INTEGER REFERENCES players(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, set_number),
    CHECK (set_number > 0),
    CHECK (player1_games >= 0 AND player2_games >= 0)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_groups_tournament_id ON groups(tournament_id);
CREATE INDEX idx_group_players_group_id ON group_players(group_id);
CREATE INDEX idx_group_players_player_id ON group_players(player_id);
CREATE INDEX idx_matches_group_id ON matches(group_id);
CREATE INDEX idx_matches_player1_id ON matches(player1_id);
CREATE INDEX idx_matches_player2_id ON matches(player2_id);
CREATE INDEX idx_sets_match_id ON sets(match_id);
CREATE INDEX idx_tournaments_year ON tournaments(year);
CREATE INDEX idx_matches_status ON matches(status);
```

## Дополнительные ограничения и триггеры

```sql
-- Триггер для автоматического обновления статуса группы при завершении всех матчей
CREATE OR REPLACE FUNCTION update_group_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем, завершены ли все матчи в группе
    IF NOT EXISTS (
        SELECT 1 FROM matches
        WHERE group_id = NEW.group_id
        AND status != 'completed'
    ) THEN
        UPDATE groups SET status = 'completed' WHERE id = NEW.group_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_group_status
    AFTER UPDATE ON matches
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_group_status();

-- Триггер для автоматического определения победителя матча
CREATE OR REPLACE FUNCTION update_match_winner()
RETURNS TRIGGER AS $$
DECLARE
    player1_sets INTEGER;
    player2_sets INTEGER;
    match_player1_id INTEGER;
    match_player2_id INTEGER;
BEGIN
    -- Получаем информацию о матче
    SELECT player1_id, player2_id INTO match_player1_id, match_player2_id
    FROM matches WHERE id = NEW.match_id;

    -- Подсчитываем количество выигранных сетов
    SELECT
        COUNT(*) FILTER (WHERE winner_id = match_player1_id),
        COUNT(*) FILTER (WHERE winner_id = match_player2_id)
    INTO player1_sets, player2_sets
    FROM sets
    WHERE match_id = NEW.match_id AND winner_id IS NOT NULL;

    -- Если один из игроков выиграл большинство сетов, обновляем победителя матча
    IF player1_sets > player2_sets THEN
        UPDATE matches SET winner_id = match_player1_id WHERE id = NEW.match_id;
    ELSIF player2_sets > player1_sets THEN
        UPDATE matches SET winner_id = match_player2_id WHERE id = NEW.match_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_match_winner
    AFTER UPDATE ON sets
    FOR EACH ROW
    WHEN (NEW.winner_id IS NOT NULL)
    EXECUTE FUNCTION update_match_winner();
```

## Тестовые данные

```sql
-- Вставка тестовых турниров
INSERT INTO tournaments (name, year, start_date, end_date, status) VALUES
('Весенний турнир', 2024, '2024-03-15', '2024-03-17', 'completed'),
('Летний чемпионат', 2024, '2024-06-10', '2024-06-12', 'active'),
('Осенний кубок', 2024, '2024-09-20', '2024-09-22', 'active'),
('Зимнее первенство', 2024, '2024-12-01', '2024-12-03', 'scheduled'),
('Новогодний турнир', 2024, '2024-12-28', '2024-12-30', 'scheduled');

-- Вставка тестовых групп
INSERT INTO groups (tournament_id, name, status) VALUES
(1, 'A', 'completed'),
(1, 'B', 'completed'),
(2, 'A', 'active'),
(2, 'B', 'active'),
(3, 'A', 'active');

-- Вставка тестовых игроков
INSERT INTO players (first_name, last_name, email, phone) VALUES
('Александр', 'Иванов', 'alex.ivanov@email.com', '+7-900-123-45-67'),
('Мария', 'Петрова', 'maria.petrova@email.com', '+7-900-234-56-78'),
('Дмитрий', 'Сидоров', 'dmitry.sidorov@email.com', '+7-900-345-67-89'),
('Елена', 'Козлова', 'elena.kozlova@email.com', '+7-900-456-78-90'),
('Сергей', 'Морозов', 'sergey.morozov@email.com', '+7-900-567-89-01');

-- Вставка игроков в группы
INSERT INTO group_players (group_id, player_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(1, 3, 'active'),
(2, 4, 'active'),
(2, 5, 'active');

-- Вставка тестовых матчей
INSERT INTO matches (group_id, player1_id, player2_id, winner_id, status, match_date) VALUES
(1, 1, 2, 1, 'completed', '2024-03-15 10:00:00'),
(1, 2, 3, 3, 'completed', '2024-03-15 11:30:00'),
(1, 1, 3, 1, 'completed', '2024-03-15 14:00:00'),
(2, 4, 5, 4, 'completed', '2024-03-16 09:00:00'),
(3, 1, 2, NULL, 'scheduled', '2024-09-20 10:00:00');

-- Вставка тестовых сетов
INSERT INTO sets (match_id, set_number, player1_games, player2_games, winner_id) VALUES
(1, 1, 6, 3, 1),
(1, 2, 6, 4, 1),
(2, 1, 3, 6, 3),
(2, 2, 4, 6, 3),
(3, 1, 6, 2, 1);
```

---AUTH MIGRATION----

CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

ALTER TABLE tournaments
ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_tournaments_user_id ON tournaments(user_id);

ALTER TABLE players
ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_players_user_id ON players(user_id);

ALTER TABLE players DROP CONSTRAINT players_email_key;
CREATE UNIQUE INDEX idx_players_user_email ON players(user_id, email);

CREATE OR REPLACE FUNCTION get_tournament_user_id(tournament_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
RETURN (SELECT user_id FROM tournaments WHERE id = tournament_id);
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION get_group_user_id(group_id INTEGER)
RETURNS INTEGER AS
$$

BEGIN
RETURN (
SELECT t.user_id
FROM tournaments t
JOIN groups g ON t.id = g.tournament_id
WHERE g.id = group_id
);
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION get_match_user_id(match_id INTEGER)
RETURNS INTEGER AS
$$

BEGIN
RETURN (
SELECT t.user_id
FROM tournaments t
JOIN groups g ON t.id = g.tournament_id
JOIN matches m ON g.id = m.group_id
WHERE m.id = match_id
);
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;


ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_self_policy ON users
    FOR ALL USING (id = current_setting('app.current_user_id')::INTEGER);

CREATE POLICY tournaments_user_policy ON tournaments
    FOR ALL USING (user_id = current_setting('app.current_user_id')::INTEGER);

CREATE POLICY groups_user_policy ON groups
    FOR ALL USING (get_tournament_user_id(tournament_id) = current_setting('app.current_user_id')::INTEGER);

CREATE POLICY players_user_policy ON players
    FOR ALL USING (user_id = current_setting('app.current_user_id')::INTEGER);

CREATE POLICY group_players_user_policy ON group_players
    FOR ALL USING (
        get_group_user_id(group_id) = current_setting('app.current_user_id')::INTEGER
        AND EXISTS (SELECT 1 FROM players WHERE id = player_id AND user_id = current_setting('app.current_user_id')::INTEGER)
    );

CREATE POLICY matches_user_policy ON matches
    FOR ALL USING (get_group_user_id(group_id) = current_setting('app.current_user_id')::INTEGER);

CREATE POLICY sets_user_policy ON sets
    FOR ALL USING (get_match_user_id(match_id) = current_setting('app.current_user_id')::INTEGER);

CREATE ROLE app_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;

DO
$$

DECLARE
system_user_id INTEGER;
BEGIN
-- Вставляем системного пользователя и получаем его ID
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES ('admin@system.local', 'temp_hash', 'System', 'Admin')
RETURNING id INTO system_user_id;

    -- Обновление существующих турниров
    UPDATE tournaments SET user_id = system_user_id WHERE user_id IS NULL;

    -- Обновление существующих игроков
    UPDATE players SET user_id = system_user_id WHERE user_id IS NULL;

END $$;

-- Делаем user_id обязательным после миграции данных
ALTER TABLE tournaments ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE players ALTER COLUMN user_id SET NOT NULL;

CREATE OR REPLACE FUNCTION validate_group_player_ownership()
RETURNS TRIGGER AS $$
BEGIN
-- Проверяем, что игрок принадлежит тому же пользователю, что и группа
IF NOT EXISTS (
SELECT 1 FROM players p, groups g, tournaments t
WHERE p.id = NEW.player_id
AND g.id = NEW.group_id
AND t.id = g.tournament_id
AND p.user_id = t.user_id
) THEN
RAISE EXCEPTION 'Игрок не принадлежит владельцу турнира';
END IF;

    RETURN NEW;

END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_group_player_ownership
    BEFORE INSERT OR UPDATE ON group_players
    FOR EACH ROW
    EXECUTE FUNCTION validate_group_player_ownership();
$$
