'use client'

import { fetchGroup, updateMatch } from '@/api/groupApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GroupResponse, Match } from '@/interfaces/groupInterfaces'
import { determineWinner } from '@/utils/addMatchUtils/addMatchUtils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { MatchData, MatchFormData } from '../addmatch/page'

export default function AddMatchPage() {
	const params = useParams()
	const router = useRouter()
	const groupId = params?.group as string
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

	const matchId = 26

	const { data: groupResponse, isLoading } = useQuery<GroupResponse[]>({
		queryKey: ['group', groupId],
		queryFn: () => fetchGroup(groupId),
	})

	const match = groupResponse?.[0]?.group_data?.matches.find(
		(match: Match) => match.id === matchId
	)

	const watchedSets = watch('sets') || match?.sets

	const updateMatchMutation = useMutation({
		mutationFn: (matchData: MatchData) => updateMatch(matchId, matchData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['match', matchId] })
		},
		onError: error => {
			console.error('Error updating match:', error)
		},
	})

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
		updateMatchMutation.mutate(matchData)

		alert('Матч успешно обновлен!')
		router.push(`/groups/${groupId}`)
	}

	if (isLoading) {
		return <div className='p-6'>Загрузка...</div>
	}

	return (
		<div className='max-w-2xl mx-auto p-6'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold mb-2'>Edit match</h1>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='player1_id'>Player 1</Label>
						<Input
							type='hidden'
							{...register('player1_id')}
							defaultValue={match?.player1_id}
						/>
						<div className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-gray-100 flex items-center'>
							{`${match?.player1_first_name} ${match?.player1_last_name}`}
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='player2_id'>Player 2</Label>
						<Input
							type='hidden'
							{...register('player2_id')}
							defaultValue={match?.player2_id}
						/>
						<div className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-gray-100 flex items-center'>
							{`${match?.player2_first_name} ${match?.player2_last_name}`}
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='match_date'>Match Date</Label>
						<Input
							type='date'
							defaultValue={match?.match_date}
							{...register('match_date', {
								required: 'Match date is required',
							})}
						/>
						{errors.match_date && (
							<p className='text-sm text-red-600'>
								{errors.match_date.message}
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='status'>Status</Label>
						<select
							defaultValue={match?.status}
							{...register('status', { required: 'Status is required' })}
							className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-transparent'
						>
							<option value='completed'>Completed</option>
							<option value='active'>Active</option>
							<option value='cancelled'>Cancelled</option>
						</select>
					</div>
				</div>

				{/* Сеты */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label className='text-lg font-semibold'>Sets</Label>
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
								Add Set
							</Button>
							{fields.length > 1 && (
								<Button
									type='button'
									variant='destructive'
									size='sm'
									onClick={() => remove(fields.length - 1)}
								>
									Remove Set
								</Button>
							)}
						</div>
					</div>

					{fields.map((field, index) => (
						<div key={field.id} className='border rounded-lg p-4 space-y-3'>
							<h3 className='font-medium'>Set {index + 1}</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Player 1 Games</Label>
									<Input
										type='number'
										min='0'
										defaultValue={match?.sets[index]?.player1_games}
										{...register(`sets.${index}.player1_games` as const, {
											required: 'Games count is required',
											valueAsNumber: true,
											min: { value: 0, message: 'Games must be 0 or more' },
										})}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Player 2 Games</Label>
									<Input
										type='number'
										min='0'
										defaultValue={match?.sets[index]?.player2_games}
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
						<h3 className='font-medium mb-2'>Preview Result:</h3>
						<div className='text-sm space-y-1'>
							{watchedSets.map((set, index) => (
								<div key={index}>
									Set {index + 1}: {set.player1_games} - {set.player2_games}
								</div>
							))}
							<div className='font-medium pt-2 border-t'>
								Winner:{' '}
								{determineWinner(watchedSets) === 'player1'
									? 'Player 1'
									: determineWinner(watchedSets) === 'player2'
									? 'Player 2'
									: 'Draw'}
							</div>
						</div>
					</div>
				)}

				{/* Кнопки действий */}
				<div className='flex gap-4 pt-4'>
					<Button type='submit' className='flex-1'>
						Update Match
					</Button>
					<Link href={`/groups/${groupId}`}>
						<Button type='button' variant='outline'>
							Cancel
						</Button>
					</Link>
				</div>
			</form>
		</div>
	)
}
