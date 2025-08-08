'use client'
import { Button } from '@/components/ui/button'
import { GroupResponse, Player } from '@/interfaces/groupInterfaces'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { UseMutationResult } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { DataTable } from '../ui/data-table'
import { createColumns } from './columns'
import { handleDownloadPDFUtil } from './handleDownloadPDF'
import MatchHistory from './MatchHistory'

function GroupClient({
	groupData,
	isLoading,
	error,
	deleteMatchMutation,
	tournamentId,
	groupId,
}: {
	groupData: GroupResponse[]
	isLoading: boolean
	error: string | null
	deleteMatchMutation: UseMutationResult<void, Error, number>
	tournamentId: string
	groupId: string
}) {
	const t = useTranslations('TournamentGroup')
	const [exportView, setExportView] = useState(false)
	const pdfRef = useRef<HTMLDivElement>(null)

	const handleDownloadPDF = async () => {
		const inputData = pdfRef.current
		if (inputData) {
			handleDownloadPDFUtil(inputData)
		}
	}

	if (isLoading) return <div className='p-6'>{t('group_loading')}</div>
	if (error) return <div className='p-6'>{t('error_loading')}</div>
	if (!groupData) return <div className='p-6'>{t('no_data')}</div>

	return (
		<div>
			<div>
				{groupData?.map((group: GroupResponse) => {
					const groupPlayersData =
						sortPlayers(
							group.group_data?.players,
							group.group_data?.matches
						)?.map((player: Player, index: number) => {
							const stats = calculatePlayerStats(
								player?.id,
								group.group_data?.matches
							)
							return {
								player_name: `${index + 1}. ${player.first_name} ${
									player.last_name
								}`,
								matches_played: stats.matchesPlayed,
								matches_won: stats.matchesWon,
								sets_played: `${stats.setsWon} - ${stats.setsLost}`,
								sets_difference: stats.setsDifference,
								games_played: `${stats.gamesWon} - ${stats.gamesLost}`,
								games_difference: stats.gamesDifference,
							}
						}) || []

					return (
						<div
							key={group.group_data.matches?.[0]?.id}
							className='flex flex-col gap-10 p-10'
							ref={pdfRef}
						>
							<div className='text-2xl font-bold text-center'>
								{group.group_data.group.name}
							</div>
							<div className='overflow-x-auto'>
								<DataTable
									columns={createColumns(t)}
									data={groupPlayersData}
									emptyMessage={t('group_table.no_data')}
								/>
							</div>
							<MatchHistory
								exportView={exportView}
								matches={group?.group_data?.matches || []}
								tournamentId={tournamentId}
								groupId={groupId}
								onDeleteMatch={deleteMatchMutation}
							/>
						</div>
					)
				})}
			</div>
			<div className='no-print mt-10 pl-10 pr-10'>
				<div className='flex gap-4 flex-col lg:flex-row lg:gap-0 mt-10 justify-between'>
					<div className='flex flex-row gap-4'>
						<Link
							href={`/tournaments/${tournamentId}/groups/${groupId}/addmatch`}
						>
							<Button>{t('buttons.add_match')}</Button>
						</Link>
						<Link
							href={`/tournaments/${tournamentId}/groups/${groupId}/addplayers`}
						>
							<Button>{t('buttons.add_players')}</Button>
						</Link>
					</div>
					<div className='flex flex-row gap-4'>
						<Button onClick={() => setExportView(!exportView)}>
							{t('buttons.toggle_export_view')}
						</Button>
						<Link href={`/tournaments/${tournamentId}`}>
							<Button>{t('buttons.back')}</Button>
						</Link>
					</div>
				</div>
				<Button
					onClick={handleDownloadPDF}
					variant='secondary'
					className='hover:bg-red-500 hover:text-white mt-4'
				>
					<Printer />
					{t('buttons.export_pdf')}
				</Button>
			</div>
		</div>
	)
}
export default GroupClient
