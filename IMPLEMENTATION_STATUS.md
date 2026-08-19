# Movie Search Application - Implementation Status

Last updated: 2026-08-17

This document tracks completed work, verification evidence, and remaining work across the assignment iterations. The repository and this file are the source of truth for implementation progress.

## Status Summary

| Iteration | Scope | Status |
| --- | --- | --- |
| 1 | Repository analysis and architecture | Complete |
| 2 | Backend foundation and database | Complete |
| 3 | Search and details API | Complete |
| 4 | React application | Complete |
| 5 | Full-stack integration | Complete |
| 6 | Automated testing review | Complete |
| 7 | Docker and developer experience | Complete |
| 8 | Senior code review | Complete |

## Completed Work

### Iteration 1 - Analysis and Architecture

- Inspected the initial repository, which contained only `README.md`, `.gitignore`, and Git metadata.
- Verified the local toolchain: .NET 10, Node.js 24, npm 11, Docker Engine, and Docker Compose.
- Selected a modular ASP.NET Core API with a service layer, EF Core, PostgreSQL, React, Redux Toolkit, RTK Query, and MUI.
- Defined the relational model, REST contracts, frontend component boundaries, testing strategy, Docker strategy, and implementation sequence.

### Iteration 2 - Backend Foundation

- Created the .NET 10 solution and ASP.NET Core controller project.
- Added EF Core 10, the Npgsql provider, OpenAPI, Problem Details, health checks, and dependency injection.
- Added `Movie`, `Genre`, `Actor`, and explicit `MovieActor` entities.
- Configured the one-to-many movie/genre relationship and many-to-many movie/actor relationship.
- Added PostgreSQL `pg_trgm` support and GIN trigram indexes for movie titles and actor names.
- Added a unique genre-name index and foreign-key indexes.
- Added deterministic seed data with 9 movies, 5 genres, 15 actors, and 20 cast relationships.
- Added and verified the `InitialCreate` EF Core migration.
- Verified every seeded movie has at least one actor.
- Added repository-local `dotnet-ef` tooling.
- Added the `/health` endpoint and development OpenAPI document.

### Iteration 3 - Search and Details API

- Added validated search request and response DTOs without exposing EF Core entities.
- Added `IMovieService` and `MovieService` as the business/query layer.
- Added database-side, case-insensitive partial filtering by title, genre, and actor.
- Added support for title, genre, actor, every two-criterion combination, all three criteria, and empty criteria.
- Added parameterized `ILIKE` predicates, actor `EXISTS` filtering, SQL wildcard escaping, `AsNoTracking`, and DTO projections.
- Added `GET /api/movies?title=&genre=&actor=` for movie search.
- Added `GET /api/movies/{id}` for movie details and ordered cast data.
- Added automatic validation responses, explicit not-found Problem Details, and cancellation-token propagation.
- Added restricted CORS configuration for the local Vite origin at `http://localhost:5173`.
- Added PostgreSQL-backed integration tests using xUnit, `WebApplicationFactory`, and Testcontainers.
- Added coverage for all search combinations, empty criteria, no results, literal wildcard handling, details, invalid input, missing movies, and CORS.
- Updated the checked-in API request examples.

### Iteration 4 - React Application

- Created a Vite 8, React 19, and TypeScript 6 frontend with ESLint.
- Added MUI 9, Emotion, Redux Toolkit, React Redux, RTK Query, Lucide icons, and locally bundled variable fonts.
- Added shared TypeScript contracts matching the backend search, summary, details, actor, and Problem Details DTOs.
- Added a dedicated RTK Query API service with configurable `VITE_API_BASE_URL`, typed hooks, filtered query parameters, caching, and consistent error extraction.
- Added a Redux slice for draft criteria, submitted criteria, clear/reset behavior, and selected movie state.
- Added typed Redux store hooks and root provider configuration.
- Added a responsive MUI theme and application shell with accessible semantic landmarks.
- Added Redux-controlled title, genre, and actor fields with backend-aligned maximum lengths.
- Added search and clear actions without page navigation or reloads.
- Added same-page loading, error, empty, results, selection, details-loading, details-error, and movie-details states.
- Added responsive results and ordered cast details with keyboard-selectable result rows.
- Added a Vite `/api` development proxy and `.env.example` API base URL override.
- Added focused Vitest, Testing Library, and MSW tests for Redux behavior and the search workflow.
- Removed all unused Vite demo UI and assets.
- Split results and details into lazy chunks, reducing the initial production application chunk below Vite's warning threshold.
- Verified initial and populated layouts in a real browser at 1440x900 and 390x844 with no horizontal overflow or incoherent overlap.

### Iteration 5 - Full-Stack Integration

