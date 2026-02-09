# Intent Expense Tracker

A serverless expense tracker built with the 50/30/20 budgeting rule. Track your income and expenses while maintaining a healthy financial balance between needs, wants, and savings.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, shadcn/ui, Tailwind CSS
- **Backend:** Cloudflare Workers, Hono, Better Auth
- **Database:** Neon Postgres, Drizzle ORM
- **Validation:** Zod
- **Deployment:** Cloudflare Pages (web) + Cloudflare Workers (api)

## Project Structure

```
├── apps/
│   ├── api/                # Cloudflare Workers API
│   └── web/                # Next.js frontend
├── packages/
│   ├── shared/             # Shared schemas and types
│   ├── eslint-config/      # Shared ESLint configs
│   └── typescript-config/  # Shared TS configs
└── infra/                  # Infrastructure definitions
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) package manager
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (for deployment)
- [Neon database](https://neon.tech/) (for Postgres)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local files with your credentials

# Run database migrations
pnpm --filter=api db:push
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Or run individually
pnpm dev --filter=web    # Frontend only (http://localhost:3000)
pnpm dev --filter=api    # API only (http://localhost:8787)
```

### Build

```bash
# Build all packages and apps
pnpm build

# Build specific app
pnpm build --filter=web
pnpm build --filter=api
```

### Database Commands

```bash
# Generate migrations
pnpm --filter=api db:generate

# Push schema changes
pnpm --filter=api db:push

# Open Drizzle Studio
pnpm --filter=api db:studio

# Seed data
pnpm --filter=api db:seed
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |

## Environment Variables

### API (`apps/api/.env.local`)

```bash
DATABASE_URL=postgres://user:pass@neon.tech/db?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:8787
```

### Web (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Deployment

```bash
# Deploy API to Cloudflare Workers
pnpm --filter=api deploy

# Deploy Web to Cloudflare Pages
pnpm --filter=web deploy
```

## Learn More

- [Turborepo Documentation](https://turbo.build)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team)
