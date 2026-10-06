import type { AppUser, UserStatus } from '@/types'

export type UserRecord = AppUser

export interface UserFormValues {
  displayName: string
  email: string
  roleIds: string[]
  status: UserStatus
}
