import { cookies } from 'next/headers'
import { API } from '@/lib/axios'

const isAuth = async (): Promise<boolean> => {
	const cookie = (await cookies()).get('token')?.value
	if (!cookie) return false

	return await API.get(`/api/auth/verify/token/${cookie}`)
		.then((res) => {
			if (res.status === 200) {
				return true
			}
			return false
		})
		.catch((err) => {
			return false
		})
}

export default isAuth
