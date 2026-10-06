import type { AppConfig, NavItem, Permission, Role } from '@/types'

/** Framework permission catalog — extend per application, never hardcode business roles. */
export const PERMISSIONS = {
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  TASK_VIEW: 'task.view',
  TASK_CREATE: 'task.create',
  TASK_UPDATE: 'task.update',
  TASK_DELETE: 'task.delete',
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',
  AUDIT_VIEW: 'audit.view',
  REPORT_VIEW: 'report.view',
  REPORT_EXPORT: 'report.export',
} as const satisfies Record<string, Permission>

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'role_superuser',
    name: 'Superuser',
    description: 'Full access to all framework capabilities',
    permissions: Object.values(PERMISSIONS),
  },
  {
    id: 'role_editor',
    name: 'Editor',
    description: 'Can manage records but not settings or deletes',
    permissions: [
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.TASK_VIEW,
      PERMISSIONS.TASK_CREATE,
      PERMISSIONS.TASK_UPDATE,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.REPORT_VIEW,
    ],
  },
  {
    id: 'role_viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.TASK_VIEW,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.REPORT_VIEW,
    ],
  },
]

export const DEFAULT_NAVIGATION: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    order: 1,
  },
  {
    id: 'users',
    label: 'Users',
    path: '/users',
    icon: 'Users',
    permission: PERMISSIONS.USER_VIEW,
    featureFlag: 'usersModule',
    order: 2,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    permission: PERMISSIONS.TASK_VIEW,
    featureFlag: 'tasksModule',
    order: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    permission: PERMISSIONS.SETTINGS_VIEW,
    order: 90,
  },
]

export const appConfig: AppConfig = {
  name: import.meta.env.VITE_APP_NAME || 'App Framework',
  logo: '/favicon.svg',
  defaultRoute: '/dashboard',
  authRoute: '/login',
  enabledModules: ['users', 'tasks'],
  features: {
    notifications: true,
    auditLogs: true,
    fileUpload: true,
    reports: false,
    usersModule: true,
    tasksModule: true,
  },
  navigation: DEFAULT_NAVIGATION,
  roles: DEFAULT_ROLES,
  theme: 'light',
}

export const COLLECTIONS = {
  users: 'users',
  tasks: 'tasks',
  notifications: 'notifications',
  auditLogs: 'audit_logs',
  roles: 'roles',
} as const

export const STORAGE_KEYS = {
  theme: 'app.theme',
  sidebarCollapsed: 'app.sidebarCollapsed',
} as const
