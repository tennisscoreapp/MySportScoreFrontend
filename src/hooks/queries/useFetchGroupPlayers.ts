import { fetchGroupPlayers } from '@/api/groupApi'
import { Player } from '@/interfaces/groupInterfaces'
import { useQuery } from '@tanstack/react-query'

export const useFetchGroupPlayers = (groupId: string) => {
	const { data, isLoading, isError, error } = useQuery<Player[]>({
		queryKey: ['players', groupId],
		queryFn: () => fetchGroupPlayers(groupId),
	})

	return { data, isLoading, isError, error }
}
