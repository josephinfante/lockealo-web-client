import OTPForm from './otp-form'

function Page() {
	return (
		<div className="max-w-md w-full mx-auto flex flex-col gap-4">
			<div>
				<h1 className="text-2xl font-medium">Verify your account.</h1>
				<p className="text-sm text-muted-foreground">We sent a one-time code to your email.</p>
			</div>
			<OTPForm />
		</div>
	)
}

export default Page
