'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useFetchTournamentsQuery } from '@/hooks/queries/useFetchTournamentsQuery'
import { formatDateDDMMYYYY } from '@/utils/dateutils/dateFormats'
import {
	getStatusColor,
	getStatusIcon,
	getStatusText,
} from '@/utils/tournamentPageUtils/tournamentPageUtils'
import { ArrowLeft, Calendar, Loader2, Plus, Trophy, X } from 'lucide-react'
import Link from 'next/link'

export default function Tournaments() {
	const { user } = useAuth()
	const { data, isLoading, isError, error } = useFetchTournamentsQuery()

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 p-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex items-center justify-center h-64'>
						<div className='flex flex-col items-center gap-4'>
							<Loader2 className='w-8 h-8 animate-spin text-blue-600' />
							<p className='text-lg text-gray-600'>Загрузка турниров...</p>
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
									Ошибка загрузки
								</h2>
								<p className='text-gray-600'>
									{error?.message || 'Не удалось загрузить турниры'}
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
				<div className='mb-8'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
							<Trophy className='w-6 h-6 text-white' />
						</div>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>Турниры</h1>
							<p className='text-gray-600'>
								Управление турнирами по большому теннису
							</p>
						</div>
					</div>
				</div>

				{/* Tournaments Grid */}
				{data && data.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
						{data.map(tournament => (
							<Link
								key={tournament.id}
								href={`/tournaments/${tournament.id}`}
								className='group'
							>
								<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 h-full'>
									{/* Header */}
									<div className='flex items-start justify-between mb-4'>
										<div className='flex-1 min-w-0'>
											<h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate'>
												{tournament.name}
											</h3>
											<p className='text-sm text-gray-500 mt-1'>
												{tournament.year} год
											</p>
										</div>
										<div
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ml-3 ${getStatusColor(
												tournament.status
											)}`}
										>
											{getStatusIcon(tournament.status)}
											{getStatusText(tournament.status)}
										</div>
									</div>

									{/* Dates */}
									<div className='space-y-2 mb-4'>
										<div className='flex items-center gap-2 text-sm text-gray-600'>
											<Calendar className='w-4 h-4' />
											<span>
												Начало: {formatDateDDMMYYYY(tournament.start_date)}
											</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-gray-600'>
											<Calendar className='w-4 h-4' />
											<span>
												Окончание: {formatDateDDMMYYYY(tournament.end_date)}
											</span>
										</div>
									</div>

									{/* Footer */}
									<div className='flex items-center justify-between pt-4 border-t border-gray-100'>
										<span className='text-xs text-gray-500'>
											ID: {tournament.id}
										</span>
										<div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors'>
											<ArrowLeft className='w-3 h-3 text-white rotate-180' />
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Trophy className='w-8 h-8 text-gray-400' />
						</div>
						<h2 className='text-xl font-semibold text-gray-900 mb-2'>
							Нет турниров
						</h2>
						<p className='text-gray-600 mb-6'>
							Создайте первый турнир для начала работы
						</p>
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Link href='/tournaments/create'>
						<Button className='flex items-center gap-2 px-6 py-3 text-base'>
							<Plus className='w-5 h-5' />
							Создать турнир
						</Button>
					</Link>
					<Link href='/'>
						<Button
							variant='outline'
							className='flex items-center gap-2 px-6 py-3 text-base'
						>
							<ArrowLeft className='w-5 h-5' />
							Назад
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
