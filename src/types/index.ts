export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'

export interface AppUser {
  id: string
  email: string
  displayName: string
  photoURL?: string | null
  roleIds: string[]
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export type Permission = string

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}

export type ThemeMode = 'light' | 'dark'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface ToastNotification {
  id: string
  title: string
  message?: string
  type: NotificationType
  duration?: number
}

export interface AppNotification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  metadata?: Record<string, unknown>
}

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | string

export interface AuditLog {
  id: string
  userId: string
  userEmail?: string
  action: AuditAction
  module: string
  entity: string
  entityId?: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface NavItem {
  id: string
  label: string
  path?: string
  icon?: string
  permission?: Permission | Permission[]
  roles?: string[]
  children?: NavItem[]
  visible?: boolean
  order?: number
  featureFlag?: string
}

export interface FeatureFlags {
  [key: string]: boolean
}

export interface AppConfig {
  name: string
  logo?: string
  defaultRoute: string
  authRoute: string
  enabledModules: string[]
  features: FeatureFlags
  navigation: NavItem[]
  roles: Role[]
  theme: ThemeMode
}

export interface QueryFilter {
  field: string
  operator:
    | '=='
    | '!='
    | '<'
    | '<='
    | '>'
    | '>='
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
  value: unknown
}

export interface QueryOptions {
  filters?: QueryFilter[]
  orderBy?: { field: string; direction?: 'asc' | 'desc' }
  limit?: number
  startAfter?: unknown
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CrudListParams {
  search?: string
  filters?: Record<string, string | number | boolean | null | undefined>
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}
