import { createTournament } from '@/api/tournamentsApi'
import { useMutation } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const useCreateTournamentMutation = (router: AppRouterInstance) =>
	useMutation({
		mutationFn: createTournament,
		onSuccess: () => {
			router.push('/tournaments')
		},
		onError: error => {
			console.error('Error creating tournament:', error)
		},
	})
