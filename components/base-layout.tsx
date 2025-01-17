import { ReactNode } from 'react'

const BaseLayout = ({ children }: { children: ReactNode }) => {
	return <main className="flex-1 max-w-7xl py-4 px-4 sm:px-6 lg:px-8 mx-auto w-full">{children}</main>
}

export default BaseLayout
