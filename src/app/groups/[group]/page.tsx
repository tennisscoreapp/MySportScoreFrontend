import GroupClient from './GroupClient'

export default async function GroupPage({
	params,
}: {
	params: Promise<{ group: string }>
}) {
	const { group } = await params

	return <GroupClient group={group} />
}
