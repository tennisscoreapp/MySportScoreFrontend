export interface GroupResponse {
	group_data: GroupData
}

export interface GroupData {
	matches: Match[]
	players: Player[]
	group: Group
}

export interface Group {
	tournament_id: number
	name: string
	status: 'active' | 'completed'
}

export interface Match {
	id: number
	group_id: number
	player1_id: number
	player2_id: number
	winner_id: number
	status: 'active' | 'completed' | 'cancelled'
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
}

export interface Player {
	id: number
	first_name: string
	last_name: string
	email?: string
	phone?: string
	status: 'active' | 'inactive'
}
