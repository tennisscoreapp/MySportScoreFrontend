'use client'

import { Button } from '@/components/ui/button'
import { useDeleteTournamentMutation } from '@/hooks/mutations/useDeleteTournamentMutation'
import { useFetchTournamentsQuery } from '@/hooks/queries/useFetchTournamentsQuery'
import { formatDateDDMMYYYY } from '@/utils/dateutils/dateFormats'
import {
	getStatusColor,
	getStatusIcon,
	getStatusText,
} from '@/utils/tournamentPageUtils/getStatus'
import { ArrowLeft, Calendar, Loader2, Plus, Trophy, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Tournaments() {
	const { data, isLoading, isError, error } = useFetchTournamentsQuery()
	const deleteJournamentMutation = useDeleteTournamentMutation()
	const t = useTranslations('Tournaments')

	const handleDeleteTournament = (tournamentId: string) => {
		if (confirm(t('delete_tournament_confirmation'))) {
			deleteJournamentMutation.mutate(tournamentId)
		}
	}

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 p-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex items-center justify-center h-64'>
						<div className='flex flex-col items-center gap-4'>
							<Loader2 className='w-8 h-8 animate-spin text-blue-600' />
							<p className='text-lg text-gray-600'>{t('tournament_loading')}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='min-h-screen bg-gray-50 p-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex items-center justify-center h-64'>
						<div className='flex flex-col items-center gap-4'>
							<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
								<X className='w-8 h-8 text-red-600' />
							</div>
							<div className='text-center'>
								<h2 className='text-xl font-semibold text-gray-900 mb-2'>
									{t('error_loading')}
								</h2>
								<p className='text-gray-600'>
									{error?.message || t('error_loading_message')}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-4 sm:mb-8'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
							<Trophy className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
						</div>
						<div>
							<h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
								{t('title')}
							</h1>
							<p className='text-sm sm:text-base text-gray-600'>
								{t('description')}
							</p>
						</div>
					</div>
				</div>

				{/* Tournaments Grid */}
				{data && data.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8'>
						{data.map(tournament => (
							<div key={`tournament-${tournament.id}`} className='relative'>
								<Link
									href={`/tournaments/${tournament.id}`}
									className='group block'
								>
									<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 h-full'>
										{/* Header */}
										<div className='flex items-start justify-between mb-4'>
											<div className='flex-1 min-w-0'>
												<h3 className='text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate'>
													{tournament.name}
												</h3>
												<p className='text-xs sm:text-sm text-gray-500 mt-1'>
													{tournament.year} {t('tournament_card.year')}
												</p>
											</div>
											<div
												className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ml-3 ${getStatusColor(
													tournament.status
												)}`}
											>
												{getStatusIcon(tournament.status)}
												{getStatusText(tournament.status, t)}
											</div>
										</div>

										{/* Dates */}
										<div className='space-y-1 sm:space-y-2 mb-2 sm:mb-4'>
											<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
												<Calendar className='w-4 h-4' />
												<span>
													{t('tournament_card.start_date')}:{' '}
													{formatDateDDMMYYYY(tournament.start_date)}
												</span>
											</div>
											<div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
												<Calendar className='w-4 h-4' />
												<span>
													{t('tournament_card.end_date')}:{' '}
													{formatDateDDMMYYYY(tournament.end_date)}
												</span>
											</div>
										</div>

										{/* Footer */}
										<div className='flex items-center justify-between pt-2 sm:pt-4 border-t border-gray-100'>
											<span className='text-xs text-gray-500'>
												ID: {tournament.id}
											</span>
											<div className='w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors'>
												<ArrowLeft className='w-3 h-3 sm:w-4 sm:h-4 text-white rotate-180' />
											</div>
										</div>
									</div>
								</Link>
								<Button
									variant='ghost'
									size='icon'
									className='absolute top-0 right-0 cursor-pointer'
									onClick={() =>
										handleDeleteTournament(tournament.id.toString())
									}
									title={t('delete_tournament_title')}
								>
									<X />
								</Button>
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Trophy className='w-8 h-8 text-gray-400' />
						</div>
						<h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
							{t('no_tournaments')}
						</h2>
						<p className='text-sm sm:text-base text-gray-600 mb-6'>
							{t('create_tournament_message')}
						</p>
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center'>
					<Link href='/tournaments/create'>
						<Button
							className='flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base'
							size='sm'
						>
							<Plus className='w-5 h-5' />
							{t('create_tournament')}
						</Button>
					</Link>
					<Link href='/'>
						<Button
							variant='outline'
							className='flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base'
							size='sm'
						>
							<ArrowLeft className='w-5 h-5' />
							{t('back')}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
