'use client'
import { TournamentSkeleton } from '@/components/Skeletons/PageSkeletons'
import CopyLinkButton from '@/components/Public/CopyLinkButton'
import DriveSettingsForm from '@/components/Tournament/DriveSettingsForm'
import { Button } from '@/components/ui/button'
import { useDeleteGroupMutation } from '@/hooks/mutations/useDeleteGroupMutation'
import { useFetchTournamentGroupsQuery } from '@/hooks/queries/useFetchTournamentGroupsQuery'
import { useFetchTournamentQuery } from '@/hooks/queries/useFetchTournamentQuery'
import { Tournament, TournamentGroup } from '@/interfaces/tournamentInterfaces'
import { formatDateDDMMYYYY } from '@/utils/dateutils/dateFormats'
import { publicPath } from '@/utils/publicLinks'
import { X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SingleTournamentPage() {
	const t = useTranslations('TournamentGroups')
	const locale = useLocale()
	const params = useParams<{ tournament: string }>()
	const tournament = params?.tournament ?? ''
	const {
		data: tournamentData,
		isLoading,
		isError,
	} = useFetchTournamentQuery(tournament)
	const {
		data: tournamentGroups,
		isLoading: isLoadingGroups,
		isError: isErrorGroups,
	} = useFetchTournamentGroupsQuery(tournament)
	const deleteGroupMutation = useDeleteGroupMutation()
	const handleDeleteGroup = (groupId: string) => {
		if (confirm(t('delete_group_confirmation'))) {
			deleteGroupMutation.mutate(groupId)
		}
	}

	if (isLoading || isLoadingGroups) {
		return <TournamentSkeleton />
	}
	if (isError || isErrorGroups) {
		return <div>{t('error_loading')}</div>
	}
	// the shared tournament page exists only while at least one group is public
	const publicToken = tournamentData?.[0]?.public_token
	const hasPublicGroups = tournamentGroups?.some(group => group.is_public)

	return (
		<div className='container mx-auto p-8 sm:p-12 min-h-screen'>
			{tournamentData?.map((tournamentInfo: Tournament) => (
				<div key={tournamentInfo.id} className='mb-4 sm:mb-8'>
					<h1 className='text-xl sm:text-2xl font-bold mb-4'>
						{tournamentInfo.name}
					</h1>
					<div className='bg-gray-100 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-1 sm:gap-4'>
							<div>
								<span className='font-semibold text-sm sm:text-base'>
									{t('tournament_start_date')}:
								</span>
								<p>{formatDateDDMMYYYY(tournamentInfo.start_date)}</p>
							</div>
							<div>
								<span className='font-semibold text-sm sm:text-base'>
									{t('tournament_end_date')}:
								</span>
								<p>{formatDateDDMMYYYY(tournamentInfo.end_date)}</p>
							</div>
						</div>
					</div>
				</div>
			))}

			<div>
				<h2 className='text-lg sm:text-xl font-bold mb-4'>
					{t('tournament_groups')}
				</h2>
				{tournamentGroups && tournamentGroups.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4'>
						{tournamentGroups?.map((group: TournamentGroup) => (
							<div key={group.id} className='relative'>
								<Link
									key={group.id}
									href={`/tournaments/${tournament}/groups/${group.id}`}
									className='block p-1 sm:p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-white hover:bg-gray-50'
								>
									<h3 className='text-sm sm:text-lg font-semibold mb-2'>
										{group.name}
									</h3>
									<div className='flex justify-end items-center'>
										<span className='text-blue-600 text-xs sm:text-sm'>
											{t('group_card.enter_group')}
										</span>
									</div>
								</Link>
								<Button
									disabled={group.status === 'completed'}
									variant='ghost'
									size='sm'
									className='absolute top-0 right-0 cursor-pointer hidden sm:block'
									onClick={() => handleDeleteGroup(group.id.toString())}
									title={t('delete_group_title')}
								>
									<X />
								</Button>
							</div>
						))}
					</div>
				) : (
					<p className='text-sm sm:text-base text-gray-600'>{t('no_groups')}</p>
				)}
			</div>
			<div className='mt-2 sm:mt-10 flex flex-wrap gap-2 sm:gap-4'>
				<Link href={`/tournaments/${tournament}/creategroup`}>
					<Button size='sm'>{t('create_group')}</Button>
				</Link>
				{publicToken && hasPublicGroups && (
					<CopyLinkButton
						size='sm'
						path={publicPath(locale, publicToken)}
						label={t('copy_public_link')}
					/>
				)}
				<Link href={`/tournaments`}>
					<Button size='sm' variant='outline'>
						{t('back')}
					</Button>
				</Link>
			</div>
			{tournamentData?.[0] && (
				<DriveSettingsForm
					key={tournamentData[0].id}
					tournamentId={tournament}
					folderId={tournamentData[0].drive_folder_id}
					fileName={tournamentData[0].drive_file_name}
				/>
			)}
		</div>
	)
}
