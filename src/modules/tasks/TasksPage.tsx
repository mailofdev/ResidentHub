import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setBreadcrumbs } from '@/app/store/slices/uiSlice'
import { notify } from '@/app/store/slices/notificationSlice'
import { PERMISSIONS } from '@/core/config/app.config'
import { getErrorMessage } from '@/core/errors'
import { isFirebaseConfigured } from '@/core/firebase'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { Can } from '@/components/ui/Can'
import { Badge, Button, IconButton, Modal } from '@/components/ui'
import { FormInput, FormSelect, FormTextarea } from '@/components/forms/FormField'
import { SearchInput } from '@/components/filters/SearchInput'
import { FilterPanel, FilterSelect } from '@/components/filters/FilterPanel'
import { GenericTable, type Column } from '@/components/table/GenericTable'
import { Pagination } from '@/components/table/Pagination'
import { ConfirmDialog } from '@/components/modal/ConfirmDialog'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { TableSkeleton } from '@/components/feedback/Skeleton'
import { Alert } from '@/components/feedback/Alert'
import { formatDate } from '@/utils'
import { taskFormSchema, type TaskFormSchema } from './task.schema'
import { createTask, deleteTask, listTasks, updateTask } from './task.service'
import type { Task } from './types'

const PAGE_SIZE = 8

const statusVariant = {
  todo: 'default',
  in_progress: 'info',
  done: 'success',
} as const

export function TasksPage() {
  const dispatch = useAppDispatch()
  const actor = useAppSelector((state) => state.auth.user)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [page, setPage] = useState(1)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [saving, setSaving] = useState(false)

  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
    },
  })

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: 'Tasks', path: '/tasks' }]))
  }, [dispatch])

  const { data, loading, error, reload } = useAsyncResource(async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.')
    }
    return listTasks({
      search,
      filters: {
        status: status || undefined,
        priority: priority || undefined,
      },
    })
  }, [search, status, priority])

  const paged = useMemo(() => {
    const list = data ?? []
    const start = (page - 1) * PAGE_SIZE
    return list.slice(start, start + PAGE_SIZE)
  }, [data, page])

  const total = data?.length ?? 0

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function updateStatus(value: string) {
    setStatus(value)
    setPage(1)
  }

  function updatePriority(value: string) {
    setPriority(value)
    setPage(1)
  }

  function openCreate() {
    setEditing(null)
    form.reset({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
    })
    setEditorOpen(true)
  }

  function openEdit(task: Task) {
    setEditing(task)
    form.reset({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    })
    setEditorOpen(true)
  }

  async function onSubmit(values: TaskFormSchema) {
    if (!actor) return
    try {
      setSaving(true)
      if (editing) {
        await updateTask(editing.id, values, actor.id)
        dispatch(notify('success', 'Task updated'))
      } else {
        await createTask(values, actor.id)
        dispatch(notify('success', 'Task created'))
      }
      setEditorOpen(false)
      reload()
    } catch (err) {
      dispatch(notify('error', 'Save failed', getErrorMessage(err)))
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!actor || !deleting) return
    try {
      setSaving(true)
      await deleteTask(deleting.id, actor.id)
      dispatch(notify('success', 'Task deleted'))
      setDeleting(null)
      reload()
    } catch (err) {
      dispatch(notify('error', 'Delete failed', getErrorMessage(err)))
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<Task>[] = [
    {
      key: 'title',
      header: 'Task',
      render: (row) => (
        <div>
          <p className="font-medium">{row.title}</p>
          {row.description ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">{row.description}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'priority',
      header: 'Priority',
      hideOnMobile: true,
      render: (row) => (
        <Badge variant={row.priority === 'high' ? 'danger' : 'default'}>{row.priority}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      hideOnMobile: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24 text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Can permission={PERMISSIONS.TASK_UPDATE}>
            <IconButton label="Edit task" onClick={() => openEdit(row)}>
              <Pencil className="h-4 w-4" />
            </IconButton>
          </Can>
          <Can permission={PERMISSIONS.TASK_DELETE}>
            <IconButton label="Delete task" onClick={() => setDeleting(row)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </IconButton>
          </Can>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Second demo module proving the framework is reusable without core changes.
          </p>
        </div>
        <Can permission={PERMISSIONS.TASK_CREATE}>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Create task
          </Button>
        </Can>
      </div>

      <FilterPanel>
        <SearchInput value={search} onChange={updateSearch} placeholder="Search tasks…" />
        <FilterSelect
          label="Status"
          value={status}
          onChange={updateStatus}
          options={[
            { label: 'Todo', value: 'todo' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Done', value: 'done' },
          ]}
        />
        <FilterSelect
          label="Priority"
          value={priority}
          onChange={updatePriority}
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
        />
      </FilterPanel>

      {!isFirebaseConfigured() ? (
        <Alert
          type="warning"
          title="Firebase required"
          message="Configure Firebase environment variables to use persistent CRUD."
        />
      ) : null}

      {loading ? <TableSkeleton /> : null}
      {error ? <ErrorState description={error} onRetry={reload} /> : null}
      {!loading && !error ? (
        <>
          <GenericTable
            columns={columns}
            data={paged}
            empty={
              <EmptyState
                title={search || status || priority ? 'No matching tasks' : 'No tasks yet'}
                description="Create a task to demonstrate module-level CRUD."
                action={
                  <Can permission={PERMISSIONS.TASK_CREATE}>
                    <Button onClick={openCreate}>Create task</Button>
                  </Can>
                }
              />
            }
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      ) : null}

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? 'Edit task' : 'Create task'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={form.handleSubmit(onSubmit)}>
              Save
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            label="Title"
            registration={form.register('title')}
            error={form.formState.errors.title?.message}
          />
          <FormTextarea
            label="Description"
            registration={form.register('description')}
            error={form.formState.errors.description?.message}
          />
          <FormSelect
            label="Status"
            registration={form.register('status')}
            options={[
              { label: 'Todo', value: 'todo' },
              { label: 'In progress', value: 'in_progress' },
              { label: 'Done', value: 'done' },
            ]}
            error={form.formState.errors.status?.message}
          />
          <FormSelect
            label="Priority"
            registration={form.register('priority')}
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]}
            error={form.formState.errors.priority?.message}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={onDelete}
        title="Delete task?"
        description={deleting ? `Permanently remove “${deleting.title}”.` : undefined}
        confirmLabel="Delete"
        destructive
        loading={saving}
      />
    </div>
  )
}
