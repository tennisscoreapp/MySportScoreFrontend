import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// список защищенных маршрутов
const protectedRoutes = ['/tournaments']

// список публичных маршрутов аутентификации
const authRoutes = ['/auth/login', '/auth/register']

// Функция для проверки доступа к конкретному ресурсу
async function checkResourceAccess(
	pathname: string,
	authToken: string
): Promise<boolean> {
	// Извлекаем ID из пути для проверки доступа к конкретному ресурсу
	const tournamentMatch = pathname.match(/^\/tournaments\/(\d+)/)
	const groupMatch = pathname.match(/^\/tournaments\/\d+\/([^\/]+)\/(\d+)/)

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
	console.log('request', request)
	const { pathname } = request.nextUrl

	// получаем токен из куки
	const authToken = request.cookies.get('auth_token')?.value

	// проверяем статус аутентификации для защищенных роутов
	const isProtectedRoute = protectedRoutes.some(route =>
		pathname.startsWith(route)
	)
	const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

	if (isProtectedRoute) {
		if (!authToken) {
			// Перенаправляем на страницу входа
			return NextResponse.redirect(new URL('/auth/login', request.url))
		}

		// проверяем валидность токена через API
		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
				headers: {
					Cookie: `auth_token=${authToken}`,
				},
			})

			if (!response.ok) {
				// токен недействителен, перенаправляем на вход
				return NextResponse.redirect(new URL('/auth/login', request.url))
			}

			// Дополнительная проверка доступа к конкретному ресурсу
			const hasResourceAccess = await checkResourceAccess(pathname, authToken)
			if (!hasResourceAccess) {
				// Нет доступа к ресурсу, перенаправляем на страницу турниров
				return NextResponse.redirect(new URL('/restricted', request.url))
			}
		} catch (error) {
			console.error('Middleware auth check failed:', error)
			return NextResponse.redirect(new URL('/auth/login', request.url))
		}
	}

	// если пользователь уже авторизован и пытается зайти на страницы auth
	if (isAuthRoute && authToken) {
		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/me`, {
				headers: {
					Cookie: `auth_token=${authToken}`,
				},
			})

			if (response.ok) {
				// пользователь авторизован, перенаправляем на главную
				return NextResponse.redirect(new URL('/', request.url))
			}
		} catch (error) {
			console.error('Middleware auth check failed:', error)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
