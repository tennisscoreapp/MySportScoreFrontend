import { Tournament } from '@/interfaces/tournamentInterfaces'
import { tournamentService } from '@/service/tournament.service'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentQuery = (tournament: string) => {
	const { data, isLoading, isError } = useQuery<Tournament[]>({
		queryKey: ['tournament', tournament],
		queryFn: () => tournamentService.fetchTournament(tournament),
	})

	return {
		data,
		isLoading,
		isError,
	}
}
