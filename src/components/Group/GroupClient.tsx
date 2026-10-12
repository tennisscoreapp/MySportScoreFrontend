'use client'
import { GroupSkeleton } from '@/components/Skeletons/PageSkeletons'
import CopyLinkButton from '@/components/Public/CopyLinkButton'
import { Button } from '@/components/ui/button'
import { clampPlaces } from '@/hooks/useGroupSettings'
import {
	GroupResponse,
	GroupSettings,
	Player,
} from '@/interfaces/groupInterfaces'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { Label } from '@radix-ui/react-label'
import { UseMutationResult } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { DataTable } from '../ui/data-table'
import { Input } from '../ui/input'
import ColorPickerDialog from './ColorPickerDialog'
import { createColumns } from './columns'
import DriveExportButton from './DriveExportButton'
import GroupPagination from './GroupPagination'
import { handleDownloadPDFUtil } from './handleDownloadPDF'
import MatchHistory from './MatchHistory'
import SwissSystemTable from './SwissSystemTable'

export enum TableView {
	SWISS_SYSTEM = 'swiss_system',
	GROUP_TABLE = 'group_table',
}

const DEFAULT_SETTINGS: GroupSettings = {
	is_public: false,
	primary_color: '#ffffff',
	primary_winners: 0,
	secondary_color: '#ff4444',
	secondary_winners: 0,
}

