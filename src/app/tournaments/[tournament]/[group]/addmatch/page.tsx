'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateMatchMutation } from '@/hooks/mutations/useCreateMatchMutation'
import { useFetchGroupPlayers } from '@/hooks/queries/useFetchGroupPlayers'
import { MatchFormData } from '@/interfaces/matchInterfaces'
import { determineWinner } from '@/utils/addMatchUtils/addMatchUtils'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'

export default function AddMatchPage() {
	const params = useParams()
	const router = useRouter()
	const groupId = params?.group as string
	const tournamentId = params?.tournament as string
	const queryClient = useQueryClient()
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<MatchFormData>({
		defaultValues: {
			player1_id: undefined,
			player2_id: undefined,
			match_date: new Date().toISOString().split('T')[0],
			status: 'completed',
			sets: [
				{ set_number: 1, player1_games: 0, player2_games: 0 },
				{ set_number: 2, player1_games: 0, player2_games: 0 },
			],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'sets',
	})

	const watchedSets = watch('sets')

	const { data: players, isLoading } = useFetchGroupPlayers(groupId)

	const createMatchMutation = useCreateMatchMutation(groupId, queryClient)

	const onSubmit = async (data: MatchFormData) => {
		const winner = determineWinner(data.sets)
		const winnerId =
			winner === 'player1'
				? data.player1_id
				: winner === 'player2'
				? data.player2_id
				: null

		const matchData = {
			group_id: Number(groupId),
			player1_id: data.player1_id,
			player2_id: data.player2_id,
			winner_id: winnerId,
			status: data.status,
			match_date: data.match_date,
			sets: data.sets,
		}
		createMatchMutation.mutate(matchData)

		alert('Матч успешно добавлен!')
		router.push(`/tournaments/${tournamentId}/${groupId}`)
	}

	if (isLoading) {
		return <div className='p-6'>Загрузка...</div>
	}

	return (
		<div className='max-w-2xl mx-auto p-6'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold mb-2'>Add New Match</h1>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				{/* Выбор игроков */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='player1_id'>Player 1</Label>
						<select
							{...register('player1_id', {
								required: 'Player 1 is required',
								valueAsNumber: true,
							})}
							className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-transparent'
						>
							<option value=''>Select Player 1</option>
							{players?.map(player => (
								<option key={player.id} value={player.id}>
									{player.first_name} {player.last_name}
								</option>
							))}
						</select>
						{errors.player1_id && (
							<p className='text-sm text-red-600'>
								{errors.player1_id.message}
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='player2_id'>Player 2</Label>
						<select
							{...register('player2_id', {
								required: 'Player 2 is required',
								valueAsNumber: true,
							})}
							className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-transparent'
						>
							<option value=''>Select Player 2</option>
							{players?.map(player => (
								<option key={player.id} value={player.id}>
									{player.first_name} {player.last_name}
								</option>
							))}
						</select>
						{errors.player2_id && (
							<p className='text-sm text-red-600'>
								{errors.player2_id.message}
							</p>
						)}
					</div>
				</div>

				{/* Дата и статус */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='match_date'>Дата матча</Label>
						<Input
							type='date'
							{...register('match_date', {
								required: 'Дата матча обязательна',
							})}
						/>
						{errors.match_date && (
							<p className='text-sm text-red-600'>
								{errors.match_date.message}
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='status'>Статус</Label>
						<select
							{...register('status', { required: 'Статус обязательно' })}
							className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-transparent'
						>
							<option value='completed'>Завершен</option>
							<option value='active'>Активен</option>
							<option value='cancelled'>Отменен</option>
						</select>
					</div>
				</div>

				{/* Сеты */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label className='text-lg font-semibold'>Сеты</Label>
						<div className='space-x-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() =>
									append({
										set_number: fields.length + 1,
										player1_games: 0,
										player2_games: 0,
									})
								}
							>
								Добавить сет
							</Button>
							{fields.length > 1 && (
								<Button
									type='button'
									variant='destructive'
									size='sm'
									onClick={() => remove(fields.length - 1)}
								>
									Удалить сет
								</Button>
							)}
						</div>
					</div>

					{fields.map((field, index) => (
						<div key={field.id} className='border rounded-lg p-4 space-y-3'>
							<h3 className='font-medium'>Сет {index + 1}</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Игрок 1</Label>
									<Input
										type='number'
										min='0'
										{...register(`sets.${index}.player1_games` as const, {
											required: 'Games count is required',
											valueAsNumber: true,
											min: { value: 0, message: 'Games must be 0 or more' },
										})}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Игрок 2</Label>
									<Input
										type='number'
										min='0'
										{...register(`sets.${index}.player2_games` as const, {
											required: 'Games count is required',
											valueAsNumber: true,
											min: { value: 0, message: 'Games must be 0 or more' },
										})}
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Предварительный результат */}
				{watchedSets && watchedSets.length > 0 && (
					<div className='bg-gray-50 p-4 rounded-lg'>
						<h3 className='font-medium mb-2'>Предварительный результат:</h3>
						<div className='text-sm space-y-1'>
							{watchedSets.map((set, index) => (
								<div key={index}>
									Сет {index + 1}: {set.player1_games} - {set.player2_games}
								</div>
							))}
							<div className='font-medium pt-2 border-t'>
								Победитель:{' '}
								{determineWinner(watchedSets) === 'player1'
									? 'Игрок 1'
									: determineWinner(watchedSets) === 'player2'
									? 'Игрок 2'
									: 'Ничья'}
							</div>
						</div>
					</div>
				)}

				{/* Кнопки действий */}
				<div className='flex gap-4 pt-4'>
					<Button type='submit' className='flex-1'>
						Создать матч
					</Button>
					<Link href={`/tournaments/${tournamentId}/${groupId}`}>
						<Button type='button' variant='outline'>
							Отмена
						</Button>
					</Link>
				</div>
			</form>
		</div>
	)
}
