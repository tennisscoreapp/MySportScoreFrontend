'use client'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Match } from '@/interfaces/groupInterfaces'
import { UseMutationResult } from '@tanstack/react-query'
import { SquarePen, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

type ViewMode = 'detailed' | 'compact'

interface MatchHistoryProps {
	matches: Match[]
	tournamentId: string
	groupId: string
	onDeleteMatch: UseMutationResult<void, Error, number>
	exportView: boolean
}

export default function MatchHistory({
	matches,
	tournamentId,
	groupId,
	onDeleteMatch,
	exportView,
}: MatchHistoryProps) {
	const t = useTranslations('TournamentGroup')
	const [view, setView] = useState<ViewMode>(() => {
		// read once on mount and avoid ssr/hydration issues
		if (typeof window === 'undefined') return 'compact'
		const stored = window.localStorage.getItem(
			'matchHistoryView'
		) as ViewMode | null
		return stored === 'detailed' || stored === 'compact' ? stored : 'compact'
	})

	const handleViewChange = (v: ViewMode) => {
		setView(v)
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('matchHistoryView', v)
		}
	}

	if (!matches?.length) return null

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between flex-col lg:flex-row gap-4'>
				<h2 className='text-xl font-bold border-b pb-2'>
					{t('matches_history.title')}
				</h2>
				<div
					className={`flex items-center gap-2 ${exportView ? 'hidden' : ''}`}
				>
					<span className='text-sm text-muted-foreground'>
						{t('matches_history.view.view_mode')}
					</span>
					<Select value={view} onValueChange={handleViewChange}>
						<SelectTrigger size='sm'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='detailed'>
								{t('matches_history.view.detailed')}
							</SelectItem>
							<SelectItem value='compact'>
								{t('matches_history.view.compact')}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div
				className={`space-y-4 ${
					view === 'compact'
						? `gap-4 grid  grid-cols-1 md:grid-cols-${Math.min(
								matches.length,
								2
						  )} lg:grid-cols-${Math.min(matches.length, 3)}`
						: ''
				}`}
			>
				{[...matches]
					.sort(
						(a, b) =>
							new Date(a.match_date).getTime() -
							new Date(b.match_date).getTime()
					)
					.map(match => {
						const { player1Sets, player2Sets } = summarizeSets(match)

						return (
							<div
								key={match.id}
								className='border rounded-lg p-4 bg-white shadow-sm h-full'
							>
								{view === 'detailed' ? (
									<DetailedCard
										match={match}
										player1Sets={player1Sets}
										player2Sets={player2Sets}
										tKeyPath='matches_history'
									/>
								) : (
									<CompactCard
										match={match}
										player1Sets={player1Sets}
										player2Sets={player2Sets}
									/>
								)}

								<div
									className={`gap-4 justify-center mt-4 ${
										exportView ? 'hidden' : 'flex flex-row'
									}`}
								>
									<div className='text-center'>
										<Link
											href={`/tournaments/${tournamentId}/groups/${groupId}/${match.id}`}
										>
											<Button
												variant='outline'
												size='icon'
												className='hover:bg-blue-500 hover:text-white'
											>
												<SquarePen strokeWidth={2.25} />
											</Button>
										</Link>
									</div>
									<div className='text-center'>
										<Button
											variant='destructive'
											size='icon'
											onClick={() => {
												if (confirm(t('delete_match_confirmation'))) {
													onDeleteMatch.mutate(match.id)
												}
											}}
										>
											<X strokeWidth={2.25} />
										</Button>
									</div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

function summarizeSets(match: Match) {
	const player1Sets = match.sets.reduce(
		(acc, set) => acc + (set.player1_games > set.player2_games ? 1 : 0),
		0
	)
	const player2Sets = match.sets.reduce(
		(acc, set) => acc + (set.player2_games > set.player1_games ? 1 : 0),
		0
	)
	return { player1Sets, player2Sets }
}

function DetailedCard({
	match,
	player1Sets,
	player2Sets,
}: {
	match: Match
	player1Sets: number
	player2Sets: number
	tKeyPath: string
}) {
	const t = useTranslations('TournamentGroup')
	return (
		<div className='grid grid-cols-3 items-center gap-4'>
			<div
				className={`text-right ${
					match.winner_id === match.player1_id ? 'font-bold text-green-600' : ''
				}`}
			>
				<div className='text-lg'>
					{match.player1_first_name} {match.player1_last_name}
				</div>
				<div className='text-sm text-gray-600'>
					{t('matches_history.game.sets')}: {player1Sets} |{' '}
					{t('matches_history.game.games')}: (
					{match.sets?.map(set => set.player1_games).join(' ')})
				</div>
			</div>

			<div className='text-center'>
				<div className='text-2xl font-bold text-blue-600'>
					{player1Sets} - {player2Sets}
				</div>
				<div className='text-sm text-gray-500'>
					{match.sets?.map(set => (
						<span key={set.set_number} className='mr-2'>
							{set.player1_games}-{set.player2_games}
						</span>
					))}
				</div>
			</div>

			<div
				className={`text-left ${
					match.winner_id === match.player2_id ? 'font-bold text-green-600' : ''
				}`}
			>
				<div className='text-lg'>
					{match.player2_first_name} {match.player2_last_name}
				</div>
				<div className='text-sm text-gray-600'>
					{t('matches_history.game.sets')}: {player2Sets} |{' '}
					{t('matches_history.game.games')}: (
					{match.sets?.map(set => set.player2_games).join(' ')})
				</div>
			</div>

			<div className='col-span-3 mt-2 text-center'>
				<span className='inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
					{t('matches_history.game.winner')}:{' '}
					{match.winner_first_name
						? `${match.winner_first_name} ${match.winner_last_name}`
						: t('matches_history.game.draw')}
				</span>
			</div>
		</div>
	)
}

function CompactCard({
	match,
	player1Sets,
	player2Sets,
}: {
	match: Match
	player1Sets: number
	player2Sets: number
}) {
	return (
		<div className='flex flex-col items-center gap-4'>
			<div
				className={`text-center ${
					match.winner_id === match.player1_id ? 'font-bold text-green-600' : ''
				}`}
			>
				<div className='text-sm lg:text-base'>
					{match.player1_first_name} {match.player1_last_name}
				</div>
			</div>

			<div className='flex items-center gap-3'>
				<ScoreGrid
					sets={match.sets}
					player1Sets={player1Sets}
					player2Sets={player2Sets}
				/>
			</div>

			<div
				className={`text-center ${
					match.winner_id === match.player2_id ? 'font-bold text-green-600' : ''
				}`}
			>
				<div className='text-xs md:text-sm lg:text-base'>
					{match.player2_first_name} {match.player2_last_name}
				</div>
			</div>
		</div>
	)
}

function ScoreGrid({
	sets,
	player1Sets,
	player2Sets,
}: {
	sets: Match['sets']
	player1Sets: number
	player2Sets: number
}) {
	return (
		<table className='border-collapse border border-gray-400 text-base font-semibold'>
			<tbody>
				<tr>
					<td className='border border-gray-400 px-2 py-1 text-center w-12 text-blue-600'>
						{player1Sets}
					</td>
					{sets?.map(s => (
						<td
							key={`p1-${s.set_number}`}
							className='border border-gray-400 px-2 py-1 text-center w-12'
						>
							{s.player1_games}
						</td>
					))}
				</tr>
				<tr>
					<td className='border border-gray-400 px-2 py-1 text-center w-12 text-blue-600'>
						{player2Sets}
					</td>
					{sets?.map(s => (
						<td
							key={`p2-${s.set_number}`}
							className='border border-gray-400 px-2 py-1 text-center w-12'
						>
							{s.player2_games}
						</td>
					))}
				</tr>
			</tbody>
		</table>
	)
}
