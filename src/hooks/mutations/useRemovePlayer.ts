import { removePlayer } from '@/api/groupApi'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useRemovePlayer = (groupId: string, queryClient: QueryClient) =>
	useMutation({
		mutationFn: (playerId: number) => removePlayer(groupId, playerId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['players', groupId] })
		},
		onError: error => {
			console.error('Error removing player:', error)
		},
	})