- Ran PostgreSQL 17, the ASP.NET Core API, and the Vite React application together.
- Applied the checked-in migration to the live integration database and verified all seed counts and actor relationships.
- Verified API health, combined search, details, empty criteria, no results, and CORS directly over HTTP.
- Verified the Vite `/api` proxy communicates with the real ASP.NET Core API and PostgreSQL database.
- Verified title, genre, actor, all two-criterion combinations, all three criteria, empty criteria, and no-results through the real browser workflow.
- Verified case-insensitive partial matching through lowercase browser input.
- Verified details selection, release date, ordered cast, selected-row state, stable page URL, and clear/reset behavior.
- Verified populated mobile results and details stack in source order with no horizontal overflow.
- Verified the real API-unavailable state exits loading and displays a recoverable error without navigating away.
- Fixed unchanged-criteria retry behavior by making explicit submissions trigger the RTK Query lazy query with a Redux search revision.
- Added a regression assertion proving a failed request can be retried successfully with unchanged criteria.
- Reverified live recovery without a page reload after restarting the API.

### Iteration 6 - Automated Testing Review

- Reviewed backend, frontend, Redux, API-layer, accessibility, and test-infrastructure coverage for meaningful gaps.
- Expanded backend coverage for trimmed combined criteria and all PostgreSQL LIKE escape characters: `%`, `_`, and backslash.
- Added API-level empty-criteria and deterministic ordering coverage.
- Added validation tests for every query parameter both at and above its maximum length.
- Added trusted and untrusted CORS-origin coverage.
- Added health endpoint coverage.
- Added cancellation-token propagation coverage for search and details database operations.
- Expanded frontend Redux coverage for repeated explicit-search revisions.
- Added deterministic controlled-request tests for search and details loading states without timing-dependent sleeps.
- Added details-error recovery coverage when selecting another movie.
- Added clear-during-request coverage to prevent stale result restoration.
- Added browser-level maximum-length tests aligned with backend validation.
- Added centralized API error fallback tests.
- Added axe-core semantic accessibility checks for initial and populated states.
- Fixed a serious accessibility defect found by axe: the results `ul` now contains semantic `li` elements around each interactive result.
- Added and enforced frontend coverage thresholds across application source files.
- Deferred persistent Playwright end-to-end tests until Iteration 7, when Docker Compose provides the canonical repeatable stack.

### Iteration 7 - Docker and Developer Experience

- Added multi-stage .NET 10 API and Node 24 frontend Dockerfiles.
- Added unprivileged ASP.NET Core and Nginx runtime containers with health checks.
- Added Nginx SPA fallback, same-origin `/api` proxying, compression, and security headers.
- Added a three-service Docker Compose stack with PostgreSQL 17, health-gated startup ordering, loopback-only published ports, restart policies, and a persistent named volume.
- Added opt-in API startup migrations for the single-instance Compose deployment while keeping local/test migration ownership explicit.
- Added root and frontend environment examples without production secrets.
- Added backend and frontend Docker ignore files with minimal build contexts.
- Added persistent Playwright desktop and mobile Chromium tests targeting the Compose stack.
- Added Playwright scripts and synchronized the npm lockfile.
- Replaced the placeholder README with comprehensive overview, architecture, stack, database, API, frontend, local setup, Docker, migration, testing, design decision, assumption, security, and troubleshooting documentation.
- Verified image builds, clean production logs, unprivileged runtime users, security headers, same-origin proxying, migration/seed data, and all service health checks.
- Verified `docker compose down` followed by `up --wait --no-build` preserves the volume and starts successfully.

### Iteration 8 - Senior Code Review

- Reviewed backend architecture, EF Core queries, validation, status codes, error handling, cancellation, logging, CORS, startup migrations, and secret handling.
- Reviewed React architecture, TypeScript contracts, Redux ownership, RTK Query behavior, loading/error recovery, accessibility, responsiveness, and bundle splitting.
- Reviewed PostgreSQL schema, relationships, migration synchronization, indexes, seed guarantees, and database-side filtering.
- Reviewed Docker build contexts, image sizes, runtime users, health checks, Nginx proxying, security headers, environment defaults, startup ordering, persistence, and logs.
- Reviewed backend, frontend, coverage, accessibility, browser E2E, and dependency-audit strategy.
- Reviewed README accuracy against the tested local and Compose workflows.
- Added deployment CORS guidance, health-response documentation, Playwright instructions, and operational troubleshooting.
- Strengthened the local-only credential warning in `.env.example`.
- Fixed Vitest discovery so Playwright specifications remain isolated from the unit/integration suite.
- Confirmed no committed secrets or real `.env` file, no pending migration, no diagnostics, and no generated test artifacts in repository scope.
- Confirmed all assignment acceptance criteria are satisfied.

## Verification Evidence

