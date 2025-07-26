import { fetchTournaments } from '@/api/tournamentsApi'
import { Tournament } from '@/interfaces/tournamentInterfaces'
import { useQuery } from '@tanstack/react-query'

export const useFetchTournamentsQuery = () => {
	const { data, isLoading, isError, error } = useQuery<Tournament[]>({
		queryKey: ['tournaments'],
		queryFn: () => fetchTournaments(),
	})

	return { data, isLoading, isError, error }
}
