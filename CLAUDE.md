# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Overview

Bun workspaces monorepo: `packages/client` (React 19 + Vite + Tailwind + TanStack Query + React Router)
and `packages/server` (Bun + Express 5 + Prisma 7 on MySQL). Two pages:

- `/reviews`: `ReviewList` for product 4, with AI summary via Ollama `tinyllama`
- `/chat`: WonderWorld theme-park chatbot via OpenAI Responses API

## Commands (run from repo root unless noted)

- `bun run dev`: starts server (:3000, `bun --watch`) and client (:5173) via `index.ts` + concurrently
- `bun run setup`: install, `prisma migrate deploy`, seed
- `bun run db:seed`: re-seed sample products/reviews (`packages/server/prisma/seed.ts`; replaces reviews for products 1–4)
- `docker compose up -d`: local MySQL matching `.env.example` defaults
- `bun run format`: Prettier (single quotes, semicolons, 3-space indent, width 80)
- Client: `bun run build` (tsc -b + vite build), `bun run lint`

## Architecture (server)

`route.ts` → `controller/` (validation, Zod) → `services/` → `repositories/` (Prisma) and `llm/client.ts`.

- Prisma client is generated into `packages/server/generated/prisma` (committed); regenerate with `bunx prisma generate` after schema changes.
- Repositories build `PrismaMariaDb` adapters from split `DATABASE_*` env vars; the Prisma CLI uses `DATABASE_URL` (`prisma.config.ts`). Keep both in sync.
- Summaries are cached in `summaries` with a 7-day `expiresAt`.
- Chat conversation state (`previousResponseId`) is in-memory in `repositories/conversations.repository.ts`.
- Prompts live in `packages/server/llm/prompts/`.

## Client

- Pages in `src/pages/`, routes in `src/App.tsx`; components in `src/components/{chat,reviews,ui}`.
- `@/` alias points to `src/`.

## Secrets: important

- Real secrets live only in `packages/server/.env` (git-ignored, never committed). Never read out, print, or commit its values.
- When adding a new env var, add it with a placeholder to `packages/server/.env.example` and document it in README.
- Env var names are case-sensitive on Mac/Linux: use UPPER_CASE (e.g. `HF_TOKEN`).
- Before pushing, check: `git ls-files | grep -i env` should list only `.env.example`.
