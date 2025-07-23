export const determineWinner = (
	sets: { player1_games: number; player2_games: number }[]
) => {
	const player1Sets = sets.reduce(
		(acc, set) =>
			acc + (Number(set.player1_games) > Number(set.player2_games) ? 1 : 0),
		0
	)
	const player2Sets = sets.reduce(
		(acc, set) =>
			acc + (Number(set.player2_games) > Number(set.player1_games) ? 1 : 0),
		0
	)

	return player1Sets > player2Sets
		? 'player1'
		: player2Sets > player1Sets
		? 'player2'
		: null
}
