'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { HOST } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	otp: z.string().min(6, {
		message: 'Your one-time password must be 6 characters.',
	}),
})

const OTPForm = () => {
	const router = useRouter()

	const [loading, setLoading] = useState<boolean>(false)
	const [timer, setTimer] = useState<number | null>(null)
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			otp: '',
		},
	})

	const handleRequestAgain = () => {
		const startTime = Date.now()
		localStorage.setItem('otp-timer', startTime.toString())
		setTimer(60)
		setIsButtonDisabled(true)
		resendOTP()
	}

	const resendOTP = async () => {
		await HOST.get('/api/user/otp')
			.then((res) => {
				console.log(res.data)
				toast.success(res.data.message)
			})
			.catch((err) => {
				toast.error(err.response.data.message)
				setTimer(null)
				setIsButtonDisabled(false)
			})
	}

	useEffect(() => {
		const savedTime = localStorage.getItem('otp-timer')

		if (savedTime) {
			const timeElapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000)
			if (timeElapsed < 60) {
				// If less than 60 seconds have passed since the last timer, continue the countdown
				setTimer(60 - timeElapsed)
				setIsButtonDisabled(true)
			} else {
				// If more than 60 seconds have passed, clear the saved time
				localStorage.removeItem('otp-timer')
			}
		}
	}, [])

	useEffect(() => {
		let countdown: NodeJS.Timeout

		if (timer !== null && timer > 0) {
			countdown = setInterval(() => {
				setTimer((prev) => (prev !== null ? prev - 1 : null))
			}, 1000)
		} else if (timer === 0) {
			setIsButtonDisabled(false)
			setTimer(null)
		}

		return () => clearInterval(countdown)
	}, [timer])

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		setLoading(true)
		HOST.put('/api/user/verify', { code: data.otp })
			.then((res) => {
				toast.success(res.data.message)
				setLoading(false)
				router.push('/dashboard')
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || 'An error occurred')
				setLoading(false)
			})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
				<FormField
					control={form.control}
					name="otp"
					render={({ field }) => (
						<FormItem className="mb-2">
							<FormControl>
								<InputOTP className="flex items-center justify-center" maxLength={6} {...field}>
									<InputOTPGroup className="flex items-center justify-between w-full">
										<InputOTPSlot className="border rounded-md h-10 w-10" index={0} />
										<InputOTPSlot className="border rounded-md h-10 w-10" index={1} />
										<InputOTPSlot className="border rounded-md h-10 w-10" index={2} />
										<InputOTPSlot className="border rounded-md h-10 w-10" index={3} />
										<InputOTPSlot className="border rounded-md h-10 w-10" index={4} />
										<InputOTPSlot className="border rounded-md h-10 w-10" index={5} />
									</InputOTPGroup>
								</InputOTP>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" loading={loading}>
					Submit
				</Button>
				<div className="text-sm text-center">
					Didn't receive the code?
					<button
						type="button"
						className={`ml-1 text-primary underline font-medium hover:no-underline ${
							isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						onClick={handleRequestAgain}
						disabled={isButtonDisabled}
					>
						{isButtonDisabled ? `Request again in ${timer}s` : 'Request again'}
					</button>
				</div>
			</form>
		</Form>
	)
}

export default OTPForm
