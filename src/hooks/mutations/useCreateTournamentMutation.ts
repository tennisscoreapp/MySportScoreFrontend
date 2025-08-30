import { Tournament } from '@/interfaces/tournamentInterfaces'
import { tournamentService } from '@/service/tournament.service'
import { useMutation } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const useCreateTournamentMutation = (router: AppRouterInstance) =>
	useMutation({
		mutationFn: (tournament: Tournament) =>
			tournamentService.createTournament({
				name: tournament.name,
				year: tournament.year,
				start_date: tournament.start_date,
				end_date: tournament.end_date,
			}),
		onSuccess: () => {
			router.push('/tournaments')
		},
		onError: error => {
			console.error('Error creating tournament:', error)
		},
	})
