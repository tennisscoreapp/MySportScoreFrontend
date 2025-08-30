'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateTournamentMutation } from '@/hooks/mutations/useCreateTournamentMutation'
import { useAuth } from '@/shared/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface TournamentForm {
	name: string
	year: number
	start_date: string
	end_date: string
}

export default function CreateTournament() {
	const router = useRouter()
	const { user } = useAuth()
	const t = useTranslations('Tournaments')
	const currentYear = new Date().getFullYear()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
	} = useForm<TournamentForm>({
		defaultValues: {
			name: '',
			year: currentYear,
			start_date: '',
			end_date: '',
		},
		mode: 'onChange',
	})

	const startDate = watch('start_date')

	const mutation = useCreateTournamentMutation(router)

	const onSubmit = (data: TournamentForm) => {
		mutation.mutate({
			...data,
			user_id: user?.id ?? 0,
			status: 'active',
			created_at: new Date().toISOString(),
			id: 0,
		})
	}

	return (
		<div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md '>
			<h1 className='text-2xl font-bold mb-6'>{t('create_tournament')}</h1>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<Label htmlFor='name' className='mb-2'>
						{t('create_tournament_form.name')}
					</Label>
					<Input
						id='name'
						type='text'
						{...register('name', {
							required: t('create_tournament_form.validation.name_required'),
							minLength: {
								value: 2,
								message: t('create_tournament_form.validation.name_min_length'),
							},
						})}
						className={errors.name ? 'border-red-500' : ''}
					/>
					{errors.name && (
						<p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor='year' className='mb-2'>
						{t('create_tournament_form.year')}
					</Label>
					<Input
						id='year'
						type='number'
						{...register('year', {
							required: t('create_tournament_form.validation.year_required'),
							min: {
								value: currentYear,
								message: t('create_tournament_form.validation.year_min'),
							},
							max: {
								value: currentYear + 10,
								message: t('create_tournament_form.validation.year_max'),
							},
							valueAsNumber: true,
						})}
						min={currentYear}
						className={errors.year ? 'border-red-500' : ''}
					/>
					{errors.year && (
						<p className='text-red-500 text-sm mt-1'>{errors.year.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor='start_date' className='mb-2'>
						{t('create_tournament_form.start_date')}
					</Label>
					<Input
						id='start_date'
						type='date'
						{...register('start_date', {
							required: t(
								'create_tournament_form.validation.start_date_required'
							),
						})}
						className={errors.start_date ? 'border-red-500' : ''}
					/>
					{errors.start_date && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.start_date.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor='end_date' className='mb-2'>
						{t('create_tournament_form.end_date')}
					</Label>
					<Input
						id='end_date'
						type='date'
						{...register('end_date', {
							required: t(
								'create_tournament_form.validation.end_date_required'
							),
							validate: value => {
								if (startDate && value < startDate) {
									return t(
										'create_tournament_form.validation.end_date_after_start_date'
									)
								}
								return true
							},
						})}
						className={errors.end_date ? 'border-red-500' : ''}
					/>
					{errors.end_date && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.end_date.message}
						</p>
					)}
				</div>

				<div className='flex gap-4 pt-4'>
					<Button
						type='submit'
						disabled={mutation.isPending || isSubmitting}
						className='flex-1'
					>
						{mutation.isPending
							? t('create_tournament_form.validation.creating')
							: t('create_tournament_form.create')}
					</Button>

					<Link href='/tournaments' className='flex-1'>
						<Button type='button' variant='outline' className='w-full'>
							{t('create_tournament_form.validation.cancel')}
						</Button>
					</Link>
				</div>
			</form>

			{mutation.isError && (
				<p className='text-red-500 text-sm mt-4'>
					{t('create_tournament_form.validation.error')}
				</p>
			)}
		</div>
	)
}
