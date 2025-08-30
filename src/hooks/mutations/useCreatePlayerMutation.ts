import { PlayerSendData } from '@/interfaces/playerInterfaces'
import { groupService } from '@/service/group.service'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useCreatePlayerMutation = (
	groupId: string,
	queryClient: QueryClient
) =>
	useMutation({
		mutationFn: (playerData: PlayerSendData) =>
			groupService.createPlayer(groupId, playerData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['players', groupId] })
		},
		onError: error => {
			console.error('Error creating player:', error)
		},
	})
