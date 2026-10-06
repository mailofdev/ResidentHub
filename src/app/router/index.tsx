import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { PublicRoute, ProtectedRoute } from '@/app/router/guards'
import { PermissionRoute } from '@/app/router/PermissionRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { NotFoundPage, UnauthorizedPage } from '@/pages/errors/ErrorPages'
import { UsersPage, UserDetailPage } from '@/modules/users'
import { TasksPage } from '@/modules/tasks'
import { PERMISSIONS, appConfig } from '@/core/config/app.config'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to={appConfig.defaultRoute} replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<PermissionRoute permission={PERMISSIONS.USER_VIEW} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:id" element={<UserDetailPage />} />
            </Route>

            <Route element={<PermissionRoute permission={PERMISSIONS.TASK_VIEW} />}>
              <Route path="/tasks" element={<TasksPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
