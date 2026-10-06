import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { resetPassword } from '@/core/auth'
import { isFirebaseConfigured } from '@/core/firebase'
import { getErrorMessage } from '@/core/errors'
import { Alert } from '@/components/feedback/Alert'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { FormInput } from '@/components/forms/FormField'

const schema = z.object({
  email: z.email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: FormValues) {
    if (!isFirebaseConfigured()) {
      setError('root', { message: 'Firebase is not configured.' })
      return
    }
    try {
      await resetPassword(values.email)
      setSent(true)
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>We will email you a secure reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <Alert
            type="success"
            title="Check your email"
            message="If an account exists for that address, a reset link has been sent."
          />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {errors.root?.message ? (
              <Alert type="error" title="Unable to send reset email" message={errors.root.message} />
            ) : null}
            <FormInput
              label="Email"
              type="email"
              registration={register('email')}
              error={errors.email?.message}
            />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
