import { Tournament } from '@/interfaces/tournamentInterfaces'
import { tournamentService } from '@/service/tournament.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const useCreateTournamentMutation = (router: AppRouterInstance) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (tournament: Tournament) =>
			tournamentService.createTournament({
				name: tournament.name,
				year: tournament.year,
				start_date: tournament.start_date,
				end_date: tournament.end_date,
				scoring_mode: tournament.scoring_mode,
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['tournaments'] })
			router.push('/tournaments')
		},
		onError: error => {
			console.error('Error creating tournament:', error)
		},
	})
}
