import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'

interface ColorStore {
	tournamentColor: string
	setTournamentColor: (color: string) => void
	numberOfWinners: number
	setNumberOfWinners: (numberOfWinners: number) => void
}

// store instances cache to avoid creating multiple stores for the same group
const storeInstances = new Map<string, ReturnType<typeof createColorStore>>()

function createColorStore(groupId: string) {
	return createStore<ColorStore>()(
		persist(
			immer(set => ({
				tournamentColor: '#ffffff',
				setTournamentColor: (color: string) => set({ tournamentColor: color }),
				numberOfWinners: 0,
				setNumberOfWinners: (numberOfWinners: number) =>
					set({ numberOfWinners }),
			})),
			{
				name: `color-group-${groupId}`,
				storage: createJSONStorage(() => localStorage),
			}
		)
	)
}

// factory function to get or create store for specific group
export function useColorStore(groupId: string) {
	if (!storeInstances.has(groupId)) {
		storeInstances.set(groupId, createColorStore(groupId))
	}
	return storeInstances.get(groupId)!
}

export default useColorStore
