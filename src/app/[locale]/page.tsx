import { Badge } from '@/components/ui/badge'
import { Plus, Settings, Trophy, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Home() {
	const t = useTranslations('Index')

	const quickActions = [
		{
			title: t('quick_actions.create_tournament.title'),
			description: t('quick_actions.create_tournament.description'),
			href: '/tournaments/create',
			icon: Plus,
			color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
		},
		{
			title: t('quick_actions.tournament_management.title'),
			description: t('quick_actions.tournament_management.description'),
			href: '/tournaments',
			icon: Trophy,
			color: 'bg-green-50 hover:bg-green-100 border-green-200',
		},
		{
			title: t('quick_actions.system_settings.title'),
			description: t('quick_actions.system_settings.description'),
			href: '/settings',
			icon: Settings,
			color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
		},
	]

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
			{/* Header */}
			<div className='bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 py-6'>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg'>
								<Trophy className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
							</div>
							<div>
								<h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
									Tournament Manager
								</h1>
								<p className='text-sm text-gray-600'>{t('header.subtitle')}</p>
							</div>
						</div>
						<Badge
							variant='secondary'
							className='bg-green-100 text-green-800 border-green-200 '
						>
							<Zap className='w-4 h-4 mr-2' />
							{t('header.system_active')}
						</Badge>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
				{/* Welcome Section */}
				<div className='mb-10'>
					<h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
						{t('description_1')}
					</h2>
					<p className='text-sm sm:text-lg text-gray-600 mb-6'>
						{t('description_2')}
					</p>
				</div>

				{/* Quick Actions */}
				<div className='mb-4 sm:mb-10'>
					<h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-6'>
						{t('quick_actions.title')}
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
						{quickActions.map((action, index) => (
							<Link key={index} href={action.href} className='group'>
								<div
									className={`${action.color} border-2 rounded-2xl p-6 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg`}
								>
									<div className='flex items-center mb-2 sm:mb-4'>
										<div className='bg-white p-2 rounded-lg shadow-sm mr-3'>
											<action.icon className='w-6 h-6 text-gray-700' />
										</div>
										<h4 className='text-base sm:text-lg font-semibold text-gray-900'>
											{action.title}
										</h4>
									</div>
									<p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
										{action.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
