import { Group } from '@/interfaces/groupInterfaces'
import { MatchData } from '@/interfaces/matchInterfaces'
import { NewPlayerData } from '@/interfaces/playerInterfaces'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchGroup(id: string) {
	try {
		const res = await fetch(`${API_URL}/api/v1/groups/${id}`, {
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to fetch group')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching group', error)
		throw error
	}
}

export async function fetchGroupPlayers(id: string) {
	try {
		const res = await fetch(`${API_URL}/api/v1/groups/${id}/players`, {
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to fetch group players')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching group players', error)
		throw error
	}
}

export async function createGroup(groupData: Group) {
	try {
		const res = await fetch(`${API_URL}/api/v1/groups`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(groupData),
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to create group')
		}
		return res.json()
	} catch (error) {
		console.error('Error creating group', error)
		throw error
	}
}

export async function deleteGroup(groupId: string) {
	const res = await fetch(`${API_URL}/api/v1/groups/${groupId}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!res.ok) {
		throw new Error('Failed to delete group')
	}
	return res.json()
}

export async function createMatch(matchData: MatchData) {
	try {
		const res = await fetch(`${API_URL}/api/v1/matches`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(matchData),
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to create match')
		}
		return res.json()
	} catch (error) {
		console.error('Error creating match', error)
		throw error
	}
}

export async function createPlayer(groupId: string, playerData: NewPlayerData) {
	try {
		const res = await fetch(`${API_URL}/api/v1/groups/${groupId}/players`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(playerData),
			credentials: 'include',
		})
		const createdPlayer = await res.json()
		return createdPlayer
	} catch (error) {
		console.error('Error creating player', error)
		throw error
	}
}

export async function removePlayer(groupId: string, playerId: number) {
	try {
		const res = await fetch(
			`${API_URL}/api/v1/groups/${groupId}/players/${playerId}`,
			{
				method: 'DELETE',
				credentials: 'include',
			}
		)
		if (!res.ok) {
			throw new Error('Failed to remove player')
		}
		return res.json()
	} catch (error) {
		console.error('Error removing player', error)
		throw error
	}
}

export async function deleteMatch(matchId: number) {
	try {
		const res = await fetch(`${API_URL}/api/v1/matches/${matchId}`, {
			method: 'DELETE',
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to delete match')
		}
		return res.json()
	} catch (error) {
		console.error('Error deleting match', error)
		throw error
	}
}

export async function fetchMatch(matchId: number) {
	try {
		const res = await fetch(`${API_URL}/api/v1/matches/${matchId}`, {
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to fetch match')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching match', error)
		throw error
	}
}

export async function updateMatch(matchId: number, matchData: MatchData) {
	try {
		const res = await fetch(`${API_URL}/api/v1/matches/${matchId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(matchData),
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to update match')
		}
		return res.json()
	} catch (error) {
		console.error('Error updating match', error)
		throw error
	}
}
