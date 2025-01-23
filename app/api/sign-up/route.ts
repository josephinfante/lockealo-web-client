import { API } from '@/lib/axios'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()

	return API.post('/api/auth/sign-up', body, { withCredentials: true })
		.then((res) => {
			const cookies = res.headers['set-cookie']

			const response = NextResponse.json(res.data, { status: res.status })

			if (cookies) {
				response.headers.append('Set-Cookie', cookies.toString())
			}

			return response
		})
		.catch((err) => NextResponse.json(err.response.data, { status: err.response.status }))
}
