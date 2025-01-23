import { API } from '@/lib/axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
	const cookie = (await cookies()).get('token')?.value
	if (!cookie) return NextResponse.json({ message: 'No token provided.' }, { status: 401 })

	const body = await req.json()

	return API.put('/api/auth/verify/account', body, {
		headers: { Cookie: `token=${cookie}` },
	})
		.then((res) => NextResponse.json(res.data, { status: res.status }))
		.catch((err) => NextResponse.json(err.response.data, { status: err.response.status }))
}
