import { GroupResponse, GroupSettings } from '@/interfaces/groupInterfaces'
import { groupService } from '@/service/group.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateGroupSettingsMutation = (groupId: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (settings: Partial<GroupSettings>) =>
			groupService.updateGroupSettings(groupId, settings),
		onSuccess: (saved: GroupSettings) => {
			queryClient.setQueryData(
				['group', groupId],
				(old: GroupResponse[] | undefined) =>
					old?.map(item => ({
						...item,
						group_data: {
							...item.group_data,
							group: { ...item.group_data.group, ...saved },
						},
					}))
			)
			// the tournament page shows the public link only when a group is public
			queryClient.invalidateQueries({ queryKey: ['tournamentGroups'] })
		},
		onError: error => {
			console.error('Error updating group settings:', error)
			queryClient.invalidateQueries({ queryKey: ['group', groupId] })
		},
	})
}
