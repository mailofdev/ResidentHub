import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setBreadcrumbs } from '@/app/store/slices/uiSlice'
import { notify } from '@/app/store/slices/notificationSlice'
import { appConfig, PERMISSIONS } from '@/core/config/app.config'
import { getErrorMessage } from '@/core/errors'
import { isFirebaseConfigured } from '@/core/firebase'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { Can } from '@/components/ui/Can'
import {
  Badge,
  Button,
  IconButton,
  Modal,
} from '@/components/ui'
import { FormInput, FormSelect } from '@/components/forms/FormField'
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
import { userFormSchema, type UserFormSchema } from './user.schema'
import { createUser, deleteUser, listUsers, updateUser } from './user.service'
import type { UserRecord } from './types'

const PAGE_SIZE = 8

export function UsersPage() {
  const dispatch = useAppDispatch()
  const actor = useAppSelector((state) => state.auth.user)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [roleId, setRoleId] = useState('')
  const [page, setPage] = useState(1)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<UserRecord | null>(null)
  const [deleting, setDeleting] = useState<UserRecord | null>(null)
  const [saving, setSaving] = useState(false)

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      roleIds: [appConfig.roles[2]?.id ?? 'role_viewer'],
      status: 'active',
    },
  })

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: 'Users', path: '/users' }]))
  }, [dispatch])

  const { data, loading, error, reload } = useAsyncResource(async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured.')
    }
    return listUsers({
      search,
      filters: { status: status || undefined, roleId: roleId || undefined },
    })
  }, [search, status, roleId])

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

  function updateRoleId(value: string) {
    setRoleId(value)
    setPage(1)
  }

  function openCreate() {
    setEditing(null)
    form.reset({
      displayName: '',
      email: '',
      roleIds: [appConfig.roles[2]?.id ?? 'role_viewer'],
      status: 'active',
    })
    setEditorOpen(true)
  }

  function openEdit(user: UserRecord) {
    setEditing(user)
    form.reset({
      displayName: user.displayName,
      email: user.email,
      roleIds: user.roleIds,
      status: user.status,
    })
    setEditorOpen(true)
  }

  async function onSubmit(values: UserFormSchema) {
    if (!actor) return
    try {
      setSaving(true)
      if (editing) {
        await updateUser(editing.id, values, actor.id)
        dispatch(notify('success', 'User updated'))
      } else {
        await createUser(values, actor.id)
        dispatch(notify('success', 'User created'))
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
      await deleteUser(deleting.id, actor.id)
      dispatch(notify('success', 'User deleted'))
      setDeleting(null)
      reload()
    } catch (err) {
      dispatch(notify('error', 'Delete failed', getErrorMessage(err)))
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<UserRecord>[] = [
    {
      key: 'name',
      header: 'User',
      render: (row) => (
        <div>
          <Link to={`/users/${row.id}`} className="font-medium text-primary hover:underline">
            {row.displayName}
          </Link>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      hideOnMobile: true,
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roleIds.map((id) => {
            const role = appConfig.roles.find((item) => item.id === id)
            return (
              <Badge key={id} variant="info">
                {role?.name || id}
              </Badge>
            )
          })}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>{row.status}</Badge>
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
        <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
          <Can permission={PERMISSIONS.USER_UPDATE}>
            <IconButton label="Edit user" onClick={() => openEdit(row)}>
              <Pencil className="h-4 w-4" />
            </IconButton>
          </Can>
          <Can permission={PERMISSIONS.USER_DELETE}>
            <IconButton label="Delete user" onClick={() => setDeleting(row)}>
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
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Demonstration module — not part of the framework core.
          </p>
        </div>
        <Can permission={PERMISSIONS.USER_CREATE}>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Create user
          </Button>
        </Can>
      </div>

      <FilterPanel>
        <SearchInput value={search} onChange={updateSearch} placeholder="Search users…" />
        <FilterSelect
          label="Status"
          value={status}
          onChange={updateStatus}
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Invited', value: 'invited' },
            { label: 'Suspended', value: 'suspended' },
          ]}
        />
        <FilterSelect
          label="Role"
          value={roleId}
          onChange={updateRoleId}
          options={appConfig.roles.map((role) => ({ label: role.name, value: role.id }))}
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
                title={search || status || roleId ? 'No matching users' : 'No users yet'}
                description="Create a user or adjust your filters."
                action={
                  <Can permission={PERMISSIONS.USER_CREATE}>
                    <Button onClick={openCreate}>Create user</Button>
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
        title={editing ? 'Edit user' : 'Create user'}
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
            label="Display name"
            registration={form.register('displayName')}
            error={form.formState.errors.displayName?.message}
          />
          <FormInput
            label="Email"
            type="email"
            registration={form.register('email')}
            error={form.formState.errors.email?.message}
            disabled={Boolean(editing)}
          />
          <FormSelect
            label="Primary role"
            registration={form.register('roleIds.0')}
            options={appConfig.roles.map((role) => ({ label: role.name, value: role.id }))}
            error={form.formState.errors.roleIds?.message}
          />
          <FormSelect
            label="Status"
            registration={form.register('status')}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Invited', value: 'invited' },
              { label: 'Suspended', value: 'suspended' },
            ]}
            error={form.formState.errors.status?.message}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={onDelete}
        title="Delete user?"
        description={deleting ? `Remove ${deleting.displayName} from the directory.` : undefined}
        confirmLabel="Delete"
        destructive
        loading={saving}
      />
    </div>
  )
}
