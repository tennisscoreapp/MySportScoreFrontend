'use client'
import { Button } from '@/components/ui/button'
import { GroupResponse, Match, Player } from '@/interfaces/groupInterfaces'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { UseMutationResult } from '@tanstack/react-query'
import { SquarePen, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { createColumns } from './columns'
import { DataTable } from './data-table'

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
	const handleDeleteMatch = (matchId: number) => {
		if (confirm(t('delete_match_confirmation'))) {
			deleteMatchMutation.mutate(matchId)
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
							className='flex flex-col gap-10'
						>
							<div className='overflow-x-auto'>
								<DataTable
									columns={createColumns(t)}
									data={groupPlayersData}
									emptyMessage={t('group_table.no_data')}
								/>
							</div>
							<div className='space-y-4'>
								<h2 className='text-xl font-bold border-b pb-2'>
									{t('matches_history.title')}
								</h2>
								<div className='space-y-4'>
									{group?.group_data?.matches
										?.sort(
											(a: Match, b: Match) =>
												new Date(a.match_date).getTime() -
												new Date(b.match_date).getTime()
										)
										.map((match: Match) => {
											const player1Sets = match.sets.reduce(
												(acc, set) =>
													acc + (set.player1_games > set.player2_games ? 1 : 0),
												0
											)
											const player2Sets = match.sets.reduce(
												(acc, set) =>
													acc + (set.player2_games > set.player1_games ? 1 : 0),
												0
											)

											return (
												<div
													key={match.id}
													className='border rounded-lg p-4 bg-white shadow-sm'
												>
													<div className='grid grid-cols-3 items-center gap-4'>
														{/* Игрок 1 */}
														<div
															className={`text-right ${
																match.winner_id === match.player1_id
																	? 'font-bold text-green-600'
																	: ''
															}`}
														>
															<div className='text-lg'>
																{match.player1_first_name}{' '}
																{match.player1_last_name}
															</div>
															<div className='text-sm text-gray-600'>
																{t('matches_history.game.sets')}: {player1Sets}{' '}
																| {t('matches_history.game.games')}: (
																{match.sets
																	?.map(set => set.player1_games)
																	.join(' ')}
																)
															</div>
														</div>

														{/* Счет */}
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

														{/* Игрок 2 */}
														<div
															className={`text-left ${
																match.winner_id === match.player2_id
																	? 'font-bold text-green-600'
																	: ''
															}`}
														>
															<div className='text-lg'>
																{match.player2_first_name}{' '}
																{match.player2_last_name}
															</div>
															<div className='text-sm text-gray-600'>
																{t('matches_history.game.sets')}: {player2Sets}{' '}
																| {t('matches_history.game.games')}: (
																{match.sets
																	?.map(set => set.player2_games)
																	.join(' ')}
																)
															</div>
														</div>
													</div>
													{/* победитель */}
													<div className='mt-2 text-center'>
														<span className='inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
															{t('matches_history.game.winner')}:{' '}
															{match.winner_first_name
																? `${match.winner_first_name} ${match.winner_last_name}`
																: t('matches_history.game.draw')}
														</span>
													</div>
													<div className='flex flex-row gap-4 justify-center mt-4'>
														<div className='text-center'>
															<Link
																href={`/tournaments/${tournamentId}/${groupId}/${match.id}`}
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
																onClick={() => handleDeleteMatch(match.id)}
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
						</div>
					)
				})}
			</div>
			<div className='mt-10'>
				<div className='flex flex-row mt-10 justify-between'>
					<div className='flex flex-row gap-4'>
						<Link href={`/tournaments/${tournamentId}/${groupId}/addmatch`}>
							<Button>{t('buttons.add_match')}</Button>
						</Link>
						<Link href={`/tournaments/${tournamentId}/${groupId}/addplayers`}>
							<Button>{t('buttons.add_players')}</Button>
						</Link>
					</div>
					<Link href={`/tournaments/${tournamentId}`}>
						<Button>{t('buttons.back')}</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default GroupClient
