# Agent Guidelines - Expense Tracker

## Project Overview

Turborepo monorepo for a serverless expense tracker implementing the 50/30/20 rule.

Tech Stack

- Frontend: Next.js 16 (App Router), React 19, shadcn/ui, Tailwind CSS
- Backend: Cloudflare Workers, Hono, Better Auth
- Database: Neon Postgres, Drizzle ORM
- Validation: Zod (shared schemas in packages/shared)
- Deployment: Cloudflare Pages (web) + Cloudflare Workers (api)

## Commands

Root (run from repo root)

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev (all apps)
pnpm build            # Build all apps
pnpm lint             # Lint all packages
pnpm check-types      # Type check all packages
pnpm format           # Prettier write
```

Package-level

```bash
# apps/web (Next.js)
pnpm dev              # :3000
pnpm build
pnpm lint
pnpm check-types

# apps/api (Workers)
pnpm dev              # Wrangler dev
pnpm deploy
pnpm db:generate      # Drizzle migrations
pnpm db:push          # Push to database
pnpm db:studio        # Drizzle Studio
pnpm db:seed          # Seed data
pnpm cf-types         # Generate bindings types
pnpm check-types

# packages/shared
pnpm lint
pnpm check-types
```

Turbo filters

```bash
turbo build --filter=web
turbo dev --filter=api
turbo lint --filter=@repo/shared
```

Testing

- No test runner configured in this repo.
- Single-test command: N/A until a test framework is added.
- Manual checks: run dev servers and verify flows in web + api.

## Code Style Guidelines

TypeScript

- Strict mode; no implicit any.
- Use optional chaining for array/object access (`noUncheckedIndexedAccess`).
- ESM only (`type: "module"`).
- File extensions: `.ts` for modules, `.tsx` for React components.

Imports

- Prefer named imports.
- Zod must be `import { z } from "zod"`.
- Order: external packages → internal workspace packages → relative.
- Workspace packages: `@repo/shared`, `@repo/eslint-config`, `@repo/typescript-config`.

Formatting

- Semicolons required.
- 2-space indentation.
- 100 char soft limit.
- Trailing commas in multi-line objects/arrays.
- Double quotes in Zod schemas and JSX; single quotes OK elsewhere.

Naming

- Files: kebab-case (`financial-profile.ts`).
- React components: PascalCase.
- Variables/functions: camelCase.
- Types/interfaces: PascalCase.
- Constants: SCREAMING_SNAKE_CASE.
- Zod schemas: camelCase ending in `Schema`.
- Enums: camelCase ending in `Enum`.

Zod schemas (packages/shared)

- Export both schema and inferred type.
- Use `z.enum()` for string unions.
- Provide friendly error messages.
- Use `.refine()` for cross-field validation.

Error handling

- API responses: proper HTTP status codes (400/401/404/500).
- Never leak raw DB errors to clients.
- Validate all inputs with Zod on both frontend and backend.
- Prefer async/await; wrap async work in try/catch.

Database (Drizzle/Neon)

- Money: Postgres `numeric` (never float/int).
- Primary keys: `uuid`.
- Timestamps: `timestamp` with `.defaultNow()`.
- Scope all queries by `userId`.
- Never edit applied migrations; always create new ones.
- Use Neon HTTP driver in Workers.

React/Next.js

- Default to server components; use `"use client"` when needed.
- Colocate page-specific components with the route.
- Use shadcn/ui components for UI primitives.
- Mobile-first Tailwind; test 375px viewport.
- Accessibility: 44px min touch targets, proper ARIA labels.

Cloudflare Workers

- Stateless functions only.
- No direct DB access from frontend; always via API.
- Keep handlers fast; avoid long-running work.

## Security and Data Integrity

- Never commit secrets or `.env` files.
- Never expose database connection strings to clients.
- All data access must be scoped to authenticated user ID.
- Percentages in financial profiles must sum to 100%.
- Apply migrations in order: dev → preview → prod.

## Environment Variables

```bash
# apps/api/.env.local
DATABASE_URL=postgres://...@neon.tech/db?sslmode=require
BETTER_AUTH_SECRET=<min-32-chars-random-string>
BETTER_AUTH_URL=http://localhost:8787

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Cursor/Copilot Rules

- No .cursor rules or Copilot instructions found in this repo.

## Notes for Agents

- Follow existing patterns in the codebase; keep changes minimal.
- Prefer simple, explicit code over clever abstractions.
- Avoid editing unrelated files.
