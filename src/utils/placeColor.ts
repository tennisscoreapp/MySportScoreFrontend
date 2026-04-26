/**
 * Returns background color for a given 1-based place in the standings.
 * Primary range: 1..numberOfWinners
 * Secondary range: (numberOfWinners+1)..(numberOfWinners+numberOfSecondaryWinners)
 */
export function getPlaceColor(
	place: number,
	numberOfWinners: number,
	tournamentColor: string,
	numberOfSecondaryWinners: number,
	secondaryTournamentColor: string
): string | undefined {
	if (numberOfWinners > 0 && place <= numberOfWinners) {
		return tournamentColor
	}
	if (
		numberOfSecondaryWinners > 0 &&
		place > numberOfWinners &&
		place <= numberOfWinners + numberOfSecondaryWinners
	) {
		return secondaryTournamentColor
	}
	return undefined
}
