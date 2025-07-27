'use client'
import { Button } from '@/components/ui/button'
import { useDeleteGroupMutation } from '@/hooks/mutations/useDeleteGroupMutation'
import { useFetchTournamentGroupsQuery } from '@/hooks/queries/useFetchTournamentGroupsQuery'
import { useFetchTournamentQuery } from '@/hooks/queries/useFetchTournamentQuery'
import { Tournament, TournamentGroup } from '@/interfaces/tournamentInterfaces'
import { formatDateDDMMYYYY } from '@/utils/dateutils/dateFormats'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SingleTournamentPage() {
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
		if (confirm('Вы уверены, что хотите удалить эту группу?')) {
			deleteGroupMutation.mutate(groupId)
		}
	}

	if (isLoading || isLoadingGroups) {
		return <div>Loading...</div>
	}
	if (isError || isErrorGroups) {
		return <div>Error</div>
	}

	return (
		<div className='container mx-auto p-6'>
			{/* информация о турнире */}
			{tournamentData.map((tournamentInfo: Tournament) => (
				<div key={tournamentInfo.id} className='mb-8'>
					<h1 className='text-3xl font-bold mb-4'>{tournamentInfo.name}</h1>
					<div className='bg-gray-100 p-4 rounded-lg mb-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<span className='font-semibold'>Дата начала:</span>
								<p>{formatDateDDMMYYYY(tournamentInfo.start_date)}</p>
							</div>
							<div>
								<span className='font-semibold'>Дата окончания:</span>
								<p>{formatDateDDMMYYYY(tournamentInfo.end_date)}</p>
							</div>
							<div>
								<span className='font-semibold'>Статус:</span>
								<p
									className={`inline-block px-2 py-1 rounded text-sm ${
										tournamentInfo.status === 'active'
											? 'bg-green-200 text-green-800'
											: tournamentInfo.status === 'completed'
											? 'bg-blue-200 text-blue-800'
											: 'bg-red-200 text-red-800'
									}`}
								>
									{tournamentInfo.status}
								</p>
							</div>
						</div>
					</div>
				</div>
			))}

			{/* Список групп */}
			<div>
				<h2 className='text-2xl font-bold mb-4'>Группы турнира</h2>
				{tournamentGroups.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{tournamentGroups.map((group: TournamentGroup) => (
							<div key={group.id} className='relative'>
								<Link
									key={group.id}
									href={`/tournaments/${tournament}/${group.id}`}
									className='block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-white hover:bg-gray-50'
								>
									<h3 className='text-lg font-semibold mb-2'>{group.name}</h3>
									<div className='flex justify-between items-center'>
										<span
											className={`px-2 py-1 rounded text-sm ${
												group.status === 'active'
													? 'bg-green-200 text-green-800'
													: group.status === 'completed'
													? 'bg-blue-200 text-blue-800'
													: 'bg-red-200 text-red-800'
											}`}
										>
											{group.status}
										</span>
										<span className='text-blue-600 text-sm'>
											Перейти в группу →
										</span>
									</div>
								</Link>
								<Button
									variant='ghost'
									size='icon'
									className='absolute top-0 right-0 cursor-pointer'
									onClick={() => handleDeleteGroup(group.id.toString())}
									title='Удалить турнир'
								>
									<X />
								</Button>
							</div>
						))}
					</div>
				) : (
					<p className='text-gray-600'>В данном турнире пока нет групп</p>
				)}
			</div>
			<div className='mt-10 flex gap-4'>
				<Link href={`/tournaments/${tournament}/creategroup`}>
					<Button>Создать группу</Button>
				</Link>
				<Link href={`/tournaments`}>
					<Button>Назад</Button>
				</Link>
			</div>
		</div>
	)
}
