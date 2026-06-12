# Contributing

Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** first. This file is the practical day-to-day guide.

---

## Add a new vertical slice (the canonical recipe)

You want to add a new bounded context — let's say `Agent`. Do these in order. Each step gives you a working green test before moving to the next.

### 1 · Model the aggregate (domain layer — pure TS)

Create `src/core/domain/agent/agent.entity.ts`:

```ts
import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '~/core/domain/example/aggregate-root.base';
import { AgentCreatedEvent } from '~/core/domain/agent/agent-events';
import { ValidationException } from '~/core/domain/example/exceptions';

export class Agent extends AggregateRoot {
  private constructor(
    id: string,
    private _email: string,
    private _active: boolean,
  ) {
    super(id);
  }

  static create(input: { email: string }): Agent {
    if (!input.email.includes('@')) throw new ValidationException('Invalid email');
    const agent = new Agent(uuidv4(), input.email, true);
    agent.addDomainEvent(
      new AgentCreatedEvent({ agentId: agent.id, email: agent.email, occurredAt: new Date().toISOString() }),
    );
    return agent;
  }

  static rehydrate(state: { id: string; email: string; active: boolean }): Agent {
    return new Agent(state.id, state.email, state.active);
  }

  get email(): string {
    return this._email;
  }
  get active(): boolean {
    return this._active;
  }
}
```

Write the unit test alongside (`test/unit/agent.entity.spec.ts`). **Domain tests need no infrastructure.**

### 2 · Declare ports (application layer)

`src/core/application/ports/agent.repository.ts`:

```ts
import type { Agent } from '~/core/domain/agent/agent.entity';
export interface IAgentRepository {
  findById(id: string): Promise<Agent | null>;
  save(a: Agent): Promise<void>;
}
export const AGENT_REPOSITORY = Symbol('IAgentRepository');
```

### 3 · Write the use case (CQRS command + handler)

`src/core/application/agent/create-agent.command.ts` — see the `CreateResource` example. Mock the ports in a unit test (`test/unit/create-agent.command.spec.ts`).

### 4 · Implement the driven adapter (Prisma repo)

Add an `Agent` model to `prisma/schema/agent.prisma`, run `pnpm prisma:migrate --name add_agent`, then implement `PrismaAgentRepository` in `src/adapters/driven/prisma/agent.repository.ts`. Register the binding in `PrismaModule`'s providers.

### 5 · Implement the driving adapter (HTTP controller + DTOs)

`src/adapters/driving/http/agent/` — `agent.controller.ts` + `agent.dto.ts`. Swagger decorators live **here only**.

### 6 · Wire it in a feature module

`src/infrastructure/modules/agent.module.ts` imports `CqrsModule`, registers the controller, and lists all command/query/event handlers as providers. Add it to `AppModule.imports`.

### 7 · Publish an integration event

If the new aggregate emits domain events, the `IEventPublisher` port is already wired. Currently backed by `LocalEventPublisher` (logs only). To send real events, implement `IEventPublisher` with your broker of choice and rebind the `EVENT_PUBLISHER` token in the feature module.

### 8 · Document

Update **`docs/diagrams/`** if the new feature changes the data flow.

---

## Coding conventions

- **Naming.** Files kebab-case; classes PascalCase; interfaces prefixed with `I` for ports only.
- **No barrel re-exports** inside `src/core/domain/**` or `src/core/application/**` — they create circular imports. Import the file directly.
- **No `any`.** Use `unknown` and narrow.
- **No default exports.** Named exports only.
- **Import order** is enforced by ESLint: builtin → external → `@nestjs/*` → `~/*` → relative.
- **Functions ≤ 80 lines, cyclomatic complexity ≤ 10.** Refactor when you hit the cap.
- **Domain layer is decorator-free.** Anything from `@nestjs/*`, `@prisma/*`, `class-validator`, `@nestjs/swagger` belongs in `adapters/` or `infrastructure/`.

---

## Commits

Conventional Commits, validated by commitlint:

```
feat(agent): add bulk import endpoint
fix(auth): handle expired JWT refresh race
refactor(prisma): split outbox into its own module
BREAKING CHANGE: rename userId → agentId
```

The `prepare-commit-msg` hook automatically prefixes branch tickets like `NUE-123` into your commit subject.

---

## Tests

| Layer                                              | Where                               | Runs in CI                            |
| -------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| **Unit** (domain + use cases, ports mocked)        | `test/unit/**/*.spec.ts`            | yes — `pnpm test:unit`                |
| **Integration** (real Postgres via Testcontainers) | `test/integration/**/*.int-spec.ts` | optional, gated on `INTEGRATION=true` |
| **e2e** (supertest against bootstrapped app)       | `test/e2e/**/*.e2e-spec.ts`         | optional                              |

Every PR needs at least one unit test for the new behavior. Coverage gates are intentionally off in v1 — speed of iteration first.

---

## Migrations & rollbacks

Prisma generates a `migration.sql` (the "up" script) for every `pnpm prisma:migrate --name <name>`,
but it does not generate a rollback script. Per CTS Section 10.2, every migration must be safely
reversible, so:

- Each `prisma/migrations/<timestamp>_<name>/` folder **must** also contain a hand-written `down.sql`
  that exactly reverses `migration.sql` (drop the tables/columns/indexes that were added, recreate
  the ones that were dropped, etc.).
- Write `down.sql` as part of the same PR that adds the migration — don't defer it.
- Migrations (and their `down.sql`) are immutable once merged. To change the schema further, add a
  new migration; never edit an existing one.
- To roll back the most recently applied migration locally, run:

```bash
pnpm prisma:migrate:down
```

This applies `down.sql` from the latest `prisma/migrations/*` folder via `prisma db execute`.

---

## Troubleshooting

- **`prisma generate` fails with "schema folder mode"** — make sure `previewFeatures = ["prismaSchemaFolder"]` is in `prisma/schema/base.prisma` and you use `--schema=./prisma/schema`.
- **Keycloak says "invalid issuer"** — the issuer URL in your JWT must match `KEYCLOAK_ISSUER` exactly, including the `/realms/<realm>` suffix.
- **JWKS fetch fails inside Docker** — when the API runs in a container the URL must be network-reachable from inside the container. If your Keycloak is on the host machine, use `host.docker.internal` instead of `localhost` in `KEYCLOAK_JWKS_URL`.
- **`max-lines-per-function` warning** — extract a helper. Don't disable the rule.

---

## Pull requests

Before opening a PR:

```bash
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build
```

The CI workflow runs the same checks.
