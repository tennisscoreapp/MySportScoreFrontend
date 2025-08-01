import CreateGroupClient from './CreateGroupClient'

export default async function CreateGroup({
	params,
}: {
	params: Promise<{ tournament: string }>
}) {
	const { tournament: tournamentId } = await params
	return <CreateGroupClient tournamentId={tournamentId} />
}
