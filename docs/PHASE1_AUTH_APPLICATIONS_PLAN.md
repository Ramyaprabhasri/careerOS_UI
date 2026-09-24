# Phase 1 Backend Plan: Auth + Applications CRUD

**Status:** Planning only — implement after review/approval.  
**Stack:** Next.js Route Handlers · Prisma · Supabase Postgres · Supabase Auth · Supabase Storage (wired later for resumes; Phase 1 only needs Auth + DB)

---

## 1. Alignment with current code

| Existing piece | Phase 1 approach |
|----------------|------------------|
| `Application` / `ApplicationInput` in `src/types/dashboard.ts` | API request/response DTOs map 1:1 to these shapes |
| `DashboardProvider` sync mutators | Keep the same method signatures; make mutators async internally (or return `Promise` while UI keeps calling them — see §6) |
| `initialApplications` from `src/data/mock` | Seed optional for empty accounts; stop using as live source when authenticated |
| `createId("app")` client IDs | Replace with Prisma/cuid or uuid from DB |
| `defaultTimeline(status)` | Server creates timeline on POST; client can still recompute on status change via PATCH |
| Dates as `YYYY-MM-DD` strings | Store as `Date`/`DateTime` in DB; serialize to ISO date strings in API mappers |
| Enums: status, workMode, employmentType, priority | Prisma enums matching TS unions exactly (`Onsite` not `On-site`) |
| Tags / timeline | Nested tables; API always returns `tags: string[]` and `timeline: TimelineEvent[]` |
| Profile settings localStorage | **Out of scope** — only minimal `Profile` row for auth bootstrap |
| Jobs / Resume AI / Prep / Analytics APIs | **Out of scope** |

---

## 2. Proposed backend folder structure

Fits under existing `src/` without touching UI component trees:

```
src/
  app/
    api/
      applications/
        route.ts                 # GET list, POST create
        [id]/
          route.ts               # GET one, PATCH, DELETE
      auth/
        callback/
          route.ts               # Supabase OAuth/email callback (if used)
    (auth)/                      # optional route group for login UI later
      login/page.tsx
      signup/page.tsx
    dashboard/
      layout.tsx                 # add auth gate here (or middleware)

  lib/
    db/
      prisma.ts                  # PrismaClient singleton
    supabase/
      server.ts                  # createServerClient (cookies)
      client.ts                  # browser client (auth UI only)
      middleware.ts              # session refresh helper
    auth/
      session.ts                 # getCurrentUser(), requireUser()
      sync-profile.ts            # ensure Profile row after first login
    applications/
      service.ts                 # business logic (user-scoped)
      mappers.ts                 # Prisma ↔ Application TS type
      validators.ts              # Zod schemas
    api/
      errors.ts                  # ApiError + json helpers
      client.ts                  # browser fetch wrapper (cookies)

  types/
    api.ts                       # shared API error/envelope types (new, small)
```

**Also at repo root:**

```
prisma/                     # OR keep prisma/ at root (recommended Prisma default)
middleware.ts               # Next.js middleware — refresh Supabase session
.env.local                  # secrets (gitignored)
.env.example                # documented vars only
```

**Assumption:** Prefer root `prisma/` (Prisma convention) over `src/prisma/`.  
**Assumption:** Login/signup pages can be minimal Phase 1 deliverables so Auth is testable; they are not a redesign of existing dashboard UI.

---

## 3. Prisma schema (User/Profile + Application)

### Design notes

- **Auth identity** lives in Supabase Auth (`auth.users`).
- App DB holds a **`User`** row keyed by Supabase `auth.users.id` (UUID).
- Minimal **`Profile`** (1:1) for display name later; full Profile & Settings CRUD stays Phase 2.
- **`Application`** is fully owned by `userId` — every query filters `where: { userId }`.

### Proposed schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  // Optional if using Supabase pooler:
  // directUrl = env("DIRECT_URL")
}

enum ApplicationStatus {
  Saved
  Applied
  Screening
  Interview
  Offer
  Rejected
}

enum WorkMode {
  Remote
  Hybrid
  Onsite
}

enum EmploymentType {
  Full_time  // maps to "Full-time" in API
  Contract
  Internship
  Part_time  // maps to "Part-time"
}

enum Priority {
  Low
  Medium
  High
}

