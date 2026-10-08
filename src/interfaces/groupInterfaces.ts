export interface GroupResponse {
	group_data: GroupData
}

export interface GroupData {
	matches: Match[]
	players: Player[]
	group: Group
	standings?: PlayerStanding[]
}

export interface PlayerStanding {
	player_id: number
	matchesPlayed: number
	matchesWon: number
	setsWon: number
	setsLost: number
	setsDifference: number
	gamesWon: number
	gamesLost: number
	gamesDifference: number
}

export interface Group {
	tournament_id: number
	name: string
	status: 'active' | 'completed'
	sets_to_win?: number
	scoring_mode?: 'tennis' | 'legacy'
}

export interface Match {
	legacy?: boolean
	id: number
	group_id: number
	player1_id: number
	player2_id: number
	winner_id: number | null
	status: 'active' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
	version?: number
	match_date: string
	created_at: string
	player1_first_name: string
	player1_last_name: string
	player2_first_name: string
	player2_last_name: string
	winner_first_name: string
	winner_last_name: string
	sets: Set[]
}

export interface Set {
	set_number: number
	player1_games: number
	player2_games: number
	tiebreak_player1?: number | null
	tiebreak_player2?: number | null
}

export interface Player {
	id: number
	first_name: string
	last_name: string
	email?: string
	phone?: string
	status: 'active' | 'inactive'
}
