import { createGroup } from '@/api/groupApi'
import { useMutation } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const useCreateGroupMutation = (
	tournamentId: string,
	router: AppRouterInstance
) =>
	useMutation({
		mutationFn: createGroup,
		onSuccess: () => {
			router.push(`/tournaments/${tournamentId}`)
		},
		onError: error => {
			console.error('Error creating tournament:', error)
		},
	})
