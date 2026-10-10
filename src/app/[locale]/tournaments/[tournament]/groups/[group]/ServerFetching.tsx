'use client';
import { GroupSkeleton } from '@/components/Skeletons/PageSkeletons'
import GroupClient from '@/components/Group/GroupClient';
import { useDeleteMatchMutation } from '@/hooks/mutations/useDeleteMatchMutation';
import { useFetchGroupQuery } from '@/hooks/queries/useFetchGroupQuery';
import { useFetchTournamentQuery } from '@/hooks/queries/useFetchTournamentQuery';
import { useGroupSettings } from '@/hooks/useGroupSettings';
import { publicPath } from '@/utils/publicLinks';
import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { Params } from 'next/dist/server/request/params';

function ServerFetching({ params }: { params: Params }) {
	const { group, tournament } = params;
	const groupId = typeof group === 'string' ? group : String(group);
	const tournamentId =
		typeof tournament === 'string' ? tournament : String(tournament);
	const queryClient = useQueryClient();
	const locale = useLocale();
	const { data: groupData, isLoading, error } = useFetchGroupQuery(groupId);
	const { data: tournamentData, isLoading: isLoadingTournament } =
		useFetchTournamentQuery(tournamentId);
	const deleteMatchMutation = useDeleteMatchMutation(groupId, queryClient);
	const { settings, update } = useGroupSettings(
		groupId,
		groupData?.[0]?.group_data?.group
	);

	const tTournament = useTranslations('TournamentGroup');

	if (isLoadingTournament) {
		return <GroupSkeleton />;
	}
	if (!tournamentData) {
		return <div>{tTournament('group_not_found')}</div>;
	}
	const publicToken = tournamentData[0]?.public_token;
	return (
		<GroupClient
			groupId={groupId}
			tournamentName={tournamentData[0]?.name ?? ''}
			groupData={groupData || []}
			isLoading={isLoading}
			error={error ? error.message : null}
			deleteMatchMutation={
				deleteMatchMutation as UseMutationResult<void, Error, number>
			}
			tournamentId={tournamentId}
			backHref={`/tournaments/${tournamentId}`}
			settings={settings}
			onSettingsChange={update}
			publicGroupPath={
				publicToken ? publicPath(locale, publicToken, groupId) : undefined
			}
		/>
	);
}

export default ServerFetching;
