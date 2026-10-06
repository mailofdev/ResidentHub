import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAppSelector } from '@/app/store/hooks'

export function Breadcrumbs() {
  const breadcrumbs = useAppSelector((state) => state.ui.breadcrumbs)
  if (!breadcrumbs.length) return null

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-foreground' : undefined}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
