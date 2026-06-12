# Architecture

This boilerplate combines **Hexagonal (Ports & Adapters)**, **Onion**, **DDD**, **SOA**, and **Event-Driven** styles into one consistent layering. They describe the same shape from different angles — do not duplicate layers.

---

## 1. The dependency rule (most important thing)

Code on an outer layer may depend on code on an inner layer. **Inner layers must never depend on outer layers.**

```mermaid
flowchart LR
  subgraph Outer["adapters / infrastructure"]
    Adapters["adapters/driving · adapters/driven"]
    Infra["infrastructure (DI wiring, main.ts, config)"]
  end
  subgraph Middle["application"]
    Ports["ports (interfaces)"]
    UseCases["use cases / CQRS handlers"]
  end
  subgraph Inner["domain"]
    Entities["entities · value objects"]
    Events["domain events"]
    Rules["invariants / business rules"]
  end

  Infra --> Adapters --> UseCases --> Entities
  UseCases --> Ports
  Adapters -. implements .-> Ports
```

What this buys you:

- **Testability** — domain & application can be tested with no infrastructure.
- **Swappability** — Prisma → another ORM, local publisher → any broker (NATS, SQS, Kafka…), REST → gRPC, all without touching business logic.
- **Boundary enforcement is automatic** — `eslint-plugin-boundaries` in `.eslintrc.cjs` fails CI on a forbidden import.

---

## 2. Layers in detail

### `src/core/domain/` — the business heart

Pure TypeScript. **Zero** decorators from NestJS, Prisma, Swagger, or class-validator.

- **Aggregate roots** extend `AggregateRoot`, expose state via readonly getters, validate invariants in static `create()` factories, and emit domain events.
- **Value objects** extend `ValueObject<TProps>`, are immutable, and define equality structurally.
- **Domain events** extend `DomainEvent<T>` and follow the **CloudEvents 1.0** shape (`id`, `source`, `type`, `specversion`, `time`, `datacontenttype`, `data`).
- **Exceptions** follow a KISS hierarchy: `BaseException` → `DomainException` { `ValidationException`, `BusinessRuleException`, `EntityNotFoundException` } / `ApplicationException` / `InfrastructureException`.

### `src/core/application/` — orchestration

- **Ports** are interfaces declared from the use case's point of view:
  - _Outbound ports_ — repository, event publisher, external service gateways.
  - _Inbound ports_ — the use case itself, called by a driving adapter.
- **CQRS** separates writes from reads from day one:
  - `<Verb>Command` + `<Verb>CommandHandler` for writes.
  - `<Noun>Query` + `<Noun>QueryHandler` for reads.
  - `@EventsHandler(<DomainEvent>)` for in-process side effects.

### `src/adapters/` — the outside world

- `driving/http/<feature>/` — controllers, request/response DTOs, Swagger decorators. Controllers **translate** HTTP into CQRS messages; they do not contain business logic.
- `driven/prisma/` — repository implementations against Postgres.
- `driven/local/` — no-op `LocalEventPublisher`. Swap for a real broker adapter (NATS, SQS, Kafka…) by implementing `IEventPublisher` and rebinding the `EVENT_PUBLISHER` token.
- `driven/legacy/` (add when needed) — anti-corruption HTTP clients that wrap legacy APIs as SDKs behind a port. Domain never touches them directly.

### `src/common/` — framework-aware utilities

Cross-cutting Nest pieces with no business semantics: `AllExceptionsFilter`, `ResponseTransformInterceptor`, `LoggingInterceptor`, `CorrelationIdMiddleware`, `JwtAuthGuard`, `RolesGuard`, decorators.

### `src/infrastructure/` — composition

Zod-validated config, the root `AppModule`, feature modules wiring CQRS handlers, `main.ts` (server) and `lambda.ts` (handler).

---

