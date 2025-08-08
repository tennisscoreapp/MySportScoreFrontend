import { fetchGroup } from '@/api/groupApi'
import { GroupResponse } from '@/interfaces/groupInterfaces'
import { useQuery } from '@tanstack/react-query'

export const useFetchGroupQuery = (groupId: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['group', groupId],
		queryFn: () => fetchGroup(groupId) as Promise<GroupResponse[]>,
	})

	return {
		data,
		isLoading,
		error,
	}
}