model User {
  id        String   @id @db.Uuid // = auth.users.id
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profile      Profile?
  applications Application[]
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  fullName  String   @default("")
  headline  String   @default("")
  location  String   @default("")
  // Phase 2 expands this to match UserProfile

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Application {
  id             String            @id @default(cuid())
  userId         String            @db.Uuid
  user           User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  company        String
  role           String
  location       String
  dateApplied    DateTime          @db.Date
  status         ApplicationStatus @default(Applied)
  matchScore     Int               @default(80)
  notes          String?
  salaryRange    String?
  source         String?
  jobUrl         String?
  workMode       WorkMode
  employmentType EmploymentType
  priority       Priority          @default(Medium)
  resumeUsed     String?
  followUpDate   DateTime?         @db.Date
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  tags           ApplicationTag[]
  timeline       ApplicationTimelineEvent[]

  @@index([userId, status])
  @@index([userId, dateApplied])
  @@index([userId, updatedAt])
}

model ApplicationTag {
  id            String      @id @default(cuid())
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  label         String

  @@unique([applicationId, label])
  @@index([applicationId])
}

model ApplicationTimelineEvent {
  id            String      @id @default(cuid())
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  label         String
  date          DateTime?   @db.Date
  completed     Boolean     @default(false)
  sortOrder     Int         @default(0)

  @@index([applicationId])
}
```

### Mapping to existing TypeScript `Application`

| UI field (`Application`) | DB | Mapper notes |
|--------------------------|-----|--------------|
| `id` | `Application.id` | cuid string (UI today uses `app-xxx`; **compatible** as opaque string) |
| `company`, `role`, `location` | same | required |
| `dateApplied` | `Date` | API returns `YYYY-MM-DD` |
| `status` | enum | identical labels |
| `matchScore` | `Int` | default 80 |
| `notes`, `salaryRange`, `source`, `jobUrl`, `resumeUsed` | optional strings | |
| `workMode` | enum | `Onsite` matches UI |
| `employmentType` | enum | Prisma cannot use hyphens → `Full_time` / `Part_time` ↔ `"Full-time"` / `"Part-time"` in mappers |
| `priority` | enum | identical |
| `followUpDate` | `Date?` | `YYYY-MM-DD` or omit |
| `updatedAt` | `DateTime` | API returns date-only string if UI expects that today (`todayIso()` style) **or** full ISO — **flag:** UI uses date-only; recommend keep date-only in JSON for zero UI churn |
| `tags` | `ApplicationTag[]` | map to `string[]` |
| `timeline` | `ApplicationTimelineEvent[]` | map to `{ id, label, date?, completed }` |

### Incompatibilities / assumptions

1. **EmploymentType hyphens** — Prisma enum values cannot be `"Full-time"`. Must map in `mappers.ts`.
2. **Client-generated IDs** (`createId("app")`) go away; UI must accept server IDs (already treated as opaque).
3. **`User` vs Supabase Auth** — We do **not** store passwords in Prisma. On first authenticated request, `requireUser()` upserts `User` + empty `Profile`.
4. **RLS** — Phase 1 can rely on Prisma `userId` filters in Route Handlers. Optionally enable Supabase RLS later; Prisma typically uses the service role and must **never** trust client-supplied `userId`.
5. **Storage** — Bucket setup can land in Phase 1 env/docs, but resume upload API stays Phase 3.
6. **Bulk ops** (`deleteApplications`, `bulkUpdateStatus`, etc.) — Existing UI calls these. Phase 1 options:
   - **A (preferred for plan):** implement as multiple single-ID calls from provider, or
   - **B:** add `POST /api/applications/bulk` in the same phase (small extra).
   - **Assumption for this plan:** support bulk via sequential PATCH/DELETE in the provider adapter first; add bulk endpoint if latency is bad.

---

## 4. Authentication flow & `/dashboard` protection

### Flow

```
Browser                    Next.js                     Supabase
   |                          |                            |
   |  signInWithPassword /    |                            |
   |  signInWithOAuth         |--------------------------->|
   |                          |  session cookies set       |
   |  GET /dashboard          |                            |
   |------------------------->|  middleware refreshes      |
   |                          |  session                   |
   |                          |  layout: requireUser()     |
   |                          |--------------------------->| getUser()
   |                          |  upsert User/Profile       |
   |                          |  render DashboardShell     |
   |  GET /api/applications   |                            |
   |------------------------->|  requireUser()             |
   |                          |  Prisma where userId=...   |
```

### Pieces

| Piece | Role |
|-------|------|
| `@supabase/ssr` | Cookie-based sessions in App Router |
| `middleware.ts` | Refresh session on each request; redirect unauthenticated users from `/dashboard/*` → `/login` |
| `src/app/dashboard/layout.tsx` | Server-side `requireUser()` as second line of defense |
| `src/lib/auth/session.ts` | `getSessionUser()`, `requireUser()` used by API routes |
| Login / signup pages | Minimal; existing dashboard UI unchanged |

### Public vs protected

| Path | Access |
|------|--------|
| `/`, `/login`, `/signup` | Public |
| `/dashboard/**` | Authenticated |
| `/api/applications/**` | Authenticated (401 if missing session) |
| `/api/auth/callback` | Public (OAuth code exchange) |

### Auth UX assumption

- Phase 1 ships email/password (and optionally Google) via Supabase Auth UI helpers.
- Unauthenticated visit to `/dashboard` redirects to login with `?next=/dashboard/...`.
- **Landing page stays public** (portfolio).
- **Incompatibility:** Today `/dashboard` works without login. Enabling auth **will** change that — intentional for Phase 1.

---

## 5. API contracts (Applications)

All JSON. All responses for a single application use the **exact** client `Application` shape after mapping.  
All routes call `requireUser()` and scope by `user.id`.

### Common error envelope

```ts
type ApiErrorBody = {
  error: {
    code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION_ERROR"
      | "INTERNAL";
    message: string;
    details?: Record<string, string[]>; // field errors
  };
};
```

| Status | When |
|--------|------|
| 401 | No/invalid session |
| 403 | Authenticated but resource not owned (treat as 404 preferably) |
| 404 | Unknown id **or** other user’s id (avoid leaking existence) |
| 400 | Validation failure |
| 500 | Unexpected |

---

### `GET /api/applications`

**Query (optional, Phase 1 minimal):**

| Param | Type | Notes |
|-------|------|-------|
| `status` | `ApplicationStatus` | optional filter |
| `q` | string | optional search company/role |

**Response `200`:**

```ts
{ data: Application[] }
```

Sorted default: `updatedAt desc` (matches board “newest activity” feel) or `dateApplied desc` — **assumption:** `updatedAt desc`, then `dateApplied desc`.

---

### `POST /api/applications`

**Body:** `ApplicationInput` (same as UI form)

```ts
{
  company: string;          // required, trim, 1–120
  role: string;             // required, 1–120
  location: string;         // required, 1–120
  status: ApplicationStatus;
  workMode: WorkMode;
  employmentType: "Full-time" | "Contract" | "Internship" | "Part-time";
  priority: Priority;
  matchScore?: number;      // 0–100, default 80
  notes?: string;
  salaryRange?: string;
  source?: string;          // default "Manual"
  jobUrl?: string;          // optional URL
  resumeUsed?: string;
  followUpDate?: string;    // YYYY-MM-DD
  dateApplied?: string;     // YYYY-MM-DD, default today (UTC date)
}
```

**Server also:**

- Sets `userId` from session (ignore any client `userId`)
- Creates `timeline` via same rules as `defaultTimeline(status)`
- `tags: []`

**Response `201`:**

```ts
{ data: Application }
```

---

### `GET /api/applications/[id]`

**Response `200`:** `{ data: Application }`  
**Response `404`:** if not found for this user

---

### `PATCH /api/applications/[id]`

**Body:** partial of `Application` fields the UI already patches (same as `Partial<Application>` minus `id`), including:

- status, notes, timeline, tags, followUpDate, priority, etc.

**Rules:**

- Only owner can patch
- If `status` changes, optionally rebuild timeline (match current `updateApplicationStatus` behavior) — **assumption:** yes, when `status` is present and timeline not explicitly sent
- If `timeline` is sent, replace events transactionally

**Response `200`:** `{ data: Application }`

---

### `DELETE /api/applications/[id]`

**Response `204`:** empty body  
**Response `404`:** not found for user

Cascades tags + timeline via Prisma `onDelete: Cascade`.

---

## 6. Connecting `DashboardProvider` without breaking UI

### Goal

Kanban, Table, Drawer, Overview metrics keep calling:

```ts
const { applications, addApplication, updateApplicationStatus, ... } = useDashboard();
```

No prop drilling changes inside board/table components.

### Strategy (recommended)

**Adapter pattern inside `DashboardProvider` only:**

1. On mount (client): if session exists → `GET /api/applications` → `setApplications(data)`.
2. While loading: `applications = []` + `isLoading` (optional; Overview/Board should tolerate empty + skeleton — add **minimal** loading flag to context if needed without changing child APIs).
3. Mutators become async internally: POST/PATCH/DELETE then update local state; keep toast UX identical.
4. On 401: redirect to `/login`.
5. Fallback: `NEXT_PUBLIC_USE_MOCK_APPLICATIONS=true` keeps `initialApplications` for local UI work without Supabase — **assumption:** include this escape hatch for portfolio demos offline.

### Async signature caveat

Today mutators are **synchronous** (`void`). Making them `async` is still compatible if callers don’t `await` (fire-and-forget). Prefer:

- Keep signatures as `void` wrappers that kick off async work, **or**
- Change to `Promise<void>` (TypeScript-compatible for most callers).

**Do not** change Kanban/Table/Drawer markup.

### What not to do in Phase 1

- Don’t rewrite board to React Query everywhere (can introduce Query later behind the provider).
- Don’t remove mock data files yet (still used by landing/overview chart seeds).
- Don’t migrate profile/localStorage stores yet.

---

## 7. Environment variables & setup steps

### Env vars

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only; seed/admin only — NOT for browser

# Prisma → Supabase Postgres
DATABASE_URL=                       # pooled connection string (PgBouncer)
DIRECT_URL=                         # direct connection for migrations

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCK_APPLICATIONS=false

# Storage (Phase 1: create bucket; use in Phase 3)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=resumes
```

**Never** put `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL` in client bundles.

### Setup steps (implementation order)

1. Create Supabase project; enable Email auth.
2. Copy connection strings into `.env.local`.
3. `npm i @prisma/client @supabase/supabase-js @supabase/ssr zod` + `npm i -D prisma`.
4. Add `prisma/schema.prisma`; `npx prisma migrate dev`.
5. Implement `lib/db/prisma.ts`, Supabase server/client, `requireUser()`.
6. Implement application routes + mappers + Zod validators.
7. Add `middleware.ts` + login page.
8. Adapt `DashboardProvider` to fetch/mutate via API.
9. Seed script (optional): create test user in Auth + sample applications.
10. Verify: login → empty board → add application → refresh → still there → another user cannot see it.

---

## 8. Security, validation, loading, errors

### Security

| Requirement | Approach |
|-------------|----------|
| User scoping | Every Prisma query includes `userId: session.user.id` |
| IDOR prevention | `findFirst({ where: { id, userId } })`; 404 if missing |
| No client userId | Ignore body/query `userId` |
| Secrets | Service role & DB URL server-only |
| CSRF | Same-site cookies via Supabase SSR; mutations require session cookie |
| Rate limiting | Optional Phase 1.5 (middleware / Upstash); note as follow-up |
| Input size | Cap notes length (e.g. 5–10k chars) |

### Validation (Zod on server)

- Mirror `ApplicationFormModal` rules: company, role, location required
- Enums for status / workMode / employmentType / priority
- `matchScore` 0–100
- `jobUrl` optional URL
- Dates `YYYY-MM-DD`
- Return `VALIDATION_ERROR` + field map for future form wiring (UI can keep local validation for now)

### Loading

| Surface | Behavior |
|---------|----------|
| Initial applications fetch | Provider `isLoading` / empty list; optional lightweight skeleton in Overview/Applications **without** redesigning cards |
| Mutations | Optimistic update **or** disable until response; keep existing toasts on success |
| Auth redirect | Middleware — no flash of protected content (prefer server redirect) |

### Error handling

| Case | UX |
|------|----|
| Network / 500 | Toast: “Couldn’t save application. Try again.”; rollback optimistic state |
| 401 | Redirect login; clear in-memory apps |
| 404 on PATCH/DELETE | Toast + refetch list |
| 400 validation | Toast with message; keep form open |

Log server errors with request id; never return stack traces to client.

---

## Phase 1 implementation checklist (for after approval)

1. Dependencies + env + Prisma schema/migrate
2. Supabase SSR helpers + middleware + login/signup
3. `User`/`Profile` upsert on first session
4. Applications CRUD Route Handlers + service + mappers + Zod
5. `DashboardProvider` API adapter + mock flag
6. Manual test matrix (two users, CRUD, refresh, unauthorized)
7. Document in `docs/PHASE1_AUTH_APPLICATIONS.md` (optional)

**Explicitly deferred:** Profile CRUD APIs, Storage uploads, Jobs, Resume AI, Interview Prep, Analytics endpoints, bulk API (unless needed), RLS policies (optional hardening).

---

## Open decisions

1. **Bulk endpoint in Phase 1** or sequential calls from provider?
2. **Email-only auth** first, or Email + Google?
3. **Force login for `/dashboard`** immediately, or temporary `USE_MOCK` bypass for demos?
4. **`updatedAt` JSON format:** date-only (`YYYY-MM-DD`) vs full ISO? (Recommend date-only for UI parity.)
5. Should empty new users see **zero applications** or a **one-click seed** of sample data?

Once these are confirmed (or the assumptions above are accepted), implementation can proceed without redesigning existing UI components.
