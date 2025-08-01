'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function setLocale(locale: string, redirectPath?: string) {
	const cookieStore = await cookies()

	// Устанавливаем cookie с локалью на год
	cookieStore.set('NEXT_LOCALE', locale, {
		path: '/',
		maxAge: 365 * 24 * 60 * 60, // 1 год
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	})

	if (redirectPath) {
		redirect(redirectPath)
	}
}
