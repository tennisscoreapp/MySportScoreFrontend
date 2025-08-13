import { Tournament } from '@/interfaces/tournamentInterfaces'
import { tournamentService } from '@/service/tournament.service'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentsQuery = () => {
	const { data, isLoading, isError, error } = useQuery<Tournament[]>({
		queryKey: ['tournaments'],
		queryFn: () => tournamentService.fetchTournaments(),
	})

	return { data, isLoading, isError, error }
}
