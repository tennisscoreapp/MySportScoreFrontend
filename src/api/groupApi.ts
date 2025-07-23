import { MatchData } from '@/app/groups/[group]/addmatch/page'
import { NewPlayerData } from '@/app/groups/[group]/addplayers/page'

export async function fetchGroup(id: string) {
	try {
		const res = await fetch(`http://localhost:5000/api/v1/groups/${id}`)
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
		const res = await fetch(`http://localhost:5000/api/v1/groups/${id}/players`)
		if (!res.ok) {
			throw new Error('Failed to fetch group players')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching group players', error)
		throw error
	}
}

export async function createMatch(matchData: MatchData) {
	try {
		const res = await fetch('http://localhost:5000/api/v1/matches', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(matchData),
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
		const res = await fetch(
			`http://localhost:5000/api/v1/groups/${groupId}/players`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(playerData),
			}
		)
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
			`http://localhost:5000/api/v1/groups/${groupId}/players/${playerId}`,
			{
				method: 'DELETE',
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
		const res = await fetch(`http://localhost:5000/api/v1/matches/${matchId}`, {
			method: 'DELETE',
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
		const res = await fetch(`http://localhost:5000/api/v1/matches/${matchId}`)
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
		const res = await fetch(`http://localhost:5000/api/v1/matches/${matchId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(matchData),
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
