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

## Enrollment integration (NATS / benefit-store)

This service is the **admin dashboard** side of the enrollment flow. The **benefit-store
enrollment API** (`../benefit-store-api-boilerplate`) owns enrollment applications and emits
events over NATS JetStream; we **consume** them, project them into our Postgres `enrollments`
table, and let admins **publish two events back**. The authoritative schema is
[`benefit-store-api-boilerplate/NATS_EVENT_CONTRACT.md`](../benefit-store-api-boilerplate/NATS_EVENT_CONTRACT.md).

```
benefit-store-api ──initiated / submitted──▶  NATS (NUERA_ENROLLMENT)  ──▶ EnrollmentConsumer ──▶ enrollments table
                                                                                                        │
   benefit-store-api  ◀──document-received / support-requested──  NatsEventPublisher  ◀── admin action (REST)
```

### Events

| Direction   | Subject / type                             | Payload (`data`)                                              |
| ----------- | ------------------------------------------ | ------------------------------------------------------------- |
| **Consume** | `enrollment.application.initiated`         | `{ enrollmentId, planId, applicantId, initiatedAt }`          |
| **Consume** | `enrollment.application.submitted`         | `{ enrollmentId, referenceNumber, applicantId, submittedAt }` |
| **Publish** | `enrollment.application.document-received` | `{ enrollmentId, documentType, receivedAt }`                  |
| **Publish** | `enrollment.application.support-requested` | `{ enrollmentId, requestedBy, requestedAt, message }`         |

All messages use the CloudEvents 1.0 envelope (`specversion, id, source, type, datacontenttype,
time, correlationid, data`). Stream `NUERA_ENROLLMENT`, subjects `enrollment.application.*`,
durable consumer `admin-dashboard`, explicit ack, `max_deliver: 5`.

### Where it lives

| Concern               | File                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Inbound consumer      | `src/adapters/driving/messaging/enrollment.consumer.ts`                                      |
| Projection commands   | `src/core/application/enrollment/record-initiated.command.ts`, `record-submitted.command.ts` |
| Outbound actions      | `request-document.command.ts`, `request-support.command.ts`                                  |
| Domain + events       | `src/core/domain/enrollment/enrollment.entity.ts`, `enrollment-events.ts`                    |
| NATS connection / pub | `src/adapters/driven/nats/nats.client.ts`, `nats-event.publisher.ts`                         |
| REST surface          | `src/adapters/driving/http/enrollment/enrollment.controller.ts`                              |

### REST surface (`/v1/enrollments`, roles: `admin`, `enrollment-manager`)

| Method | Path                                | Action                                                 |
| ------ | ----------------------------------- | ------------------------------------------------------ |
| `GET`  | `/enrollments`                      | List (paginated; `search`, `status` filters)           |
| `GET`  | `/enrollments/:id`                  | Get one                                                |
| `POST` | `/enrollments/:id/documents`        | Mark document received → publishes `document-received` |
| `POST` | `/enrollments/:id/support-requests` | Request support → publishes `support-requested`        |

### Local NATS

The benefit-store API owns the `NUERA_ENROLLMENT` stream; for a standalone spin-up the
`NatsClient` creates the stream + durable consumer if missing:

```bash
docker run -p 4222:4222 -p 8222:8222 nats -js
```

Configure via `NATS_*` in `.env` (see `.env.example`). `pnpm prisma:seed` inserts sample
enrollment rows so the dashboard isn't empty without a live broker.

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
