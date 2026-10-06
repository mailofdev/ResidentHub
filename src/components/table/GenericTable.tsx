import type { ReactNode } from 'react'
import { cn } from '@/utils'

export interface Column<T> {
  key: string
  header: string
  className?: string
  hideOnMobile?: boolean
  render: (row: T) => ReactNode
}

export function GenericTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  empty,
}: {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  empty?: ReactNode
}) {
  if (!data.length && empty) return <>{empty}</>

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/60">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase',
                  column.hideOnMobile && 'hidden md:table-cell',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {data.map((row) => (
            <tr
              key={row.id}
              className={cn(onRowClick && 'cursor-pointer hover:bg-muted/40')}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-3 align-middle',
                    column.hideOnMobile && 'hidden md:table-cell',
                    column.className,
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
