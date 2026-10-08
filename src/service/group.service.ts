import {
	Group,
	GroupResponse,
	Match,
	Player,
} from '@/interfaces/groupInterfaces'
import { MatchData } from '@/interfaces/matchInterfaces'
import { PlayerSendData } from '@/interfaces/playerInterfaces'
import { BaseService } from './base.service'

class GroupService extends BaseService {
	async fetchGroup(groupId: string): Promise<GroupResponse[]> {
		return this.get<GroupResponse[]>(`/api/v1/groups/${groupId}`)
	}

	async fetchGroupPlayers(id: string): Promise<Player[]> {
		return this.get<Player[]>(`/api/v1/groups/${id}/players`)
	}

	async createGroup(groupData: Group): Promise<Group> {
		return this.post<Group>('/api/v1/groups', { tournament_id: groupData.tournament_id, name: groupData.name })
	}

	async deleteGroup(groupId: string): Promise<unknown> {
		return this.delete(`/api/v1/groups/${groupId}`)
	}

	async createMatch(matchData: MatchData): Promise<SavedMatch> {
		return this.post<SavedMatch>('/api/v1/matches', matchData)
	}

	async createPlayer(
		groupId: string,
		playerData: PlayerSendData
	): Promise<Player> {
		const { first_name, last_name, email, phone, status } = playerData
		return this.post<Player>(`/api/v1/groups/${groupId}/players`, {
			first_name, last_name, email, phone, status: status === 'inactive' ? 'withdrawn' : status,
		})
	}

	async removePlayer(groupId: string, playerId: number): Promise<unknown> {
		return this.delete(`/api/v1/groups/${groupId}/players/${playerId}`)
	}

	async deleteMatch(matchId: number): Promise<unknown> {
		return this.delete(`/api/v1/matches/${matchId}`)
	}

	async fetchMatch(matchId: number): Promise<Match> {
		return this.get<Match>(`/api/v1/matches/${matchId}`)
	}

	async updateMatch(matchId: number, matchData: MatchData): Promise<SavedMatch> {
		return this.put<SavedMatch>(`/api/v1/matches/${matchId}`, matchData)
	}
}

export interface SavedMatch {
	success: boolean
	match_id?: number
	version?: number
	winner_id?: number | null
}

export const groupService = new GroupService()
