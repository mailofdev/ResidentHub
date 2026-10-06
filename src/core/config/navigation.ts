import type { AppUser, NavItem } from '@/types'
import { appConfig } from '@/core/config/app.config'
import { isFeatureEnabled } from '@/core/features'
import { canAccessNavItem } from '@/core/rbac'

export function filterNavigation(
  items: NavItem[] = appConfig.navigation,
  user: AppUser | null | undefined,
): NavItem[] {
  return items
    .filter((item) => {
      if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) return false
      return canAccessNavItem(user, item)
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterNavigation(item.children, user) : undefined,
    }))
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
}
