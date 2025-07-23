import { Match, Player } from '@/interfaces/groupInterfaces'

// Функция сортировки игроков по критериям
export function sortPlayers(players: Player[], matches: Match[]) {
	return players?.sort((a, b) => {
		const statsA = calculatePlayerStats(a.id, matches)
		const statsB = calculatePlayerStats(b.id, matches)

		// 1. Сначала по количеству выигранных матчей (по убыванию)
		if (statsA.matchesWon !== statsB.matchesWon) {
			return statsB.matchesWon - statsA.matchesWon
		}

		// 2. Если равны, то по разности сетов (по убыванию)
		if (statsA.setsDifference !== statsB.setsDifference) {
			return statsB.setsDifference - statsA.setsDifference
		}

		// 3. Если равны, то по разности геймов (по убыванию)
		return statsB.gamesDifference - statsA.gamesDifference
	})
}

export function calculatePlayerStats(playerId: number, matches: Match[]) {
	const playerMatches = matches?.filter(
		match => match.player1_id === playerId || match.player2_id === playerId
	)

	let matchesWon = 0
	let setsWon = 0
	let setsLost = 0
	let gamesWon = 0
	let gamesLost = 0

	playerMatches?.forEach(match => {
		const isPlayer1 = match.player1_id === playerId
		let matchSetsWon = 0
		let matchSetsLost = 0

		match?.sets?.forEach(set => {
			const playerGames = isPlayer1 ? set.player1_games : set.player2_games
			const opponentGames = isPlayer1 ? set.player2_games : set.player1_games

			gamesWon += playerGames
			gamesLost += opponentGames

			if (playerGames > opponentGames) {
				matchSetsWon++
			} else {
				matchSetsLost++
			}
		})

		setsWon += matchSetsWon
		setsLost += matchSetsLost

		if (match.winner_id === playerId) {
			matchesWon++
		}
	})

	return {
		matchesPlayed: playerMatches?.length || 0,
		matchesWon,
		setsWon,
		setsLost,
		setsDifference: setsWon - setsLost,
		gamesWon,
		gamesLost,
		gamesDifference: gamesWon - gamesLost,
	}
}
