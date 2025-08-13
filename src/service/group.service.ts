import {
	Group,
	GroupResponse,
	Match,
	Player,
} from '@/interfaces/groupInterfaces'
import { MatchData } from '@/interfaces/matchInterfaces'
import { NewPlayerData } from '@/interfaces/playerInterfaces'
import { BaseService } from './base.service'

class GroupService extends BaseService {
	async fetchGroup(groupId: string): Promise<GroupResponse[]> {
		return this.get<GroupResponse[]>(`/api/v1/groups/${groupId}`)
	}

	async fetchGroupPlayers(id: string): Promise<Player[]> {
		return this.get<Player[]>(`/api/v1/groups/${id}/players`)
	}

	async createGroup(groupData: Group): Promise<Group> {
		return this.post<Group>('/api/v1/groups', groupData)
	}

	async deleteGroup(groupId: string): Promise<unknown> {
		return this.delete(`/api/v1/groups/${groupId}`)
	}

	async createMatch(matchData: MatchData): Promise<Match> {
		return this.post<Match>('/api/v1/matches', matchData)
	}

	async createPlayer(
		groupId: string,
		playerData: NewPlayerData
	): Promise<Player> {
		return this.post<Player>(`/api/v1/groups/${groupId}/players`, playerData)
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

	async updateMatch(matchId: number, matchData: MatchData): Promise<Match> {
		return this.put<Match>(`/api/v1/matches/${matchId}`, matchData)
	}
}

export const groupService = new GroupService()
