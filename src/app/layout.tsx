import Providers from '@/utils/provider'
import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body className={`${pressStart2P.variable} antialiased min-h-screen`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
