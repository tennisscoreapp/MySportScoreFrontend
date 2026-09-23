import { MatchData } from '@/interfaces/matchInterfaces'
import { groupService } from '@/service/group.service'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useUpdateMatchMutation = (
	matchId: string,
	queryClient: QueryClient,
	groupId: string
) =>
	useMutation({
		mutationFn: (matchData: MatchData) =>
			groupService.updateMatch(Number(matchId), matchData),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['group', groupId] }),
		onError: error => {
			console.error('Error updating match:', error)
		},
	})
