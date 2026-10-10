'use client'
import { TournamentSkeleton } from '@/components/Skeletons/PageSkeletons'
import PublicUnavailable from '@/components/Public/PublicUnavailable'
import { usePublicTournamentQuery } from '@/hooks/queries/usePublicQueries'
import { formatDateDDMMYYYY } from '@/utils/dateutils/dateFormats'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PublicTournamentPage() {
	const t = useTranslations('TournamentGroups')
	const { token } = useParams<{ token: string }>()
	const { data, isLoading, isError } = usePublicTournamentQuery(token)

	if (isLoading) return <TournamentSkeleton withActions={false} />
	if (isError || !data) return <PublicUnavailable />

	return (
		<div className='container mx-auto p-8 sm:p-12 min-h-screen'>
			<div className='mb-4 sm:mb-8'>
				<h1 className='text-xl sm:text-2xl font-bold mb-4'>{data.name}</h1>
				<div className='bg-gray-100 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-1 sm:gap-4'>
						<div>
							<span className='font-semibold text-sm sm:text-base'>
								{t('tournament_start_date')}:
							</span>
							<p>{formatDateDDMMYYYY(data.start_date)}</p>
						</div>
						{data.end_date && (
							<div>
								<span className='font-semibold text-sm sm:text-base'>
									{t('tournament_end_date')}:
								</span>
								<p>{formatDateDDMMYYYY(data.end_date)}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<h2 className='text-lg sm:text-xl font-bold mb-4'>
				{t('tournament_groups')}
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4'>
				{data.groups.map(group => (
					<Link
						key={group.id}
						href={`/public/${token}/groups/${group.id}`}
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
				))}
			</div>
		</div>
	)
}
