import { TournamentGroup } from '@/interfaces/tournamentInterfaces'
import { tournamentService } from '@/service/tournament.service'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentGroupsQuery = (tournament: string) => {
	const { data, isLoading, isError } = useQuery<TournamentGroup[]>({
		queryKey: ['tournamentGroups', tournament],
		queryFn: () => tournamentService.fetchTournamentGroups(tournament),
	})

	return {
		data,
		isLoading,
		isError,
	}
}