- Backend Release build succeeds without warnings.
- All 17 backend tests pass against PostgreSQL 17.
- EF Core reports no pending model changes.
- The migration applies successfully and seed counts match expectations.
- .NET formatting verification passes.
- VS Code reports no backend diagnostics.
- NuGet reports no known vulnerabilities in production or test dependencies.
- Testcontainers removes its temporary resources after test execution.
- Frontend production build succeeds without warnings.
- All 6 frontend tests pass.
- Frontend ESLint verification passes.
- npm reports no known vulnerabilities in runtime or development dependencies.
- VS Code reports no frontend diagnostics.
- Desktop and mobile browser checks confirm responsive layout containment.
- Live integration database contains 9 movies, 5 genres, 15 actors, 20 cast links, zero movies without actors, and one applied migration.
- All 9 required browser search scenarios pass through React, the Vite proxy, ASP.NET Core, EF Core, and PostgreSQL.
- Live details, clear/reset, API failure, unchanged-criteria recovery, and mobile stacking checks pass.
- Post-integration frontend lint, all 6 frontend tests, and the production build pass.
- Post-integration backend Release suite passes all 17 tests.
- Backend Release suite now passes all 30 tests against PostgreSQL 17.
- Backend core coverage: `MovieService` and `MoviesController` are 100% line and branch covered; startup is 96.87% line covered.
- Frontend suite now passes all 16 tests across Redux, API normalization, page behavior, error recovery, and accessibility.
- Frontend enforced coverage is 100% statements, 100% lines, 100% functions, and 93.33% branches.
- Frontend axe-core scans pass for initial and populated application states; real-browser visual checks continue to cover contrast and layout.
- Compose builds both application images and starts all three services healthy in approximately 18 seconds after images are available.
- API runs as UID 1654 and Nginx runs as UID 101.
- Nginx sends `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`.
- Production API and frontend logs contain no warnings, failures, errors, or exceptions during verified workflows.
- All 4 Playwright desktop/mobile tests pass against the Compose stack.
- Persistent-volume restart retains 9 movies, 20 cast links, and one applied migration.
- Final Compose browser check returns HTTP `200` for search and details with zero console errors.
- Final Nginx/API logs contain no warning, failure, error, or exception entries.
- Final dependency audits report zero known npm or NuGet vulnerabilities.
- Final EF check reports no model changes since the last migration.

## Iteration 4 Checklist

- [x] Scaffold the Vite React and TypeScript application.
- [x] Add Redux Toolkit, RTK Query, and typed store hooks.
- [x] Add the typed API service and configurable API base URL.
- [x] Add the search criteria and selected-movie Redux state.
- [x] Add the responsive MUI application shell and theme.
- [x] Add title, genre, and actor search controls.
- [x] Add search and clear actions.
- [x] Add loading, error, empty, and result states.
- [x] Add the same-page movie details view.
- [x] Add focused frontend tests.
- [x] Verify frontend lint, tests, and production build.

## Optional Future Enhancements

The assignment acceptance scope is complete. Potential future work for a larger production deployment includes pagination, authentication and authorization, CI-hosted Playwright execution, database failover/load testing, structured observability, and a dedicated migration job for multiple API replicas.

## Acceptance Criteria Tracker

- [x] Backend builds successfully.
- [x] Frontend builds successfully.
- [x] Database migrations work.
- [x] Seed data works.
- [x] Title searches work.
- [x] Genre searches work.
- [x] Actor searches work.
- [x] Combined searches work.
- [x] Empty criteria are handled correctly by the API.
- [x] No-result searches are handled correctly by the API.
- [x] Movie details are available through the API.
- [x] Movie details can be displayed in the frontend.
- [x] Search results appear below the form without a full page reload.
- [x] Redux Toolkit is used for appropriate application state.
- [x] React uses functional components only.
- [x] API calls are separated from UI components.
- [x] Frontend loading, error, empty, and details states are implemented.
- [x] Backend automated tests pass.
- [x] Frontend automated tests pass.
- [x] Full-stack integration is verified.
- [x] Docker startup is verified.
- [x] Comprehensive README documentation is complete.
- [x] No secrets are committed.
- [x] Source comments and existing documentation are in English.

## Established Decisions and Assumptions

- A movie has one primary genre because the required model names a singular `Genre`; actors use the required many-to-many relationship.
- Empty search criteria return all movies.
- Non-empty criteria are combined with AND semantics.
- Partial matching is case-insensitive, and SQL wildcard characters supplied by users are treated literally.
- Search results are ordered by title and release date.
- PostgreSQL is the primary relational database and integration-test database.
- A repository layer is intentionally omitted because EF Core already provides the required unit-of-work and query abstractions.
- The frontend uses RTK Query as the dedicated HTTP/cache layer and a small Redux slice for criteria and selection state.