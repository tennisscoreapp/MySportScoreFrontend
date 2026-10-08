'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateMatchMutation } from '@/hooks/mutations/useCreateMatchMutation'
import { useUpdateMatchMutation } from '@/hooks/mutations/useUpdateMatchMutation'
import { Match, Player } from '@/interfaces/groupInterfaces'
import { MatchData, MatchFormData } from '@/interfaces/matchInterfaces'
import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

export default function MatchEditor({ groupId, tournamentId, players, match, setsToWin = 2, scoringMode = 'tennis' }: {
	groupId: string
	tournamentId: string
	players: Player[]
	match?: Match
	setsToWin?: number
	scoringMode?: 'tennis' | 'legacy'
}) {
	const legacy = scoringMode === 'legacy'
	const t = useTranslations('Match')
	const router = useRouter()
	const queryClient = useQueryClient()
	// Freeze the version the organizer opened. A background refetch must not
	// attach a newer version to a dirty form and bypass conflict checks.
	const [openedMatch] = useState(match)
	const [error, setError] = useState('')
	const [conflict, setConflict] = useState(false)
	const request = useRef<{ body: string; id: string } | null>(null)
	const destination = `/tournaments/${tournamentId}/groups/${groupId}`
	const create = useCreateMatchMutation(groupId, queryClient)
	const update = useUpdateMatchMutation(String(openedMatch?.id || ''), queryClient, groupId)
	const pending = create.isPending || update.isPending
	const { register, control, handleSubmit, watch, formState: { errors } } = useForm<MatchFormData>({
		defaultValues: {
			player1_id: openedMatch?.player1_id,
			player2_id: openedMatch?.player2_id,
			match_date: openedMatch?.match_date.split('T')[0] || new Date().toLocaleDateString('en-CA'),
			status: openedMatch?.status || 'completed',
			sets: openedMatch?.sets.map(set => ({ set_number: set.set_number, player1_games: set.player1_games, player2_games: set.player2_games })) || [
				{ set_number: 1, player1_games: 0, player2_games: 0 },
				{ set_number: 2, player1_games: 0, player2_games: 0 },
			],
		},
	})
	const { fields, append, remove } = useFieldArray({ control, name: 'sets' })
	const submit = async (data: MatchFormData) => {
		setError(''); setConflict(false)
		const payload: MatchData = {
			group_id: Number(groupId), player1_id: data.player1_id, player2_id: data.player2_id,
			winner_id: null,
			status: data.status, match_date: data.match_date,
			sets: data.status === 'scheduled' ? [] : data.sets.map((set, index) => {
				const previous = openedMatch?.sets[index]
				const sameScore = previous?.player1_games === set.player1_games && previous?.player2_games === set.player2_games
				return { set_number: index + 1, player1_games: set.player1_games, player2_games: set.player2_games,
					tiebreak_player1: sameScore ? previous?.tiebreak_player1 : undefined,
					tiebreak_player2: sameScore ? previous?.tiebreak_player2 : undefined }
			}),
		}
		try {
			if (openedMatch) {
				await update.mutateAsync({ ...payload, version: openedMatch.version })
			} else {
				const body = JSON.stringify(payload)
				if (!request.current || request.current.body !== body) request.current = { body, id: crypto.randomUUID() }
				await create.mutateAsync({ ...payload, request_id: request.current.id })
			}
			router.replace(destination)
		} catch (cause) {
			const code = isAxiosError(cause) ? cause.response?.data?.code : undefined
			if (code === 'version_conflict' || code === 'version_required') {
				setConflict(true); setError(t('version_conflict'))
			} else {
				const message = isAxiosError(cause) ? cause.response?.data?.message : undefined
				setError(typeof message === 'string' ? message : t('save_failed'))
			}
		}
	}
	return (
		<div className='max-w-2xl mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-2'>{t(openedMatch ? 'titleEdit' : 'titleAdd')}</h1>
			<p className='text-sm text-muted-foreground mb-6'>{legacy ? t('legacy_format') : t('tennis_format', { count: setsToWin })}</p>
			{error && <div role='alert' className='border border-red-300 bg-red-50 text-red-800 p-4 mb-4 rounded-md'>
				<p>{error}</p>
				{conflict && <Button type='button' variant='outline' className='mt-3' onClick={() => window.location.reload()}>{t('reload_match')}</Button>}
			</div>}
			<form onSubmit={handleSubmit(submit)}>
				<fieldset disabled={pending} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{(['player1_id', 'player2_id'] as const).map((name, index) => <div key={name} className='space-y-2'>
							<Label htmlFor={name}>{t(index === 0 ? 'form.player1' : 'form.player2')}</Label>
							<select id={name} {...register(name, { required: t(index === 0 ? 'validation.player1_required' : 'validation.player2_required'), valueAsNumber: true })}
								aria-invalid={!!errors[name]} className='w-full h-9 px-3 border border-input rounded-md bg-background'>
								<option value=''>{t(index === 0 ? 'form.select_player1' : 'form.select_player2')}</option>
								{players.filter(player => legacy || !openedMatch || player.id === openedMatch[name]).map(player => <option key={player.id} value={player.id}>{player.first_name} {player.last_name}</option>)}
							</select>
							{errors[name] && <p className='text-sm text-red-600'>{errors[name]?.message}</p>}
						</div>)}
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'><Label htmlFor='match_date'>{t('form.match_date')}</Label><Input id='match_date' type='date' {...register('match_date', { required: t('validation.match_date_required') })} />
							{errors.match_date && <p className='text-sm text-red-600'>{errors.match_date.message}</p>}
						</div>
						<div className='space-y-2'><Label htmlFor='status'>{t('form.status')}</Label>
							<select id='status' {...register('status')} className='w-full h-9 px-3 border border-input rounded-md bg-background'>
								<option value='completed'>{t('form.status_completed')}</option>
								<option value='in_progress'>{t('form.status_active')}</option>
								<option value='scheduled'>{t('status_scheduled')}</option>
								<option value='cancelled'>{t('form.status_cancelled')}</option>
							</select>
						</div>
					</div>
					{watch('status') !== 'scheduled' && <div className='space-y-4'>
						{fields.map((field, index) => <fieldset key={field.id} className='border rounded-lg p-4 space-y-3'>
							<legend className='px-2 font-medium'>{t('form.set')} {index + 1}</legend>
							<div className='grid grid-cols-2 gap-4'>
								{(['player1_games', 'player2_games'] as const).map((name, playerIndex) => <div key={name} className='space-y-2'>
									<Label htmlFor={`set-${index}-${name}`}>{t(playerIndex === 0 ? 'form.player1' : 'form.player2')}</Label>
									<Input id={`set-${index}-${name}`} type='number' min={0} max={legacy ? 2147483647 : index === setsToWin * 2 - 2 ? 1000 : 7} step={1} {...register(`sets.${index}.${name}`, { required: true, min: 0, max: legacy ? 2147483647 : index === setsToWin * 2 - 2 ? 1000 : 7, valueAsNumber: true })} />
									{errors.sets?.[index]?.[name] && <p className='text-sm text-red-600'>{t(legacy ? 'legacy_score_range' : index === setsToWin * 2 - 2 ? 'deciding_score_range' : 'games_range')}</p>}
								</div>)}
							</div>
						</fieldset>)}
						<div className='flex gap-3'>
							<Button type='button' variant='outline' disabled={!legacy && fields.length >= setsToWin * 2 - 1} onClick={() => append({ set_number: fields.length + 1, player1_games: 0, player2_games: 0 })}>{t('form.add_set')}</Button>
							<Button type='button' variant='outline' disabled={fields.length === 0} onClick={() => remove(fields.length - 1)}>{t('form.delete_set')}</Button>
						</div>
					</div>}
					<div className='flex gap-4 pt-4'>
						<Button type='submit' className='flex-1' disabled={pending || conflict}>{pending ? t('saving') : t(openedMatch ? 'buttons.update_match' : 'buttons.create_match')}</Button>
						<Link href={destination}><Button type='button' variant='outline'>{t('buttons.cancel')}</Button></Link>
					</div>
				</fieldset>
			</form>
		</div>
	)
}
