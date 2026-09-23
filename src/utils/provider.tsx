'use client'

import { AuthProvider } from '@/shared/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</AuthProvider>
		</QueryClientProvider>
	)
}
