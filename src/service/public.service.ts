import { PublicGroup, PublicTournament } from '@/interfaces/publicInterfaces'
import { BaseService } from './base.service'

class PublicService extends BaseService {
	async fetchTournament(token: string): Promise<PublicTournament> {
		return this.get<PublicTournament>(`/api/v1/public/tournaments/${token}`)
	}

	async fetchGroup(token: string, groupId: string): Promise<PublicGroup> {
		return this.get<PublicGroup>(
			`/api/v1/public/tournaments/${token}/groups/${groupId}`
		)
	}
}

export const publicService = new PublicService()
