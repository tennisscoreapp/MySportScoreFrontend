'use client'

import { useAuth } from '@/shared/contexts/AuthContext'
import { LogIn, LogOut, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './button'

export default function Navbar() {
	const { user, logout, loading } = useAuth()
	const t = useTranslations('Global')
	const router = useRouter()

	const handleLogout = async () => {
		try {
			await logout()
			router.push('/auth/login')
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	if (loading) {
		return (
			<nav className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex items-center'>
							<Link
								href='/'
								className='text-lg sm:text-xl font-bold text-gray-900'
							>
								Tournament Manager
							</Link>
						</div>
						<div className='flex items-center'>
							<div className='animate-pulse bg-gray-200 h-8 w-20 rounded'></div>
						</div>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className='bg-white shadow-sm border-b'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex items-center'>
						<Link
							href='/'
							className='text-sm sm:text-lg font-bold text-gray-900'
						>
							Tournament Manager
						</Link>
					</div>

					<div className='flex items-center space-x-4'>
						{user ? (
							<>
								<div className='flex items-center space-x-2 text-gray-700'>
									<User className='h-5 w-5' />
									<span className='text-xs sm:text-sm'>
										{user.first_name} {user.last_name}
									</span>
								</div>
								<Button
									size='sm'
									onClick={handleLogout}
									variant='ghost'
									className='flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors'
								>
									<LogOut className='h-4 w-4' />
									<span className='text-xs sm:text-sm'>
										{t('navbar.logout')}
									</span>
								</Button>
							</>
						) : (
							<Link
								href='/auth/login'
								className='flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors'
							>
								<LogIn className='h-4 w-4' />
								<span>{t('navbar.login')}</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
