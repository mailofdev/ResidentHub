import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { AppNotification, NotificationType, ToastNotification } from '@/types'

export interface NotificationState {
  toasts: ToastNotification[]
  inbox: AppNotification[]
}

const initialState: NotificationState = {
  toasts: [],
  inbox: [],
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action: PayloadAction<ToastNotification>) {
        state.toasts.push(action.payload)
      },
      prepare(payload: Omit<ToastNotification, 'id'> & { id?: string }) {
        return {
          payload: {
            id: payload.id ?? nanoid(),
            title: payload.title,
            message: payload.message,
            type: payload.type,
            duration: payload.duration ?? 4000,
          },
        }
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
    clearToasts(state) {
      state.toasts = []
    },
    setInbox(state, action: PayloadAction<AppNotification[]>) {
      state.inbox = action.payload
    },
    markInboxRead(state, action: PayloadAction<string>) {
      const item = state.inbox.find((notification) => notification.id === action.payload)
      if (item) item.read = true
    },
  },
})

export const { pushToast, dismissToast, clearToasts, setInbox, markInboxRead } =
  notificationSlice.actions

export function notify(
  type: NotificationType,
  title: string,
  message?: string,
): ReturnType<typeof pushToast> {
  return pushToast({ type, title, message })
}

export default notificationSlice.reducer
