import { useMemo } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  User,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  setSidebarOpen,
  toggleSidebarCollapsed,
  toggleTheme,
} from '@/app/store/slices/uiSlice'
import { setUnauthenticated } from '@/app/store/slices/authSlice'
import { notify } from '@/app/store/slices/notificationSlice'
import { logout } from '@/core/auth'
import { filterNavigation } from '@/core/config/navigation'
import { getErrorMessage } from '@/core/errors'
import { getAppName } from '@/core/features'
import { Brand, SidebarNav } from '@/components/layout/SidebarNav'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Avatar, Drawer, Dropdown, DropdownItem, IconButton } from '@/components/ui'
import { cn } from '@/utils'

export function AppLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const { theme, sidebarCollapsed, sidebarOpen, globalLoading } = useAppSelector((state) => state.ui)
  const inbox = useAppSelector((state) => state.notifications.inbox)

  const navItems = useMemo(() => filterNavigation(undefined, user), [user])
  const unread = inbox.filter((item) => !item.read).length

  async function handleLogout() {
    try {
      await logout(user)
      dispatch(setUnauthenticated())
      navigate('/login')
    } catch (error) {
      dispatch(notify('error', 'Logout failed', getErrorMessage(error)))
    }
  }

  const sidebarContent = (
    <>
      <Brand collapsed={sidebarCollapsed && !sidebarOpen} />
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <SidebarNav
          items={navItems}
          collapsed={sidebarCollapsed && !sidebarOpen}
          onNavigate={() => dispatch(setSidebarOpen(false))}
        />
      </div>
    </>
  )

  return (
    <div className="min-h-dvh bg-background">
      {globalLoading ? (
        <div className="fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden bg-muted">
          <div className="h-full w-1/3 animate-pulse bg-primary" />
        </div>
      ) : null}

      <div className="flex min-h-dvh">
        <aside
          className={cn(
            'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-white/5 bg-sidebar transition-[width] lg:flex',
            sidebarCollapsed ? 'w-[4.5rem]' : 'w-64',
          )}
        >
          {sidebarContent}
        </aside>

        <Drawer
          open={sidebarOpen}
          onClose={() => dispatch(setSidebarOpen(false))}
          title="Navigation"
        >
          <SidebarNav items={navItems} onNavigate={() => dispatch(setSidebarOpen(false))} />
        </Drawer>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
            <div className="flex items-center gap-2 px-4 py-3 sm:px-6">
              <IconButton
                label="Open menu"
                className="lg:hidden"
                onClick={() => dispatch(setSidebarOpen(true))}
              >
                <Menu className="h-5 w-5" />
              </IconButton>
              <IconButton
                label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden lg:inline-flex"
                onClick={() => dispatch(toggleSidebarCollapsed())}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </IconButton>

              <div className="min-w-0 flex-1">
                <Breadcrumbs />
              </div>

              <IconButton
                label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                onClick={() => dispatch(toggleTheme())}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </IconButton>

              <Dropdown
                trigger={
                  <IconButton label="Notifications">
                    <span className="relative">
                      <Bell className="h-4 w-4" />
                      {unread > 0 ? (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
                      ) : null}
                    </span>
                  </IconButton>
                }
              >
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Notifications
                </div>
                {inbox.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground">No notifications</div>
                ) : (
                  inbox.slice(0, 5).map((item) => (
                    <div key={item.id} className="border-t border-border px-3 py-2 text-sm">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground">{item.message}</p>
                    </div>
                  ))
                )}
              </Dropdown>

              <Dropdown
                trigger={
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg p-1 hover:bg-muted">
                    <Avatar name={user?.displayName} src={user?.photoURL} size="sm" />
                  </button>
                }
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4" /> Profile
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4" /> Settings
                </DropdownItem>
                <DropdownItem danger onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownItem>
              </Dropdown>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>

          <footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
            <Link to="/dashboard">{getAppName()}</Link> — generic application framework
          </footer>
        </div>
      </div>
    </div>
  )
}
