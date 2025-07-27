import { deleteGroup } from '@/api/groupApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteGroupMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (groupId: string) => deleteGroup(groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tournament'] })
			queryClient.invalidateQueries({ queryKey: ['tournamentGroups'] })
		},
		onError: error => {
			console.error('Error deleting group:', error)
		},
	})
}
