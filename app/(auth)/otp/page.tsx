import OTPForm from './otp-form'

function Page() {
	return (
		<main className="flex-1 flex items-center justify-center max-w-7xl py-4 px-4 sm:px-6 lg:px-8 mx-auto w-full">
			<div className="max-w-md w-full mx-auto flex flex-col gap-4">
				<div>
					<h1 className="text-2xl font-medium">Verify your account.</h1>
					<p className="text-sm text-muted-foreground">We sent a one-time code to your email.</p>
				</div>
				<OTPForm />
			</div>
		</main>
	)
}

export default Page
