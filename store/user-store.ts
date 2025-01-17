import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface IUser {
	first_name: string
	last_name: string
	email: string
}

type State = {
	user: IUser | null
	setUser: (user: IUser | null) => void
}

export const useUser = create<State>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				setUser: (user) => set({ user }),
			}),
			{ name: 'user-store' },
		),
	),
)
