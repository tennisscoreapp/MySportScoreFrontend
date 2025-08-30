import { GroupResponse } from '@/interfaces/groupInterfaces'
import { groupService } from '@/service/group.service'
import { QueryClient, useMutation } from '@tanstack/react-query'

export const useDeleteMatchMutation = (
	groupId: string,
	queryClient: QueryClient
) =>
	useMutation({
		mutationFn: (matchId: number) => groupService.deleteMatch(matchId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['group', groupId] })
		},
		onMutate: async (matchId: number) => {
			await queryClient.cancelQueries({ queryKey: ['group', groupId] })
			const previousData = queryClient.getQueryData(['group', groupId])
			queryClient.setQueryData(
				['group', groupId],
				(old: GroupResponse[] | undefined) => {
					if (!old) return old
					return old?.map((groupItem: GroupResponse) => ({
						...groupItem,
						group_data: {
							...groupItem.group_data,
							matches:
								groupItem.group_data.matches?.filter(
									match => match.id !== matchId
								) || [],
						},
					}))
				}
			)
			return { previousData }
		},
		onError: (err, matchId, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(['group', groupId], context.previousData)
			}
		},
	})
