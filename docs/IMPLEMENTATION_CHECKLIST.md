# Implementation Checklist

## Working Rules

- [ ] Use `@tanstack/react-query` for server state and API caching
- [ ] Use `zustand` for client/UI state where local component state is not enough
- [ ] Use Tailwind CSS only for styling
- [ ] Build small custom reusable components as needed (no UI component libraries)
- [ ] Use Conventional Commits for every commit
- [ ] Install and configure Husky to enforce commit standards
- [ ] Do not use auto-commits; commit manually per completed step

## Step 1 - Project Foundation and Tooling

- [x] Add core dependencies:
  - [x] `@tanstack/react-query`
  - [x] `zustand`
  - [x] `json-server`
  - [x] `recharts`
  - [x] `zod` (form validation)
  - [x] testing stack (`@playwright/test`)
- [x] Add scripts for app + mock API (separate processes)
- [x] Set up folder structure for app routes, components, hooks, store, lib, types
- [x] Set up Husky + commit-msg hook (Conventional Commits)
- [x] Add commit linting setup (if used) for commit message validation

## Step 2 - Mock API and Seed Data

- [ ] Create `db.json` with:
  - [ ] 500+ `spaces`
  - [ ] 20-30 `bookings`
  - [ ] `saved` collection
- [ ] Ensure realistic value variety (city/category/price/capacity/rating/amenities)
- [ ] Add typed API client utilities and endpoint helpers
- [ ] Verify `json-server` endpoints match requirements
- [ ] Commit: `feat(data): add json-server dataset and typed api utilities`

## Step 3 - App Shell and Routing

- [ ] Create route pages:
  - [ ] `/login`
  - [ ] `/register`
  - [ ] `/discovery`
  - [ ] `/saved`
  - [ ] `/dashboard`
  - [ ] `/bookings`
- [ ] Create shared layout/sidebar shell for authenticated area
- [ ] Add placeholders for loading/empty/error states
- [ ] Commit: `feat(shell): add app routing and authenticated layout scaffold`

## Step 4 - Authentication (Single Commit)

- [x] Build Login page:
  - [x] email/password fields
  - [x] show/hide password toggle
  - [x] remember me
  - [x] forgot password toast
  - [x] social login buttons (UI only, guest login behavior)
  - [x] inline validation errors
- [x] Build Register page:
  - [x] required fields
  - [x] password length + match validation
  - [x] inline validation errors
- [x] Implement mock session storage logic (`localStorage` / `sessionStorage`)
- [x] Add protected route guard and redirect behavior
- [x] Add sidebar user info + logout
- [ ] Commit: `feat(auth): implement mock auth flow with protected routes`

## Step 5 - Discovery Search and Filter Engine

- [ ] Fetch spaces with React Query
- [ ] Implement full-text debounced search (name/location/description)
- [ ] Implement AND-composed filters:
  - [ ] category (multi-select)
  - [ ] city (multi-select)
  - [ ] dynamic price range
  - [ ] capacity min-max
  - [ ] amenities (multi-select)
  - [ ] minimum rating
  - [ ] availability date (or clearly marked optional)
- [ ] Add active filter chips and clear-all behavior
- [ ] Add live result count
- [ ] Commit: `feat(discovery): implement search and composed filters`

## Step 6 - URL State Synchronization

- [ ] Serialize filter/search/sort state to URL query params
- [ ] Deserialize URL query params into initial UI state
- [ ] Keep URL as source of truth for filters
- [ ] Ensure refresh/shareable links preserve state
- [ ] Commit: `feat(filters): sync discovery state with url query params`

## Step 7 - Discovery Grid, Sorting, and Virtualization

- [x] Build responsive space card grid
- [x] Add sorting (price asc/desc, rating, capacity, newest)
- [x] Implement save/unsave toggle wiring
- [ ] Add virtualization for 500+ items (`@tanstack/react-virtual`)
- [x] Add robust loading/empty/error states
- [ ] Commit: `feat(discovery): add virtualized results grid and sorting`

## Step 8 - Saved Collection

- [x] Show saved spaces grid
- [x] Add search within saved
- [x] Add saved filters (category/city)
- [x] Add remove-from-saved behavior
- [x] Add empty state with CTA to discovery
- [ ] Commit: `feat(saved): implement saved collection page and interactions`

## Step 9 - Dashboard Overview

- [ ] Create stats cards with trend indicators
- [ ] Build activity chart using Recharts
- [ ] Add upcoming bookings list with status badges
- [ ] Commit: `feat(dashboard): add overview metrics and activity chart`

## Step 10 - Bookings Table

- [ ] Build bookings table with required columns
- [ ] Add search, status/date filters, and sorting
- [ ] Add sticky header
- [ ] Add row selection with filtered select-all behavior
- [ ] Add bulk cancel via PATCH per selected booking
- [ ] Add CSV export
- [ ] Add loading/empty/error + retry states
- [ ] Commit: `feat(bookings): implement searchable sortable bookings table with bulk actions`

## Step 11 - Tests

- [ ] Add unit tests for:
  - [ ] filter composition logic
  - [ ] sort logic
  - [ ] URL param serialize/deserialize
  - [ ] at least one custom hook
- [ ] Ensure tests run cleanly in CI/local
- [ ] Commit: `test(core): add unit tests for filters sorting url-state and hooks`

## Step 12 - Documentation and Final Polish

- [ ] Replace starter README with assignment-specific documentation:
  - [ ] setup and run instructions (app + json-server)
  - [ ] testing instructions
  - [ ] architecture overview
  - [ ] server/client component boundary rationale
  - [ ] filter URL state design rationale
  - [ ] virtualization choice rationale
  - [ ] trade-offs
  - [ ] prioritized future improvements
  - [ ] time spent
- [ ] Validate lint + tests + build
- [ ] Commit: `docs(readme): document architecture decisions and setup`

## Optional Final Step - Deployment

- [ ] Deploy app (Vercel/Netlify)
- [ ] Add live URL to README
- [ ] Commit: `chore(deploy): add production deployment link`
