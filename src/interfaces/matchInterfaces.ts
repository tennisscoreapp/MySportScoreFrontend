export interface MatchFormData {
	group_id: number
	player1_id: number
	player2_id: number
	winner_id: number | null
	match_date: string
	status: 'active' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
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
	status: 'active' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
	version?: number
	request_id?: string
	match_date: string
	sets: {
		set_number: number
		player1_games: number
		player2_games: number
		tiebreak_player1?: number | null
		tiebreak_player2?: number | null
	}[]
}
