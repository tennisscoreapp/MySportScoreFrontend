import { PublicGroup, PublicTournament } from '@/interfaces/publicInterfaces'
import { publicService } from '@/service/public.service'
import { useQuery } from '@tanstack/react-query'

export const PUBLIC_QUERY_KEYS = ['publicTournament', 'publicGroup']

// a hidden or unknown page answers 404, so retrying only delays the message
export const usePublicTournamentQuery = (token: string) =>
	useQuery<PublicTournament>({
		queryKey: [PUBLIC_QUERY_KEYS[0], token],
		queryFn: () => publicService.fetchTournament(token),
		retry: false,
	})

export const usePublicGroupQuery = (token: string, groupId: string) =>
	useQuery<PublicGroup>({
		queryKey: [PUBLIC_QUERY_KEYS[1], token, groupId],
		queryFn: () => publicService.fetchGroup(token, groupId),
		retry: false,
	})
