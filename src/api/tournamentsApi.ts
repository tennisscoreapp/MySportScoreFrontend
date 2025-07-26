export async function fetchTournaments(userId: number) {
	const res = await fetch(
		`http://localhost:5000/api/v1/tournaments?userId=${userId}`,
		{ credentials: 'include' }
	)
	if (!res.ok) {
		throw new Error('Failed to fetch tournaments')
	}
	return res.json()
}

export async function fetchTournament(id: string, userId: number) {
	console.log('fetchTournament', id, userId)
	try {
		const res = await fetch(
			`http://localhost:5000/api/v1/tournaments/${id}?userId=${userId}`,
			{ credentials: 'include' }
		)
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
	const res = await fetch(
		`http://localhost:5000/api/v1/tournaments/${id}/groups`
	)
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
	userId: number
}) {
	const res = await fetch(
		`http://localhost:5000/api/v1/tournaments?userId=${tournament.userId}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(tournament),
		}
	)

	if (!res.ok) {
		throw new Error('Failed to create tournament')
	}

	return res.json()
}
