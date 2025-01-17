'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HOST } from '@/lib/axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUser } from '@/store/user-store'

const formSchema = z.object({
	first_name: z.string().min(1, {
		message: 'First name must be at least 1 character',
	}),
	last_name: z.string().min(1, {
		message: 'Last name must be at least 1 character',
	}),
	email: z.string().email({
		message: 'Invalid email address',
	}),
	password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters',
		})
		.regex(/[a-z]/, {
			message: 'Password must contain at least one lowercase letter',
		})
		.regex(/[A-Z]/, {
			message: 'Password must contain at least one uppercase letter',
		})
		.regex(/\d/, {
			message: 'Password must contain at least one number',
		})
		.regex(/[@$!%*?&]/, {
			message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)',
		}),
})

const SignUpForm = () => {
	const router = useRouter()

	const { setUser } = useUser()
	const [loading, setLoading] = useState<boolean>(false)
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
		},
	})

	const toggleVisibility = () => setIsVisible((prevState) => !prevState)

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		if (!checkStrength(data.password)) return
		setLoading(true)
		HOST.post('/api/sign-up', data)
			.then((res) => {
				toast.success('Sign up successful.')
				setUser(res.data)
				setLoading(false)
				router.push('/otp')
			})
			.catch((err) => {
				const { type, message, metadata } = err.response.data || {}
				if (type === 'ValidationError' && metadata) {
					const { missing_fields, validation_errors } = metadata

					if (validation_errors) {
						Object.keys(validation_errors).forEach((field) => {
							const fieldErrors = validation_errors[field]

							if (typeof fieldErrors === 'string') {
								toast.error(message, { description: fieldErrors })
							} else {
								// Multiple error types for password or other fields
								Object.keys(fieldErrors).forEach((errorType) => {
									// Check if error contains 'message', otherwise fallback to errorType
									const errorDescription = fieldErrors[errorType].message || fieldErrors[errorType]
									toast.error(message, { description: errorDescription })
								})
							}
						})
					}
					if (missing_fields && missing_fields.length) {
						toast.error('Missing fields', {
							description: missing_fields.join(', '),
						})
					}
				} else {
					toast.error(message || 'An error occurred')
				}
				setLoading(false)
			})
	}

	const checkStrength = (pass: string) => {
		const requirements = [
			{ regex: /.{8,}/, text: 'At least 8 characters' },
			{ regex: /[a-z]/, text: 'At least 1 lowercase letter' },
			{ regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
			{ regex: /\d/, text: 'At least 1 number' },
			{ regex: /[@$!%*?&]/, text: 'At least 1 special character' },
		]

		return requirements.map((req) => ({
			met: req.regex.test(pass),
			text: req.text,
		}))
	}

	const strength = checkStrength(form.watch('password'))

	const strengthScore = useMemo(() => {
		return strength.filter((req) => req.met).length
	}, [strength])

	const getStrengthColor = (score: number) => {
		if (score === 0) return 'bg-border'
		if (score <= 1) return 'bg-red-500'
		if (score <= 3) return 'bg-orange-500'
		if (score === 4) return 'bg-amber-500'
		return 'bg-emerald-500'
	}

	const getStrengthText = (score: number) => {
		if (score === 0) return 'Enter a password'
		if (score <= 3) return 'Weak password'
		if (score === 4) return 'Medium password'
		return 'Strong password'
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
				<div className="flex flex-row gap-4 items-center justify-between">
					<FormField
						control={form.control}
						name="first_name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input {...field} autoComplete="first_name" />
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="last_name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input {...field} autoComplete="last_name" />
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input {...field} autoComplete="email" />
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<div className="relative">
									<Input className="pe-9" {...field} type={isVisible ? 'text' : 'password'} autoComplete="password" />
									<button
										className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
										type="button"
										onClick={toggleVisibility}
										aria-label={isVisible ? 'Hide password' : 'Show password'}
										aria-pressed={isVisible}
										aria-controls="password"
									>
										{isVisible ? (
											<EyeOff size={16} strokeWidth={2} aria-hidden="true" />
										) : (
											<Eye size={16} strokeWidth={2} aria-hidden="true" />
										)}
									</button>
								</div>
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>
				{/* Password strength indicator */}
				<div
					className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
					role="progressbar"
					aria-valuenow={strengthScore}
					aria-valuemin={0}
					aria-valuemax={5}
					aria-label="Password strength"
				>
					<div
						className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
						style={{ width: `${(strengthScore / 5) * 100}%` }}
					></div>
				</div>

				{/* Password strength description */}
				<p className="mb-2 text-sm font-medium text-foreground">{getStrengthText(strengthScore)}. Must contain:</p>

				{/* Password requirements list */}
				<ul className="space-y-1.5" aria-label="Password requirements">
					{strength.map((req, index) => (
						<li key={index} className="flex items-center gap-2">
							{req.met ? (
								<Check size={16} className="text-emerald-500" aria-hidden="true" />
							) : (
								<X size={16} className="text-muted-foreground/80" aria-hidden="true" />
							)}
							<span className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
								{req.text}
								<span className="sr-only">{req.met ? ' - Requirement met' : ' - Requirement not met'}</span>
							</span>
						</li>
					))}
				</ul>
				<Button className="w-full mt-4" loading={loading} type="submit">
					Submit
				</Button>
			</form>
		</Form>
	)
}

export default SignUpForm
