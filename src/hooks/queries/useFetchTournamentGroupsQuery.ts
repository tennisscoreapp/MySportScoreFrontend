import { fetchTournamentGroups } from '@/api/tournamentsApi'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentGroupsQuery = (tournament: string) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['tournamentGroups', tournament],
		queryFn: () => fetchTournamentGroups(tournament),
	})

	return {
		data,
		isLoading,
		isError,
	}
}
