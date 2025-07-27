const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchTournaments() {
	const res = await fetch(`${API_URL}/api/v1/tournaments`, {
		credentials: 'include',
	})
	if (!res.ok) {
		throw new Error('Failed to fetch tournaments')
	}
	return res.json()
}

export async function fetchTournament(id: string) {
	try {
		const res = await fetch(`${API_URL}/api/v1/tournaments/${id}`, {
			credentials: 'include',
		})
		if (!res.ok) {
			throw new Error('Failed to fetch tournament')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching tournament', error)
		throw error
	}
}

export async function fetchTournamentGroups(id: string) {
	const res = await fetch(`${API_URL}/api/v1/tournaments/${id}/groups`, {
		credentials: 'include',
	})
	if (!res.ok) {
		throw new Error('Failed to fetch tournament groups')
	}
	return res.json()
}

export async function createTournament(tournament: {
	name: string
	year: number
	start_date: string
	end_date: string
}) {
	const res = await fetch(`${API_URL}/api/v1/tournaments`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(tournament),
		credentials: 'include',
	})

	if (!res.ok) {
		throw new Error('Failed to create tournament')
	}

	return res.json()
}

export async function deleteTournament(id: string) {
	const res = await fetch(`${API_URL}/api/v1/tournaments/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!res.ok) {
		throw new Error('Failed to delete tournament')
	}
	return res.json()
}
