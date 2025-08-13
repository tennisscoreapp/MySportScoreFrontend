import { Player } from '@/interfaces/groupInterfaces'
import { groupService } from '@/service/group.service'
import { useQuery } from '@tanstack/react-query'

export const useFetchGroupPlayers = (groupId: string) => {
	const { data, isLoading, isError, error } = useQuery<Player[]>({
		queryKey: ['players', groupId],
		queryFn: () => groupService.fetchGroupPlayers(groupId),
	})

	return { data, isLoading, isError, error }
}
