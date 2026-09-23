import { groupService } from '@/service/group.service'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useRemovePlayer = (groupId: string, queryClient: QueryClient) =>
	useMutation({
		mutationFn: (playerId: number) =>
			groupService.removePlayer(groupId, playerId),
		onSuccess: () => Promise.all([
			queryClient.invalidateQueries({ queryKey: ['players', groupId] }),
			queryClient.invalidateQueries({ queryKey: ['group', groupId] }),
		]),
		onError: error => {
			console.error('Error removing player:', error)
		},
	})
