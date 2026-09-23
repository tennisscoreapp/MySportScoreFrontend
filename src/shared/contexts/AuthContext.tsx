'use client'

import { AuthContextType, User } from '@/interfaces/loginInterfaces'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient()
	const authGeneration = useRef(0)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)

	const checkAuth = async () => {
		const generation = authGeneration.current
		// prevent multiple simultaneous auth checks
		if (loading && initialized) return

		setLoading(true)
		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
				credentials: 'include',
			})
			if (generation !== authGeneration.current) return

			if (response.ok) {
				const data = await response.json()
				if (generation !== authGeneration.current) return
				if (data.success) {
					setUser(data.user)
				}
			} else {
				queryClient.clear()
				setUser(null)
			}
		} catch (error) {
			if (generation !== authGeneration.current) return
			console.error('Auth check failed:', error)
			queryClient.clear()
			setUser(null)
		} finally {
			if (generation === authGeneration.current) {
				setLoading(false)
				setInitialized(true)
			}
		}
	}

	const login = async (email: string, password: string) => {
		authGeneration.current++
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
				await queryClient.cancelQueries()
				queryClient.clear()
				setUser(data.user)
			}
		} catch (error) {
			throw error
		} finally {
			setLoading(false)
			setInitialized(true)
		}
	}

	const logout = async () => {
		authGeneration.current++
		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			})
			if (!response.ok) throw new Error('Logout failed')
			await queryClient.cancelQueries()
			queryClient.clear()
			setUser(null)
			setLoading(false)
			setInitialized(true)
		} catch (error) {
			console.error('Logout error:', error)
			throw error
		}
	}

	useEffect(() => {
		if (!initialized) {
			checkAuth()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialized])

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
