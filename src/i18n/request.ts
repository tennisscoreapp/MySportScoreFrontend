import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale
	const cookieStore = await cookies()
	const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value

	// Приоритет: cookie > запрос > дефолт
	let locale = routing.defaultLocale

	if (cookieLocale && hasLocale(routing.locales, cookieLocale)) {
		locale = cookieLocale
	} else if (requested && hasLocale(routing.locales, requested)) {
		locale = requested
	}

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	}
})
