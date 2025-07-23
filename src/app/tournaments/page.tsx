'use client'

import { fetchTournaments } from '@/api/tournamentsApi'
import { Tournament } from '@/interfaces/tournamentInterfaces'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function Tournaments() {
	const { data, isLoading, isError, error } = useQuery<Tournament[]>({
		queryKey: ['tournaments'],
		queryFn: fetchTournaments,
	})

	if (isLoading) return <div>Loading...</div>
	if (isError) return <div>Error: {error.message}</div>

	return (
		<div>
			<h1>Tournaments</h1>
			<ul>
				{data?.map(tournament => (
					<li key={tournament.id}>
						<Link href={`/tournaments/${tournament.id}`}>
							{tournament.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
