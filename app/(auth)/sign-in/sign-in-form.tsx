'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { HOST } from '@/lib/axios'
import { useUser } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters',
	}),
})

export const SignInForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const redirectTo = searchParams?.get('redirectTo') || 'dashboard'

	const { setUser } = useUser()
	const [loading, setLoading] = useState<boolean>(false)
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const toggleVisibility = () => setIsVisible((prevState) => !prevState)

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		setLoading(true)
		HOST.post('/api/sign-in', data)
			.then((res) => {
				toast.success('Sign in successful.')
				setUser(res.data)
				setLoading(false)
				router.push(redirectTo)
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
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input {...field} />
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
									<Input className="pe-9" {...field} type={isVisible ? 'text' : 'password'} />
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
				<Button className="w-full mt-4" loading={loading} type="submit">
					Submit
				</Button>
			</form>
		</Form>
	)
}

export const SignInFormSkeleton = () => {
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="space-y-2">
				<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Email
				</label>
				<Skeleton className="flex h-9 w-full rounded-md border" />
			</div>
			<div className="space-y-2">
				<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Password
				</label>
				<Skeleton className="flex h-9 w-full rounded-md border" />
			</div>
			<Skeleton className="flex h-9 w-full rounded-md border mt-4" />
		</div>
	)
}
