import GroupClient from './GroupClient'

export default async function GroupPage({
	params,
}: {
	params: Promise<{ group: string; tournament: string }>
}) {
	const { group, tournament } = await params

	return <GroupClient group={group} tournamentId={tournament} />
}
