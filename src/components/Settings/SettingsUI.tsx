import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Globe, SettingsIcon } from 'lucide-react'
import Link from 'next/link'

interface SettingsUIProps {
	t: (key: string) => string
	currentLocale: string
	handleLanguageChange: (value: string) => void
	isPending: boolean
	localeLabels: Record<string, string>
	routing: { locales: string[] }
}
export default function SettingsUI({
	t,
	currentLocale,
	handleLanguageChange,
	isPending,
	localeLabels,
	routing,
}: SettingsUIProps) {
	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<div className='mb-8'>
				<div className='flex items-center gap-3 mb-2'>
					<SettingsIcon className='h-8 w-8 text-blue-600' />
					<h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
				</div>
				<p className='text-gray-600'>{t('description')}</p>
			</div>

			<div className='flex flex-col gap-4'>
				<div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
					<div className='space-y-6'>
						<div className='space-y-4'>
							<div className='flex items-center gap-3'>
								<Globe className='h-5 w-5 text-gray-500' />
								<div>
									<h3 className='text-lg font-medium text-gray-900'>
										{t('language.title')}
									</h3>
									<p className='text-sm text-gray-500'>
										{t('language.description')}
									</p>
								</div>
							</div>

							<div className='ml-8'>
								<Select
									value={currentLocale}
									onValueChange={handleLanguageChange}
									disabled={isPending}
								>
									<SelectTrigger className='w-48'>
										<SelectValue>
											{localeLabels[currentLocale as keyof typeof localeLabels]}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{routing.locales.map(locale => (
											<SelectItem key={locale} value={locale}>
												<div className='flex items-center gap-2'>
													<span className='text-base'>
														{locale === 'ru' ? '🇷🇺' : '🇺🇸'}
													</span>
													<span>
														{localeLabels[locale as keyof typeof localeLabels]}
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{isPending && (
									<p className='text-sm text-gray-500 mt-2'>
										{t('language.loading')}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Link href={`/${currentLocale}`}>
				<Button variant='outline'>{t('back')}</Button>
			</Link>

			<div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'>
				<div className='flex items-start gap-3'>
					<div className='flex-shrink-0'>
						<div className='w-2 h-2 bg-blue-400 rounded-full mt-2'></div>
					</div>
					<div className='text-sm text-blue-800'>
						<p className='font-medium mb-1'>{t('info.title')}</p>
						<p>{t('info.description')}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
