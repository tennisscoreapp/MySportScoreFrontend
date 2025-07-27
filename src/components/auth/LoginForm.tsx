'use client'

import { useAuth } from '@/shared/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginFormData {
	email: string
	password: string
}

export default function LoginForm() {
	const { login } = useAuth()
	const router = useRouter()
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
			<h2 className='text-2xl font-bold text-center mb-6'>Вход в систему</h2>

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
						Email
					</label>
					<input
						{...register('email', {
							required: 'Email обязателен',
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: 'Неверный формат email',
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
						Пароль
					</label>
					<input
						{...register('password', {
							required: 'Пароль обязателен',
							minLength: {
								value: 6,
								message: 'Пароль должен содержать минимум 6 символов',
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

				<button
					type='submit'
					disabled={isLoading}
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
				>
					{isLoading ? 'Вход...' : 'Войти'}
				</button>
			</form>

			<div className='mt-4 text-center text-sm text-gray-600'>
				<p>Тестовые данные:</p>
				<p>Email: admin@test.local</p>
				<p>Пароль: admin123</p>
			</div>
		</div>
	)
}
