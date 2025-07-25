import { fetchGroup } from '@/api/groupApi'
import { useQuery } from '@tanstack/react-query'

export const useFetchGroupQuery = (groupId: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['group', groupId],
		queryFn: () => fetchGroup(groupId),
	})

	return {
		data,
		isLoading,
		error,
	}
}
