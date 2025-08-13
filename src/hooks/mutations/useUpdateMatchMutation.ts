import { MatchData } from '@/interfaces/matchInterfaces'
import { groupService } from '@/service/group.service'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useUpdateMatchMutation = (
	matchId: string,
	queryClient: QueryClient
) =>
	useMutation({
		mutationFn: (matchData: MatchData) =>
			groupService.updateMatch(Number(matchId), matchData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] })
		},
		onError: error => {
			console.error('Error updating match:', error)
		},
	})
