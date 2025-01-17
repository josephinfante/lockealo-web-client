import Link from 'next/link'
import SignUpForm from './sign-up-form'

function Page() {
	return (
		<main className="flex-1 flex items-center justify-center max-w-7xl py-4 px-4 sm:px-6 lg:px-8 mx-auto w-full">
			<div className="max-w-md w-full mx-auto flex flex-col gap-4">
				<div>
					<h1 className="text-2xl font-medium">Sign up.</h1>
					<p className="text-sm text-muted-foreground">Fill in your information.</p>
				</div>
				<SignUpForm />
				<p className="text-sm text-center">
					You already have an account?
					<Link href={'/sign-in'} className="ml-1 text-primary underline font-medium">
						Sign in
					</Link>
				</p>
			</div>
		</main>
	)
}

export default Page
