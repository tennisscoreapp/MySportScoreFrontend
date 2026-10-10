import { DriveSettings, Tournament } from '@/interfaces/tournamentInterfaces'
import { tournamentService } from '@/service/tournament.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateTournamentDriveMutation = (tournamentId: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (settings: { folder: string; file_name: string }) =>
			tournamentService.updateDriveSettings(tournamentId, settings),
		onSuccess: (saved: DriveSettings) => {
			queryClient.setQueryData(
				['tournament', tournamentId],
				(old: Tournament[] | undefined) =>
					old?.map(item => ({ ...item, ...saved }))
			)
		},
	})
}