## 3. Request lifecycle

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant MW as CorrelationId<br/>Middleware
  participant G1 as JwtAuthGuard
  participant G2 as RolesGuard
  participant Ctrl as Controller
  participant Bus as CommandBus / QueryBus
  participant Handler as Handler (use case)
  participant Dom as Domain (Resource)
  participant Repo as PrismaRepository
  participant Pub as NatsEventPublisher
  participant Int as ResponseInterceptor
  participant F as AllExceptionsFilter

  C->>MW: HTTP request
  MW->>G1: + x-correlation-id
  G1->>G1: jose.jwtVerify(token, JWKS)
  G1->>G2: req.user
  G2->>Ctrl: roles match @Roles()
  Ctrl->>Bus: execute(Command)
  Bus->>Handler: handle
  Handler->>Dom: Resource.create()
  Handler->>Repo: save(resource)
  Handler->>Pub: publishAll(events)
  Pub-->>Handler: ok
  Handler-->>Bus: result
  Bus-->>Ctrl: result
  Ctrl-->>Int: payload
  Int-->>C: { success, data, message, meta }

  Note over F: any thrown exception bypasses<br/>the interceptor and emits the<br/>standard error envelope.
```

---

## 4. CQRS — writes vs reads

```mermaid
flowchart LR
  HTTP[POST /v1/resources] --> CmdBus[CommandBus]
  CmdBus --> CmdH[CreateResourceCommandHandler]
  CmdH --> Aggregate[(Resource aggregate)]
  CmdH --> Repo[(PrismaResourceRepository)]
  CmdH --> EvBus[CQRS EventBus]
  EvBus --> InProc[ResourceCreatedHandler<br/>in-process side effects]
  CmdH --> Outbound[NatsEventPublisher → JetStream]

  HTTPq[GET /v1/resources] --> QBus[QueryBus]
  QBus --> QH[ListResourcesQueryHandler]
  QH --> Repo
```

**Why both an in-process EventBus and an external publisher?** They have different jobs: the EventBus is cheap, synchronous, and stays inside the process (audit logs, cache busts, local projections). The `IEventPublisher` port is the integration event channel for other services — currently backed by `LocalEventPublisher` (logs only). Wire in a real broker (NATS, SQS, Kafka…) by implementing the port and rebinding `EVENT_PUBLISHER`. Production deployments should use the **transactional outbox** pattern for at-least-once delivery — the `OutboxEvent` Prisma model is included for that.

---

## 5. Event flow with transactional outbox

```mermaid
sequenceDiagram
  participant H as CommandHandler
  participant Tx as prisma.$transaction
  participant DB as Postgres
  participant D as OutboxDispatcher<br/>(scheduled)
  participant Broker as Message Broker<br/>(NATS / SQS / Kafka)
  participant Sub as Subscriber service

  H->>Tx: begin
  Tx->>DB: insert/update business row
  Tx->>DB: insert outbox_events row
  Tx-->>H: commit
  Note over H: response returned to client
  D->>DB: SELECT publishedAt IS NULL
  D->>Broker: publish(event.type, CloudEvent)
  D->>DB: UPDATE publishedAt = now()
  Broker-->>Sub: at-least-once delivery
  Sub->>Sub: idempotent handler<br/>(retry + DLQ)
```

---

## 6. Auth flow (Keycloak SSO)

```mermaid
sequenceDiagram
  participant U as Browser (frontend-web)
  participant K as Keycloak (hosted login)
  participant A as nest-api
  participant JWKS as Keycloak JWKS

  U->>K: redirect to hosted login (PKCE)
  U->>K: credentials
  K-->>U: authorization code → token
  U->>A: GET /v1/resources<br/>Authorization: Bearer <jwt>
  A->>JWKS: fetch keys (cached, rotated)
  A->>A: jose.jwtVerify(token, jwks, { issuer })
  A->>A: req.user = { id, roles[] }
  A-->>U: 200 { success, data, … }

  Note over A: service-to-service uses<br/>client_credentials grant with<br/>each service's own client_id/secret.
