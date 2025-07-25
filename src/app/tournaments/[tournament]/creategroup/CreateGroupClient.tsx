'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useCreateGroupMutation } from '@/hooks/mutations/useCreateGroupMutation'
import { Group } from '@/interfaces/groupInterfaces'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function CreateGroupClient({
	tournamentId,
}: {
	tournamentId: string
}) {
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<Group>({
		defaultValues: {
			name: '',
			status: 'active',
		},
		mode: 'onChange',
	})

	const mutation = useCreateGroupMutation(tournamentId, router)

	const onSubmit = (data: Group) => {
		mutation.mutate({
			...data,
			tournament_id: parseInt(tournamentId),
		})
	}

	return (
		<div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md '>
			<h1 className='text-2xl font-bold mb-6'>Создать группу</h1>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<Label htmlFor='name' className='mb-2'>
						Название группы
					</Label>
					<Input
						id='name'
						type='text'
						{...register('name', {
							required: 'Название группы обязательно',
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
					<Label htmlFor='status' className='mb-2'>
						Статус
					</Label>
					<Select
						{...register('status', {
							required: 'Статус обязателен',
						})}
					>
						<SelectTrigger>
							<SelectValue placeholder='Выберите статус' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='active'>Активная</SelectItem>
							<SelectItem value='completed'>Завершенная</SelectItem>
						</SelectContent>
					</Select>
					{errors.status && (
						<p className='text-red-500 text-sm mt-1'>{errors.status.message}</p>
					)}
				</div>

				<div className='flex gap-4 pt-4'>
					<Button
						type='submit'
						disabled={mutation.isPending || isSubmitting}
						className='flex-1'
					>
						{mutation.isPending ? 'Создание...' : 'Создать группу'}
					</Button>

					<Link href={`/tournaments/${tournamentId}`} className='flex-1'>
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
