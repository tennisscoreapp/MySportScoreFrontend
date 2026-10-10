'use client'
import GroupClient from '@/components/Group/GroupClient'
import PublicUnavailable from '@/components/Public/PublicUnavailable'
import { usePublicGroupQuery } from '@/hooks/queries/usePublicQueries'
import { useParams } from 'next/navigation'

export default function PublicGroupPage() {
	const { token, group } = useParams<{ token: string; group: string }>()
	const { data, isLoading, isError } = usePublicGroupQuery(token, group)

	if (isError) return <PublicUnavailable />

	return (
		<div className='lg:p-10'>
			<GroupClient
				readOnly
				groupId={group}
				tournamentId=''
				tournamentName={data?.tournament_name ?? ''}
				groupData={data ? [{ group_data: data.group_data }] : []}
				isLoading={isLoading}
				error={null}
				backHref={`/public/${token}`}
				settings={data?.group_data.group}
			/>
		</div>
	)
}
