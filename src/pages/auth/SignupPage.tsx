import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '@/app/store/hooks'
import { setAuthenticated } from '@/app/store/slices/authSlice'
import { notify } from '@/app/store/slices/notificationSlice'
import { signup } from '@/core/auth'
import { isFirebaseConfigured } from '@/core/firebase'
import { getErrorMessage } from '@/core/errors'
import { Alert } from '@/components/feedback/Alert'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { FormInput } from '@/components/forms/FormField'
import { appConfig } from '@/core/config/app.config'

const schema = z
  .object({
    displayName: z.string().min(2, 'Name is required'),
    email: z.email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: FormValues) {
    if (!isFirebaseConfigured()) {
      setError('root', {
        message: 'Firebase is not configured. Add credentials to your .env file.',
      })
      return
    }

    try {
      const user = await signup({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
      })
      dispatch(setAuthenticated(user))
      dispatch(notify('success', 'Account created', 'Your workspace is ready.'))
      navigate(appConfig.defaultRoute)
    } catch (error) {
      const message = getErrorMessage(error)
      setError('root', { message })
      dispatch(notify('error', 'Signup failed', message))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Start with a generic user profile. Roles stay configurable.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root?.message ? (
            <Alert type="error" title="Unable to create account" message={errors.root.message} />
          ) : null}
          <FormInput
            label="Display name"
            registration={register('displayName')}
            error={errors.displayName?.message}
          />
          <FormInput
            label="Email"
            type="email"
            autoComplete="email"
            registration={register('email')}
            error={errors.email?.message}
          />
          <FormInput
            label="Password"
            type="password"
            autoComplete="new-password"
            registration={register('password')}
            error={errors.password?.message}
          />
          <FormInput
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
