# Generic React + Redux + Firebase Application Framework

A production-oriented, reusable frontend foundation for role-based CRUD applications. It is intentionally business-agnostic: ResidentHub-style domains (residents, visitors, payments, etc.) do **not** belong in `core/`.

Use this repository as the starting point for CRM, inventory, booking, admin portals, employee tools, SaaS apps, and similar products.

## Technology stack

- React 19 + TypeScript + Vite
- Redux Toolkit + React Redux
- React Router
- Firebase Auth, Firestore, Storage
- React Hook Form + Zod
- Tailwind CSS v4
- Lucide icons

## Architecture

```
src/
  app/           # providers, router, store
  core/          # framework-only: auth, firebase, rbac, audit, config, errors
  components/    # reusable UI (no business logic)
  layouts/       # AuthLayout, AppLayout
  modules/       # business modules (users, tasks demos)
  pages/         # top-level pages (auth, dashboard, profile, settings)
  hooks/ utils/ constants/ types/
```

### Rules

1. `core/` stays business-agnostic.
2. Roles, permissions, and navigation are configurable — never hardcoded to Admin/Resident/etc. in framework logic.
3. UI components never call Firebase directly.
4. Modules own their schemas, services, and pages.
5. Redux holds global auth/UI/notifications — not every local form field.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and set:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Optional: `VITE_APP_NAME`

The app fails gracefully when Firebase config is missing (auth screens show a clear warning).

## Firebase setup

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Create a Firestore database.
4. Enable Storage if you need uploads.
5. Deploy `firestore.rules` and `storage.rules`.
6. Fill `.env` with the web app config values.

### Security note

Frontend RBAC (`<Can>`, route guards, nav filtering) is for UX only. Enforce authorization in Firebase Security Rules (and/or custom claims). Never trust client-side roles as the only boundary.

## Authentication

Generic auth APIs live in `src/core/auth` and `src/core/firebase/auth.ts`:

- `login()`
- `signup()`
- `logout()`
- `resetPassword()`
- `getCurrentUser()` / auth state subscription
- profile + password updates

User model fields: `id`, `email`, `displayName`, `photoURL`, `roleIds`, `status`, `createdAt`, `updatedAt`.

## Redux usage

Framework slices:

- `authSlice` — session + current user
- `uiSlice` — theme, sidebar, breadcrumbs, global loading
- `notificationSlice` — toasts + inbox shell

Business modules should keep temporary UI state local. Add module-specific slices in the consuming app when global module state is truly required.

## RBAC & permissions

Configure roles and permissions in `src/core/config/app.config.ts`.

Helpers:

- `hasRole()`
- `hasPermission()`
- `hasAnyPermission()`
- `hasAllPermissions()`

Permission UI:

```tsx
<Can permission="user.create">
  <CreateButton />
</Can>
```

Route guards:

- `PublicRoute`
- `ProtectedRoute`
- `RoleRoute`
- `PermissionRoute`

## Dynamic navigation

Navigation is declared in config (`DEFAULT_NAVIGATION`). Items support `label`, `path`, `icon`, `permission`, `roles`, `children`, `visible`, `order`, and `featureFlag`. The layout filters items automatically via `filterNavigation()`.

## Generic CRUD

Framework primitives:

- Firestore helpers: `createDocument`, `getDocument`, `getDocuments`, `updateDocument`, `deleteDocument`
- UI: `GenericTable`, `SearchInput`, `FilterPanel`, `Pagination`, `ConfirmDialog`, `EmptyState`, `Loading` / skeleton states
- Forms: React Hook Form + Zod wrappers in `components/forms`

Demo modules:

- `modules/users` — list/search/filter/create/edit/view/delete + permissions
- `modules/tasks` — second unrelated module proving reusability

## Feature flags

```ts
isFeatureEnabled('auditLogs')
```

Flags live in `appConfig.features`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## How to create a new business module

1. Create `src/modules/<name>/`
2. Add `types.ts`, `<name>.schema.ts`, `<name>.service.ts`, pages
3. Use `core/firebase/firestore` inside the service — not from UI components
4. Register routes in `src/app/router/index.tsx`
5. Add a nav item + permissions in `src/core/config/app.config.ts`
6. Gate UI with `<Can>` / `PermissionRoute`

Example service pattern:

```ts
// modules/inventory/inventory.service.ts
import { createDocument, getDocuments } from '@/core/firebase/firestore'
import { COLLECTIONS } from '@/core/config/app.config'

export async function listItems() {
  return getDocuments('inventory_items')
}
```

You should not need to change RBAC helpers, layout, auth, or base UI components to ship a new module.

## Theme

Light/dark themes use CSS design tokens in `src/index.css`. Preference is stored in `localStorage` and managed through `uiSlice`.

## Demo modules vs core

| Area | Belongs in |
| --- | --- |
| Auth, RBAC, Firebase abstractions, layouts, UI kit | `core/`, `components/`, `layouts/` |
| Users CRUD demo | `modules/users` |
| Tasks CRUD demo | `modules/tasks` |
| Future Resident/CRM/Inventory logic | new folders under `modules/` only |
