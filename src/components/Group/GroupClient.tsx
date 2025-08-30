'use client'
import { Button } from '@/components/ui/button'
import { GroupResponse, Player } from '@/interfaces/groupInterfaces'
import { Tournament } from '@/interfaces/tournamentInterfaces'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { Label } from '@radix-ui/react-label'
import { UseMutationResult } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { DataTable } from '../ui/data-table'
import { Input } from '../ui/input'
import { createColumns } from './columns'
import GroupPagination from './GroupPagination'
import { handleDownloadPDFUtil } from './handleDownloadPDF'
import MatchHistory from './MatchHistory'

function GroupClient({
	groupData,
	isLoading,
	error,
	tournamentData,
	deleteMatchMutation,
	tournamentId,
	groupId,
}: {
	groupData: GroupResponse[]
	isLoading: boolean
	error: string | null
	deleteMatchMutation: UseMutationResult<void, Error, number>
	tournamentData: Tournament[]
	tournamentId: string
	groupId: string
}) {
	const t = useTranslations('TournamentGroup')
	const [exportView, setExportView] = useState(false)
	const [tournamentColor, setTournamentColor] = useState('#ffffff')
	const [numberOfWinners, setNumberOfWinners] = useState(0)
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState<number>(() => {
		if (typeof window === 'undefined') return 6
		const storedValue = Number(window.localStorage.getItem('pageSize'))
		return Number.isFinite(storedValue) && storedValue > 0 ? storedValue : 6
	})
	const pdfRef = useRef<HTMLDivElement>(null)

	const firstGroupMatchesLength =
		groupData?.[0]?.group_data?.matches?.length || 0
	const totalPages = Math.max(1, Math.ceil(firstGroupMatchesLength / pageSize))

	const selectOptions = [3, 6, 9, 12]

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('pageSize', String(pageSize))
		}
	}, [pageSize])

	useEffect(() => {
		if (page > totalPages) setPage(totalPages)
	}, [totalPages, page])

	const handleDownloadPDF = async () => {
		const inputData = pdfRef.current
		if (inputData) {
			handleDownloadPDFUtil(
				inputData,
				groupData?.[0]?.group_data?.group.name || 'No_Name'
			)
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
								index: index + 1,
								player_name: player.first_name,
								player_last_name: player.last_name,
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
								{tournamentData[0]?.name}
							</div>
							<div
								className='text-2xl font-bold text-center'
								style={{ color: tournamentColor }}
							>
								{group.group_data.group.name}
							</div>
							<div className='overflow-x-auto'>
								<DataTable
									columns={createColumns(t, numberOfWinners, tournamentColor)}
									data={groupPlayersData}
									emptyMessage={t('group_table.no_data')}
								/>
							</div>
							{(() => {
								const matches = group?.group_data?.matches || []
								const sortedMatches = [...matches].sort(
									(a, b) =>
										new Date(a.match_date).getTime() -
										new Date(b.match_date).getTime()
								)
								const start = (page - 1) * pageSize
								const end = start + pageSize
								const pageMatches = sortedMatches.slice(start, end)

								return (
									<MatchHistory
										exportView={exportView}
										matches={pageMatches}
										tournamentId={tournamentId}
										groupId={groupId}
										onDeleteMatch={deleteMatchMutation}
									/>
								)
							})()}
						</div>
					)
				})}
			</div>
			<div className='no-print mt-10 pl-10 pr-10'>
				<GroupPagination
					pageSize={pageSize}
					setPageSize={setPageSize}
					page={page}
					setPage={setPage}
					totalPages={totalPages}
					selectOptions={selectOptions}
				/>

				<div className='flex gap-4 flex-col lg:flex-row lg:gap-0 mt-10 justify-between'>
					<div className='flex flex-col lg:flex-row gap-4'>
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
					<div className='flex flex-col lg:flex-row gap-4'>
						<Button onClick={() => setExportView(!exportView)}>
							{t('buttons.toggle_export_view')}
						</Button>
						<Link href={`/tournaments/${tournamentId}`}>
							<Button>{t('buttons.back')}</Button>
						</Link>
					</div>
				</div>
				<div className='flex items-center justify-center gap-4 mt-10'>
					<Button
						onClick={handleDownloadPDF}
						variant='secondary'
						className='hover:bg-red-500 hover:text-white mt-4'
					>
						<Printer />
						{t('buttons.export_pdf')}
					</Button>
					<HexColorPicker
						color={tournamentColor}
						onChange={setTournamentColor}
					/>
					<div className='w-fit'>
						<Label htmlFor='number-of-winners'>
							Number of winners in a group
						</Label>
						<Input
							id='number-of-winners'
							type='number'
							placeholder='Number of winners in group'
							value={numberOfWinners}
							onChange={e => setNumberOfWinners(Number(e.target.value))}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
export default GroupClient
