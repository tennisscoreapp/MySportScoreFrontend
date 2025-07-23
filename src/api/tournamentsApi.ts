export async function fetchTournaments() {
	const res = await fetch('http://localhost:5000/api/v1/tournaments')
	if (!res.ok) {
		throw new Error('Failed to fetch posts')
	}
	return res.json()
}

export async function fetchTournament(id: string) {
	try {
		const res = await fetch(`http://localhost:5000/api/v1/tournaments/${id}`)
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
}) {
	const res = await fetch('http://localhost:5000/api/v1/tournaments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(tournament),
	})

	if (!res.ok) {
		throw new Error('Failed to create tournament')
	}

	return res.json()
}
