'use client'
import { deleteMatch, fetchGroup } from '@/api/groupApi'
import { Button } from '@/components/ui/button'
import { GroupResponse, Match, Player } from '@/interfaces/groupInterfaces'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SquarePen, X } from 'lucide-react'
import Link from 'next/link'

function GroupClient({
	group,
	tournamentId,
}: {
	group: string
	tournamentId: string
}) {
	const queryClient = useQueryClient()

	// Ensure group is a string, not an object
	const groupId = typeof group === 'string' ? group : String(group)

	const {
		data: groupData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['group', groupId],
		queryFn: () => fetchGroup(groupId),
	})

	const deleteMatchMutation = useMutation({
		mutationFn: (matchId: number) => deleteMatch(matchId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['group', groupId] })
		},
		onMutate: async (matchId: number) => {
			await queryClient.cancelQueries({ queryKey: ['group', groupId] })
			const previousData = queryClient.getQueryData(['group', groupId])
			queryClient.setQueryData(
				['group', groupId],
				(old: GroupResponse[] | undefined) => {
					if (!old) return old
					return old.map(groupItem => ({
						...groupItem,
						group_data: {
							...groupItem.group_data,
							matches:
								groupItem.group_data.matches?.filter(
									match => match.id !== matchId
								) || [],
						},
					}))
				}
			)
			return { previousData }
		},
		onError: (err, matchId, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(['group', groupId], context.previousData)
			}
		},
	})

	const handleDeleteMatch = (matchId: number) => {
		if (confirm('Вы уверены, что хотите удалить этот матч?')) {
			deleteMatchMutation.mutate(matchId)
		}
	}

	if (isLoading) return <div className='p-6'>Загрузка...</div>
	if (error) return <div className='p-6'>Ошибка загрузки данных</div>
	if (!groupData) return <div className='p-6'>Нет данных</div>

	return (
		<div>
			<div>
				{groupData?.map((group: GroupResponse) => (
					<div
						key={group.group_data.matches?.[0]?.id}
						className='flex flex-col gap-10'
					>
						<div className='overflow-x-auto'>
							<table className='w-full border-collapse border border-gray-300'>
								<thead>
									<tr className='bg-gray-100'>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Players standings
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Matches played
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Matches won
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Sets (W - L)
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Sets difference
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Games (W - L)
										</th>
										<th className='border border-gray-300 px-4 py-2 text-left'>
											Games difference
										</th>
									</tr>
								</thead>
								<tbody>
									{sortPlayers(
										group.group_data.players,
										group.group_data.matches
									)?.map((player: Player, index: number) => {
										const stats = calculatePlayerStats(
											player.id,
											group.group_data.matches
										)
										return (
											<tr key={player.id} className='hover:bg-gray-50'>
												<td className='border border-gray-300 px-4 py-2'>
													{`${index + 1}. ${player.first_name} ${
														player.last_name
													}`}
												</td>
												<td className='border border-gray-300 px-4 py-2'>
													{stats.matchesPlayed}
												</td>
												<td className='border border-gray-300 px-4 py-2'>
													{stats.matchesWon}
												</td>
												<td className='border border-gray-300 px-4 py-2'>
													{`${stats.setsWon} - ${stats.setsLost}`}
												</td>
												<td className='border border-gray-300 px-4 py-2'>
													{stats.setsDifference}
												</td>
												<td className='border border-gray-300 px-4 py-2'>
													{`${stats.gamesWon} - ${stats.gamesLost}`}
												</td>
												<td className='border border-gray-300 px-4 py-2'>
													{stats.gamesDifference}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
						<div className='space-y-4'>
							<h2 className='text-xl font-bold border-b pb-2'>
								Matches History
							</h2>
							<div className='space-y-4'>
								{group.group_data.matches?.map((match: Match) => {
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
														{match.player1_first_name} {match.player1_last_name}
													</div>
													<div className='text-sm text-gray-600'>
														Sets: {player1Sets} | Games: (
														{match.sets
															?.map((set, index) => (
																<span key={index}>{set.player1_games}</span>
															))
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
														{match.player2_first_name} {match.player2_last_name}
													</div>
													<div className='text-sm text-gray-600'>
														Sets: {player2Sets} | Games: (
														{match.sets
															?.map((set, index) => (
																<span key={index}>{set.player2_games}</span>
															))
															.join(' ')}
														)
													</div>
												</div>
											</div>
											{/* Победитель */}
											<div className='mt-2 text-center'>
												<span className='inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
													Победитель:{' '}
													{match.winner_first_name
														? `${match.winner_first_name} ${match.winner_last_name}`
														: 'Ничья'}
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
				))}
			</div>
			<div className='mt-10'>
				<div className='flex flex-row mt-10 justify-between'>
					<div className='flex flex-row gap-4'>
						<Link href={`/tournaments/${tournamentId}/${groupId}/addmatch`}>
							<Button>Add match</Button>
						</Link>
						<Link href={`/tournaments/${tournamentId}/${groupId}/addplayers`}>
							<Button>Add players</Button>
						</Link>
					</div>
					<Link href={`/tournaments/${tournamentId}`}>
						<Button>Get back</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default GroupClient
