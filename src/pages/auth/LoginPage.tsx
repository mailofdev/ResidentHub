import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  clearAuthError,
  setAuthError,
  setAuthLoading,
  setAuthenticated,
} from '@/app/store/slices/authSlice'
import { notify } from '@/app/store/slices/notificationSlice'
import { login } from '@/core/auth'
import { isFirebaseConfigured } from '@/core/firebase'
import { getErrorMessage } from '@/core/errors'
import { Alert } from '@/components/feedback/Alert'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { FormInput } from '@/components/forms/FormField'
import { appConfig } from '@/core/config/app.config'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error, status } = useAppSelector((state) => state.auth)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  async function onSubmit(values: FormValues) {
    if (!isFirebaseConfigured()) {
      dispatch(
        setAuthError(
          'Firebase is not configured. Copy .env.example to .env and add your Firebase credentials.',
        ),
      )
      return
    }

    try {
      dispatch(setAuthLoading())
      const user = await login(values)
      dispatch(setAuthenticated(user))
      dispatch(notify('success', 'Welcome back', `Signed in as ${user.displayName}`))
      navigate(appConfig.defaultRoute)
    } catch (err) {
      const message = getErrorMessage(err)
      dispatch(setAuthError(message))
      dispatch(notify('error', 'Login failed', message))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Access your workspace with email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isFirebaseConfigured() ? (
            <Alert
              type="warning"
              title="Firebase not configured"
              message="Add VITE_FIREBASE_* values to your .env file to enable authentication."
            />
          ) : null}
          {error ? <Alert type="error" title="Unable to sign in" message={error} /> : null}
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
            autoComplete="current-password"
            registration={register('password')}
            error={errors.password?.message}
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting || status === 'loading'}>
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
