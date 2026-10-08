// Presentation only. The API validates the full result.
export function hasWonSet(games: number, opponentGames: number, legacy = false) {
	if (legacy) return games > opponentGames
	return (games === 6 && opponentGames <= 4) ||
		(games === 7 && (opponentGames === 5 || opponentGames === 6)) ||
		(games > 7 && opponentGames >= 6 && games - opponentGames === 2)
}
