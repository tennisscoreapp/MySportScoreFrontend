import { groupService } from '@/service/group.service'
import { useMutation } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const useCreateGroupMutation = (
	tournamentId: string,
	router: AppRouterInstance
) =>
	useMutation({
		mutationFn: groupService.createGroup.bind(groupService),
		onSuccess: () => {
			router.push(`/tournaments/${tournamentId}`)
		},
		onError: error => {
			console.error('Error creating group:', error)
		},
	})
