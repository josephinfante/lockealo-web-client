import { NextRequest, NextResponse } from 'next/server'
import isAuth from './utils/is-auth'
import isVerified from './utils/is-verified'

const public_routes = ['/', '/home']
const auth_routes = ['/sign-in', '/sign-up']
const static_file_regex = /\.(.*)$/

export async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname

	// Skip static files and API routes
	if (static_file_regex.test(path) || path.startsWith('/api')) {
		return NextResponse.next()
	}

	const is_protected_route = path.startsWith('/dashboard') || path.startsWith('/otp')
	const is_auth_routes = auth_routes.includes(path)

	// Pass the request to the `isAuth` function to check the token
	const is_auth = await isAuth()

	// Redirect logged-in users away from sign-in and sign-up pages
	if (is_auth_routes && is_auth) {
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
	}

	// Redirect unauthenticated users away from protected routes
	if (is_protected_route && !is_auth) {
		return NextResponse.redirect(new URL(`/sign-in?redirectTo=${path}`, req.nextUrl))
	}

	// Check if the user is verified and redirect to dashboard if they are
	if (path.startsWith('/otp') && is_auth) {
		const is_verified = await isVerified()
		if (is_verified) return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
	}

	// Allow access to public routes or protected routes if authenticated
	return NextResponse.next()
}

export const config = {
	matcher: '/:path*',
}
