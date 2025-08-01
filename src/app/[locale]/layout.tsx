import '@/app/globals.css'
import Providers from '@/utils/provider'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Press_Start_2P } from 'next/font/google'

const pressStart2P = Press_Start_2P({
	variable: '--font-press-start-2p',
	subsets: ['cyrillic', 'latin'],
	weight: ['400'],
	preload: true,
})

export const metadata: Metadata = {
	title: 'Tournament index page',
	description: 'Tournament index page',
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={`${pressStart2P.variable} antialiased min-h-screen`}>
				<NextIntlClientProvider messages={messages}>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
