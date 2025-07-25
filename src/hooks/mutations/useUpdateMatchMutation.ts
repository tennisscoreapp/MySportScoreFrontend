import { updateMatch } from '@/api/groupApi'
import { MatchData } from '@/interfaces/matchInterfaces'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useUpdateMatchMutation = (
	matchId: string,
	queryClient: QueryClient
) =>
	useMutation({
		mutationFn: (matchData: MatchData) =>
			updateMatch(Number(matchId), matchData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] })
		},
		onError: error => {
			console.error('Error updating match:', error)
		},
	})
