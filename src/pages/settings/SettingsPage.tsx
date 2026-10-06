import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setBreadcrumbs, setTheme } from '@/app/store/slices/uiSlice'
import { appConfig } from '@/core/config/app.config'
import { isFeatureEnabled } from '@/core/features'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
} from '@/components/ui'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: 'Settings' }]))
  }, [dispatch])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Framework-level preferences. Keep business settings in their modules.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Theme preference is persisted locally.</CardDescription>
        </CardHeader>
        <CardContent>
          <Switch
            id="theme"
            label={theme === 'dark' ? 'Dark theme' : 'Light theme'}
            checked={theme === 'dark'}
            onCheckedChange={(checked) => dispatch(setTheme(checked ? 'dark' : 'light'))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
          <CardDescription>Values from centralized app configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span> {appConfig.name}
          </p>
          <p>
            <span className="text-muted-foreground">Default route:</span> {appConfig.defaultRoute}
          </p>
          <p>
            <span className="text-muted-foreground">Enabled modules:</span>{' '}
            {appConfig.enabledModules.join(', ')}
          </p>
          <p>
            <span className="text-muted-foreground">Notifications:</span>{' '}
            {isFeatureEnabled('notifications') ? 'on' : 'off'}
          </p>
          <p>
            <span className="text-muted-foreground">Audit logs:</span>{' '}
            {isFeatureEnabled('auditLogs') ? 'on' : 'off'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
