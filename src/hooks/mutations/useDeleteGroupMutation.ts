import { groupService } from '@/service/group.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteGroupMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (groupId: string) => groupService.deleteGroup(groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tournament'] })
			queryClient.invalidateQueries({ queryKey: ['tournamentGroups'] })
		},
		onError: error => {
			console.error('Error deleting group:', error)
		},
	})
}
