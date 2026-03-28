# Selma

Monorepo powered by Bun workspaces.

## Apps

| App | Path | Description | Port |
|-----|------|-------------|------|
| `@selma/web` | `apps/web` | Next.js frontend with Tailwind CSS and shadcn/ui | 3000 |
| `@selma/api` | `apps/api` | Node.js backend with Express | 3001 |

## Prerequisites

- [Bun](https://bun.sh) v1.1+

## Getting Started

```bash
# Install dependencies
bun install

# Start all apps in development
bun run dev

# Start individual apps
bun run dev:web
bun run dev:api
```

## Scripts

```bash
bun run dev       # Start all apps
bun run dev:web   # Start frontend only
bun run dev:api   # Start backend only
bun run build     # Build all apps
bun run lint      # Lint all apps
```

## Project Structure

```
selma/
├── apps/
│   ├── web/          # Next.js + Tailwind CSS + shadcn/ui
│   └── api/          # Express + TypeScript
└── packages/         # Shared packages
```
