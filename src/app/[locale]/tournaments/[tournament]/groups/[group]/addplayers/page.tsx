'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreatePlayerMutation } from '@/hooks/mutations/useCreatePlayerMutation'
import { useRemovePlayer } from '@/hooks/mutations/useRemovePlayer'
import { useFetchGroupPlayers } from '@/hooks/queries/useFetchGroupPlayers'
import { NewPlayerData } from '@/interfaces/playerInterfaces'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

function AddPlayers() {
	const t = useTranslations('AddPlayers')
	const queryClient = useQueryClient()
	const params = useParams()
	const groupId = params?.group as string
	const tournamentId = params?.tournament as string
	const [showAddForm, setShowAddForm] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<NewPlayerData>({
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			status: 'active',
		},
	})

	const { data: players, isLoading } = useFetchGroupPlayers(groupId)

	const createPlayerMutation = useCreatePlayerMutation(groupId, queryClient)

	const removePlayerMutation = useRemovePlayer(groupId, queryClient)

	const onSubmit: SubmitHandler<NewPlayerData> = async data => {
		createPlayerMutation.mutate(data)
		reset()
		setShowAddForm(false)
	}

	const handleRemovePlayer = async (playerId: number) => {
		if (confirm(t('confirm_delete'))) {
			removePlayerMutation.mutate(playerId)
		}
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-lg'>{t('loading')}</div>
			</div>
		)
	}
	return (
		<div className='max-w-4xl mx-auto p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>
					{t('title')} ({players?.length || 0})
				</h1>
				<button
					onClick={() => setShowAddForm(!showAddForm)}
					className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
				>
					{showAddForm ? t('buttons.cancel') : t('buttons.add_player')}
				</button>
			</div>

			{showAddForm && (
				<div className='bg-gray-50 p-4 rounded-lg mb-6'>
					<h2 className='text-lg font-semibold mb-4'>{t('form.title')}</h2>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='grid grid-cols-1 md:grid-cols-2 gap-4'
					>
						<div>
							<label className='block text-sm font-medium mb-1'>
								{t('form.first_name')} *
							</label>
							<Input
								type='text'
								{...register('first_name', {
									required: t('validation.first_name_required'),
								})}
							/>
							{errors.first_name && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.first_name.message}
								</p>
							)}
						</div>
						<div>
							<Label className='block text-sm font-medium mb-1'>
								{t('form.last_name')} *
							</Label>
							<Input
								type='text'
								{...register('last_name', {
									required: t('validation.last_name_required'),
								})}
							/>
							{errors.last_name && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.last_name.message}
								</p>
							)}
						</div>
						<div>
							<Label className='block text-sm font-medium mb-1'>
								{t('form.email')} *
							</Label>
							<Input
								type='email'
								{...register('email', {
									required: t('validation.email_required'),
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: t('validation.email_invalid'),
									},
								})}
							/>
							{errors.email && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.email.message}
								</p>
							)}
						</div>
						<div>
							<Label className='block text-sm font-medium mb-1'>
								{t('form.phone')}
							</Label>
							<Input type='tel' {...register('phone')} />
						</div>
						<div className='md:col-span-2 flex gap-2'>
							<Button
								type='submit'
								variant='green'
								disabled={createPlayerMutation.isPending}
							>
								{createPlayerMutation.isPending
									? t('Global.loading')
									: t('buttons.add')}
							</Button>
						</div>
					</form>
				</div>
			)}

			<div className='bg-white rounded-lg shadow'>
				{!players || players.length === 0 ? (
					<div className='p-8 text-center text-gray-500'>{t('no_players')}</div>
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
										{player.status === 'active'
											? t('active_player')
											: t('inactive_player')}
									</span>
								</div>
								<Button
									onClick={() => handleRemovePlayer(player.id)}
									variant='redDelete'
									title={t('delete_player')}
								>
									×
								</Button>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='flex flex-row gap-4 mt-10'>
				<Link href={`/tournaments/${tournamentId}/groups/${groupId}/`}>
					<Button>{t('buttons.back')}</Button>
				</Link>
			</div>
		</div>
	)
}

export default AddPlayers
