import { NavLink } from 'react-router-dom'
import {
  CheckSquare,
  Circle,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { NavItem } from '@/types'
import { cn } from '@/utils'
import { getAppName } from '@/core/features'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  Circle,
}

function resolveIcon(name?: string): LucideIcon {
  if (!name) return Circle
  return ICON_MAP[name] ?? Circle
}

export function SidebarNav({
  items,
  collapsed,
  onNavigate,
}: {
  items: NavItem[]
  collapsed?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = resolveIcon(item.icon)
        if (!item.path) return null
        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-muted hover:text-sidebar-foreground',
                collapsed && 'justify-center px-2',
              )
            }
            title={item.label}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        )
      })}
    </nav>
  )
}

export function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 px-3 py-4', collapsed && 'justify-center px-2')}>
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      {!collapsed ? (
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">{getAppName()}</p>
          <p className="text-xs text-sidebar-foreground/60">Framework</p>
        </div>
      ) : null}
    </div>
  )
}
