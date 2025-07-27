'use client'

import { AuthProvider } from '@/shared/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</AuthProvider>
		</QueryClientProvider>
	)
}
