'use client'

import { useAuth } from '@/shared/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'

interface LoginFormData {
	email: string
	password: string
}

export default function LoginForm() {
	const { login } = useAuth()
	const router = useRouter()
	const t = useTranslations('Auth')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>()

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true)
		setError('')

		try {
			await login(data.email, data.password)
			router.push('/')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка входа')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold text-center mb-6'>
				{t('login.title')}
			</h2>

			{error && (
				<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4'>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<label
						htmlFor='email'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						{t('login.email')}
					</label>
					<input
						{...register('email', {
							required: t('validation.email_required'),
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: t('validation.email_invalid'),
							},
						})}
						type='email'
						id='email'
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						placeholder='admin@test.local'
					/>
					{errors.email && (
						<p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor='password'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						{t('login.password')}
					</label>
					<input
						{...register('password', {
							required: t('validation.password_required'),
							minLength: {
								value: 6,
								message: t('validation.password_min_length'),
							},
						})}
						type='password'
						id='password'
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						placeholder='••••••••'
					/>
					{errors.password && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.password.message}
						</p>
					)}
				</div>

				<Button type='submit' disabled={isLoading} variant='login'>
					{isLoading ? t('login.enter_loading') : t('login.enter')}
				</Button>
			</form>
		</div>
	)
}
