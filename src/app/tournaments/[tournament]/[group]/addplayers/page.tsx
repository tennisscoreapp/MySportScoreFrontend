'use client'

import { Button } from '@/components/ui/button'
import { useCreatePlayerMutation } from '@/hooks/mutations/useCreatePlayerMutation'
import { useRemovePlayer } from '@/hooks/mutations/useRemovePlayer'
import { useFetchGroupPlayers } from '@/hooks/queries/useFetchGroupPlayers'
import { NewPlayerData } from '@/interfaces/playerInterfaces'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

function AddPlayers() {
	const queryClient = useQueryClient()
	const params = useParams()
	const groupId = params?.group as string
	const tournamentId = params?.tournament as string
	const [showAddForm, setShowAddForm] = useState(false)
	const [newPlayer, setNewPlayer] = useState<NewPlayerData>({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		status: 'active',
	})

	const { data: players, isLoading } = useFetchGroupPlayers(groupId)

	const createPlayerMutation = useCreatePlayerMutation(groupId, queryClient)

	const removePlayerMutation = useRemovePlayer(groupId, queryClient)

	const handleCreatePlayer = async (e: React.FormEvent) => {
		e.preventDefault()
		createPlayerMutation.mutate(newPlayer)
		setNewPlayer({
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			status: 'active',
		})
		setShowAddForm(false)
	}

	const handleRemovePlayer = async (playerId: number) => {
		if (confirm('Вы уверены, что хотите удалить этого игрока?')) {
			removePlayerMutation.mutate(playerId)
		}
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-lg'>Загрузка...</div>
			</div>
		)
	}
	return (
		<div className='max-w-4xl mx-auto p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>
					Игроки группы ({players?.length || 0})
				</h1>
				<button
					onClick={() => setShowAddForm(!showAddForm)}
					className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
				>
					{showAddForm ? 'Отмена' : 'Добавить игрока'}
				</button>
			</div>

			{/* Форма добавления игрока */}
			{showAddForm && (
				<div className='bg-gray-50 p-4 rounded-lg mb-6'>
					<h2 className='text-lg font-semibold mb-4'>Добавить игрока</h2>
					<form
						onSubmit={handleCreatePlayer}
						className='grid grid-cols-1 md:grid-cols-2 gap-4'
					>
						<div>
							<label className='block text-sm font-medium mb-1'>Имя *</label>
							<input
								type='text'
								required
								value={newPlayer.first_name}
								onChange={e =>
									setNewPlayer({ ...newPlayer, first_name: e.target.value })
								}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Фамилия *
							</label>
							<input
								type='text'
								required
								value={newPlayer.last_name}
								onChange={e =>
									setNewPlayer({ ...newPlayer, last_name: e.target.value })
								}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Email *</label>
							<input
								type='email'
								required
								value={newPlayer.email}
								onChange={e =>
									setNewPlayer({ ...newPlayer, email: e.target.value })
								}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>Телефон</label>
							<input
								type='tel'
								value={newPlayer.phone}
								onChange={e =>
									setNewPlayer({ ...newPlayer, phone: e.target.value })
								}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='md:col-span-2'>
							<button
								type='submit'
								className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
							>
								Добавить
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Список игроков */}
			<div className='bg-white rounded-lg shadow'>
				{!players || players.length === 0 ? (
					<div className='p-8 text-center text-gray-500'>
						В группе пока нет игроков
					</div>
				) : (
					<ul className='divide-y divide-gray-200'>
						{players.map(player => (
							<li
								key={player.id}
								className='p-4 flex items-center justify-between hover:bg-gray-50'
							>
								<div className='flex items-center space-x-3'>
									<div className='font-medium text-gray-900'>
										{player.first_name} {player.last_name}
									</div>
									<div className='text-sm text-gray-500'>{player.email}</div>
									{player.phone && (
										<div className='text-sm text-gray-500'>{player.phone}</div>
									)}
									<span
										className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
											player.status === 'active'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}`}
									>
										{player.status === 'active' ? 'Активен' : 'Неактивен'}
									</span>
								</div>
								<button
									onClick={() => handleRemovePlayer(player.id)}
									className='text-red-500 hover:text-red-700 text-xl font-bold'
									title='Удалить игрока'
								>
									×
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='flex flex-row gap-4 mt-10'>
				<Link href={`/tournaments/${tournamentId}/${groupId}/`}>
					<Button>Назад</Button>
				</Link>
			</div>
		</div>
	)
}

export default AddPlayers
