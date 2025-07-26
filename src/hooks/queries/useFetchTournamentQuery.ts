import { fetchTournament } from '@/api/tournamentsApi'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentQuery = (tournament: string, userId: number) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['tournament', tournament, userId],
		queryFn: () => fetchTournament(tournament, userId),
	})

	return {
		data,
		isLoading,
		isError,
	}
}
