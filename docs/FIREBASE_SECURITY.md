# Firebase Security Strategy

Frontend authorization is **not** sufficient.

## Separation of concerns

| Layer | Purpose |
| --- | --- |
| React RBAC (`hasPermission`, `<Can>`, route guards) | Hide/disable UI for better UX |
| Firebase Auth | Prove identity |
| Firestore / Storage rules | Enforce what data can be read or written |
| Custom claims (recommended for production) | Server-trusted roles/permissions |

## Guidelines

1. Never store secrets in frontend code. Use `VITE_*` only for public Firebase web config.
2. Never trust `roleIds` or permissions sent by the client on privileged writes without rules validation.
3. Prefer Auth custom claims for elevated roles in production SaaS.
4. Keep audit logs append-only (`update`/`delete` denied).
5. Scope Storage uploads by `request.auth.uid` and validate size/content type.
6. Deploy `firestore.rules` and `storage.rules` with every environment.

## Starter rules

See:

- `/firestore.rules`
- `/storage.rules`

Tighten these before production. The starter rules demonstrate ownership and a configurable superuser role id; replace with your claim-based or permission-lookup strategy as needed.