// readOnly renders the public standings page: no editing, settings or export
function GroupClient({
	groupData,
	isLoading,
	error,
	tournamentName,
	deleteMatchMutation,
	tournamentId,
	groupId,
	backHref,
	readOnly = false,
	settings = DEFAULT_SETTINGS,
	onSettingsChange,
	publicGroupPath,
}: {
	groupData: GroupResponse[]
	isLoading: boolean
	error: string | null
	deleteMatchMutation?: UseMutationResult<void, Error, number>
	tournamentName: string
	tournamentId: string
	groupId: string
	backHref: string
	readOnly?: boolean
	settings?: GroupSettings
	onSettingsChange?: (patch: Partial<GroupSettings>, immediate?: boolean) => void
	publicGroupPath?: string
}) {
	const t = useTranslations('TournamentGroup')
	const [exportView, setExportView] = useState(false)
	const [swissView, setSwissView] = useState<TableView>(() => {
		if (typeof window === 'undefined') return TableView.SWISS_SYSTEM
		const storedValue = window.localStorage.getItem(
			'swissView'
		) as TableView | null
		return storedValue === TableView.SWISS_SYSTEM ||
			storedValue === TableView.GROUP_TABLE
			? storedValue
			: TableView.SWISS_SYSTEM
	})
	const [page, setPage] = useState(1)

	const {
		primary_color: tournamentColor,
		primary_winners: numberOfWinners,
		secondary_color: secondaryTournamentColor,
		secondary_winners: numberOfSecondaryWinners,
	} = settings
	const canEdit = !readOnly && onSettingsChange !== undefined
	const changeSettings = onSettingsChange ?? (() => {})
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
			window.localStorage.setItem('swissView', swissView)
		}
	}, [pageSize, swissView])

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

	if (isLoading) return <GroupSkeleton readOnly={readOnly} />
	if (error) return <div className='p-6'>{t('error_loading')}</div>
	if (!groupData) return <div className='p-6'>{t('no_data')}</div>

	return (
		<div>
			<div>
				{groupData?.map((group: GroupResponse) => {
					const groupPlayersData =
						sortPlayers(
							group.group_data?.players,
							group.group_data?.matches,
							group.group_data?.standings
						)?.map((player: Player, index: number) => {
							const stats = group.group_data?.standings?.find(row => row.player_id === player.id) ?? calculatePlayerStats(
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
							key={`${group.group_data.group.tournament_id}:${group.group_data.group.name}`}
							className='flex flex-col gap-10 p-10'
							ref={pdfRef}
						>
							<div className='text-2xl font-bold text-center'>
								{tournamentName}
							</div>
							<div
								className='text-2xl font-bold text-center'
								style={{ color: tournamentColor }}
							>
								{group.group_data.group.name}
							</div>
							<div className='overflow-x-auto'>
								{swissView === TableView.SWISS_SYSTEM ? (
									<SwissSystemTable
										players={group.group_data?.players || []}
										matches={group.group_data?.matches || []}
										standings={group.group_data?.standings}
										tournamentColor={tournamentColor}
										numberOfWinners={numberOfWinners}
										secondaryTournamentColor={secondaryTournamentColor}
										numberOfSecondaryWinners={numberOfSecondaryWinners}
									/>
								) : (
									<DataTable
										columns={createColumns(
											t,
											numberOfWinners,
											tournamentColor,
											numberOfSecondaryWinners,
											secondaryTournamentColor
										)}
										data={groupPlayersData}
										emptyMessage={t('group_table.no_data')}
									/>
								)}
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
									swissView !== TableView.SWISS_SYSTEM && (
										<MatchHistory
											exportView={exportView}
											readOnly={readOnly}
											matches={pageMatches}
											tournamentId={tournamentId}
											groupId={groupId}
											onDeleteMatch={deleteMatchMutation}
										/>
									)
								)
							})()}
						</div>
					)
				})}
			</div>
			<div className='no-print mt-10 pl-10 pr-10'>
				{swissView !== TableView.SWISS_SYSTEM && (
					<GroupPagination
						pageSize={pageSize}
						setPageSize={setPageSize}
						page={page}
						setPage={setPage}
						totalPages={totalPages}
						selectOptions={selectOptions}
					/>
				)}

				<div className='flex gap-4 flex-col lg:flex-row lg:gap-0 mt-10 justify-between'>
					<div className='flex flex-col lg:flex-row gap-4'>
						{!readOnly && (
							<>
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
							</>
						)}
					</div>
					<div className='flex flex-col lg:flex-row gap-4'>
						<Button
							onClick={() =>
								setSwissView(
									swissView === TableView.SWISS_SYSTEM
										? TableView.GROUP_TABLE
										: TableView.SWISS_SYSTEM
								)
							}
						>
							{swissView === TableView.SWISS_SYSTEM
								? t('buttons.toggle_group_table_view')
								: t('buttons.toggle_swiss_view')}
						</Button>
						{!readOnly && swissView !== TableView.SWISS_SYSTEM && (
							<Button onClick={() => setExportView(!exportView)}>
								{t('buttons.toggle_export_view')}
							</Button>
						)}
						<Link href={backHref}>
							<Button>{t('buttons.back')}</Button>
						</Link>
					</div>
				</div>
				{canEdit && (
					<div className='mt-10 flex flex-col gap-3 rounded-lg border p-4'>
						<label className='flex items-center gap-3 font-medium cursor-pointer'>
							<input
								type='checkbox'
								className='h-4 w-4 cursor-pointer'
								checked={settings.is_public}
								onChange={e =>
									changeSettings({ is_public: e.target.checked }, true)
								}
							/>
							{t('public_access.label')}
						</label>
						<p className='text-sm text-muted-foreground'>
							{settings.is_public
								? t('public_access.enabled_hint')
								: t('public_access.disabled_hint')}
						</p>
						{settings.is_public && publicGroupPath && (
							<div>
								<CopyLinkButton
									path={publicGroupPath}
									label={t('public_access.copy_link')}
								/>
							</div>
						)}
					</div>
				)}
				{canEdit && (
				<div className='flex flex-wrap items-start justify-center gap-6 mt-10'>
					<div className='flex flex-col items-center gap-3 mt-4 self-center'>
						<Button
							onClick={handleDownloadPDF}
							variant='secondary'
							className='hover:bg-red-500 hover:text-white'
						>
							<Printer />
							{t('buttons.export_pdf')}
						</Button>
						<DriveExportButton
							groupId={groupId}
							tournamentId={tournamentId}
							getExportRoot={() => pdfRef.current}
						/>
					</div>

					<div className='flex w-72 flex-col gap-4'>
						<ColorPickerDialog
							id='primary-color'
							label={t('buttons.primary_color_label')}
							buttonLabel={t('buttons.change_primary_color')}
							color={tournamentColor}
							onSave={color => changeSettings({ primary_color: color }, true)}
						/>
						<div className='w-full'>
							<Label htmlFor='number-of-winners'>
								{t('buttons.number_of_winners')}
							</Label>
							<Input
								id='number-of-winners'
								type='number'
								placeholder={t('buttons.number_of_winners')}
								value={numberOfWinners}
								onChange={e =>
									changeSettings({
										primary_winners: clampPlaces(Number(e.target.value)),
									})
								}
							/>
						</div>
					</div>

					<div className='flex w-72 flex-col gap-4'>
						<ColorPickerDialog
							id='secondary-color'
							label={t('buttons.secondary_color_label')}
							buttonLabel={t('buttons.change_secondary_color')}
							color={secondaryTournamentColor}
							onSave={color => changeSettings({ secondary_color: color }, true)}
						/>
						<div className='w-full'>
							<Label htmlFor='number-of-secondary-winners'>
								{t('buttons.number_of_secondary_winners')}
							</Label>
							<Input
								id='number-of-secondary-winners'
								type='number'
								placeholder={t('buttons.number_of_secondary_winners')}
								value={numberOfSecondaryWinners}
								onChange={e =>
									changeSettings({
										secondary_winners: clampPlaces(Number(e.target.value)),
									})
								}
							/>
						</div>
					</div>
				</div>
				)}
			</div>
		</div>
	)
}
export default GroupClient