```

---

## 7. Deployment topology

```mermaid
flowchart TB
  subgraph LocalDev["Local (primary path)"]
    DC[Docker Compose] --> API1[nest-api container]
    DC --> PG1[Postgres]
    DC --> R1[Redis]
    ExtKC[Keycloak API<br/>hosted externally] -. KEYCLOAK_* env vars .-> API1
  end

  subgraph Cloud["Production"]
    LB[Load Balancer / API Gateway] --> FN[nest-api — serverless-express or container]
    FN --> RDS[(RDS Postgres)]
    ExtKCProd[Keycloak API<br/>hosted externally] -. KEYCLOAK_* from SSM .-> FN
  end

  LocalDev -. same code, different entrypoint .-> Cloud
```

`src/infrastructure/main.ts` (server) and `src/infrastructure/lambda.ts` (serverless-express) share the same `AppModule` — runtime-agnostic.

---

## 8. Folder map (canonical)

```
src/
├─ core/
│  ├─ domain/<feature>/       ← entities · VOs · events · exceptions (pure TS)
│  └─ application/
│     ├─ ports/               ← repository/event/gateway interfaces
│     └─ <feature>/           ← command + query handlers
├─ adapters/
│  ├─ driving/http/<feature>/ ← controller + DTOs (Swagger here only)
│  └─ driven/
│     ├─ prisma/              ← repos implementing ports
│     └─ local/               ← LocalEventPublisher (no-op; swap for real broker)
├─ common/                    ← filter · interceptor · guard · decorator · middleware
└─ infrastructure/            ← config · modules · main.ts · lambda.ts
```

---

## 9. ER diagram (example slice)

```mermaid
erDiagram
  RESOURCE {
    uuid id PK
    string name
    string description
    boolean active
    timestamp createdAt
    timestamp updatedAt
    timestamp deletedAt "nullable — soft delete"
    string createdBy
    string updatedBy
  }
  OUTBOX_EVENT {
    uuid id PK
    string eventType
    json payload
    string correlationId
    timestamp occurredAt
    timestamp publishedAt "nullable"
    int attempts
    string lastError
  }
```

The outbox table lives **with** the business data so writes and event records share one transaction.

---

## 10. Cross-cutting concerns and where they live

| Concern                  | Mechanism                                        | File                                                        |
| ------------------------ | ------------------------------------------------ | ----------------------------------------------------------- |
| Config validation        | Zod, fail-fast at boot                           | `src/infrastructure/config/env.ts`                          |
| Request correlation      | Middleware → `x-correlation-id` header           | `src/common/middleware/correlation-id.middleware.ts`        |
| Structured logging       | `nestjs-pino` JSON stdout                        | configured in `AppModule`                                   |
| Authentication           | JWKS local JWT verify via `jose`                 | `src/common/guards/jwt-auth.guard.ts`                       |
| Authorization            | Role match against JWT claims                    | `src/common/guards/roles.guard.ts`                          |
| Validation               | Global `ValidationPipe` + `class-validator` DTOs | `AppModule`                                                 |
| Response shape           | `ResponseTransformInterceptor`                   | `src/common/interceptors/response-transform.interceptor.ts` |
| Error handling           | `AllExceptionsFilter`                            | `src/infrastructure/filters/all-exceptions.filter.ts`       |
| Rate limiting            | `@nestjs/throttler`, configurable per-env        | `AppModule`                                                 |
| Security headers         | `helmet`                                         | `main.ts`                                                   |
| CORS                     | Per-env allowed origins                          | `main.ts`                                                   |
| API versioning           | URL `/v1`                                        | `main.ts`                                                   |
| Health                   | `GET /v1/health` (minimal liveness)              | `src/infrastructure/health/health.controller.ts`            |
| Tracing (off by default) | OpenTelemetry → OTLP/Honeycomb                   | env-gated                                                   |
| Error tracking           | Sentry, DSN-gated                                | `@sentry/nestjs`                                            |

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the step-by-step "add a new vertical slice" recipe.
