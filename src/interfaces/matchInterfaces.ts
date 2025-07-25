export interface MatchFormData {
	group_id: number
	player1_id: number
	player2_id: number
	winner_id: number | null
	match_date: string
	status: 'active' | 'completed' | 'cancelled'
	sets: {
		set_number: number
		player1_games: number
		player2_games: number
	}[]
}

export interface MatchData {
	group_id: number
	player1_id: number
	player2_id: number
	winner_id: number | null
	status: 'active' | 'completed' | 'cancelled'
	match_date: string
	sets: {
		set_number: number
		player1_games: number
		player2_games: number
	}[]
}
