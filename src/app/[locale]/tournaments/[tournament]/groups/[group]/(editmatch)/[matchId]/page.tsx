'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateMatchMutation } from '@/hooks/mutations/useUpdateMatchMutation'
import { useFetchGroupQuery } from '@/hooks/queries/useFetchGroupQuery'
import { Match } from '@/interfaces/groupInterfaces'
import { MatchFormData } from '@/interfaces/matchInterfaces'
import { determineWinner } from '@/utils/addMatchUtils/addMatchUtils'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'

export default function EditMatchPage() {
	const params = useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const t = useTranslations('Match')

	const groupId = (params?.group as string) || ''
	const matchId = (params?.matchId as string) || ''
	const tournamentId = (params?.tournament as string) || ''

	const { data: groupResponse, isLoading } = useFetchGroupQuery(groupId)
	console.log('GroupResponse', groupResponse)

	const match = groupResponse?.[0]?.group_data?.matches.find(
		(match: Match) => match.id === Number(matchId)
	)
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<MatchFormData>({
		defaultValues: {
			player1_id: match?.player1_id,
			player2_id: match?.player2_id,
			match_date: match?.match_date.split('T')[0],
			status: match?.status || 'completed',
			sets: match?.sets || [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'sets',
	})

	const watchedSets = watch('sets') || match?.sets

	const updateMatchMutation = useUpdateMatchMutation(matchId, queryClient)

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

		alert(t('match_updated'))
		router.push(`/tournaments/${tournamentId}/groups/${groupId}`)
	}

	if (isLoading) {
		return <div className='p-6'>{t('loading')}</div>
	}

	return (
		<div className='max-w-2xl mx-auto p-6'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold mb-2'>{t('titleEdit')}</h1>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='player1_id'>{t('form.player1')}</Label>
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
						<Label htmlFor='player2_id'>{t('form.player2')}</Label>
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
						<Label htmlFor='match_date'>{t('form.match_date')}</Label>
						<Input
							type='date'
							defaultValue={match?.match_date}
							{...register('match_date', {
								required: t('validation.match_date_required'),
							})}
						/>
						{errors.match_date && (
							<p className='text-sm text-red-600'>
								{errors.match_date.message}
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='status'>{t('form.status')}</Label>
						<select
							defaultValue={match?.status}
							{...register('status', {
								required: t('validation.status_required'),
							})}
							className='w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-transparent'
						>
							<option value='completed'>{t('form.status_completed')}</option>
							<option value='active'>{t('form.status_active')}</option>
							<option value='cancelled'>{t('form.status_cancelled')}</option>
						</select>
					</div>
				</div>

				{/* Сеты */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label className='text-lg font-semibold'>{t('form.sets')}</Label>
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
								{t('form.add_set')}
							</Button>
							{fields.length > 1 && (
								<Button
									type='button'
									variant='destructive'
									size='sm'
									onClick={() => remove(fields.length - 1)}
								>
									{t('form.delete_set')}
								</Button>
							)}
						</div>
					</div>

					{fields.map((field, index) => (
						<div key={field.id} className='border rounded-lg p-4 space-y-3'>
							<h3 className='font-medium'>
								{t('form.set')} {index + 1}
							</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>{t('form.player1')}</Label>
									<Input
										type='number'
										min='0'
										defaultValue={match?.sets[index]?.player1_games}
										{...register(`sets.${index}.player1_games` as const, {
											required: t('validation.games_count_required'),
											valueAsNumber: true,
											min: {
												value: 0,
												message: t('validation.games_count_min'),
											},
										})}
									/>
								</div>
								<div className='space-y-2'>
									<Label>{t('form.player2')}</Label>
									<Input
										type='number'
										min='0'
										defaultValue={match?.sets[index]?.player2_games}
										{...register(`sets.${index}.player2_games` as const, {
											required: t('validation.games_count_required'),
											valueAsNumber: true,
											min: {
												value: 0,
												message: t('validation.games_count_min'),
											},
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
						<h3 className='font-medium mb-2'>{t('form.preview_result')}</h3>
						<div className='text-sm space-y-1'>
							{watchedSets.map((set, index) => (
								<div key={index}>
									{t('form.set')} {index + 1}: {set.player1_games} -{' '}
									{set.player2_games}
								</div>
							))}
							<div className='font-medium pt-2 border-t'>
								{t('form.winner')}:{' '}
								{determineWinner(watchedSets) === 'player1'
									? t('form.player1')
									: determineWinner(watchedSets) === 'player2'
									? t('form.player2')
									: t('form.draw')}
							</div>
						</div>
					</div>
				)}

				{/* Кнопки действий */}
				<div className='flex gap-4 pt-4'>
					<Button type='submit' className='flex-1'>
						{t('buttons.update_match')}
					</Button>
					<Link href={`/tournaments/${tournamentId}/groups/${groupId}`}>
						<Button type='button' variant='outline'>
							{t('buttons.cancel')}
						</Button>
					</Link>
				</div>
			</form>
		</div>
	)
}
