import { MatchData } from '@/interfaces/matchInterfaces'
import { groupService } from '@/service/group.service'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useCreateMatchMutation = (
	groupId: string,
	queryClient: QueryClient
) =>
	useMutation({
		mutationFn: (matchData: MatchData) => groupService.createMatch(matchData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['matches', groupId] })
		},
		onError: error => {
			console.error('Error creating match:', error)
		},
	})
