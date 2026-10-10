import { routing } from '@/i18n/routing'

// path of a shared tournament or group page, prefixed like the rest of the app
export function publicPath(locale: string, token: string, groupId?: string) {
	const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
	const group = groupId ? `/groups/${groupId}` : ''
	return `${prefix}/public/${token}${group}`
}
