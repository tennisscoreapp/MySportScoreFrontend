import { createPlayer } from '@/api/groupApi'
import { NewPlayerData } from '@/interfaces/playerInterfaces'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useCreatePlayerMutation = (
	groupId: string,
	queryClient: QueryClient
) =>
	useMutation({
		mutationFn: (playerData: NewPlayerData) =>
			createPlayer(groupId, playerData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['players', groupId] })
		},
		onError: error => {
			console.error('Error creating player:', error)
		},
	})
