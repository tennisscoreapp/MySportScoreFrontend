'use client'

import { AuthContextType, User } from '@/interfaces/loginInterfaces'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Добавляем fallback и проверку корректности URL
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	(typeof window !== 'undefined'
		? `${window.location.protocol}//${window.location.hostname}:5000`
		: 'http://localhost:5000')

// Проверяем, что URL не содержит undefined
if (API_BASE_URL.includes('undefined')) {
	console.error(
		'❌ NEXT_PUBLIC_API_URL содержит undefined. Проверьте переменные окружения в Coolify!'
	)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	const checkAuth = async () => {
		// Логируем только в development
		if (process.env.NODE_ENV === 'development') {
			console.log('API_BASE_URL:', API_BASE_URL)
			console.log('Full URL:', `${API_BASE_URL}/api/v1/me`)
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
				credentials: 'include',
			})

			if (response.ok) {
				const data = await response.json()
				if (data.success) {
					setUser(data.user)
				}
			} else {
				setUser(null)
			}
		} catch (error) {
			console.error('Auth check failed:', error)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	const login = async (email: string, password: string) => {
		setLoading(true)
		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ email, password }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Ошибка входа')
			}

			if (data.success) {
				setUser(data.user)
			}
		} catch (error) {
			throw error
		} finally {
			setLoading(false)
		}
	}

	const logout = async () => {
		try {
			await fetch(`${API_BASE_URL}/api/v1/logout`, {
				method: 'POST',
				credentials: 'include',
			})
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			setUser(null)
		}
	}

	useEffect(() => {
		checkAuth()
	}, [])

	const value = {
		user,
		loading,
		login,
		logout,
		checkAuth,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
