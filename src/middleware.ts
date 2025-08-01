import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const protectedRoutes = ['/tournaments']
const authRoutes = ['/auth/login', '/auth/register']

// Create the next-intl middleware with locale detection from cookies
const handleI18nRouting = createMiddleware({
	...routing,
	localeDetection: true,
})

async function checkResourceAccess(
	pathname: string,
	authToken: string
): Promise<boolean> {
	const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, '') || '/'

	const tournamentMatch = pathWithoutLocale.match(/^\/tournaments\/(\d+)/)
	const groupMatch = pathWithoutLocale.match(
		/^\/tournaments\/\d+\/([^\/]+)\/(\d+)/
	)

	try {
		if (tournamentMatch) {
			const tournamentId = tournamentMatch[1]
			const response = await fetch(
				`${API_BASE_URL}/api/v1/tournaments/${tournamentId}`,
				{
					headers: {
						Cookie: `auth_token=${authToken}`,
					},
				}
			)
			return response.ok
		}

		if (groupMatch) {
			const groupId = groupMatch[2]
			const response = await fetch(`${API_BASE_URL}/api/v1/groups/${groupId}`, {
				headers: {
					Cookie: `auth_token=${authToken}`,
				},
			})
			return response.ok
		}

		return true
	} catch (error) {
		console.error('Resource access check failed:', error)
		return false
	}
}

export async function middleware(request: NextRequest) {
	const response = handleI18nRouting(request)

	const { pathname } = request.nextUrl

	const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, '') || '/'

	let authToken = request.cookies.get('auth_token')?.value

	if (!authToken) {
		const cookieHeader = request.headers.get('cookie')
		if (cookieHeader) {
			const authTokenMatch = cookieHeader.match(/auth_token=([^;]+)/)
			authToken = authTokenMatch?.[1]
		}
	}

	const isProtectedRoute = protectedRoutes.some(route =>
		pathWithoutLocale.startsWith(route)
	)
	const isAuthRoute = authRoutes.some(route =>
		pathWithoutLocale.startsWith(route)
	)

	if (isProtectedRoute) {
		if (!authToken) {
			console.log('No auth token found, redirecting to login')
			return NextResponse.redirect(new URL('/auth/login', request.url))
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
				headers: {
					Cookie: `auth_token=${authToken}`,
				},
			})

			if (!response.ok) {
				console.log('Auth token is invalid, redirecting to login')
				return NextResponse.redirect(new URL('/auth/login', request.url))
			}

			const hasResourceAccess = await checkResourceAccess(pathname, authToken)
			if (!hasResourceAccess) {
				return NextResponse.redirect(new URL('/restricted', request.url))
			}
		} catch (error) {
			console.error('Middleware auth check failed:', error)
			console.log('Redirecting to login due to error')
			return NextResponse.redirect(new URL('/auth/login', request.url))
		}
	}

	if (isAuthRoute && authToken) {
		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
				headers: {
					Cookie: `auth_token=${authToken}`,
				},
			})

			if (response.ok) {
				return NextResponse.redirect(new URL('/', request.url))
			}
		} catch (error) {
			console.error('Middleware auth check failed:', error)
		}
	}

	return response
}

export const config = {
	matcher: [
		// Match only internationalized pathnames
		// - Match all pathnames except for API routes, static files, and favicon
		// - Support both localized (e.g., /en/tournaments) and root paths (/)
		'/',
		'/(en|ru)/:path*',
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
