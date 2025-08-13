import { tournamentService } from '@/service/tournament.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteTournamentMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (tournamentId: string) =>
			tournamentService.deleteTournament(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tournaments'] })
		},
		onError: error => {
			console.error('Error deleting tournament:', error)
		},
	})
}
