'use client'

import { Match, Player } from '@/interfaces/groupInterfaces'
import { getPlaceColor } from '@/utils/placeColor'
import { cn } from '@/utils/shadcn/css'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { useTranslations } from 'next-intl'
import { type ReactNode, useMemo } from 'react'

interface SwissSystemTableProps {
	players: Player[]
	matches: Match[]
	tournamentColor: string
	numberOfWinners: number
	secondaryTournamentColor: string
	numberOfSecondaryWinners: number
}

interface MatchResult {
	setsWon: number
	setsLost: number
	gamesWon: number
	gamesLost: number
	playerScores: number[]
	opponentScores: number[]
	status: 'win' | 'loss' | 'draw'
}

type PlayerStats = ReturnType<typeof calculatePlayerStats>

const ROW_HEIGHT_CLASS = 'h-14'
const CELL_CLASS = 'border border-gray-950 align-middle'
const HEADER_CELL_CLASS = cn(CELL_CLASS, 'px-2 py-2 text-center')
const STICKY_PLACE_CLASS = cn(
	CELL_CLASS,
	'sticky left-0 z-20 w-[60px] min-w-[60px] max-w-[60px] bg-background px-2 py-2 text-center',
)
const STICKY_PLAYER_CLASS = cn(
	CELL_CLASS,
	'sticky left-[60px] z-20 w-[120px] min-w-[120px] bg-background px-2 py-2 text-center',
)
const NUMERIC_CELL_CLASS = cn(
	CELL_CLASS,
	'min-w-[60px] px-2 py-2 text-center text-sm whitespace-nowrap',
)
const MATCH_CELL_CLASS = cn(
	CELL_CLASS,
	'w-[110px] min-w-[110px] max-w-[110px] px-2 py-2',
)
const EMPTY_PLAYERS: Player[] = []

const getMatchKey = (player1Id: number, player2Id: number) =>
	[player1Id, player2Id].sort((a, b) => a - b).join(':')

function PlayerName({
	firstName,
	lastName,
	className,
}: {
	firstName: string
	lastName: string
	className?: string
}) {
	return (
		<div className={cn('text-center leading-tight', className)}>
			<span>{firstName}</span>
			<br />
			<span>{lastName}</span>
		</div>
	)
}

function StatsCell({ children }: { children: ReactNode }) {
	return (
		<td className={NUMERIC_CELL_CLASS}>
			<div>{children}</div>
		</td>
	)
}

function DiagonalCell({ color }: { color: string }) {
	return (
		<td
			className={cn(MATCH_CELL_CLASS, 'text-center')}
			style={{ backgroundColor: color }}
		>
			<div className='text-sm font-bold'>LokoLiga</div>
		</td>
	)
}

function ScoreCell({ result }: { result: MatchResult | null }) {
	if (!result) {
		return (
			<td
				className={cn(
					MATCH_CELL_CLASS,
					'text-center text-sm text-muted-foreground',
				)}
			>
				-
			</td>
		)
	}

	return (
		<td className={MATCH_CELL_CLASS}>
			<div
				className={cn(
					'flex flex-col justify-center gap-0.5 rounded p-1',
					result.status === 'win' && 'bg-green-100 dark:bg-green-900/30',
					result.status === 'loss' && 'bg-red-100 dark:bg-red-900/30',
					result.status === 'draw' && 'text-center',
				)}
			>
				<div className='flex gap-1 text-sm'>
					<span className='font-bold'>{result.setsWon}</span>
					{result.playerScores.map((score, index) => (
						<span key={`player-score-${index}`}>{score}</span>
					))}
				</div>
				<div className='flex gap-1 text-sm'>
					<span className='font-bold'>{result.setsLost}</span>
					{result.opponentScores.map((score, index) => (
						<span key={`opponent-score-${index}`}>{score}</span>
					))}
				</div>
			</div>
		</td>
	)
}

