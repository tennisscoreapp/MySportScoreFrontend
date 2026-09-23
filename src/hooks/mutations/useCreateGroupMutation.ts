import { groupService } from '@/service/group.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const useCreateGroupMutation = (
	tournamentId: string,
	router: AppRouterInstance
) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: groupService.createGroup.bind(groupService),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['tournamentGroups', tournamentId] })
			router.push(`/tournaments/${tournamentId}`)
		},
		onError: error => {
			console.error('Error creating group:', error)
		},
	})
}
