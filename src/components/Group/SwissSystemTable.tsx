'use client'

import { Match, Player } from '@/interfaces/groupInterfaces'
import { calculatePlayerStats, sortPlayers } from '@/utils/sortGroupTable'
import { getPlaceColor } from '@/utils/placeColor'
import { useTranslations } from 'next-intl'

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
	winner: 'player1' | 'player2' | 'draw'
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
	// uniform row height for header and body rows
	const rowHeightClass = 'h-14'

	// create matrix of match results
	const getMatchResult = (
		player1Id: number,
		player2Id: number
	): MatchResult | null => {
		// find match between these two players
		const match = matches.find(
			m =>
				(m.player1_id === player1Id && m.player2_id === player2Id) ||
				(m.player1_id === player2Id && m.player2_id === player1Id)
		)

		if (!match || !match.sets || match.sets.length === 0) return null

		const isPlayer1First = match.player1_id === player1Id
		let setsWon = 0
		let setsLost = 0
		let gamesWon = 0
		let gamesLost = 0

		match.sets.forEach(set => {
			const player1Games = set.player1_games
			const player2Games = set.player2_games

			if (isPlayer1First) {
				gamesWon += player1Games
				gamesLost += player2Games
				if (player1Games > player2Games) setsWon++
				else if (player2Games > player1Games) setsLost++
			} else {
				gamesWon += player2Games
				gamesLost += player1Games
				if (player2Games > player1Games) setsWon++
				else if (player1Games > player2Games) setsLost++
			}
		})

		let winner: 'player1' | 'player2' | 'draw' = 'draw'
		if (setsWon > setsLost) winner = 'player1'
		else if (setsLost > setsWon) winner = 'player2'

		return {
			setsWon,
			setsLost,
			gamesWon,
			gamesLost,
			winner,
		}
	}

	const getCellContent = (
		player1Id: number,
		player2Id: number,
		result: MatchResult | null
	) => {
		if (!result) return '-'

		// find match to get sets details
		const match = matches.find(
			m =>
				(m.player1_id === player1Id && m.player2_id === player2Id) ||
				(m.player1_id === player2Id && m.player2_id === player1Id)
		)

		if (!match || !match.sets || match.sets.length === 0) return '-'

		const isPlayer1First = match.player1_id === player1Id

		// collect scores for display
		const player1Scores: number[] = []
		const player2Scores: number[] = []

		match.sets.forEach(set => {
			const p1Games = isPlayer1First ? set.player1_games : set.player2_games
			const p2Games = isPlayer1First ? set.player2_games : set.player1_games
			player1Scores.push(p1Games)
			player2Scores.push(p2Games)
		})

		return (
			<div className='flex flex-col justify-center gap-0.5'>
				{/* first row: sets won (bold) + games for each set */}
				<div className='flex gap-1 text-xs'>
					<span className='font-bold'>{result.setsWon}</span>
					{player1Scores.map((score, index) => (
						<span key={`p1-${index}`}>{score}</span>
					))}
				</div>
				{/* second row: sets lost (bold) + games for each set */}
				<div className='flex gap-1 text-xs'>
					<span className='font-bold'>{result.setsLost}</span>
					{player2Scores.map((score, index) => (
						<span key={`p2-${index}`}>{score}</span>
					))}
				</div>
			</div>
		)
	}

	if (!players || players.length === 0) {
		return <div className='p-4 text-center'>{t('group_table.no_data')}</div>
	}

	// sort players by tournament results
	const sortedPlayers = sortPlayers(players, matches) || players

	return (
		<div className='w-full overflow-x-auto'>
			<table className='w-full border-collapse'>
				<thead className='text-center'>
					<tr className={rowHeightClass}>
						<th className='border border-gray-950 p-2 sticky left-0 z-20 bg-background w-[60px] min-w-[60px] max-w-[80px]'>
							<div className='text-xs font-bold'>{t('group_table.place')}</div>
						</th>
						<th className='border border-gray-950 p-2 w-[120px] min-w-[120px] max-w-[120px] sticky left-[50px] z-20 bg-background'>
							<div className='text-xs font-bold'>{t('group_table.player')}</div>
						</th>
						<th className='border border-gray-950 p-2 w-[60px] min-w-[60px] max-w-[80px]'>
							<div className='text-[10px] '>
								{t('group_table.matches_played')}
							</div>
						</th>
						<th className='border border-gray-950 p-2 w-[60px] min-w-[60px] max-w-[90px]'>
							<div className='text-[10px] font-bold'>
								{t('group_table.matches_won')}
							</div>
						</th>
						<th className='border border-gray-950 p-2 w-[90px]  max-w-[100px]'>
							<div className='text-[10px] font-bold'>
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
						<th className='border border-gray-950 p-2 w-[60px] min-w-[60px] max-w-[80px]'>
							<div className='text-[10px] font-bold'>
								{t('group_table.sets_difference')}
							</div>
						</th>
						<th className='border border-gray-950 p-2 w-[90px] min-w-[60px] max-w-[100px]'>
							<div className='text-[10px] font-bold'>
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
						<th className='border border-gray-950 p-2 w-[60px] min-w-[60px] max-w-[100px]'>
							<div className='text-[10px] font-bold'>
								{t('group_table.games_difference')}
							</div>
						</th>
						{sortedPlayers.map(player => (
							<th
								key={player.id}
								className='border border-gray-950 p-2 w-[110px] min-w-[110px] max-w-[110px]'
							>
								<div className='text-xs font-bold'>
									{player.first_name}
									<br />
									{player.last_name}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedPlayers.map((player, rowIndex) => {
						const stats = calculatePlayerStats(player.id, matches)
						return (
							<tr key={player.id} className={rowHeightClass}>
								<td
									className='border border-gray-950 p-2 text-center sticky left-0 z-10 bg-background min-w-[50px]'
									style={{
										backgroundColor:
											getPlaceColor(
												rowIndex + 1,
												numberOfWinners,
												tournamentColor,
												numberOfSecondaryWinners,
												secondaryTournamentColor
											) ?? 'white',
									}}
								>
									<div className='font-semibold text-sm text-center'>
										{rowIndex + 1}
									</div>
								</td>
								<td className='border border-gray-950 sticky left-[50px] z-10 bg-background	'>
									<div className='text-sm font-medium text-center'>
										{player.first_name}
										<br />
										{player.last_name}
									</div>
								</td>
								<td className='border border-gray-950 text-center min-w-[60px] '>
									<div className='text-xs'>{stats.matchesPlayed}</div>
								</td>
								<td className='border border-gray-950 text-center min-w-[60px] '>
									<div className='text-xs'>{stats.matchesWon}</div>
								</td>
								<td className='border border-gray-950 text-center min-w-[60px] p-2'>
									<div className='text-xs'>
										{stats.setsWon} - {stats.setsLost}
									</div>
								</td>
								<td className='border border-gray-950 text-center min-w-[60px] '>
									<div className='text-xs'>{stats.setsDifference}</div>
								</td>
								<td className='border border-gray-950 text-center min-w-[60px]p-2'>
									<div className='text-xs'>
										{stats.gamesWon} - {stats.gamesLost}
									</div>
								</td>
								<td className='border border-gray-950 text-center min-w-[60px]'>
									<div className='text-xs'>{stats.gamesDifference}</div>
								</td>
								{sortedPlayers.map((opponentPlayer, colIndex) => {
									const isSamePlayer = rowIndex === colIndex
									const result = isSamePlayer
										? null
										: getMatchResult(player.id, opponentPlayer.id)

									return (
										<td
											key={opponentPlayer.id}
											className='border border-gray-950 p-2 w-[110px] min-w-[110px] max-w-[110px]'
											style={{
												backgroundColor: isSamePlayer
													? tournamentColor
													: undefined,
											}}
										>
											{isSamePlayer ? (
												<div className='text-center text-xs font-bold'>
													LokoLiga
												</div>
											) : (
												<div
													className={`${
														result?.winner === 'player1'
															? 'bg-green-100 dark:bg-green-900/30'
															: result?.winner === 'player2'
															? 'bg-red-100 dark:bg-red-900/30'
															: 'text-center'
													} rounded p-1`}
												>
													{getCellContent(player.id, opponentPlayer.id, result)}
												</div>
											)}
										</td>
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
