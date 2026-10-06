import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { updateAuthUser } from '@/app/store/slices/authSlice'
import { setBreadcrumbs } from '@/app/store/slices/uiSlice'
import { notify } from '@/app/store/slices/notificationSlice'
import { updateProfile, updateUserPassword } from '@/core/auth'
import { isFeatureEnabled } from '@/core/features'
import { uploadFile } from '@/core/firebase/storage'
import { getErrorMessage } from '@/core/errors'
import { Alert } from '@/components/feedback/Alert'
import { FileUploadField } from '@/components/forms/FileUploadField'
import { FormInput } from '@/components/forms/FormField'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
} from '@/components/ui'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name is required'),
})

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ProfileValues = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [uploading, setUploading] = useState(false)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { displayName: user?.displayName || '' },
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: 'Profile' }]))
  }, [dispatch])

  async function onSaveProfile(values: ProfileValues) {
    if (!user) return
    try {
      const updated = await updateProfile(user.id, { displayName: values.displayName })
      dispatch(updateAuthUser(updated))
      dispatch(notify('success', 'Profile updated'))
    } catch (error) {
      dispatch(notify('error', 'Update failed', getErrorMessage(error)))
    }
  }

  async function onChangePassword(values: PasswordValues) {
    try {
      await updateUserPassword(values.password)
      passwordForm.reset()
      dispatch(notify('success', 'Password updated'))
    } catch (error) {
      dispatch(notify('error', 'Password update failed', getErrorMessage(error)))
    }
  }

  async function onUpload(files: File[]) {
    if (!user || !files[0] || !isFeatureEnabled('fileUpload')) return
    try {
      setUploading(true)
      const result = await uploadFile({
        file: files[0],
        path: `profiles/${user.id}/${Date.now()}-${files[0].name}`,
        maxSizeBytes: 2 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      })
      const updated = await updateProfile(user.id, { photoURL: result.url })
      dispatch(updateAuthUser(updated))
      dispatch(notify('success', 'Profile image updated'))
    } catch (error) {
      dispatch(notify('error', 'Upload failed', getErrorMessage(error)))
    } finally {
      setUploading(false)
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generic profile fields only — no business-specific attributes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={user.displayName} src={user.photoURL} size="lg" />
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">Status: {user.status}</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={profileForm.handleSubmit(onSaveProfile)}>
            <FormInput
              label="Display name"
              registration={profileForm.register('displayName')}
              error={profileForm.formState.errors.displayName?.message}
            />
            <Button type="submit" loading={profileForm.formState.isSubmitting}>
              Save profile
            </Button>
          </form>

          <Divider label="Profile image" />
          {isFeatureEnabled('fileUpload') ? (
            <FileUploadField
              accept="image/png,image/jpeg,image/webp"
              maxSizeLabel="Max 2MB · JPG, PNG, WebP"
              onChange={onUpload}
            />
          ) : (
            <Alert type="info" title="File upload disabled" message="Enable the fileUpload feature flag." />
          )}
          {uploading ? <p className="text-sm text-muted-foreground">Uploading…</p> : null}

          <Divider label="Security" />
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onChangePassword)}>
            <FormInput
              label="New password"
              type="password"
              registration={passwordForm.register('password')}
              error={passwordForm.formState.errors.password?.message}
            />
            <FormInput
              label="Confirm password"
              type="password"
              registration={passwordForm.register('confirmPassword')}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
            <Button type="submit" variant="outline" loading={passwordForm.formState.isSubmitting}>
              Change password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
