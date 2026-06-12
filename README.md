# `nest-api-boilerplate`

A production-grade, opinionated **NestJS** boilerplate for any nest backend service.
Hexagonal / DDD / CQRS / event-driven / onion, strict TypeScript, Prisma + PostgreSQL, Keycloak SSO, runtime-agnostic (normal server + container + AWS Lambda handler).

> **Replace** the nest `Resource` example aggregate with your real domain (Agent, Member, Plan, …) and adapt module/controller names. The architectural skeleton stays the same.

---

## Quickstart

Prerequisites: Node 20, pnpm 9, Docker.

```bash
cp .env.example .env
pnpm install
make dev


```

`make dev` brings up Postgres and Redis via Docker, runs Prisma migrations, and starts the API in watch mode on http://localhost:3000.

Keycloak is **external** — set `KEYCLOAK_*` variables in your `.env` file (see `.env.example`) before starting.

- API root → `http://localhost:3000/v1/health`
- Swagger UI → `http://localhost:3000/docs` (dev/staging only)
- Prisma Studio → `make studio`

---

## Scripts

| Command                       | Purpose                               |
| ----------------------------- | ------------------------------------- |
| `pnpm start:dev`              | Start with hot reload                 |
| `pnpm build`                  | Compile to `dist/`                    |
| `pnpm lint` / `pnpm lint:fix` | ESLint with zero warnings             |
| `pnpm typecheck`              | `tsc --noEmit`                        |
| `pnpm test:unit`              | Unit tests (mocked ports)             |
| `pnpm test:integration`       | Testcontainers Postgres + real repos  |
| `pnpm test:e2e`               | Supertest HTTP e2e                    |
| `pnpm prisma:migrate`         | Run migrations in dev                 |
| `pnpm prisma:seed`            | Seed with faker data                  |
| `pnpm openapi:generate`       | Emit `openapi.json`                   |
| `pnpm postman:generate`       | Convert OpenAPI to Postman collection |

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — how the hexagonal/DDD/CQRS layers fit together, the dependency rule, every cross-cutting concern, where to put what.
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — step-by-step guide for adding a new vertical slice or shared concern.
- **[docs/diagrams/](./docs/diagrams/)** — Mermaid diagrams (system, layers, request lifecycle, CQRS, events, auth, deployment, ERD, folder layout).

---

## Folder layout (high level)

```
src/
  core/
    domain/                 # entities, value objects, domain events, exceptions — pure TS
    application/
      ports/                # outbound/inbound port interfaces
      <feature>/            # commands, queries, handlers, use-cases
  adapters/
    driving/http/<feature>/ # controllers + DTOs (Swagger lives ONLY here)
    driven/
      prisma/               # repository implementations
      local/                # no-op event publisher (swap for a real broker when needed)
  common/                   # filters, interceptors, middleware, guards, decorators
  infrastructure/
    config/                 # Zod-validated env
    modules/                # feature modules wiring CQRS handlers
    health/
    main.ts                 # normal server entrypoint
    lambda.ts               # serverless-express handler
prisma/schema/              # multi-file Prisma schema
test/{unit,integration,e2e}
docs/diagrams/              # Mermaid + (when generated) SVG
```

---