function SwissSystemTable({
	players,
	matches,
	tournamentColor,
	numberOfWinners,
	secondaryTournamentColor,
	numberOfSecondaryWinners,
}: SwissSystemTableProps) {
	const t = useTranslations('TournamentGroup')
	const tablePlayers = players ?? EMPTY_PLAYERS

	const sortedPlayers = useMemo(
		() => sortPlayers([...tablePlayers], matches) || [...tablePlayers],
		[tablePlayers, matches],
	)

	const matchByPlayerPair = useMemo(() => {
		return matches.reduce((acc, match) => {
			acc.set(getMatchKey(match.player1_id, match.player2_id), match)
			return acc
		}, new Map<string, Match>())
	}, [matches])

	const statsByPlayerId = useMemo(() => {
		return sortedPlayers.reduce((acc, player) => {
			acc.set(player.id, calculatePlayerStats(player.id, matches))
			return acc
		}, new Map<number, PlayerStats>())
	}, [matches, sortedPlayers])

	const getMatchResult = (
		playerId: number,
		opponentId: number,
	): MatchResult | null => {
		const match = matchByPlayerPair.get(getMatchKey(playerId, opponentId))

		if (!match || !match.sets || match.sets.length === 0) return null

		const isPlayer1 = match.player1_id === playerId
		let setsWon = 0
		let setsLost = 0
		let gamesWon = 0
		let gamesLost = 0
		const playerScores: number[] = []
		const opponentScores: number[] = []

		match.sets.forEach(set => {
			const playerGames = isPlayer1 ? set.player1_games : set.player2_games
			const opponentGames = isPlayer1 ? set.player2_games : set.player1_games

			playerScores.push(playerGames)
			opponentScores.push(opponentGames)
			gamesWon += playerGames
			gamesLost += opponentGames

			if (playerGames > opponentGames) setsWon++
			else if (opponentGames > playerGames) setsLost++
		})

		let status: MatchResult['status'] = 'draw'
		if (setsWon > setsLost) status = 'win'
		else if (setsLost > setsWon) status = 'loss'

		return {
			setsWon,
			setsLost,
			gamesWon,
			gamesLost,
			playerScores,
			opponentScores,
			status,
		}
	}

	if (tablePlayers.length === 0) {
		return <div className='p-4 text-center'>{t('group_table.no_data')}</div>
	}

	return (
		<div className='w-full overflow-x-auto'>
			<table className='w-full border-collapse'>
				<thead className='text-center'>
					<tr className={ROW_HEIGHT_CLASS}>
						<th className={STICKY_PLACE_CLASS}>
							<div className='text-sm font-bold'>{t('group_table.place')}</div>
						</th>
						<th className={STICKY_PLAYER_CLASS}>
							<div className='text-sm font-bold'>{t('group_table.player')}</div>
						</th>
						<th
							className={cn(
								HEADER_CELL_CLASS,
								'w-[60px] min-w-[60px] max-w-[80px]',
							)}
						>
							<div className='text-sm font-bold'>
								{t('group_table.matches_played')}
							</div>
						</th>
						<th
							className={cn(
								HEADER_CELL_CLASS,
								'w-[60px] min-w-[60px] max-w-[90px]',
							)}
						>
							<div className='text-sm font-bold'>
								{t('group_table.matches_won')}
							</div>
						</th>
						<th
							className={cn(
								HEADER_CELL_CLASS,
								'w-[90px] min-w-[90px] max-w-[100px]',
							)}
						>
							<div className='text-sm font-bold'>
								{t.rich('group_table.sets_played', {
									winlose: chunks => (
										<>
											<br />
											{chunks}
										</>
									),
								})}
							</div>
						</th>
						<th
							className={cn(
								HEADER_CELL_CLASS,
								'w-[60px] min-w-[60px] max-w-[80px]',
							)}
						>
							<div className='text-sm font-bold'>
								{t('group_table.sets_difference')}
							</div>
						</th>
						<th
							className={cn(
								HEADER_CELL_CLASS,
								'w-[90px] min-w-[90px] max-w-[100px]',
							)}
						>
							<div className='text-sm font-bold'>
								{t.rich('group_table.games_played', {
									winlose: chunks => (
										<>
											<br />
											{chunks}
										</>
									),
								})}
							</div>
						</th>
						<th
							className={cn(
								HEADER_CELL_CLASS,
								'w-[60px] min-w-[60px] max-w-[100px]',
							)}
						>
							<div className='text-sm font-bold'>
								{t('group_table.games_difference')}
							</div>
						</th>
						{sortedPlayers.map(player => (
							<th
								key={player.id}
								className={cn(
									HEADER_CELL_CLASS,
									'w-[110px] min-w-[110px] max-w-[110px]',
								)}
							>
								<PlayerName
									firstName={player.first_name}
									lastName={player.last_name}
									className='text-sm font-bold'
								/>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedPlayers.map((player, rowIndex) => {
						const stats = statsByPlayerId.get(player.id)

						if (!stats) return null

						return (
							<tr key={player.id} className={ROW_HEIGHT_CLASS}>
								<td
									className={cn(
										STICKY_PLACE_CLASS,
										'z-10 font-semibold text-sm',
									)}
									style={{
										backgroundColor:
											getPlaceColor(
												rowIndex + 1,
												numberOfWinners,
												tournamentColor,
												numberOfSecondaryWinners,
												secondaryTournamentColor,
											) ?? 'white',
									}}
								>
									<div>{rowIndex + 1}</div>
								</td>
								<td className={cn(STICKY_PLAYER_CLASS, 'z-10')}>
									<PlayerName
										firstName={player.first_name}
										lastName={player.last_name}
										className='text-base font-medium'
									/>
								</td>
								<StatsCell>{stats.matchesPlayed}</StatsCell>
								<StatsCell>{stats.matchesWon}</StatsCell>
								<StatsCell>
									{stats.setsWon} - {stats.setsLost}
								</StatsCell>
								<StatsCell>{stats.setsDifference}</StatsCell>
								<StatsCell>
									{stats.gamesWon} - {stats.gamesLost}
								</StatsCell>
								<StatsCell>{stats.gamesDifference}</StatsCell>
								{sortedPlayers.map((opponentPlayer, colIndex) => {
									const isSamePlayer = rowIndex === colIndex
									const result = isSamePlayer
										? null
										: getMatchResult(player.id, opponentPlayer.id)

									return isSamePlayer ? (
										<DiagonalCell
											key={opponentPlayer.id}
											color={tournamentColor}
										/>
									) : (
										<ScoreCell key={opponentPlayer.id} result={result} />
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default SwissSystemTable
