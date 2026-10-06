import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { dismissToast } from '@/app/store/slices/notificationSlice'
import { Alert } from './Alert'

export function ToastViewport() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((state) => state.notifications.toasts)

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        dispatch(dismissToast(toast.id))
      }, toast.duration ?? 4000),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [toasts, dispatch])

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(100%-2rem,24rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Alert
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => dispatch(dismissToast(toast.id))}
            className="bg-card shadow-lg"
          />
        </div>
      ))}
    </div>
  )
}
