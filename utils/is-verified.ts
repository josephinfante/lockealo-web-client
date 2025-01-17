import { API } from '@/lib/axios'
import { cookies } from 'next/headers'

const isVerified = async (): Promise<boolean> => {
	const cookie = (await cookies()).get('token')?.value
	if (!cookie) return false

	return await API.get('/api/auth/verify/status', {
		headers: { Cookie: `token=${cookie}` },
	})
		.then((res) => {
			if (res.data.is_verified) {
				return true
			}
			return false
		})
		.catch((err) => {
			return false
		})
}

export default isVerified
