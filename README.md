# Telohive Assignment - Space Discovery Dashboard

This project is a Next.js App Router dashboard for discovering spaces, saving favorites, viewing bookings, and tracking activity.

Live URL: https://telohive-assignment.vercel.app

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- React Query (`@tanstack/react-query`) for server state
- Zustand for client/UI persistence (auth + saved spaces)
- Playwright for unit/API/UI testing

## Quick Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Seed local dataset (optional, recommended first run)

```bash
npm run seed:db
```

### 3) Run the app

```bash
npm run dev
```

App URL: [http://localhost:3000](http://localhost:3000)

### 4) Run `json-server` (separate process)

The assignment requires documenting app + `json-server` startup as two processes.

```bash
npx json-server db.json --port 3001
```

JSON server URL: [http://localhost:3001](http://localhost:3001)

Note: the UI currently consumes Next.js route handlers under `/api/*` that read from `db.json` directly.

## Command Reference

- `npm run dev`: start Next.js dev server on port 3000
- `npm run seed:db`: regenerate `db.json` with seeded spaces/bookings/saved data
- `npm run build`: production build
- `npm run start`: run production server after build
- `npm run lint`: run ESLint
- `npm run test`: run unit tests
- `npm run test:api`: run API route tests
- `npm run test:ui`: run browser UI tests (headless)
- `npm run test:headed`: run browser UI tests in headed mode

## User Flow

1. User lands on `/` and is redirected to `/login` when unauthenticated, or `/discovery` when authenticated.
2. User logs in via credentials or social guest buttons, or creates an account via `/register`.
3. Authenticated users access protected app routes with sidebar navigation:
   - `/discovery` - search + filter spaces, save/unsave, sort and paginate
   - `/saved` - view and filter saved spaces
   - `/dashboard` - activity summaries and chart
   - `/bookings` - searchable/sortable table with bulk actions
4. Logout clears session and redirects to `/login`.

## Architecture Overview

The codebase is split by route domain and responsibility:

- `src/app/(auth)/*`: login/register pages and validation-driven form handling
- `src/app/(app)/*`: authenticated route group (discovery, saved, dashboard, bookings)
- `src/app/api/*`: route handlers for spaces and bookings
- `src/lib/server/*`: server-side db access and query/filter composition
- `src/lib/discovery/*` and `src/lib/bookings/*`: URL query parse/serialize logic
- `src/store/*`: client-side persisted state (`auth-store`, `saved-spaces-store`)
- `src/components/*`: shared UI shell and providers

This split keeps data/query logic testable and reusable, while keeping pages focused on layout/composition.

## Server vs Client Component Decisions

### Server Components

- Route pages such as `src/app/(app)/discovery/page.tsx` parse initial query params and prefetch data.
- Server-side prefetch + hydration reduces first render loading and keeps URL-linked state SSR-friendly.
- API route handlers and db/query modules stay server-only (`src/app/api/*`, `src/lib/server/*`).

### Client Components

- Interactive views are client components (`DiscoveryClient`, bookings/saved UI clients, auth forms).
- Browser-only concerns (localStorage/sessionStorage, debounced input, modal state, table selection) are kept client-side.
- Zustand stores (`auth-store`, `saved-spaces-store`) and React Query provider are client-only by design.

## Filter URL State Design

URL params are the source of truth for Discovery and Bookings filters/sort/search:

- Parse: `parseSpacesQueryFromSearchParams` and related parser utilities create typed query objects.
- Serialize: `toSpacesSearchParams` writes only non-default values to keep URLs compact.
- Sync flow:
  - UI updates draft/local state
  - apply/update functions call `router.replace(...)`
  - URL updates trigger derived query state and refetch
- Benefits:
  - refresh-safe
  - shareable links
  - deterministic test coverage for parse/serialize edge cases

## Performance Strategy and Virtualization Choice

The discovery list uses server-side filtering + pagination (default page size 12, up to 48) instead of client window virtualization.

Why this choice:

- With API-driven filtering/sorting and paged responses, only a bounded result set is rendered at once.
- It avoids rendering hundreds of cards simultaneously and keeps interactions responsive.
- It simplifies SEO/SSR behavior and deep-linking because each page state is URL-addressable.

Trade-off:

- This does not implement viewport windowing (`@tanstack/react-virtual`), so the requirement is addressed via pagination as a pragmatic performance strategy rather than true virtual scrolling.

## Test Cases and Coverage

### Unit (`npm run test`)

- Discovery/bookings query state serialization + fallback behavior
- Bookings sort logic with tie-break determinism
- Bookings filter composition logic
- Spaces query composition (AND filters), sorting, and page clamping

### API (`npm run test:api`)

- `GET /api/spaces`:
  - filtered payload shape + meta
  - oversized page clamping
  - multi-filter behavior
  - empty-state response shape
- `GET /api/spaces/:id`:
  - valid id success
  - invalid id error
  - not found error
- `GET /api/bookings`:
  - mapped rows and id-desc ordering
- `PATCH /api/bookings/:id`:
  - invalid id/status validations
  - not found behavior
  - update + restore flow

### UI (`npm run test:ui`)

- Auth to discovery flow and cross-page navigation/logout
- Discovery URL synchronization (search, sort, filters, pagination, page size)
- Bookings URL synchronization (sort/search/status)
- Saved page filter + clear behavior

## Trade-offs

- Chose API-backed pagination instead of client virtual list windowing for simpler state and stable URL-driven behavior.
- Kept auth as storage-based mock auth (assignment scope) rather than introducing a real provider and backend session management.
- Used route handlers over a separate runtime JSON API dependency to keep local dev simple, while still supporting `json-server` for dataset inspection.

## Prioritized Future Improvements

1. Add true virtualization (`@tanstack/react-virtual`) for very large client-side result sets.
2. Add availability-date filtering end-to-end in query execution (currently URL/UI ready).
3. Expand automated tests for error/empty states in UI and add coverage for saved/dashboard interactions.
4. Introduce API contract typing shared between route handlers and client fetchers.
5. Improve metadata/title and production-ready docs for deployment and environment setup.

## Time Spent

Estimated total: ~15 hours.
