export interface Tournament {
	scoring_mode?: 'tennis' | 'legacy'
	id: number
	user_id: number
	name: string
	year: number
	start_date: string
	end_date: string
	status: 'active' | 'completed' | 'cancelled'
	created_at: string
	public_token: string
}

export interface TournamentGroup {
	id: number
	tournament_id: number
	name: string
	status: 'active' | 'completed' | 'cancelled'
	created_at: string
	is_public: boolean
}
