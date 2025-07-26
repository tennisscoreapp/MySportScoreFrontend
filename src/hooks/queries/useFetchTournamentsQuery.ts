import { fetchTournaments } from '@/api/tournamentsApi'
import { Tournament } from '@/interfaces/tournamentInterfaces'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentsQuery = (userId: number) => {
	const { data, isLoading, isError, error } = useQuery<Tournament[]>({
		queryKey: ['tournaments'],
		queryFn: () => fetchTournaments(userId),
	})

	return { data, isLoading, isError, error }
}
