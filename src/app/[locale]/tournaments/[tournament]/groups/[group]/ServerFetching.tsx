import GroupClient from '@/components/Group/GroupClient'
import { useDeleteMatchMutation } from '@/hooks/mutations/useDeleteMatchMutation'
import { useFetchGroupQuery } from '@/hooks/queries/useFetchGroupQuery'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { Params } from 'next/dist/server/request/params'

function ServerFetching({ params }: { params: Params }) {
	const { group, tournament } = params
	const groupId = typeof group === 'string' ? group : String(group)
	const tournamentId =
		typeof tournament === 'string' ? tournament : String(tournament)
	const queryClient = useQueryClient()
	const { data: groupData, isLoading, error } = useFetchGroupQuery(groupId)
	const deleteMatchMutation = useDeleteMatchMutation(groupId, queryClient)
	return (
		<GroupClient
			groupId={groupId}
			groupData={groupData || []}
			isLoading={isLoading}
			error={error ? error.message : null}
			deleteMatchMutation={
				deleteMatchMutation as UseMutationResult<void, Error, number>
			}
			tournamentId={tournamentId}
		/>
	)
}

export default ServerFetching
