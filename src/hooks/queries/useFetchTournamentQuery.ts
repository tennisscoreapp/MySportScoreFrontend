import { fetchTournament } from '@/api/tournamentsApi'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentQuery = (tournament: string) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['tournament', tournament],
		queryFn: () => fetchTournament(tournament),
	})

	return {
		data,
		isLoading,
		isError,
	}
}
