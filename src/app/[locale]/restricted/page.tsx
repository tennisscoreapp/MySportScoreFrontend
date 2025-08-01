import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function RestrictedPage() {
	const t = useTranslations('Restricted')

	return (
		<div className='flex flex-col items-center justify-center h-screen gap-4'>
			<h1 className='text-4xl font-bold'>{t('title')}</h1>
			<p className='text-lg'>{t('description')}</p>
			<Link href='/tournaments'>
				<Button>{t('back_to_tournaments')}</Button>
			</Link>
		</div>
	)
}
