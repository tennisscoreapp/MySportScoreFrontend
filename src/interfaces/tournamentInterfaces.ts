export interface Tournament {
	id: number
	name: string
	year: number
	start_date: string
	end_date: string
	status: 'active' | 'completed' | 'cancelled'
	created_at: string
}

export interface TournamentGroup {
	id: number
	tournament_id: number
	name: string
	status: 'active' | 'completed' | 'cancelled'
	created_at: string
}
