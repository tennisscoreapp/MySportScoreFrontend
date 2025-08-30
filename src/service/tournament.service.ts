import { Tournament, TournamentGroup } from '@/interfaces/tournamentInterfaces'
import { BaseService } from './base.service'

class TournamentService extends BaseService {
	async fetchTournaments(): Promise<Tournament[]> {
		return this.get<Tournament[]>('/api/v1/tournaments')
	}

	async fetchTournament(id: string): Promise<Tournament[]> {
		return this.get<Tournament[]>(`/api/v1/tournaments/${id}`)
	}

	async fetchTournamentGroups(id: string): Promise<TournamentGroup[]> {
		return this.get<TournamentGroup[]>(`/api/v1/tournaments/${id}/groups`)
	}

	async createTournament(tournament: {
		name: string
		year: number
		start_date: string
		end_date: string
	}): Promise<Tournament> {
		return this.post<Tournament>('/api/v1/tournaments', tournament)
	}

	async deleteTournament(id: string): Promise<unknown> {
		return this.delete(`/api/v1/tournaments/${id}`)
	}
}

export const tournamentService = new TournamentService()
