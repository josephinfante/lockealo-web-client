import Link from 'next/link'
import SignInForm from './sign-in-form'

function Page() {
	return (
		<main className="flex-1 flex items-center justify-center max-w-7xl py-4 px-4 sm:px-6 lg:px-8 mx-auto w-full">
			<div className="max-w-md w-full mx-auto flex flex-col gap-4">
				<div>
					<h1 className="text-2xl font-medium">Sign in.</h1>
					<p className="text-sm text-muted-foreground">Put your credentials here.</p>
				</div>
				<SignInForm />
				<p className="text-sm text-center">
					You don't have an account?
					<Link href={'/sign-up'} className="ml-1 text-primary underline font-medium">
						Sign up
					</Link>
				</p>
			</div>
		</main>
	)
}

export default Page
