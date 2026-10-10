import type { Metadata } from 'next'

// shared links are unlisted, so keep them out of search results
export const metadata: Metadata = {
	title: 'Tournament standings',
	robots: { index: false, follow: false },
}

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div>
			<nav className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16'>
					<span className='text-sm sm:text-lg font-bold text-gray-900'>
						Tournament Manager
					</span>
				</div>
			</nav>
			<main>{children}</main>
		</div>
	)
}
