'use client'
import { useTranslations } from 'next-intl'

export default function PublicUnavailable() {
	const t = useTranslations('PublicPages')
	return (
		<div className='container mx-auto p-8 sm:p-12 text-center'>
			<h1 className='text-xl sm:text-2xl font-bold mb-4'>
				{t('unavailable_title')}
			</h1>
			<p className='text-gray-600'>{t('unavailable_description')}</p>
		</div>
	)
}
