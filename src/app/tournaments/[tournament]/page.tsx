import { fetchTournament, fetchTournamentGroups } from '@/api/tournamentsApi'
import { Tournament, TournamentGroup } from '@/interfaces/tournamentInterfaces'

export default async function SingleTournamentPage({
	params,
}: {
	params: Promise<{ tournament: string }>
}) {
	const { tournament } = await params

	const tournamentData = await fetchTournament(tournament)
	const tournamentGroups = await fetchTournamentGroups(tournament)

	return (
		<div>
			{tournamentData.map((tournament: Tournament) => (
				<div key={tournament.id}>
					<h1>{tournament.name}</h1>
					<p>
						Start Date: {tournament.start_date} End Date: {tournament.end_date}
					</p>
					<p>Status: {tournament.status}</p>
				</div>
			))}
			<div> Groups: </div>
			{tournamentGroups.map((group: TournamentGroup) => (
				<div key={group.id}>
					<p>
						{group.name} - Status: {group.status}
					</p>
				</div>
			))}
		</div>
	)
}
