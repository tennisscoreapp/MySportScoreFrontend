'use client'

import { createTournament } from '@/api/tournamentsApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
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
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
	} = useForm<TournamentForm>({
		defaultValues: {
			name: '',
			year: new Date().getFullYear(),
			start_date: '',
			end_date: '',
		},
		mode: 'onChange',
	})

	const startDate = watch('start_date')

	const mutation = useMutation({
		mutationFn: createTournament,
		onSuccess: () => {
			router.push('/tournaments')
		},
		onError: error => {
			console.error('Error creating tournament:', error)
		},
	})

	const onSubmit = (data: TournamentForm) => {
		mutation.mutate(data)
	}

	const currentYear = new Date().getFullYear()

	return (
		<div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md '>
			<h1 className='text-2xl font-bold mb-6'>Создать турнир</h1>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<Label htmlFor='name' className='mb-2'>
						Название турнира
					</Label>
					<Input
						id='name'
						type='text'
						{...register('name', {
							required: 'Название турнира обязательно',
							minLength: {
								value: 2,
								message: 'Название должно содержать минимум 2 символа',
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
						Год
					</Label>
					<Input
						id='year'
						type='number'
						{...register('year', {
							required: 'Год обязателен',
							min: {
								value: currentYear,
								message: `Год должен быть не меньше ${currentYear}`,
							},
							max: {
								value: currentYear + 10,
								message: `Год должен быть не больше ${currentYear + 10}`,
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
						Дата начала
					</Label>
					<Input
						id='start_date'
						type='date'
						{...register('start_date', {
							required: 'Дата начала обязательна',
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
						Дата окончания
					</Label>
					<Input
						id='end_date'
						type='date'
						{...register('end_date', {
							required: 'Дата окончания обязательна',
							validate: value => {
								if (startDate && value < startDate) {
									return 'Дата окончания должна быть позже даты начала'
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
						{mutation.isPending ? 'Создание...' : 'Создать турнир'}
					</Button>

					<Link href='/tournaments' className='flex-1'>
						<Button type='button' variant='outline' className='w-full'>
							Отмена
						</Button>
					</Link>
				</div>
			</form>

			{mutation.isError && (
				<p className='text-red-500 text-sm mt-4'>
					Произошла ошибка при создании турнира. Попробуйте еще раз.
				</p>
			)}
		</div>
	)
}
