import { GroupResponse } from '@/interfaces/groupInterfaces'
import { groupService } from '@/service/group.service'
import { useQuery } from '@tanstack/react-query'

export const useFetchGroupQuery = (groupId: string) => {
	const { data, isLoading, error } = useQuery<GroupResponse[]>({
		queryKey: ['group', groupId],
		queryFn: () => groupService.fetchGroup(groupId),
	})

	return {
		data,
		isLoading,
		error,
	}
}
