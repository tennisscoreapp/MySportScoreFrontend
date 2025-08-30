'use client'

import { routing } from '@/i18n/routing'
import { setLocale } from '@/utils/locale-actions'
import { useTranslations } from 'next-intl'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import SettingsUI from '../../../components/Settings/SettingsUI'

const localeLabels = {
	ru: 'Русский',
	en: 'English',
} as const

export default function SettingsPage() {
	const t = useTranslations('Settings')
	const params = useParams()
	const pathname = usePathname()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	let currentLocale = params.locale as string

	const handleLanguageChange = async (newLocale: string) => {
		startTransition(async () => {
			await setLocale(newLocale)

			const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
			router.replace(newPathname)
			currentLocale = newLocale
		})
	}

	return (
		<SettingsUI
			t={t}
			currentLocale={currentLocale}
			handleLanguageChange={handleLanguageChange}
			isPending={isPending}
			localeLabels={localeLabels}
			routing={{ locales: routing.locales as unknown as string[] }}
		/>
	)
}
