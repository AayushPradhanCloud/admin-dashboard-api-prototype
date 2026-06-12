# nest-api-boilerplate — Developer Guide

**Project:** `nest-api-boilerplate` (package name in [package.json](../package.json))
**Version:** 0.1.0
**Generated:** 2026-06-10
**Audience:** Junior developers (0–2 years) onboarding to this repository for the first time, and senior engineers who want a precise architectural reference.

---

## Table of Contents

- [Section 0. How to Use This Guide & Recommended Reading Order](#section-0-how-to-use-this-guide--recommended-reading-order)
- [Section A. Prerequisites & Toolchain Setup](#section-a-prerequisites--toolchain-setup)
- [Section B. Glossary & Technology Primers](#section-b-glossary--technology-primers)
- [1. Project Overview](#1-project-overview)
- [2. Architecture Overview](#2-architecture-overview)
- [3. Repository Structure](#3-repository-structure)
- [4. File Placement Rules](#4-file-placement-rules)
- [5. Import Rules](#5-import-rules)
- [6. Coding Standards](#6-coding-standards)
- [7. Development Workflow](#7-development-workflow)
- [8. Boilerplate Usage Guide](#8-boilerplate-usage-guide)
- [9. End-to-End Tutorial](#9-end-to-end-tutorial)
- [10. Security Guidelines](#10-security-guidelines)
- [11. Testing Guide](#11-testing-guide)
- [12. CI/CD Guide](#12-cicd-guide)
- [13. Common Mistakes & Anti-Patterns](#13-common-mistakes--anti-patterns)
- [14. Developer Checklist](#14-developer-checklist)
- [15. Quick Reference](#15-quick-reference)
- [16. How to Read This Codebase & Get Unstuck](#16-how-to-read-this-codebase--get-unstuck)
- [Appendix A. Glossary](#appendix-a-glossary)
- [Appendix B. Architecture Decision Records (Reconstructed)](#appendix-b-architecture-decision-records-reconstructed)
- [Appendix C. Evidence Map](#appendix-c-evidence-map)

---

## Section 0. How to Use This Guide & Recommended Reading Order

This document is a complete, evidence-based developer guide for **`nest-api-boilerplate`** — a NestJS backend boilerplate built around Hexagonal/DDD/CQRS principles. It is written so that a developer who has **never seen this repository, and may not know these architecture patterns**, can clone it, run it, understand it, and ship a first change without asking a colleague a single question. A senior engineer can use the same document as a precise reference: every claim is backed by a file path in this repository.

Every architectural statement in this guide is backed by a real file in the repository (cited as `path/to/file.ts`). Where the boilerplate intentionally omits a component (e.g., a message broker adapter or a CI pipeline file) to keep the core lightweight, this guide explicitly flags it as **"Intentionally omitted from boilerplate"** and provides pointers on how to add it when you clone the project.

### Reading path for beginners (Day 1)

Read these sections **in this order** before touching any code:

1. **Section A — Prerequisites & Toolchain Setup** — get your machine ready.
2. **Section B — Glossary & Technology Primers** — learn the vocabulary used everywhere else in this guide.
3. **Section 1 — Project Overview** — understand what this thing is for.
4. **Section 2 — Architecture Overview** — the big picture, with diagrams.
5. **Section 3 — Repository Structure** — what lives where.
6. **Section 8 — Boilerplate Usage Guide** — get it running on your machine.
7. **Section 9 — End-to-End Tutorial** — make your first change and trace a full request.

### Reading path for later (Day 2+, or "as needed")

Read these once you start writing real code, or whenever you need them:

8. **Section 4 — File Placement Rules**
9. **Section 5 — Import Rules**
10. **Section 6 — Coding Standards**
11. **Section 7 — Development Workflow** (adding a brand-new feature from scratch)
12. **Section 10 — Security Guidelines**
13. **Section 11 — Testing Guide**
14. **Section 12 — CI/CD Guide**
15. **Section 13 — Common Mistakes & Anti-Patterns** (read before your first PR)
16. **Section 14 — Developer Checklist** (use before every PR)
17. **Section 15 — Quick Reference** (keep open in a tab while coding)
18. **Section 16 — How to Read This Codebase & Get Unstuck** (when something breaks)

### Legend — callout boxes used in this guide

> **Note:** Extra context that helps you understand _why_ something is the way it is. Safe to skim, useful to remember.

> **Tip:** A shortcut, command, or habit that will save you time.

> **Warning:** Something that will break your app, your data, or your security if you get it wrong. Do not skip these.

> **Deep Dive (optional on first read):** Advanced detail for the curious or for senior readers. Beginners can skip this on a first pass and come back later.

> **Common Mistake:** A specific error new contributors make in this codebase, why it happens, and how to avoid it.

---

## Section A. Prerequisites & Toolchain Setup

> **Note:** This section gets your _machine_ ready. It does not yet explain the _code_. If a term below (e.g. "JWT", "ORM", "container") is unfamiliar, jump to [Section B — Glossary](#section-b-glossary--technology-primers) and come back.

### Knowledge prerequisites

You don't need to be an expert in any of these, but you should be comfortable with:

| Skill                                                              | Why you need it                                                            | If you need to learn it                                         |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Basic Git (clone, branch, commit, push, pull request)              | All work happens through Git; commit messages are validated automatically. | [git-scm.com/book](https://git-scm.com/book/en/v2)              |
| Basic command line (cd, ls/dir, running a script)                  | Every setup and test step in this guide is a terminal command.             | Any "command line basics" tutorial for your OS                  |
| Basic TypeScript / JavaScript                                      | The entire codebase is strict TypeScript.                                  | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| Basic HTTP / REST concepts (GET, POST, status codes, JSON)         | The API is a REST API.                                                     | MDN "HTTP overview"                                             |
| Basic SQL / relational database concepts (table, row, primary key) | Data is stored in PostgreSQL via Prisma.                                   | Any "intro to SQL" tutorial                                     |
| Basic Docker concepts (image, container, `docker compose up`)      | Local dependencies (Postgres, Redis) run in Docker.                        | Docker's official "Get Started" guide                           |

Everything else — NestJS, CQRS, Hexagonal Architecture, Prisma, Keycloak, JWTs — is explained from scratch in [Section B](#section-b-glossary--technology-primers).

### Required software

The versions below are not arbitrary — each is **pinned somewhere in this repository**. If your local version differs, things may subtly break (or refuse to install at all).

#### 1. Node.js v20.x

- **Why:** [`.nvmrc`](../.nvmrc) pins `20`; [`package.json`](../package.json) requires `"node": ">=20.0.0"`; the production [`Dockerfile`](../Dockerfile) is built `FROM node:20-alpine`.
- **Install:**

  ```bash
  # macOS (Homebrew)
  brew install nvm
  nvm install 20
  nvm use 20

  # Windows (using nvm-windows: https://github.com/coreybutler/nvm-windows)
  nvm install 20.17.0
  nvm use 20.17.0

  # Linux (using nvm)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install 20
  nvm use 20
  ```

- **Verify:**

  ```bash
  node --version
  # Expected: v20.x.x  (must start with v20 — matches .nvmrc and package.json "engines")
  ```

  If you see `v18.x.x` or `v22.x.x`, switch versions before continuing — `pnpm install` may still succeed but native modules (e.g. Prisma's query engine) and CI behavior can differ.

#### 2. pnpm ≥ 9 (package manager)

- **Why:** [`package.json`](../package.json) pins `"packageManager": "pnpm@9.0.0"`. The lockfile is `pnpm-lock.yaml`, not `package-lock.json` or `yarn.lock`. Using npm or yarn will create a second, conflicting lockfile.
- **Install (all platforms — Node 20 ships Corepack):**

  ```bash
  corepack enable
  corepack prepare pnpm@9.0.0 --activate
  ```

  > **Tip:** If `corepack` is not found, install pnpm directly: `npm install -g pnpm@9`.

- **Verify:**

  ```bash
  pnpm --version
  # Expected: 9.x.x
  ```

#### 3. Docker + Docker Compose

- **Why:** [`docker-compose.yml`](../docker-compose.yml) provisions PostgreSQL and Redis for local development; [`Dockerfile`](../Dockerfile) builds the deployable image.
- **Install:**

  ```bash
  # macOS — Docker Desktop
  # Download from https://www.docker.com/products/docker-desktop/

  # Windows — Docker Desktop (with WSL2 backend)
  # Download from https://www.docker.com/products/docker-desktop/

  # Linux (Debian/Ubuntu)
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER   # log out/in afterwards
  ```

- **Verify:**

  ```bash
  docker --version
  # Expected: Docker version 24.x.x or higher

  docker compose version
  # Expected: Docker Compose version v2.x.x
  ```

#### 4. Git

- **Why:** version control; [`.husky/`](../.husky) hooks run on commit/push.
- **Verify:**

  ```bash
  git --version
  # Expected: git version 2.x.x
  ```

#### 5. (Recommended) gitleaks — secret scanner

- **Why:** [`.husky/pre-commit`](../.husky/pre-commit) runs `gitleaks protect --staged --redact --verbose` if it is installed, blocking commits that contain secrets (API keys, passwords). If it is **not** installed, the hook prints a warning and continues — so this is recommended, not strictly required, to get started.
- **Install:**

  ```bash
  # macOS
  brew install gitleaks

  # Windows (winget)
  winget install gitleaks

  # Linux — see https://github.com/gitleaks/gitleaks#installing
  ```

- **Verify:**

  ```bash
  gitleaks version
  # Expected: a version string, e.g. 8.18.x
  ```

#### 6. A reachable Keycloak instance (external — not bundled)

- **Why:** [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts) requires `KEYCLOAK_BASE_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_JWKS_URL`, and `KEYCLOAK_ISSUER` to be set to **valid URLs / non-empty strings**, or the app refuses to start (Zod validation fails fast). [`src/common/guards/jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts) uses `KEYCLOAK_JWKS_URL` and `KEYCLOAK_ISSUER` to validate Bearer tokens on the `resources` API.
- **Intentionally omitted from boilerplate**: a bundled local Keycloak container (To add a local Keycloak for testing, you can add a Keycloak image to your docker-compose.yml and configure a realm export file) — [`docker-compose.yml`](../docker-compose.yml) explicitly comments: _"Keycloak is NOT included here — point KEYCLOAK\_\* env vars at your hosted instance."_
- **What this means for Day 1:** [`.env.example`](../.env.example) ships **placeholder URLs** (`https://auth.example.com/...`). These are syntactically valid, so the app will **boot successfully** and `GET /v1/health` will work without any Keycloak instance. But any request to the `/v1/resources` endpoints will fail at the `JwtAuthGuard` because the JWKS endpoint doesn't really exist. See [Section 8](#8-boilerplate-usage-guide) for what to expect on first run, and [Section 10](#10-security-guidelines) for how authentication works.

### Troubleshooting table — installation issues

| Symptom                                                           | Likely cause                                                                   | Fix                                                                                                                                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm: command not found` after `corepack enable`                 | Corepack shim not on PATH yet, or shell not restarted                          | Open a new terminal, or run `corepack prepare pnpm@9.0.0 --activate` again                                                                                       |
| `node --version` shows v18 or v22                                 | Wrong Node version active                                                      | `nvm use 20` (run this in every new terminal, or `nvm alias default 20`)                                                                                         |
| `pnpm install` fails with `ERR_PNPM_UNSUPPORTED_ENGINE`           | Node/pnpm version below the `engines` field in [package.json](../package.json) | Install Node 20 + pnpm 9 as above                                                                                                                                |
| `docker compose up` fails with "port is already allocated"        | Another process is using port 5432 (Postgres) or 6379 (Redis)                  | Stop the conflicting process, or change the port mapping in [docker-compose.yml](../docker-compose.yml)                                                          |
| `docker: command not found`                                       | Docker not installed or Docker Desktop not started                             | Install Docker Desktop and make sure it is **running** (check the system tray/menu bar icon)                                                                     |
| `[husky] gitleaks not installed — skipping secret scan`           | gitleaks not installed (informational, not an error)                           | Optional — install gitleaks if you want secret scanning locally; CI/PR review remains your safety net either way                                                 |
| `pnpm install` very slow / fails on Windows with long path errors | Windows `MAX_PATH` limit (260 chars) hit by deep `node_modules` paths          | Enable long paths: `git config --system core.longpaths true` and enable the Windows long-path policy, or clone closer to the drive root (e.g. `D:\dev\nest-api`) |

---

## Section B. Glossary & Technology Primers

> **Note:** Read this section once, fully, before Section 1. Every term defined here is used — without re-explanation — throughout the rest of the guide.

### Glossary

| Term                                                | Plain-English meaning                                                                                                                                                                          | Analogy                                                                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API**                                             | A set of URLs a program can call to do things or get data, instead of a human clicking a website.                                                                                              | A restaurant menu: you order by name, you don't go into the kitchen.                                                                                                |
| **REST**                                            | A style of API where each URL represents a "thing" (a _resource_) and HTTP verbs (GET/POST/PATCH/DELETE) say what to do to it.                                                                 | Filling out different forms (GET = "show me", POST = "create one").                                                                                                 |
| **DTO (Data Transfer Object)**                      | A plain class describing the _shape_ of data going into or out of an API endpoint, with validation rules attached.                                                                             | A delivery form that must be filled in correctly before the courier accepts the package.                                                                            |
| **DI (Dependency Injection)**                       | Instead of a class creating the things it depends on, those things are handed to it from outside. NestJS does this automatically via constructors.                                             | A restaurant kitchen doesn't grow its own vegetables — a supplier delivers them. The kitchen just asks for "vegetables" and doesn't care which farm they came from. |
| **DI container**                                    | The framework component that knows how to build and hand out dependencies. In NestJS, this is the Nest application context, configured via `@Module()`.                                        | The supplier's warehouse and delivery system.                                                                                                                       |
| **Aggregate / Aggregate root**                      | A cluster of related objects (entity + its parts) that must always be changed together to stay consistent, accessed through one "root" object.                                                 | A car: you don't replace just one bolt without going through "the car" as a whole — the car is the aggregate root.                                                  |
| **Entity**                                          | An object with an identity (an `id`) that persists over time, even if its other properties change.                                                                                             | A person: their name might change, but they're still the same person (same ID).                                                                                     |
| **Value Object**                                    | An object defined entirely by its data, with no identity of its own. Two value objects with the same data are considered equal.                                                                | A £10 note: any £10 note is interchangeable with any other — what matters is the value, not "which" note it is.                                                     |
| **Domain Event**                                    | A record of "something important happened" in the business domain (e.g. "a resource was created"), used to trigger follow-up actions.                                                          | A receipt printed after a sale — it records that the sale happened, and other systems (accounting, stock) react to it.                                              |
| **Repository (pattern)**                            | An abstraction that lets application code save/load domain objects without knowing _how_ (database, file, etc.).                                                                               | A librarian: you ask for "Book X", you don't need to know which shelf it's on.                                                                                      |
| **Port**                                            | An interface (a "socket shape") defined by the application core, describing what it needs from the outside world (e.g. "a place to save Resources").                                           | An electrical wall socket — it defines a _shape_, not which power station the electricity comes from.                                                               |
| **Adapter**                                         | Code that implements a port for a specific technology (e.g. Prisma + PostgreSQL implements the "repository" port).                                                                             | A power plug shaped to fit the wall socket — different plugs (adapters) can connect to the same socket (port).                                                      |
| **Hexagonal Architecture (Ports & Adapters)**       | An architecture style where business logic sits in the center and only talks to the outside world through ports/adapters, never directly.                                                      | Your laptop doesn't care if power comes from solar or coal — it just uses the standard plug.                                                                        |
| **Onion Architecture**                              | Same idea as Hexagonal, drawn as concentric rings: domain in the center, then application, then adapters/infrastructure on the outside. Dependencies always point inward.                      | Layers of an onion — the core doesn't know the outer layers exist.                                                                                                  |
| **DDD (Domain-Driven Design)**                      | An approach to software design that models code around the real business concepts (entities, value objects, aggregates, domain events) and the language the business uses.                     | Building a model of a real shop, with "Customer", "Order", "Product" as first-class concepts in the code, not just database tables.                                 |
| **CQRS (Command Query Responsibility Segregation)** | Splitting "write" operations (Commands — change something) from "read" operations (Queries — fetch something) into separate classes and handlers.                                              | A restaurant: the person taking your order (write) is a different role from the person checking the menu board (read), even if it's the same kitchen.               |
| **Command**                                         | A request to _change_ something (e.g. "create this resource"). Has a handler that performs the change.                                                                                         | An order slip handed to the kitchen.                                                                                                                                |
| **Query**                                           | A request to _read_ something (e.g. "list resources"), with no side effects.                                                                                                                   | Looking at the menu board.                                                                                                                                          |
| **Use case**                                        | The application-layer class that orchestrates one specific business operation (often a Command or Query handler).                                                                              | The kitchen's recipe for one specific dish.                                                                                                                         |
| **Event-Driven Architecture**                       | A style where parts of the system communicate by emitting and reacting to events, rather than calling each other directly.                                                                     | A fire alarm: the alarm doesn't call the fire department directly — it emits a signal, and whoever is listening reacts.                                             |
| **Transactional Outbox (pattern)**                  | A technique for reliably publishing events: write the business change _and_ a record of "an event needs to be sent" in the same database transaction, then a separate process sends it later.  | Writing a letter and a "send this letter" note in the same notebook entry, so even if the postal trip happens later, you never forget to send it.                   |
| **Idempotency / idempotent**                        | An operation that produces the same result no matter how many times it's repeated (useful for safely retrying).                                                                                | Pressing an elevator call button five times doesn't call five elevators.                                                                                            |
| **JWT (JSON Web Token)**                            | A signed, self-contained token that proves "who you are" and "what you're allowed to do", without the server needing to look it up in a database every time.                                   | A wax-sealed letter of introduction — anyone with the right "seal-checking" tool can trust it without phoning the sender.                                           |
| **JWKS (JSON Web Key Set)**                         | A published set of public keys an API uses to verify that a JWT's signature is genuine.                                                                                                        | The public stamp catalogue that lets you verify a wax seal is authentic.                                                                                            |
| **SSO (Single Sign-On)**                            | Logging in once (e.g. via Keycloak) and being trusted across multiple applications.                                                                                                            | One staff badge that opens every door in the building.                                                                                                              |
| **Keycloak**                                        | An open-source identity provider (login server) that issues JWTs after a user signs in.                                                                                                        | The security desk that checks ID and issues the staff badge.                                                                                                        |
| **ORM (Object-Relational Mapper)**                  | A library that lets you work with database rows as code objects/classes instead of writing raw SQL by hand.                                                                                    | A translator between "table rows" and "TypeScript objects".                                                                                                         |
| **Prisma**                                          | The ORM used in this project — generates a type-safe database client from a schema file.                                                                                                       | —                                                                                                                                                                   |
| **Migration**                                       | A versioned, reproducible change to the database schema (e.g. "add a column"), tracked so every environment ends up with the same schema.                                                      | A recipe step that's been written down so anyone can reproduce the same dish, in order.                                                                             |
| **Seed (data)**                                     | Sample/test data inserted into the database to make local development realistic.                                                                                                               | Stocking a demo shop with sample products before opening day.                                                                                                       |
| **Soft delete**                                     | "Deleting" a row by marking it with a `deletedAt` timestamp instead of physically removing it, so it can be audited or restored.                                                               | Moving a file to the recycle bin instead of shredding it.                                                                                                           |
| **Correlation ID**                                  | A unique ID attached to a request (header `x-correlation-id`) so all logs related to that one request can be found and grouped together.                                                       | A tracking number on a parcel — lets you follow it through every step of its journey.                                                                               |
| **Middleware**                                      | Code that runs on every (or selected) incoming HTTP requests before they reach a controller.                                                                                                   | A security checkpoint every visitor passes through before reaching any office.                                                                                      |
| **Guard**                                           | NestJS code that decides whether a request is **allowed** to proceed (authentication/authorization). Returns true/false (or throws).                                                           | A bouncer checking ID at the door.                                                                                                                                  |
| **Interceptor**                                     | NestJS code that can transform the request before, and/or the response after, a controller handler runs.                                                                                       | A gift-wrapping station: takes whatever the kitchen produces and wraps it consistently before it goes out the door.                                                 |
| **Pipe**                                            | NestJS code that transforms/validates incoming data (e.g. validating a DTO) before it reaches a controller method.                                                                             | Quality control at the factory intake — rejects bad input before it enters the production line.                                                                     |
| **Filter (Exception Filter)**                       | NestJS code that catches errors thrown anywhere in the request pipeline and turns them into a consistent HTTP response.                                                                        | The complaints desk — no matter what went wrong in the building, complaints are handled in one consistent way.                                                      |
| **Decorator**                                       | A `@SomeName(...)` annotation in TypeScript that attaches metadata or behavior to a class, method, or parameter. NestJS is built almost entirely on decorators.                                | A sticky note on a form telling the mailroom how to handle it.                                                                                                      |
| **ESLint boundaries plugin**                        | An ESLint plugin (`eslint-plugin-boundaries`) that enforces _which folders are allowed to import from which other folders_ — used here to enforce the hexagonal dependency rule automatically. | An automatic gate that physically prevents the kitchen staff from wandering into the dining room.                                                                   |
| **Zod**                                             | A TypeScript library for declaring a "schema" (shape + validation rules) for data, and validating real data against it at runtime — used here to validate environment variables at startup.    | A checklist the building inspector runs through before declaring a building "fit for occupancy".                                                                    |
| **Throttling / rate limiting**                      | Limiting how many requests a client can make in a time window, to prevent abuse.                                                                                                               | A "take a number" system at a busy counter — only so many people served per minute.                                                                                 |
| **CORS (Cross-Origin Resource Sharing)**            | Browser security rules controlling which websites are allowed to call your API from JavaScript.                                                                                                | A guest list at the door — only invited websites are let in.                                                                                                        |
| **Helmet**                                          | An Express/NestJS middleware that sets various security-related HTTP response headers.                                                                                                         | Standard safety signage and locks added to a building by default.                                                                                                   |
| **API versioning**                                  | Putting a version number in the URL (e.g. `/v1/...`) so the API can evolve without breaking existing clients.                                                                                  | Edition numbers on a textbook — old readers can keep using "edition 1" while new readers get "edition 2".                                                           |
| **Swagger / OpenAPI**                               | A standard format for describing a REST API (endpoints, request/response shapes), and the tooling that turns that description into interactive documentation.                                  | An auto-generated, always-up-to-date instruction manual for the API.                                                                                                |
| **Testcontainers**                                  | A testing library that spins up real Docker containers (e.g. a real Postgres) for integration tests, then tears them down afterward.                                                           | Renting a real test kitchen for a day instead of imagining how the real kitchen would behave.                                                                       |
| **Husky**                                           | A tool that runs scripts ("hooks") automatically at Git lifecycle points (e.g. before a commit).                                                                                               | An automatic checklist that runs itself every time you try to leave the building.                                                                                   |
| **Conventional Commits**                            | A standard format for commit messages (e.g. `feat(agent): add X`, `fix(auth): handle Y`) that tools can parse to generate changelogs.                                                          | A standard form for incident reports — same fields every time, so they're easy to file and search later.                                                            |
| **commitlint**                                      | A tool that checks commit messages against the Conventional Commits format and rejects ones that don't comply.                                                                                 | The form-checker that hands your incident report back if you missed a required field.                                                                               |
| **lint-staged**                                     | A tool that runs linters/formatters only on the files you're about to commit (not the whole repo), for speed.                                                                                  | Spell-checking only the page you just wrote, not the whole book, before filing it.                                                                                  |

### Technology primers

For each major technology actually present in this repository (see [package.json](../package.json) for exact versions), here is what it is, why it's used here, and what it does in this codebase.

> **NestJS** (`@nestjs/core` ^10.3.10) — A TypeScript backend framework built on top of Express, structured around modules, controllers, providers, and decorators, with first-class dependency injection. _Why here:_ It gives this boilerplate modules, DI, guards, interceptors, pipes, and filters out of the box — exactly the building blocks this hexagonal architecture is assembled from. _What it does here:_ every controller, module, guard, and interceptor in `src/` is a NestJS construct. The app entry points are [`src/infrastructure/main.ts`](../src/infrastructure/main.ts) (normal server) and [`src/infrastructure/lambda.ts`](../src/infrastructure/lambda.ts) (AWS Lambda).

> **TypeScript 5.5 (strict mode)** — A typed superset of JavaScript. _Why here:_ [`tsconfig.json`](../tsconfig.json) enables `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, and more — catching whole classes of bugs at compile time. _What it does here:_ every `.ts` file in `src/` and `test/` is compiled under these strict rules; `pnpm typecheck` runs `tsc --noEmit` to verify this without producing output files.

> **@nestjs/cqrs** (^10.2.7) — NestJS's official CQRS toolkit, providing `CommandBus`, `QueryBus`, `EventBus`, and the `@CommandHandler`/`@QueryHandler`/`@EventsHandler` decorators. _Why here:_ implements the CQRS half of this architecture. _What it does here:_ see [`src/core/application/example/create-resource.command.ts`](../src/core/application/example/create-resource.command.ts) (a command + handler), [`list-resources.query.ts`](../src/core/application/example/list-resources.query.ts) (a query + handler), and [`resource-created.handler.ts`](../src/core/application/example/resource-created.handler.ts) (an in-process event handler).

> **Prisma** (`@prisma/client` / `prisma` ^5.18.0) — A type-safe ORM: you describe your database schema in `.prisma` files, and Prisma generates a fully-typed client. _Why here:_ gives compile-time-checked database access and a clean migration workflow. _What it does here:_ schema lives in [`prisma/schema/`](../prisma/schema) (split into `base.prisma` for datasource/generator config and `example.prisma` for the `Resource` and `OutboxEvent` models, using Prisma's `prismaSchemaFolder` preview feature for multi-file schemas). [`PrismaService`](../src/adapters/driven/prisma/prisma.service.ts) wraps `PrismaClient` as a Nest provider.

> **PostgreSQL 16** — A relational (SQL) database. _Why here:_ it's the `datasource` configured in [`prisma/schema/base.prisma`](../prisma/schema/base.prisma) (`provider = "postgresql"`), and [`docker-compose.yml`](../docker-compose.yml) runs `postgres:16-alpine` for local dev.

> **Zod** (^3.23.8) — A schema-validation library. _Why here:_ used to validate `process.env` at startup so the app fails fast with a clear error instead of crashing later with a confusing one. _What it does here:_ [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts) defines `EnvSchema` and `loadEnv()`, called once from [`AppModule`](../src/infrastructure/app.module.ts).

> **class-validator / class-transformer** (^0.14.1 / ^0.5.1) — Decorator-based validation (`@IsString()`, `@Length()`, etc.) and object transformation for plain classes. _Why here:_ used on DTOs so NestJS's global `ValidationPipe` can validate incoming HTTP request bodies/queries automatically. _What it does here:_ see [`src/adapters/driving/http/example/resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts) — `CreateResourceDto`, `ListResourcesQueryDto`.

> **jose** (^5.6.3) — A modern JavaScript library for JWT/JWK operations. _Why here:_ used to verify Keycloak-issued JWTs against the realm's JWKS without a separate library for key management. _What it does here:_ [`src/common/guards/jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts) calls `createRemoteJWKSet()` and `jwtVerify()`.

> **nestjs-pino / pino-http / pino-pretty** (^4.1.0 / ^10.2.0 / ^11.2.2) — Structured JSON logging for Nest, using the high-performance Pino logger; `pino-pretty` makes logs human-readable in development. _Why here:_ production logs need to be machine-parseable JSON; developers need readable console output. _What it does here:_ configured in [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts) via `LoggerModule.forRoot(...)` — pretty-printed only when `NODE_ENV === 'development'`.

> **@nestjs/throttler** (^6.0.0) — Rate-limiting module for NestJS. _Why here:_ protects the API from being hammered by too many requests from one client. _What it does here:_ registered globally in [`AppModule`](../src/infrastructure/app.module.ts) via `ThrottlerModule.forRoot(...)` and `APP_GUARD: ThrottlerGuard`, configured by `THROTTLE_TTL` / `THROTTLE_LIMIT` env vars.

> **helmet** (^7.1.0) and **compression** (^1.7.4) — Express middleware for security headers and response compression respectively. _Why here:_ sane security/performance defaults. _What it does here:_ both are applied in [`src/infrastructure/main.ts`](../src/infrastructure/main.ts) and [`src/infrastructure/lambda.ts`](../src/infrastructure/lambda.ts) via `app.use(helmet())` / `app.use(compression())`.

> **@nestjs/swagger** (^7.4.0) — Generates an OpenAPI spec and interactive "Swagger UI" docs from decorators on controllers/DTOs. _Why here:_ self-documenting API. _What it does here:_ [`main.ts`](../src/infrastructure/main.ts) sets up `SwaggerModule` at `/docs` when `NODE_ENV !== 'production'`; [`scripts/generate-openapi.ts`](../scripts/generate-openapi.ts) emits a static `openapi.json`.

> **Jest / ts-jest / supertest / Testcontainers** — Jest is the test runner; `ts-jest` lets it run TypeScript directly; `supertest` drives HTTP requests against a Nest app in tests; Testcontainers spins up real Docker containers (e.g. Postgres) for integration tests. _Why here:_ three distinct test configs ([`jest.config.ts`](../jest.config.ts), [`jest.integration.config.ts`](../jest.integration.config.ts), [`jest.e2e.config.ts`](../jest.e2e.config.ts)) map to the three test types covered in [Section 11](#11-testing-guide).

> **ESLint + `eslint-plugin-boundaries` + Prettier** — ESLint lints code quality and architectural rules; `eslint-plugin-boundaries` specifically enforces _which layer can import which_; Prettier formats code. _Why here:_ makes the hexagonal dependency rule a **machine-enforced** rule, not just a convention in a document. _What it does here:_ see [`.eslintrc.cjs`](../.eslintrc.cjs), and [Section 5 — Import Rules](#5-import-rules).

> **Husky + commitlint + lint-staged** — Husky runs Git hook scripts; commitlint validates commit messages; lint-staged runs linters only on staged files. _Why here:_ enforces code quality and commit hygiene automatically, before code ever reaches a shared branch. _What it does here:_ see [`.husky/`](../.husky), [`commitlint.config.cjs`](../commitlint.config.cjs), [`lint-staged.config.cjs`](../lint-staged.config.cjs), and [Section 16](#16-how-to-read-this-codebase--get-unstuck).

### Architecture-pattern primers (plain English + this repo's implementation)

> **Hexagonal Architecture (Ports & Adapters)** — _Plain English:_ Your core business logic sits in the middle and never talks directly to the outside world (databases, web frameworks, message queues). Instead, it talks to "ports" (interfaces) that describe what it needs, and "adapters" plug into those ports with real technology. Think of it like a power socket: your laptop (business logic) doesn't care whether the electricity comes from solar or coal — it just uses the standard plug (port). _In this repo:_ `src/core/` is the center (domain + application). `src/core/application/ports/` defines the sockets — e.g. [`IResourceRepository`](../src/core/application/ports/resource.repository.ts) and [`IEventPublisher`](../src/core/application/ports/event-publisher.port.ts). `src/adapters/driven/` plugs real technology into those sockets — e.g. [`PrismaResourceRepository`](../src/adapters/driven/prisma/resource.repository.ts) implements `IResourceRepository`. `src/adapters/driving/` is how the outside world calls _into_ the core — e.g. [`ResourceController`](../src/adapters/driving/http/example/resource.controller.ts).

> **Onion Architecture** — _Plain English:_ The same idea as Hexagonal, drawn as concentric rings: domain at the center, then application, then adapters/infrastructure on the outside — and dependencies only ever point inward (outer rings can see inner rings, never the reverse). _In this repo:_ [`ARCHITECTURE.md`](../ARCHITECTURE.md) states this explicitly as "the dependency rule" and it is enforced by the `boundaries/element-types` rule in [`.eslintrc.cjs`](../.eslintrc.cjs) (see [Section 5](#5-import-rules)).

> **DDD (Domain-Driven Design)** — _Plain English:_ Model your code around real business concepts — using the same words the business uses — rather than around database tables or technical layers. Aggregates, value objects, and domain events become first-class TypeScript classes. _In this repo:_ [`src/core/domain/example/resource.entity.ts`](../src/core/domain/example/resource.entity.ts) is an aggregate root (`Resource`) with a private constructor, a `static create()` factory that enforces invariants (name length 2–120 characters), and behavior methods (`rename`, `deactivate`). [`src/core/domain/example/resource-events.ts`](../src/core/domain/example/resource-events.ts) defines `ResourceCreatedEvent`, a domain event.

> **CQRS (Command Query Responsibility Segregation)** — _Plain English:_ Split "write" requests (Commands) from "read" requests (Queries) into entirely separate classes and handlers, even if they operate on the same data. _In this repo:_ writes go through `CommandBus.execute(new CreateResourceCommand(...))` → [`CreateResourceCommandHandler`](../src/core/application/example/create-resource.command.ts); reads go through `QueryBus.execute(new ListResourcesQuery(...))` → [`ListResourcesQueryHandler`](../src/core/application/example/list-resources.query.ts). Both are wired up in [`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts).

> **Event-Driven Architecture** — _Plain English:_ Parts of the system communicate by emitting events ("a resource was created") that other parts react to, rather than calling each other directly. _In this repo:_ after `CreateResourceCommandHandler` saves a `Resource`, it calls `resource.pullDomainEvents()` and publishes them via the `IEventPublisher` port. [`ResourceCreatedHandler`](../src/core/application/example/resource-created.handler.ts) is an **in-process** subscriber (`@EventsHandler(ResourceCreatedEvent)`) that currently just logs. The **external** publisher is [`LocalEventPublisher`](../src/adapters/driven/local/local-event.publisher.ts) — a no-op/logging implementation. > **Deep Dive (optional on first read):** Architecture diagrams and `ARCHITECTURE.md` describe a NATS JetStream broker and an `OutboxDispatcherService` for at-least-once external delivery. **Intentionally omitted from boilerplate**: an actual NATS adapter or dispatcher implementation (To add NATS, implement the IEventPublisher port using the `nats` or `@nestjs/microservices` package and bind it in your feature module) under `src/` — only the `IEventPublisher` port, the `LocalEventPublisher` stub, and the `OutboxEvent` Prisma model exist today. Treat the broker/outbox as the _intended future_ design, not the current behavior.

> **Transactional Outbox** — _Plain English:_ To reliably send an event when you save data, write the event into the _same database transaction_ as the data change (an "outbox" table), then have a separate process read that table and actually send the events. This avoids the "saved to DB but the event got lost" problem. _In this repo:_ the `OutboxEvent` model exists in [`prisma/schema/example.prisma`](../prisma/schema/example.prisma) (fields: `eventType`, `payload`, `correlationId`, `publishedAt`, `attempts`, `lastError`). **Intentionally omitted from boilerplate**: code that writes to this table or a dispatcher that reads from it (To implement this, write a cron job or use a tool like Debezium to read the outbox table and publish to your message broker) — the table is provisioned for this pattern but not yet wired up.

---

## 1. Project Overview

> In one sentence: **this repository is a ready-made template for building a backend API service** — it comes with the architecture, security, database, and tooling already wired up, so a team can focus on writing business logic instead of plumbing.

`nest-api-boilerplate` (see [`package.json`](../package.json) `name` and `description`) is described as:

> "nest NestJS boilerplate — hexagonal/DDD/CQRS/event-driven, strict TypeScript, Prisma, Keycloak."

[`README.md`](../README.md) elaborates:

> "A production-grade, opinionated **NestJS** boilerplate for any nest backend service. Hexagonal / DDD / CQRS / event-driven / onion, strict TypeScript, Prisma + PostgreSQL, Keycloak SSO, runtime-agnostic (normal server + container + AWS Lambda handler)."
>
> "**Replace** the nest `Resource` example aggregate with your real domain (Agent, Member, Plan, …) and adapt module/controller names. The architectural skeleton stays the same."

### What this means in practice

- **Purpose:** a starting point ("boilerplate") to be **copied** for new backend services. The word `nest` and the example `Resource` aggregate are placeholders meant to be renamed (see [Section 8](#8-boilerplate-usage-guide)).
- **Business goal:** consistency. Every service built from this template shares the same folder layout, the same architectural rules, the same auth model, and the same tooling — so developers moving between services (or onboarding to any of them) face a familiar shape.
- **Intended use cases:** any backend service that needs a REST API, a PostgreSQL database, JWT-based authentication via Keycloak, and the option to run either as a long-lived server (Docker) or as an AWS Lambda function — both entry points share the same [`AppModule`](../src/infrastructure/app.module.ts) ([`src/infrastructure/main.ts`](../src/infrastructure/main.ts) vs [`src/infrastructure/lambda.ts`](../src/infrastructure/lambda.ts)).
- **What's included out of the box:** one fully-working vertical slice (the `Resource` example: create + list, with pagination, validation, auth, and a domain event) that demonstrates every layer of the architecture end-to-end. New features are built by following the same shape (see [Section 7](#7-development-workflow)).

> **Note:** Throughout this guide, "the `Resource` example" refers to the sample aggregate found under `*/example/*` paths (e.g. [`src/core/domain/example/resource.entity.ts`](../src/core/domain/example/resource.entity.ts)). It exists purely to **demonstrate the pattern** — in a real service derived from this boilerplate, it would be deleted and replaced with real domain aggregates (e.g. `Agent`, `Member`, `Plan`).

---

## 2. Architecture Overview

### The big picture, in plain English

Imagine the codebase as three concentric rings, like a target board.

- **The bullseye (center) is the _domain_** — pure business rules, written in plain TypeScript with no framework code at all. It knows nothing about HTTP, databases, or NestJS.
- **The middle ring is the _application_ layer** — it orchestrates the domain to perform use cases ("create a resource", "list resources"), and declares _interfaces_ ("ports") describing what it needs from the outside world (e.g. "somewhere to save a Resource").
- **The outer ring is _adapters_ and _infrastructure_** — the real technology: HTTP controllers, the Prisma/PostgreSQL database, NestJS wiring, configuration, and the application's entry points.

The single most important rule (called **"the dependency rule"** in [`ARCHITECTURE.md`](../ARCHITECTURE.md)) is: **code in an outer ring may depend on an inner ring, but never the other way around.** The domain must never `import` anything from `adapters/` or `infrastructure/`. This is what lets the business logic be tested without a database, and lets you swap technologies (e.g. Prisma → another ORM) without touching business rules.

#### Figure 1 — System Context

```mermaid
%% System Context (C4 Level 1)
graph TB
  user([Admin User])
  subgraph nest[nest Platform]
    web[frontend-web<br/>React SPA]
    api[backend-api<br/>NestJS service]
    db[(PostgreSQL)]
    bus{{NATS JetStream}}
    kc[Keycloak SSO]
    cache[(Redis)]
  end
  legacy[(Legacy Laravel services<br/>corenroll · billing · etc.)]

  user -- HTTPS --> web
  web -- "Bearer JWT" --> api
  web -- "redirect to hosted login" --> kc
  api -- JWKS verify --> kc
  api -- SQL --> db
  api -- pub/sub --> bus
  api -- "cache (optional)" --> cache
  api -- "ACL HTTP client" --> legacy
  bus -- events --> legacy
```

_Source: [`docs/diagrams/system-context.mmd`](../docs/diagrams/system-context.mmd)._

> **How to read this diagram:** This is the "zoomed out" view — boxes are whole systems, arrows are how they talk to each other. The box this repository builds is **`backend-api`**. Read it as: a user's browser talks to a frontend, the frontend sends API calls with a JWT to this API, and this API verifies that JWT against Keycloak and reads/writes PostgreSQL.
>
> **Deep Dive (optional on first read):** This diagram also shows a `frontend-web` SPA, NATS JetStream, Redis cache, and legacy Laravel services as part of "the nest Platform". **Intentionally omitted from boilerplate**: any of those (You can implement a Redis cache by adding a Redis module, and wire up legacy APIs using NestJS HttpModule) — this repo contains only the `backend-api` piece. Redis and NATS appear in configuration/diagrams as _planned_ integration points (see [Section B](#section-b-glossary--technology-primers) deep dives on Event-Driven Architecture and Transactional Outbox), but no Redis client code or NATS adapter exists under `src/`.

#### Figure 2 — Hexagonal Layers & the Dependency Rule

```mermaid
%% Hexagonal layers and the dependency rule
flowchart LR
  subgraph infra[infrastructure]
    main[main.ts / lambda.ts]
    cfg[config (Zod)]
    appmod[AppModule]
  end
  subgraph adapt[adapters]
    drv[driving/http<br/>controllers · DTOs · Swagger]
    drvn[driven<br/>Prisma · NATS · Legacy ACL]
  end
  subgraph appl[application]
    ports[ports<br/>repository · event · gateway]
    uc[use cases<br/>commands · queries · handlers]
  end
  subgraph dom[domain]
    ent[entities · value objects]
    ev[domain events]
    inv[invariants]
  end

  infra --> adapt
  drv --> uc
  drvn -. implements .-> ports
  uc --> ports
  uc --> dom

  classDef inner fill:#dbeafe,stroke:#1d4ed8;
  class dom inner;
```

_Source: [`docs/diagrams/hexagonal-layers.mmd`](../docs/diagrams/hexagonal-layers.mmd)._

> **How to read this diagram:** Follow the solid arrows — they point in the _only_ direction dependencies are allowed to flow. `infrastructure` depends on `adapters`, `adapters/driving` depends on `application` (use cases), and use cases depend on both `ports` (interfaces) and `domain`. The dashed arrow (`-. implements .->`) is special: `adapters/driven` _implements_ the `ports` interfaces, but the `ports` themselves live in `application` and don't know which adapter implements them. The highlighted box (`domain`) has **no incoming dependency arrows from outside itself** — nothing outside the domain is allowed to be imported by it.
>
> This is enforced automatically — see [Section 5 — Import Rules](#5-import-rules) for the exact ESLint configuration that fails the build on a violation.

#### Figure 3 — Request Lifecycle (a single HTTP request, end to end)

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant MW as CorrelationIdMiddleware
  participant G as JwtAuthGuard + RolesGuard
  participant Ctrl as Controller
  participant Cmd as CommandBus
  participant H as CommandHandler
  participant D as Domain
  participant R as PrismaRepository
  participant P as EventPublisher
  participant I as ResponseInterceptor

  C->>MW: HTTP
  MW->>G: + x-correlation-id
  G->>Ctrl: req.user (JWT verified)
  Ctrl->>Cmd: execute(Command)
  Cmd->>H: handle
  H->>D: aggregate.create()
  H->>R: save
  H->>P: publishAll(events)
  H-->>Ctrl: result
  Ctrl-->>I: payload
  I-->>C: {success, data, message, meta}
```

_Adapted from [`docs/diagrams/request-lifecycle.mmd`](../docs/diagrams/request-lifecycle.mmd) (the original diagram labels the publisher "NatsEventPublisher"; this guide labels it "EventPublisher" because the currently-implemented adapter is [`LocalEventPublisher`](../src/adapters/driven/local/local-event.publisher.ts) — see the Deep Dive under Event-Driven Architecture in [Section B](#section-b-glossary--technology-primers))._

> **How to read this diagram:** Time flows top to bottom. Each vertical line is a _participant_ (a piece of code). An arrow means "this code calls that code". `autonumber` adds step numbers automatically. Read it as a story: (1) a client sends an HTTP request, (2) the correlation-id middleware tags it, (3–4) the auth guards verify the JWT and attach the user, (5) the controller turns the HTTP call into a `Command` object and hands it to the `CommandBus`, (6) the matching handler runs, (7) it asks the domain entity to do something, (8) it saves the result via the repository, (9) it publishes any domain events, and finally (10–11) the response is wrapped in a standard envelope and sent back. We trace this _exact_ flow with real code in [Section 9](#9-end-to-end-tutorial).

#### Figure 4 — CQRS: Writes vs. Reads

```mermaid
flowchart LR
  HTTP[POST /v1/resources] --> CmdBus[CommandBus]
  CmdBus --> CmdH[CreateResourceCommandHandler]
  CmdH --> Aggregate[(Resource aggregate)]
  CmdH --> Repo[(PrismaResourceRepository)]
  CmdH --> EvBus[CQRS EventBus]
  EvBus --> InProc[ResourceCreatedHandler<br/>in-process side effects]
  CmdH --> Outbound[EventPublisher port]

  HTTPq[GET /v1/resources] --> QBus[QueryBus]
  QBus --> QH[ListResourcesQueryHandler]
  QH --> Repo
```

_Adapted from the CQRS diagram in [`ARCHITECTURE.md`](../ARCHITECTURE.md) §4 (original labels the outbound box "NatsEventPublisher → JetStream"; relabeled "EventPublisher port" per the Deep Dive note above)._

> **How to read this diagram:** Two separate flows share the same `Repo`. The **top flow** (a `POST`) goes through the `CommandBus` to a handler that changes state — it touches the domain `Aggregate`, the `Repo`, the in-process `EventBus` (for synchronous side-effects like logging), and the outbound `EventPublisher` port (for external integration events). The **bottom flow** (a `GET`) goes through the `QueryBus` straight to a handler that _only reads_ via `Repo` — it never touches the aggregate or publishes events. This separation is why it's called CQRS: **C**ommand **Q**uery **R**esponsibility **S**egregation.
>
> **Why this matters:** keeping reads and writes in separate classes means a read-heavy endpoint can later be optimized (e.g. a different query, a cache, a read replica) without touching — or risking — the write logic at all.

### Layer responsibilities (at a glance)

| Layer          | Folder                  | Responsibility                                                                                                                      | May depend on                         |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Domain         | `src/core/domain/`      | Business rules, entities, value objects, domain events, exceptions. Pure TypeScript — zero framework decorators.                    | itself only                           |
| Application    | `src/core/application/` | Orchestrates use cases (Commands/Queries/Handlers); declares ports (interfaces) for what it needs from the outside.                 | domain, application                   |
| Adapters       | `src/adapters/`         | Connects the application to the real world: HTTP controllers (`driving/`) and database/external-system implementations (`driven/`). | application, domain, adapters, common |
| Common         | `src/common/`           | Framework-aware cross-cutting helpers with no business meaning: filters, interceptors, guards, middleware, decorators.              | itself only                           |
| Infrastructure | `src/infrastructure/`   | Composition root: config loading, the root `AppModule`, feature modules, and the two app entry points (`main.ts`, `lambda.ts`).     | everything                            |

_(This table mirrors the `boundaries/elements` and `boundaries/element-types` configuration in [`.eslintrc.cjs`](../.eslintrc.cjs) — see [Section 5](#5-import-rules) for the full enforced matrix.)_

### Cross-cutting concerns — where each one lives

| Concern                 | Mechanism                                                                 | File                                                                                                                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Config validation       | Zod schema, fail-fast at boot                                             | [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts)                                                                                                                                                                                                           |
| Request correlation     | Middleware sets/reads `x-correlation-id`                                  | [`src/common/middleware/correlation-id.middleware.ts`](../src/common/middleware/correlation-id.middleware.ts)                                                                                                                                                                       |
| Structured logging      | `nestjs-pino`, JSON to stdout (pretty in dev)                             | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                                                                                                                                                                                           |
| Authentication          | Local JWT verification against Keycloak JWKS via `jose`                   | [`src/common/guards/jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts)                                                                                                                                                                                                     |
| Authorization           | Role match against JWT claims                                             | [`src/common/guards/roles.guard.ts`](../src/common/guards/roles.guard.ts) + [`@Roles()`](../src/common/decorators/roles.decorator.ts)                                                                                                                                               |
| Validation              | Global `ValidationPipe` + `class-validator` DTOs                          | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts), [`src/adapters/driving/http/example/resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts)                                                                                              |
| Response shape          | `ResponseTransformInterceptor` wraps every success response               | [`src/common/interceptors/response-transform.interceptor.ts`](../src/common/interceptors/response-transform.interceptor.ts)                                                                                                                                                         |
| Error handling          | `AllExceptionsFilter` maps exceptions → consistent error envelope         | [`src/infrastructure/filters/all-exceptions.filter.ts`](../src/infrastructure/filters/all-exceptions.filter.ts)                                                                                                                                                                     |
| Request logging         | `LoggingInterceptor` logs method/path/status/duration/user/correlationId  | [`src/common/interceptors/logging.interceptor.ts`](../src/common/interceptors/logging.interceptor.ts)                                                                                                                                                                               |
| Rate limiting           | `@nestjs/throttler`, env-configurable                                     | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                                                                                                                                                                                           |
| Security headers        | `helmet`                                                                  | [`src/infrastructure/main.ts`](../src/infrastructure/main.ts)                                                                                                                                                                                                                       |
| CORS                    | Per-env allow-list (`CORS_ALLOWED_ORIGINS`)                               | [`src/infrastructure/main.ts`](../src/infrastructure/main.ts)                                                                                                                                                                                                                       |
| API versioning          | URL-based, `/v1/...`                                                      | [`src/infrastructure/main.ts`](../src/infrastructure/main.ts)                                                                                                                                                                                                                       |
| Health check            | `GET /v1/health` — liveness + DB connectivity check (`SELECT 1`), no auth | [`src/infrastructure/health/health.controller.ts`](../src/infrastructure/health/health.controller.ts)                                                                                                                                                                               |
| Soft delete             | `deletedAt` column, filtered in repository queries                        | [`prisma/schema/example.prisma`](../prisma/schema/example.prisma), [`src/adapters/driven/prisma/resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts)                                                                                                      |
| Tracing (OpenTelemetry) | env-gated (`OTEL_ENABLED`)                                                | [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts) — **Intentionally omitted from boilerplate**: actual OTEL SDK wiring in `src/`. (To add it, install `@opentelemetry/sdk-node` and initialize it in a separate file imported at the very top of `main.ts`) |
| Error tracking (Sentry) | `@sentry/nestjs`, initialized when `SENTRY_DSN` is set                    | [`src/infrastructure/instrument.ts`](../src/infrastructure/instrument.ts) — imported first in `main.ts`/`lambda.ts`; `AllExceptionsFilter` reports all 5xx exceptions via `Sentry.captureException`                                                                                 |

> **Warning:** The OpenTelemetry row above is important for beginners: a dependency being listed in `package.json`, or an env var existing in [`env.ts`](../src/infrastructure/config/env.ts), does **not** mean the feature is active. Always check whether the _code_ actually uses it. This guide flags every such gap explicitly.

### Deployment topology

```mermaid
flowchart TB
  subgraph Local[Local Docker Compose - primary path]
    api[backend-api container] --- pg[(Postgres)]
    api --- nats[NATS JetStream]
    api --- kc[Keycloak]
    api --- redis[(Redis)]
  end
  subgraph AWS[AWS - minimal CDK skeleton]
    gw[HTTP API v2] --> auth[Lambda Authorizer<br/>Keycloak JWT]
    auth --> fn[Lambda: serverless-express]
    fn --> rds[(RDS Postgres)]
    fn --> natsCloud[(NATS cluster)]
  end
  Local -. same AppModule, different entrypoint .-> AWS
```

_Source: [`docs/diagrams/deployment.mmd`](../docs/diagrams/deployment.mmd)._

> **How to read this diagram:** Two boxes represent two ways to run the **same code**. On the left, "Local" — `docker compose` runs Postgres, Redis (and, per [`docker-compose.yml`](../docker-compose.yml), the API itself can also be containerized). On the right, "AWS" — an HTTP API Gateway forwards requests through a Lambda Authorizer to a Lambda function running this app via `@codegenie/serverless-express` ([`src/infrastructure/lambda.ts`](../src/infrastructure/lambda.ts)). The dashed arrow says: it's the same [`AppModule`](../src/infrastructure/app.module.ts) either way — only the entry point ([`main.ts`](../src/infrastructure/main.ts) vs [`lambda.ts`](../src/infrastructure/lambda.ts)) differs.
>
> **Deep Dive (optional on first read):** The diagram's "Local" box includes NATS JetStream and Keycloak as containers, and the "AWS" box includes a Lambda Authorizer and an `infra/cdk` stack. **Intentionally omitted from boilerplate**: any `infra/` or CDK directory, a NATS container in [`docker-compose.yml`](../docker-compose.yml), or a Lambda Authorizer implementation (You can add your own Terraform or CDK scripts under an `infra/` folder when you are ready to deploy) — [`docker-compose.yml`](../docker-compose.yml) provisions only `postgres`, `redis`, and `api`, and explicitly states Keycloak is external. Treat the AWS half of this diagram as a target design, not a present capability of this repository.

---

## 3. Repository Structure

> **In plain terms:** every top-level folder under `src/` corresponds to one "ring" of the architecture from [Section 2](#2-architecture-overview). If you remember nothing else: **`core/` is business logic, `adapters/` connects it to the world, `common/` is shared framework glue, `infrastructure/` is wiring.**

#### Figure 5 — Folder Layout

```mermaid
graph TD
  src --> core
  src --> adapters
  src --> common
  src --> infrastructure
  core --> domain[domain<br/>entities · VOs · events]
  core --> application[application<br/>ports · use cases]
  adapters --> driving[driving/http<br/>controllers · DTOs]
  adapters --> driven[driven<br/>Prisma · NATS · Legacy]
  infrastructure --> cfg[config<br/>Zod env]
  infrastructure --> modules[feature modules]
  infrastructure --> main[main.ts / lambda.ts]
```

_Source: [`docs/diagrams/folder-layout.mmd`](../docs/diagrams/folder-layout.mmd). The diagram mentions "Legacy" under `driven` as an example of a future adapter — **intentionally omitted from boilerplate**: an existing legacy adapter; only `driven/prisma` and `driven/local` exist today._

### `src/core/domain/`

- **In plain terms:** the pure business rules — no databases, no web, no framework. If you deleted every other folder in `src/`, the code in here should still compile and its tests should still pass.
- **Allowed:** Aggregate roots (extend [`AggregateRoot`](../src/core/domain/example/aggregate-root.base.ts)), value objects (extend [`ValueObject<T>`](../src/core/domain/example/value-object.base.ts)), domain events (extend [`DomainEvent<T>`](../src/core/domain/example/domain-event.base.ts)), domain exceptions ([`exceptions.ts`](../src/core/domain/example/exceptions.ts)).
- **Not allowed:** Anything from `@nestjs/*`, `@prisma/*`, `class-validator`, `@nestjs/swagger`, or any I/O (HTTP calls, database calls, file system access).
- **Why:** keeping this layer pure means business rules can be unit-tested with **zero setup** — no database, no Docker, no mocking frameworks beyond plain objects. See [`test/unit/resource.entity.spec.ts`](../test/unit/resource.entity.spec.ts), which tests `Resource.create()` with nothing but plain `expect()` calls.
- **Current contents:** `src/core/domain/example/` — `aggregate-root.base.ts`, `value-object.base.ts`, `domain-event.base.ts`, `exceptions.ts`, `resource.entity.ts`, `resource-events.ts`.

### `src/core/application/`

- **In plain terms:** the "recipes" — each one describes the steps for one specific operation (e.g. "create a resource"), using only domain objects and ports. It doesn't know _how_ data gets saved, only _that_ it can be saved.
- **Allowed:** Port interfaces (`ports/`), Command/Query classes, Command/Query/Event handlers (`@CommandHandler`, `@QueryHandler`, `@EventsHandler` from `@nestjs/cqrs`), references to `core/domain`.
- **Not allowed:** Direct references to Prisma, HTTP, Express types, or any class from `src/adapters/` or `src/infrastructure/`.
- **Why:** a use case that depends on `IResourceRepository` (an interface) instead of `PrismaResourceRepository` (a concrete class) can be unit-tested by handing it a fake/mock repository — see [`test/unit/create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts), where `repo` and `publisher` are plain Jest mocks, no NestJS test module, no database.
- **Current contents:**
  - `src/core/application/ports/` — [`resource.repository.ts`](../src/core/application/ports/resource.repository.ts) (`IResourceRepository`, `RESOURCE_REPOSITORY` token), [`event-publisher.port.ts`](../src/core/application/ports/event-publisher.port.ts) (`IEventPublisher`, `EVENT_PUBLISHER` token).
  - `src/core/application/example/` — [`create-resource.command.ts`](../src/core/application/example/create-resource.command.ts), [`list-resources.query.ts`](../src/core/application/example/list-resources.query.ts), [`resource-created.handler.ts`](../src/core/application/example/resource-created.handler.ts).

### `src/adapters/driving/http/`

- **In plain terms:** the "front desk" — translates an incoming HTTP request into a Command/Query object, hands it to the application layer, and translates the result back into an HTTP response shape. This is the **only** place Swagger (`@nestjs/swagger`) decorators are allowed.
- **Allowed:** Controllers (`@Controller`), request/response DTOs (`class-validator` + `@nestjs/swagger` decorators), guards applied via `@UseGuards`.
- **Not allowed:** Business logic (no `if` statements that decide business outcomes — that belongs in a command/query handler), direct Prisma access.
- **Why:** if business rules lived in the controller, you couldn't reuse them from a different driving adapter (e.g. a CLI, a message-queue listener, a scheduled job) without copy-pasting. Keeping controllers "thin" means they're easy to read and the real logic is unit-tested separately from HTTP concerns.
- **Current contents:** `src/adapters/driving/http/example/` — [`resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts), [`resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts).

### `src/adapters/driven/`

- **In plain terms:** the "backstage" — real implementations of the ports declared in `core/application/ports/`. This is where Prisma, databases, and (eventually) message brokers live.
- **Allowed:** Classes implementing application ports (`@Injectable()` providers), framework/ORM-specific code.
- **Not allowed:** Business rules/invariants (those belong in `core/domain`); these classes should be relatively "dumb" translators between domain objects and storage/transport formats.
- **Why:** because `core/application` only knows about the _interface_ (`IResourceRepository`), you can swap [`PrismaResourceRepository`](../src/adapters/driven/prisma/resource.repository.ts) for a different implementation (different ORM, different database) by changing only the binding in a module — no changes to use cases or domain.
- **Current contents:**
  - `src/adapters/driven/prisma/` — [`prisma.module.ts`](../src/adapters/driven/prisma/prisma.module.ts), [`prisma.service.ts`](../src/adapters/driven/prisma/prisma.service.ts), [`resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts) (`PrismaResourceRepository`).
  - `src/adapters/driven/local/` — [`local-event.publisher.ts`](../src/adapters/driven/local/local-event.publisher.ts) (`LocalEventPublisher`, a no-op/logging `IEventPublisher`).
  - **Intentionally omitted from boilerplate**: `src/adapters/driven/legacy/` or any message-broker adapter (e.g. NATS) (Create these directories and implement the required ports when you integrate with external systems) — `ARCHITECTURE.md` describes these as future additions.

### `src/common/`

- **In plain terms:** shared NestJS "plumbing" used across every feature — but plumbing that has **no business meaning**. If you're writing something that would be identical in a totally different application (e.g. "attach a correlation ID to every request"), it goes here.
- **Allowed:** Filters, interceptors, guards, middleware, decorators, and small framework-level config tokens.
- **Not allowed:** References to `core/domain` or `core/application` business types — per `boundaries/element-types` in [`.eslintrc.cjs`](../.eslintrc.cjs), `common` may only import from `common`. [`AllExceptionsFilter`](../src/infrastructure/filters/all-exceptions.filter.ts) needs the domain exception hierarchy to do its job, which is exactly why it lives in `src/infrastructure/filters/` rather than here — see [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) for the full story.
- **Current contents:**
  - `config/` — [`auth-config.token.ts`](../src/common/config/auth-config.token.ts) (`AuthConfig` interface + `AUTH_CONFIG` DI token).
  - `decorators/` — [`current-user.decorator.ts`](../src/common/decorators/current-user.decorator.ts) (`@CurrentUser()`), [`roles.decorator.ts`](../src/common/decorators/roles.decorator.ts) (`@Roles()`), [`index.ts`](../src/common/decorators/index.ts) (a barrel — **allowed here**, barrels are only forbidden inside `core/domain` and `core/application`).
  - `guards/` — [`jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts), [`roles.guard.ts`](../src/common/guards/roles.guard.ts).
  - `interceptors/` — [`logging.interceptor.ts`](../src/common/interceptors/logging.interceptor.ts), [`response-transform.interceptor.ts`](../src/common/interceptors/response-transform.interceptor.ts).
  - `middleware/` — [`correlation-id.middleware.ts`](../src/common/middleware/correlation-id.middleware.ts).

### `src/infrastructure/`

- **In plain terms:** the "wiring closet" — where everything gets plugged together and the application actually starts. If you're looking for "where does the program begin?", it's here.
- **Allowed:** NestJS modules (`@Module`), the env/config loader, the two entry points, health check.
- **Not allowed:** New business rules — this layer should mostly be declarative wiring (`imports`, `providers`, `controllers` arrays).
- **Current contents:**
  - [`app.module.ts`](../src/infrastructure/app.module.ts) — the root module: registers global pipes/filters/interceptors/guards, logging, throttling, and feature modules.
  - `config/` — [`config.module.ts`](../src/infrastructure/config/config.module.ts), [`env.ts`](../src/infrastructure/config/env.ts) (Zod schema + `loadEnv()`).
  - `filters/` — [`all-exceptions.filter.ts`](../src/infrastructure/filters/all-exceptions.filter.ts) (`AllExceptionsFilter` — global exception → HTTP response mapping; lives here rather than `src/common/` because it imports the domain exception hierarchy, see [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation)).
  - `health/` — [`health.controller.ts`](../src/infrastructure/health/health.controller.ts) (`GET /v1/health`, no auth).
  - `modules/` — [`example.module.ts`](../src/infrastructure/modules/example.module.ts) (wires the `Resource` feature's controller + handlers + event publisher binding).
  - [`main.ts`](../src/infrastructure/main.ts) — normal server entry point (used by `pnpm start`, `pnpm start:dev`, and the production `Dockerfile` CMD).
  - [`lambda.ts`](../src/infrastructure/lambda.ts) — AWS Lambda entry point via `@codegenie/serverless-express`.

### `prisma/`

- **In plain terms:** the database schema and seed data, in Prisma's own format — not TypeScript, but central to how `driven/prisma` adapters work.
- **Allowed:** `.prisma` schema files, `seed.ts`.
- **Current contents:**
  - `schema/` — [`base.prisma`](../prisma/schema/base.prisma) (datasource + generator config, using the `prismaSchemaFolder` preview feature so multiple `.prisma` files share one schema), [`example.prisma`](../prisma/schema/example.prisma) (the `Resource` and `OutboxEvent` models).
  - [`seed.ts`](../prisma/seed.ts) — inserts 25 fake `Resource` rows via `@faker-js/faker` (run with `pnpm prisma:seed`).
- **Why split into multiple files:** as a real service grows new aggregates (Agent, Member, …), each gets its own `<name>.prisma` file alongside `example.prisma`, keeping each bounded context's schema easy to find — without one giant file.

### `test/`

- **In plain terms:** three folders, three different _kinds_ of test, each with its own Jest config (see [Section 11](#11-testing-guide)).
- **Current contents:**
  - `unit/` — [`resource.entity.spec.ts`](../test/unit/resource.entity.spec.ts), [`create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts) — fast, no I/O, ports mocked.
  - `integration/` — [`resource.repository.int-spec.ts`](../test/integration/resource.repository.int-spec.ts) — spins up a real PostgreSQL via Testcontainers.
  - `e2e/` — [`health.e2e-spec.ts`](../test/e2e/health.e2e-spec.ts) — `supertest` against a bootstrapped Nest app.

### `docs/diagrams/`

- **In plain terms:** the source-of-truth diagrams (Mermaid `.mmd` files) referenced throughout this guide and [`ARCHITECTURE.md`](../ARCHITECTURE.md).
- **Current contents:** [`system-context.mmd`](../docs/diagrams/system-context.mmd), [`hexagonal-layers.mmd`](../docs/diagrams/hexagonal-layers.mmd), [`request-lifecycle.mmd`](../docs/diagrams/request-lifecycle.mmd), [`event-flow-outbox.mmd`](../docs/diagrams/event-flow-outbox.mmd), [`auth-flow.mmd`](../docs/diagrams/auth-flow.mmd), [`deployment.mmd`](../docs/diagrams/deployment.mmd), [`folder-layout.mmd`](../docs/diagrams/folder-layout.mmd), [`erd.mmd`](../docs/diagrams/erd.mmd), and a [`README.md`](../docs/diagrams/README.md) explaining how to render them (paste into [mermaid.live](https://mermaid.live), use a VS Code Mermaid preview extension, or run `@mermaid-js/mermaid-cli` for SVG export).

### `scripts/`

- **In plain terms:** small standalone Node scripts, run via `ts-node`, that aren't part of the running application.
- **Current contents:** [`generate-openapi.ts`](../scripts/generate-openapi.ts) — boots the app (without listening on a port), generates the OpenAPI document, and writes `openapi.json` to the repo root (`pnpm openapi:generate`).

---

## 4. File Placement Rules

This section answers "I just wrote a new `class` / `interface` / `function` — which folder does it go in?" For each kind of file, you'll find: where it goes, a real example from this repo, and **what breaks if you put it somewhere else**.

### Entities & Aggregate Roots

- **Goes in:** `src/core/domain/<feature>/<name>.entity.ts`
- **Example:** [`src/core/domain/example/resource.entity.ts`](../src/core/domain/example/resource.entity.ts) — `export class Resource extends AggregateRoot`
- **Contains:** business invariants, factory methods (`static create(...)`, `static rehydrate(...)`), mutators (`rename()`, `deactivate()`), and the raising of domain events.
- **Must never contain:** `@Injectable()` or any NestJS decorator, Prisma types, `class-validator` decorators, anything `async`/I/O.
- **If you put it in the wrong place** (e.g. inside `src/adapters/driven/prisma/`): nothing stops it from compiling on its own, but the moment `core/application` imports it, ESLint reports `boundaries/element-types`: _"File is of type 'application'. Dependency is of type 'adapters'"_ — application code is forbidden from depending on adapters (see [Section 5](#5-import-rules)). The build fails.

### Value Objects

- **Goes in:** `src/core/domain/<feature>/`, extending [`ValueObject<TProps>`](../src/core/domain/example/value-object.base.ts).
- **Intentionally omitted from boilerplate**: a concrete value object beyond the base class. The `Resource` entity validates its `name` with a private `validateName()` function rather than wrapping it in a dedicated `ResourceName` value object. If you introduce one, it belongs alongside the entity it describes (e.g. `src/core/domain/example/resource-name.vo.ts`).

### Domain Events

- **Goes in:** `src/core/domain/<feature>/<feature>-events.ts`, extending [`DomainEvent<TData>`](../src/core/domain/example/domain-event.base.ts).
- **Example:** [`src/core/domain/example/resource-events.ts`](../src/core/domain/example/resource-events.ts) — `ResourceCreatedEvent`, raised by `Resource.create()`.
- **If you put it in `core/application` instead:** `resource.entity.ts` (domain) would need to `import` it from `application` — `domain → application` is forbidden, so ESLint fails the build immediately.

### Domain Exceptions

- **Goes in:** `src/core/domain/<feature>/exceptions.ts`.
- **Example:** [`src/core/domain/example/exceptions.ts`](../src/core/domain/example/exceptions.ts) — `BaseException`, `DomainException`, `ValidationException`, `BusinessRuleException`, `EntityNotFoundException`, plus `ApplicationException` and `InfrastructureException`.
- **Why this file is special:** it is imported from _both_ `core/domain` (the entity throws `ValidationException`) **and** [`src/infrastructure/filters/all-exceptions.filter.ts`](../src/infrastructure/filters/all-exceptions.filter.ts) (which maps each exception type to an HTTP status). That second import — `infrastructure → domain` — is allowed by the matrix below. It used to be `common → domain`, which **is** a violation; [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) walks through that violation and how moving the filter into `infrastructure` fixed it.

### Ports (interfaces the application layer needs from the outside world)

- **Goes in:** `src/core/application/ports/<name>.ts`. Convention: an `I`-prefixed interface **plus** a `Symbol` DI token of the same name in `UPPER_SNAKE_CASE`.
- **Examples:**
  - [`src/core/application/ports/resource.repository.ts`](../src/core/application/ports/resource.repository.ts) — `interface IResourceRepository` + `const RESOURCE_REPOSITORY = Symbol('IResourceRepository')`.
  - [`src/core/application/ports/event-publisher.port.ts`](../src/core/application/ports/event-publisher.port.ts) — `interface IEventPublisher` + `const EVENT_PUBLISHER = Symbol('IEventPublisher')`.
- **If you put a port in `core/domain` instead:** it still _compiles_ (an interface has no runtime dependencies), but it mixes "what the business rules are" with "what infrastructure capability some use case needs" — the next developer won't know where to look for it. By convention (and to keep the domain layer's job singular: pure business rules), ports live in `application`.

### Commands & Queries (use cases)

- **Goes in:** `src/core/application/<feature>/<verb-feature>.command.ts` (writes) or `.query.ts` (reads). **This repo's convention is to define the message class and its handler in the same file.**
- **Examples:**
  - [`src/core/application/example/create-resource.command.ts`](../src/core/application/example/create-resource.command.ts) — exports `CreateResourceCommand` (the data) **and** `CreateResourceCommandHandler` (the `@CommandHandler`).
  - [`src/core/application/example/list-resources.query.ts`](../src/core/application/example/list-resources.query.ts) — exports `ListResourcesQuery` and `ListResourcesQueryHandler`.
- **If you put a command/handler in `adapters/driving/http/` instead:** it would still be reachable from the controller in the same folder, but any _other_ driving adapter (a NATS message listener, a CLI, a scheduled job) that wanted to trigger "create a resource" would have to import from the HTTP layer — `adapters → adapters` across driving/driven boundaries is technically allowed by ESLint, but it defeats the entire purpose of CQRS use cases: **one use case, reusable from any entry point**.

### Event Handlers (in-process side effects)

- **Goes in:** alongside commands/queries, in `src/core/application/<feature>/`, as an `@EventsHandler(SomeEvent)` class.
- **Example:** [`src/core/application/example/resource-created.handler.ts`](../src/core/application/example/resource-created.handler.ts) — `ResourceCreatedHandler`, currently just logs (`// TODO: in real services, write to an audit log, invalidate cache, etc.`).

### Repository Adapters (driven — persistence)

- **Goes in:** `src/adapters/driven/prisma/<feature>.repository.ts`, implementing the matching port interface.
- **Example:** [`src/adapters/driven/prisma/resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts) — `class PrismaResourceRepository implements IResourceRepository`. The DI binding (`{ provide: RESOURCE_REPOSITORY, useClass: PrismaResourceRepository }`) is registered in [`src/adapters/driven/prisma/prisma.module.ts`](../src/adapters/driven/prisma/prisma.module.ts).
- **If you put repository code inside a command handler instead:** the handler can no longer be unit-tested with a fake repository (see [`test/unit/create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts)) — every test would need a real Postgres connection, turning fast unit tests into slow integration tests.

### Event Publisher Adapters (driven — outbound integration events)

- **Goes in:** `src/adapters/driven/<technology>/<name>.publisher.ts`, implementing `IEventPublisher`.
- **Example:** [`src/adapters/driven/local/local-event.publisher.ts`](../src/adapters/driven/local/local-event.publisher.ts) — `class LocalEventPublisher implements IEventPublisher`, bound to `EVENT_PUBLISHER` in [`src/infrastructure/modules/example.module.ts`](../src/infrastructure/modules/example.module.ts).

### Controllers

- **Goes in:** `src/adapters/driving/http/<feature>/<feature>.controller.ts`. **This is the only place `@nestjs/swagger` decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`) are allowed.**
- **Example:** [`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts) — its own header comment states the rule: _"Controllers MUST NOT contain business logic; they translate HTTP to CQRS messages."_
- **If you put business logic (an `if` that decides a business outcome) in a controller:** it can only be tested via an HTTP request (slow, needs a running app) and can't be reused by any other driving adapter. It also tends to silently duplicate validation/invariants that the domain entity already enforces, so the two can drift out of sync.

### DTOs & Validators

- **Goes in:** `src/adapters/driving/http/<feature>/<feature>.dto.ts`, using `class-validator` decorators (`@IsString()`, `@MinLength()`, etc.) and `@nestjs/swagger`'s `@ApiProperty()`.
- **Example:** [`src/adapters/driving/http/example/resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts) — `CreateResourceDto`, `ListResourcesQueryDto`, `ResourceResponseDto`.
- **Why there are _two_ validation layers:** the DTO checks "is this HTTP request well-formed?" (e.g. `name` is a string between 2 and 120 characters). The domain entity's `Resource.create()` _also_ validates the name. **Why this matters:** the domain check protects the invariant _no matter how_ a `Resource` is constructed (including from a future second driving adapter that might skip the DTO entirely), while the DTO check gives the HTTP caller a fast, friendly 400 response. Neither layer should "trust" the other.

### Mappers (Persistence ↔ Domain translation)

- **Intentionally omitted from boilerplate**: standalone `*.mapper.ts` files. Today, [`PrismaResourceRepository`](../src/adapters/driven/prisma/resource.repository.ts) has a small private `toDomain(row)` method that converts a raw Prisma row into a `Resource` via `Resource.rehydrate(...)`.
- **If a feature's mapping logic grows large:** the consistent place to extract it would be a sibling file, e.g. `src/adapters/driven/prisma/<feature>.mapper.ts`, exporting plain functions (`toDomain`, `toPersistence`) — kept inside `adapters/driven` because mapping _to/from a specific storage shape_ is an adapter concern, not a domain or application concern.

### NestJS Modules

- **Goes in:** `src/infrastructure/modules/<feature>.module.ts`. Wires together the controller, DTOs (implicitly, via the controller), command/query/event handlers, and port-to-adapter bindings for one feature.
- **Example:** [`src/infrastructure/modules/example.module.ts`](../src/infrastructure/modules/example.module.ts).
- **Registered in:** [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)'s `imports` array.

### Configuration

- **Goes in:** `src/infrastructure/config/`. [`env.ts`](../src/infrastructure/config/env.ts) holds the Zod schema and `loadEnv()`; [`config.module.ts`](../src/infrastructure/config/config.module.ts) exposes the validated config and derived tokens (like `AUTH_CONFIG`) via NestJS DI.
- **If you read `process.env` directly somewhere else** (e.g. inside a repository or a controller): the value won't be validated by the Zod schema, won't fail fast at boot if missing, and won't be visible in one place when auditing configuration. Always add new variables to `EnvSchema` in `env.ts` first.

---

## 5. Import Rules

> **In plain terms:** a "dependency" here just means "this file has an `import` statement pointing at that other file." The rule below says **which folders are allowed to `import` from which other folders** — and it is checked automatically every time you run `pnpm lint`.

### The dependency matrix

✅ = allowed · ❌ = forbidden. Row = the layer **doing** the importing. Column = the layer **being imported from**. (Source: `boundaries/element-types` in [`.eslintrc.cjs`](../.eslintrc.cjs).)

| from \\ to             | `core/domain` | `core/application` | `adapters/*` | `infrastructure` | `common` |
| ---------------------- | ------------- | ------------------ | ------------ | ---------------- | -------- |
| **`core/domain`**      | ✅            | ❌                 | ❌           | ❌               | ❌       |
| **`core/application`** | ✅            | ✅                 | ❌           | ❌               | ❌       |
| **`adapters/*`**       | ✅            | ✅                 | ✅           | ❌               | ✅       |
| **`infrastructure`**   | ✅            | ✅                 | ✅           | ✅               | ✅       |
| **`common`**           | ❌            | ❌                 | ❌           | ❌               | ✅       |

> **Why this matters:** if `core/domain` could import from `adapters`, then your business rules would be coupled to (say) Prisma — changing your database library could mean rewriting your business rules. Reading the table **bottom-to-top tells you what's "safe to change without breaking other things"**: `core/domain` has nothing depending on it from below (nothing is "below" it), so it's the safest, most stable code in the project; `infrastructure` can depend on everything, so it's expected to change most often (new config, new wiring) without breaking anything else.

### A forbidden import, and the correct alternative

❌ **Forbidden** — a domain entity reaching into the Prisma adapter directly:

```ts
// src/core/domain/example/resource.entity.ts
import { PrismaService } from '~/adapters/driven/prisma/prisma.service'; // ❌

export class Resource extends AggregateRoot {
  async save(prisma: PrismaService): Promise<void> {
    await prisma.resource.update(/* ... */); // ❌ domain doing I/O
  }
}
```

Running `pnpm lint` on this would produce:

```
error  No rule allowing this dependency was found. File is of type 'domain'. Dependency is of type 'adapters'  boundaries/element-types
```

✅ **Correct** — the domain entity stays pure and ignorant of _how_ it's persisted; a use case in `core/application` asks the **port** (interface) to save it, and the **adapter** (in `src/adapters/driven/prisma/`) provides the real implementation:

```ts
// src/core/domain/example/resource.entity.ts — unchanged, no I/O, no imports from outside core/domain
export class Resource extends AggregateRoot {
  rename(name: string): void {
    this._name = validateName(name);
    this._updatedAt = new Date();
  }
}

// src/core/application/example/create-resource.command.ts — depends only on the PORT (an interface)
@CommandHandler(CreateResourceCommand)
export class CreateResourceCommandHandler implements ICommandHandler<CreateResourceCommand> {
  constructor(
    @Inject(RESOURCE_REPOSITORY) private readonly repo: IResourceRepository, // interface, not Prisma
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  async execute(command: CreateResourceCommand): Promise<CreateResourceResult> {
    const resource = Resource.create({ name: command.name, description: command.description });
    await this.repo.save(resource); // <- the actual Prisma call happens behind this interface
    await this.publisher.publishAll(resource.pullDomainEvents());
    return { id: resource.id, name: resource.name, description: resource.description };
  }
}
```

This is taken almost verbatim from [`src/core/application/example/create-resource.command.ts`](../src/core/application/example/create-resource.command.ts) — open that file alongside [`src/adapters/driven/prisma/resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts) to see the real implementation behind `IResourceRepository`.

> **Note:** `pnpm lint` on this repository reports **zero** `boundaries/element-types` violations today — but it didn't always. [`AllExceptionsFilter`](../src/infrastructure/filters/all-exceptions.filter.ts) used to live in `src/common/filters/` and import `BaseException`, `ValidationException`, etc. from `core/domain/example/exceptions`, which is `common → domain` — ❌ per the matrix above. [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) walks through exactly how that **real, previously-present violation** was diagnosed and fixed (by moving the file to `src/infrastructure/filters/`, where `infrastructure → domain` is ✅) — read it once so you recognize the same error message if you ever introduce a new violation yourself.

---

## 6. Coding Standards

All naming conventions below are taken directly from files that exist in this repository today — open the linked file to see the convention in context.

### Naming conventions

| What                          | Convention                                                                                 | Real example                                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File names                    | `kebab-case.<role>.ts` — the suffix describes the file's _role_                            | [`resource.entity.ts`](../src/core/domain/example/resource.entity.ts), [`create-resource.command.ts`](../src/core/application/example/create-resource.command.ts), [`jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts), [`response-transform.interceptor.ts`](../src/common/interceptors/response-transform.interceptor.ts) |
| Classes                       | `PascalCase`, named after what they _are_, suffixed with their role                        | `Resource`, `CreateResourceCommandHandler`, `PrismaResourceRepository`, `JwtAuthGuard`                                                                                                                                                                                                                                                |
| Interfaces for **ports only** | `I` + `PascalCase`                                                                         | `IResourceRepository`, `IEventPublisher` — but note `ErrorEnvelope`, `AuthUser`, `AuthConfig` are plain interfaces _without_ an `I` prefix because they are **not ports** (data shapes, not swappable infrastructure contracts)                                                                                                       |
| DI tokens for ports           | `UPPER_SNAKE_CASE` `Symbol`, named after the interface                                     | `RESOURCE_REPOSITORY = Symbol('IResourceRepository')`, `EVENT_PUBLISHER = Symbol('IEventPublisher')`, `AUTH_CONFIG`                                                                                                                                                                                                                   |
| Methods & variables           | `camelCase`, verbs for methods                                                             | `findById`, `paginate`, `publishAll`, `pullDomainEvents`                                                                                                                                                                                                                                                                              |
| Domain event `type` strings   | `<bounded-context>.<aggregate>.<past-tense-event>`                                         | `'example.resource.created'` (see [`resource-events.ts`](../src/core/domain/example/resource-events.ts))                                                                                                                                                                                                                              |
| Test files                    | `<thing>.spec.ts` (unit), `<thing>.int-spec.ts` (integration), `<thing>.e2e-spec.ts` (e2e) | [`resource.entity.spec.ts`](../test/unit/resource.entity.spec.ts), [`resource.repository.int-spec.ts`](../test/integration/resource.repository.int-spec.ts), [`health.e2e-spec.ts`](../test/e2e/health.e2e-spec.ts)                                                                                                                   |

### Rule: no default exports (`import/no-default-export`)

✅ **Correct** — every export in this repo is a named export:

```ts
// src/adapters/driving/http/example/resource.controller.ts
export class ResourceController {
  /* ... */
}
```

❌ **Incorrect:**

```ts
export default class ResourceController {
  /* ... */
}
```

> **Why this matters:** named exports give every class exactly one name everywhere it's used, which makes "find all references" and auto-import tooling reliable. Default exports let every importer pick a different name for the same thing — confusing when reading unfamiliar code.

### Rule: no `any` (`@typescript-eslint/no-explicit-any: error`)

❌ **Incorrect:**

```ts
async paginate(params: any): Promise<any> { /* ... */ }
```

✅ **Correct** — real types from the port interface:

```ts
// src/core/application/ports/resource.repository.ts
export interface IResourceRepository {
  paginate(params: { page: number; pageSize: number; search?: string }): Promise<PaginatedResult<Resource>>;
}
```

> **Deep Dive (optional on first read):** [`src/adapters/driven/prisma/resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts) uses casts like `(this.prisma as unknown as { resource: ResourceDelegate }).resource.findMany(...)` in a few places. This is **not** the same as `any` — `unknown` forces an explicit, intentional cast to a named shape, and ESLint still type-checks everything after the cast. It's a documented workaround for a Prisma typing edge case with the multi-file schema feature, confined entirely to one adapter file — it does not leak `any` into the rest of the codebase.

### Rule: type-only imports (`@typescript-eslint/consistent-type-imports`)

✅ **Correct** — values and types are imported separately when mixed in one statement:

```ts
// src/adapters/driving/http/example/resource.controller.ts
import { CurrentUser, type AuthUser } from '~/common/decorators/current-user.decorator';
import { CreateResourceCommand, type CreateResourceResult } from '~/core/application/example/create-resource.command';
```

❌ **Incorrect** (would trigger `@typescript-eslint/consistent-type-imports` if `AuthUser`/`CreateResourceResult` are only ever used as types):

```ts
import { CurrentUser, AuthUser } from '~/common/decorators/current-user.decorator';
import { CreateResourceCommand, CreateResourceResult } from '~/core/application/example/create-resource.command';
```

> **Why this matters:** types are erased at compile time, but a plain `import` of something used only as a type can still force the _module itself_ to be loaded at runtime in some bundler configurations, and it's not obvious to a reader which imports are "real" runtime dependencies. `import type` makes that distinction explicit.

### Rule: import order (`import/order`)

Imports must be grouped, in this order, with a **blank line between groups**, and **alphabetized within each group**:

1. Node.js builtins
2. External packages — with `@nestjs/**` packages first within this group
3. Internal absolute imports (`~/...`)
4. Relative imports (`./`, `../`)

✅ **Correct** — the real top of [`resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts):

```ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser, type AuthUser } from '~/common/decorators/current-user.decorator';
import { Roles } from '~/common/decorators/roles.decorator';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard';
import { RolesGuard } from '~/common/guards/roles.guard';
import { CreateResourceCommand, type CreateResourceResult } from '~/core/application/example/create-resource.command';
import { ListResourcesQuery, type ListResourcesResult } from '~/core/application/example/list-resources.query';

import { CreateResourceDto, ListResourcesQueryDto, ResourceResponseDto } from './resource.dto';
```

❌ **Incorrect** (relative import mixed in with `@nestjs/**`, no blank-line separation, not alphabetized):

```ts
import { CreateResourceDto } from './resource.dto';
import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller } from '@nestjs/common';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard';
```

> **Tip:** run `pnpm lint:fix` — `import/order` (and most other style rules) are auto-fixable.

### Rule: function size & complexity (`complexity: max 10`, `max-lines-per-function: warn 80`, `max-depth: 4`)

✅ **Correct** — each handler does **one** thing, with shallow nesting. [`CreateResourceCommandHandler.execute()`](../src/core/application/example/create-resource.command.ts) is ~6 lines: build the entity, save it, publish events, return a result.

❌ **Incorrect** — a handler that also validates input shape, queries another aggregate, branches on feature flags, formats a response DTO, _and_ logs — all in one method with nested `if`/`for`/`try` blocks more than 4 levels deep, or longer than ~80 lines. ESLint will warn on length and **error** if cyclomatic complexity exceeds 10.

> **Why this matters:** a function that does one thing has one reason to change, and a name that accurately describes its single job. When a function grows past these limits, it's usually a sign it's doing two jobs that should be two functions (or two handlers).

### Rule: no `console.*` (`no-console`, `warn`/`error` allowed)

✅ **Correct** — use NestJS's `Logger`:

```ts
// src/adapters/driven/local/local-event.publisher.ts
private readonly logger = new Logger(LocalEventPublisher.name);
// ...
this.logger.debug(`Publishing event ${event.type}`);
```

❌ **Incorrect:**

```ts
console.log('Publishing event', event.type);
```

> **Why this matters:** `Logger` output goes through the structured `nestjs-pino` pipeline (JSON in production, pretty-printed in dev) and automatically includes context like the class name. `console.log` bypasses all of that — it won't be redacted, correlated, or shipped to log aggregation the same way.

---

## 7. Development Workflow

> **In plain terms:** most days you'll either (a) make a small, incremental change to something that already exists, or (b) — much more rarely — add a brand-new business concept ("aggregate") the boilerplate doesn't have yet. This section gives you a numbered recipe for both, each with a **"✅ How to verify it worked"** checkpoint.

### 7.1 Recipe: Add a brand-new vertical slice (new aggregate + full feature)

This is the recipe from [`CONTRIBUTING.md`](../CONTRIBUTING.md) §"Add a new vertical slice", expanded step-by-step. Use it when adding an entirely new business concept — the example below uses `Agent` (the same example `CONTRIBUTING.md` uses), but the steps are identical for any aggregate name.

#### Step 1 — Model the aggregate (domain layer, pure TypeScript)

Create `src/core/domain/agent/agent.entity.ts`, following the exact shape of [`src/core/domain/example/resource.entity.ts`](../src/core/domain/example/resource.entity.ts): a `private constructor`, a `static create(...)` factory that validates input and raises a domain event, a `static rehydrate(...)` factory for loading from storage (no events), readonly getters, and mutator methods.

Also create `src/core/domain/agent/agent-events.ts` for any domain events (e.g. `AgentCreatedEvent`), following [`resource-events.ts`](../src/core/domain/example/resource-events.ts).

> **Why this matters:** this is the _only_ step that has zero dependencies on anything else — no database, no HTTP, no NestJS. Getting the business rules right here, with fast tests, is cheaper than discovering a bug after the database/API are also built on top of it.

✅ **How to verify it worked:** write `test/unit/agent.entity.spec.ts` (mirror [`resource.entity.spec.ts`](../test/unit/resource.entity.spec.ts)) and run:

```bash
pnpm test:unit -- agent.entity.spec.ts
# Expected output: PASS  test/unit/agent.entity.spec.ts
#                  Tests: N passed, N total
```

#### Step 2 — Declare ports (application layer)

Create `src/core/application/ports/agent.repository.ts`:

```ts
import type { Agent } from '~/core/domain/agent/agent.entity';

export interface IAgentRepository {
  findById(id: string): Promise<Agent | null>;
  save(agent: Agent): Promise<void>;
}

export const AGENT_REPOSITORY = Symbol('IAgentRepository');
```

> **Why this matters:** this interface is a _contract_, not an implementation. Nothing in `core/application` knows yet whether `Agent` rows live in Postgres, MongoDB, or an in-memory map — and it doesn't need to.

✅ **How to verify it worked:** `pnpm typecheck` passes (the file compiles on its own — there's nothing to "run" yet).

#### Step 3 — Write the use case (CQRS command/query + handler)

Create `src/core/application/agent/create-agent.command.ts`, following [`create-resource.command.ts`](../src/core/application/example/create-resource.command.ts): export both `CreateAgentCommand` (the data) and `@CommandHandler(CreateAgentCommand) class CreateAgentCommandHandler` (the logic), injecting `AGENT_REPOSITORY` and `EVENT_PUBLISHER` by their `Symbol` tokens.

✅ **How to verify it worked:** write `test/unit/create-agent.command.spec.ts` (mirror [`create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts)) using **plain Jest mocks** for `IAgentRepository` and `IEventPublisher` — no NestJS `Test.createTestingModule`, no database:

```bash
pnpm test:unit -- create-agent.command.spec.ts
# Expected output: PASS  test/unit/create-agent.command.spec.ts
```

#### Step 4 — Implement the driven adapter (Prisma repository)

1. Add an `Agent` model to a new file `prisma/schema/agent.prisma` (sibling to [`example.prisma`](../prisma/schema/example.prisma)), following the same shape: `id`, business columns, `createdAt`/`updatedAt`/`deletedAt` (soft delete), `createdBy`/`updatedBy`, `@@map("agents")`.
2. Run:
   ```bash
   pnpm prisma:migrate --name add_agent
   # Expected output: ... "Your database is now in sync with your schema." ...
   #                   A new folder appears under prisma/migrations/<timestamp>_add_agent/
   ```
3. Implement `PrismaAgentRepository` in `src/adapters/driven/prisma/agent.repository.ts`, following [`resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts) (including its private `toDomain()` mapping method).
4. Register the binding in [`PrismaModule`](../src/adapters/driven/prisma/prisma.module.ts)'s `providers`/`exports`: `{ provide: AGENT_REPOSITORY, useClass: PrismaAgentRepository }`.

✅ **How to verify it worked:**

```bash
pnpm prisma:generate
# Expected output: "✔ Generated Prisma Client ..."
pnpm typecheck
# Expected output: no errors
```

#### Step 5 — Implement the driving adapter (HTTP controller + DTOs)

Create `src/adapters/driving/http/agent/agent.controller.ts` and `agent.dto.ts`, following [`resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts) and [`resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts). **All `@nestjs/swagger` decorators live here, and only here.**

> **Why this matters:** anyone reading `src/adapters/driving/http/` should be able to understand the entire public HTTP API of this service without reading any other folder.

✅ **How to verify it worked:** start the app (`pnpm start:dev`) and open `http://localhost:3000/docs` — the new `agents` tag and its endpoints appear in Swagger UI.

#### Step 6 — Wire it in a feature module

Create `src/infrastructure/modules/agent.module.ts`, following [`example.module.ts`](../src/infrastructure/modules/example.module.ts): `imports: [CqrsModule]`, `controllers: [AgentController]`, `providers: [...HANDLERS, ...]`. Add `AgentModule` to [`AppModule`](../src/infrastructure/app.module.ts)'s `imports` array.

✅ **How to verify it worked:**

```bash
pnpm start:dev
# Expected output (among the startup logs):
#   [Nest] ... LOG [InstanceLoader] AgentModule dependencies initialized
#   [Nest] ... LOG [RoutesResolver] AgentController {/v1/agents}: ...
```

#### Step 7 — Publish an integration event (optional, only if the aggregate raises domain events)

The `IEventPublisher` port is already wired and bound to [`LocalEventPublisher`](../src/adapters/driven/local/local-event.publisher.ts) (which just logs). No code change is needed for `AgentCreatedEvent` to flow through `publishAll()` and be logged. **If/when a real broker is introduced**, you would implement `IEventPublisher` against it and rebind `EVENT_PUBLISHER` in `agent.module.ts` — the command handler code does not change.

✅ **How to verify it worked:** trigger the use case (e.g. `POST /v1/agents`) and check the application logs for a line like `Publishing event agent.agent.created` from `LocalEventPublisher`.

#### Step 8 — Document

If the new feature changes how data flows through the system, update the relevant diagram(s) in [`docs/diagrams/`](../docs/diagrams/) (`.mmd` files — plain text, edit directly).

✅ **How to verify it worked:** paste the updated `.mmd` file into [mermaid.live](https://mermaid.live) (or a VS Code Mermaid preview) and confirm it renders without syntax errors.

---

### 7.2 Smaller, everyday changes

#### Add an endpoint to an existing controller

1. Add a new method to the controller (e.g. `src/adapters/driving/http/example/resource.controller.ts`), decorated with `@Get()`/`@Post()`/`@Patch()`/`@Delete()` plus `@Roles(...)` and Swagger decorators.
2. If the endpoint needs a new use case, add a new Command/Query + Handler in `core/application/<feature>/` (Step 3 above) and register the handler in the feature module's `providers` (Step 6 above).
3. If the request body/query needs new fields, add or extend a DTO in the same `*.dto.ts` file.

✅ **How to verify it worked:** `pnpm start:dev`, then check `http://localhost:3000/docs` for the new route, and call it with `curl` or the Swagger "Try it out" button. [Section 9](#9-end-to-end-tutorial) walks through this exact recipe in full for a real endpoint.

#### Add a new query (read-only use case)

1. Create `src/core/application/<feature>/<verb-feature>.query.ts`, following [`list-resources.query.ts`](../src/core/application/example/list-resources.query.ts): export the `Query` class (`implements IQuery`) and its `@QueryHandler` class, injecting only the repository port (never `EVENT_PUBLISHER` — queries must not have side effects).
2. Register the handler in the feature module's `providers`.
3. Call it from a controller via `this.queryBus.execute(new YourQuery(...))`.

✅ **How to verify it worked:** unit-test the handler with a mocked repository (`pnpm test:unit -- your-query.spec.ts`), then confirm the new `GET` route appears in `/docs`.

#### Add a database column / new migration

1. Edit the relevant `.prisma` file under `prisma/schema/` (e.g. add a column to `model Resource` in [`example.prisma`](../prisma/schema/example.prisma)).
2. Run `pnpm prisma:migrate --name <describe_the_change>` (or `make migrate NAME=<describe_the_change>`).
3. Update the domain entity's `create`/`rehydrate`/getters, the repository's `ResourceRow` interface and `toDomain()`/`save()` mapping, and any DTOs that should expose the new field.

✅ **How to verify it worked:**

```bash
pnpm prisma:migrate --name add_my_column
# Expected output: "Your database is now in sync with your schema."
#                   A new folder appears under prisma/migrations/
pnpm typecheck
# Expected output: no errors (catches any mapping you forgot to update)
```

> **Warning:** **Intentionally omitted from boilerplate**: any existing migrations (You generate these yourself for your specific project when you first run Prisma migrate) — `prisma/migrations/` does not exist yet in this boilerplate. The **first** time anyone runs `pnpm prisma:migrate`, Prisma will create that folder and an initial migration covering `Resource` and `OutboxEvent`. This is a one-time event for a brand-new clone — see the troubleshooting table in [Section 8](#8-boilerplate-usage-guide), which explains why `make dev` alone does **not** create your database tables.

---

## 8. Boilerplate Usage Guide

This section walks through using this repository as the **starting point for a brand-new service** — from `git clone` to a running, verified API.

### 8.1 Clone the boilerplate

```bash
git clone <your-org-git-url>/nest-boilerplate.git my-new-service
cd my-new-service
```

> **Note:** this repository's own `origin` remote is `git@github-work:CloudTechService/nest-boilerplate.git` (`github-work` is a custom SSH host alias configured on this machine — **intentionally omitted from boilerplate**: what alias or URL _your_ machine should use). Use whatever clone URL your organization's Git hosting provides for this boilerplate (SSH or HTTPS).

### 8.2 Rename the project

> **Why this matters:** every file below contains the placeholder name **`nest`** (or `generic`/`example`) standing in for "your service's name." If you skip this step, your service will run fine, but its Docker containers, database, and `package.json` will all be named `nest`/`generic` — confusing once you have several services running side by side.

| #   | File                                                                                                                                                      | What to change                                                                                                                                      | Current value                                                                                                                                                                 | Change to                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | [`package.json`](../package.json)                                                                                                                         | `"name"` field                                                                                                                                      | `"nest-api-boilerplate"`                                                                                                                                                      | `"<your-service>-api"`                                                                                          |
| 2   | [`README.md`](../README.md)                                                                                                                               | Title and intro paragraph                                                                                                                           | `` # `nest-api-boilerplate` ``, "Replace the nest `Resource` example aggregate..."                                                                                            | your service's name and aggregate name                                                                          |
| 3   | [`docker-compose.yml`](../docker-compose.yml)                                                                                                             | 3× `container_name`, `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`, the `pg_isready -U` healthcheck, and the `api` service's `DATABASE_URL` | `nest_postgres`, `nest_redis`, `nest_api`, `POSTGRES_USER: nest` / `POSTGRES_PASSWORD: nest` / `POSTGRES_DB: nest`, `postgresql://nest:nest@postgres:5432/nest?schema=public` | `<your-service>_postgres`, etc., and matching DB credentials                                                    |
| 4   | [`.env.example`](../.env.example)                                                                                                                         | `SERVICE_NAME`, `DATABASE_URL`                                                                                                                      | `SERVICE_NAME=generic-api`, `DATABASE_URL=postgresql://generic:generic@localhost:5432/generic?schema=public`                                                                  | match the new `docker-compose.yml` values from row 3                                                            |
| 5   | [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts)                                                                                 | `SERVICE_NAME` Zod default                                                                                                                          | `.default('nest-api')`                                                                                                                                                        | `.default('<your-service>-api')`                                                                                |
| 6   | `src/core/domain/example/`, `src/core/application/example/`, `src/adapters/*/example/`, [`prisma/schema/example.prisma`](../prisma/schema/example.prisma) | Replace the entire `Resource`/`example` vertical slice with your real first aggregate                                                               | `Resource`, `resources`, `example.*` paths and event types                                                                                                                    | `<YourAggregate>` — follow [Section 7.1](#71-recipe-add-a-brand-new-vertical-slice-new-aggregate--full-feature) |

> **Warning:** **do not** rename the word "nest" everywhere indiscriminately. `@nestjs/*` package names, the `nest build` / `nest start` CLI commands (from `@nestjs/cli`, see [`nest-cli.json`](../nest-cli.json)), and the word "NestJS" itself refer to the **framework**, not your project, and must stay as-is.

### 8.3 Environment setup

```bash
cp .env.example .env
# Expected output: (no output — the file .env now exists)
```

`.env` is read by [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts) (and by `docker-compose.yml`, which passes `KEYCLOAK_*` through to the `api` container). It is **git-ignored** — never commit it.

| Variable                      | Purpose                                                              | Example value                                                            | Secret?                                                                      |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `NODE_ENV`                    | Runtime mode — affects logging format and whether Swagger is enabled | `development`                                                            | No                                                                           |
| `SERVICE_NAME`                | Shown in logs and the startup banner                                 | `generic-api`                                                            | No                                                                           |
| `APP_PORT`                    | HTTP port the server listens on                                      | `3000`                                                                   | No                                                                           |
| `API_PREFIX`                  | URL version prefix (`/v1/...`)                                       | `v1`                                                                     | No                                                                           |
| `LOG_LEVEL`                   | Pino log level                                                       | `debug`                                                                  | No                                                                           |
| `DATABASE_URL`                | PostgreSQL connection string (includes username + password)          | `postgresql://generic:generic@localhost:5432/generic?schema=public`      | **Yes** — contains a DB password                                             |
| `KEYCLOAK_BASE_URL`           | Base URL of your Keycloak server                                     | `https://auth.example.com`                                               | No                                                                           |
| `KEYCLOAK_REALM`              | Keycloak realm name                                                  | `my-realm`                                                               | No                                                                           |
| `KEYCLOAK_CLIENT_ID`          | Confidential client ID registered in Keycloak                        | `my-api`                                                                 | No                                                                           |
| `KEYCLOAK_CLIENT_SECRET`      | Client secret from Keycloak → Clients → Credentials                  | `replace-with-your-client-secret`                                        | **Yes**                                                                      |
| `KEYCLOAK_JWKS_URL`           | JWKS endpoint used for local JWT signature validation                | `https://auth.example.com/realms/my-realm/protocol/openid-connect/certs` | No                                                                           |
| `KEYCLOAK_ISSUER`             | Must match the `iss` claim of incoming JWTs exactly                  | `https://auth.example.com/realms/my-realm`                               | No                                                                           |
| `REDIS_URL`                   | Optional cache connection string                                     | `redis://localhost:6379`                                                 | No (unless your Redis URL embeds a password)                                 |
| `CACHE_ENABLED`               | Toggles cache usage                                                  | `false`                                                                  | No                                                                           |
| `CORS_ALLOWED_ORIGINS`        | Comma-separated allow-list for browser origins                       | `http://localhost:5173`                                                  | No                                                                           |
| `SENTRY_DSN`                  | Error-tracking endpoint                                              | _(empty)_                                                                | **Treat as sensitive** — anyone with the DSN can send events to your project |
| `OTEL_ENABLED`                | Toggles OpenTelemetry export                                         | `false`                                                                  | No                                                                           |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector URL                                                   | `https://api.honeycomb.io`                                               | No                                                                           |
| `OTEL_EXPORTER_OTLP_HEADERS`  | Headers sent to the OTLP collector (often an API key)                | `x-honeycomb-team=YOUR_KEY`                                              | **Yes**                                                                      |
| `THROTTLE_TTL`                | Rate-limit window, in seconds                                        | `60`                                                                     | No                                                                           |
| `THROTTLE_LIMIT`              | Max requests per window                                              | `100`                                                                    | No                                                                           |
| `FEATURE_FLAGS_OVERRIDES`     | Comma-separated feature-flag overrides                               | _(empty)_                                                                | No                                                                           |

> **Warning:** the `KEYCLOAK_*` placeholder values point at `auth.example.com`, which does not exist. The app will **start** successfully with these placeholders ([`env.ts`](../src/infrastructure/config/env.ts) only checks they are _well-formed URLs_, not that they're reachable), and `/v1/health` will work — but [`JwtAuthGuard`](../src/common/guards/jwt-auth.guard.ts) will fail to fetch the JWKS for any guarded route (e.g. `/v1/resources`), returning `401 Unauthorized`. You need a real, reachable Keycloak instance to exercise guarded endpoints — see [Section A](#section-a-prerequisites--toolchain-setup).

### 8.4 Database setup

> **Critical — read this before running `make dev`.** This repository ships **without** a `prisma/migrations/` folder. Until you run `pnpm prisma:migrate` at least once, your database has **no tables** — see the Warning at the end of [Section 7.2](#72-smaller-everyday-changes).

1. **Fix the database credential mismatch.** [`.env.example`](../.env.example)'s `DATABASE_URL` (`generic:generic@.../generic`) does **not** match [`docker-compose.yml`](../docker-compose.yml)'s Postgres service (`POSTGRES_USER: nest`, `POSTGRES_PASSWORD: nest`, `POSTGRES_DB: nest`). In your `.env`, set:

   ```bash
   DATABASE_URL=postgresql://nest:nest@localhost:5432/nest?schema=public
   ```

   (or, if you completed [Section 8.2](#82-rename-the-project), use whatever credentials you put in `docker-compose.yml`).

2. **Start the database** (and Redis):

   ```bash
   docker compose up -d postgres redis
   # Expected output: ... Container nest_postgres  Healthy
   #                   ... Container nest_redis     Started
   ```

3. **Generate the Prisma client:**

   ```bash
   pnpm prisma:generate
   # Expected output: "✔ Generated Prisma Client (v5.18.x) ..."
   ```

4. **Create and apply the initial migration** (one-time, only needed if `prisma/migrations/` doesn't exist yet):

   ```bash
   pnpm prisma migrate dev --schema=./prisma/schema --name init
   # Expected output: "Applying migration `<timestamp>_init`"
   #                   "Your database is now in sync with your schema."
   #                   A new folder appears: prisma/migrations/<timestamp>_init/
   ```

5. **Seed sample data (optional):**
   ```bash
   pnpm prisma:seed
   # Expected output: "Seeded 25 resources"  (see prisma/seed.ts)
   ```

### 8.5 First run

```bash
pnpm install
# Expected output: "Done in Xs" — installs all workspace dependencies

pnpm start:dev
# Expected output (key lines):
#   [Nest] ... LOG [NestFactory] Starting Nest application...
#   [Nest] ... LOG [InstanceLoader] PrismaModule dependencies initialized
#   [Nest] ... LOG [InstanceLoader] ExampleModule dependencies initialized
#   [Nest] ... LOG [RoutesResolver] ResourceController {/v1/resources}: ...
#   [Nest] ... LOG [RoutesResolver] HealthController {/v1/health}: ...
#   [Bootstrap] 🚀  generic-api running on http://localhost:3000 (development)
```

> **Tip:** `make dev` does steps 8.4.2–8.4.3 and `pnpm start:dev` for you in one command — but it does **not** run step 8.4.4 (the initial migration). Run step 8.4.4 once, manually, on a fresh clone.

### 8.6 Verification

| Check                          | Command / URL                                       | Expected result                                                                                                                              |
| ------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| API is up                      | `curl http://localhost:3000/v1/health`              | `{"success":true,"data":{"status":"ok","timestamp":"..."},"message":"OK","meta":{...}}`                                                      |
| Swagger UI                     | open `http://localhost:3000/docs`                   | Interactive API docs, including the `resources` and `health` tags                                                                            |
| Database has tables            | `pnpm prisma:studio` → open `http://localhost:5555` | `Resource` and `OutboxEvent` tables are listed (and contain 25 rows each... `OutboxEvent` empty, `Resource` has 25 rows if you ran the seed) |
| Guarded endpoint requires auth | `curl http://localhost:3000/v1/resources`           | `{"success":false,"error":{"code":"HTTP_401",...}}` — **this is correct**: you haven't sent a JWT                                            |

### 8.7 Troubleshooting

| Symptom                                                                                                             | Cause                                                                                                                                                                       | Fix                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm prisma migrate dev` fails with `P1000: Authentication failed` or `database "generic" does not exist`          | `.env`'s `DATABASE_URL` still has the `.env.example` placeholder credentials (`generic:generic@.../generic`), which don't match the `nest:nest@.../nest` Postgres container | Update `DATABASE_URL` in `.env` to `postgresql://nest:nest@localhost:5432/nest?schema=public` (see [8.4.1](#84-database-setup))                                                                                                   |
| App starts fine, `/v1/health` returns `200`, but `/v1/resources` returns `500` with `code: "INTERNAL_SERVER_ERROR"` | `prisma/migrations/` doesn't exist yet — the `resources` table was never created                                                                                            | Run `pnpm prisma migrate dev --schema=./prisma/schema --name init` (see [8.4.4](#84-database-setup)), then restart                                                                                                                |
| `pnpm prisma:seed` fails with `relation "resources" does not exist`                                                 | Same as above — seeding requires the table to exist first                                                                                                                   | Run the migration (8.4.4) **before** seeding                                                                                                                                                                                      |
| Any guarded endpoint (e.g. `/v1/resources`) returns `401 Unauthorized` even with a token                            | `KEYCLOAK_JWKS_URL` / `KEYCLOAK_ISSUER` still point at the `auth.example.com` placeholder, or your token's `iss` claim doesn't exactly match `KEYCLOAK_ISSUER`              | Point `KEYCLOAK_*` vars at a real, reachable Keycloak realm; ensure `KEYCLOAK_ISSUER` matches the JWT's `iss` claim exactly, including the `/realms/<realm>` suffix (see [`CONTRIBUTING.md`](../CONTRIBUTING.md) troubleshooting) |
| `docker compose up` fails: `port is already allocated` for `5432`/`6379`/`3000`/`8025`                              | Another process (often a previously-running stack, or a local Postgres install) is using the port                                                                           | Stop the conflicting process, or change the host-side port mapping in `docker-compose.yml` (e.g. `'5433:5432'`)                                                                                                                   |
| `pnpm lint` reports hundreds of `prettier/prettier "Delete '␍'"` errors                                             | Files were checked out with Windows-style CRLF line endings, but [`.editorconfig`](../.editorconfig) and [`.prettierrc`](../.prettierrc) require LF                         | Run `git config core.autocrlf false` (or `input`) and re-checkout the files, or run `pnpm lint:fix` / `prettier --write` to normalize line endings                                                                                |
| `JwtAuthGuard` can't reach Keycloak when the **API itself runs inside Docker**                                      | From inside a container, `localhost` refers to the container, not your host machine                                                                                         | Use `host.docker.internal` instead of `localhost` in `KEYCLOAK_JWKS_URL`/`KEYCLOAK_ISSUER` when Keycloak runs on your host (see [`CONTRIBUTING.md`](../CONTRIBUTING.md))                                                          |

---

## 9. End-to-End Tutorial

> **Plain English summary:** this section is a hands-on walkthrough. You will make two real, working changes to this codebase: a tiny one (to see the edit → run → check loop), and a complete one (a brand-new API endpoint, built the "right way", from the domain layer up to HTTP). By the end, you will have touched every layer described in [Section 2](#2-architecture-overview).

### 9.1 Your first 5-minute change

**Goal:** make one small, safe edit, see it take effect, and confirm it — before attempting anything bigger.

1. Make sure the API is running:

   ```bash
   pnpm start:dev
   # Expected output (key lines):
   #   [Nest] ... LOG [NestFactory] Starting Nest application...
   #   [Bootstrap] 🚀  generic-api running on http://localhost:3000 (development)
   ```

2. Open [`src/common/interceptors/response-transform.interceptor.ts`](../src/common/interceptors/response-transform.interceptor.ts). This file controls the **envelope** — the wrapper object — that every successful API response is placed inside. Find this line (line 30):

   ```typescript
   // src/common/interceptors/response-transform.interceptor.ts
   message: 'OK',
   ```

3. Change it to:

   ```typescript
   // src/common/interceptors/response-transform.interceptor.ts
   message: 'Request handled successfully',
   ```

4. Save the file. Because `pnpm start:dev` runs Nest in **watch mode**, it detects the change automatically.

   ```text
   # Expected output in the terminal running `pnpm start:dev`:
   File change detected. Starting incremental compilation...
   Found 0 errors. Watching for file changes.
   ```

   > **Note:** if you see TypeScript errors here instead, you have a typo. Compare your edit character-by-character with the snippet above — strict mode (see [Section B](#section-b-glossary--technology-primers)) catches even small mistakes like a missing comma.

5. In a second terminal, call the health endpoint:

   ```bash
   curl http://localhost:3000/v1/health
   ```

   ```json
   // Expected output:
   {
     "success": true,
     "data": { "status": "ok", "timestamp": "2026-06-10T12:00:00.000Z" },
     "message": "Request handled successfully",
     "meta": { "timestamp": "2026-06-10T12:00:00.000Z", "correlationId": null }
   }
   ```

6. **Checkpoint:** if `"message"` reads `"Request handled successfully"`, the loop worked: you edited a file, the running server picked it up, and you observed the new behavior over HTTP. This is the core feedback loop you'll use for everything in this guide.

> **Tip:** every controller in this codebase returns a plain object or class instance (e.g. `{ id, name, description }`). [`ResponseTransformInterceptor`](../src/common/interceptors/response-transform.interceptor.ts) — registered globally in [`src/infrastructure/main.ts`](../src/infrastructure/main.ts) — wraps that return value in `{ success, data, message, meta }` automatically. You never construct this envelope yourself inside a controller.

> If you want a completely clean working tree before continuing, you can revert this change later with `git checkout -- src/common/interceptors/response-transform.interceptor.ts`. It is harmless to leave it, too — the rest of this tutorial does not depend on it either way.

---

### 9.2 Full tutorial: add a "Deactivate Resource" endpoint

**The feature:** the `Resource` aggregate already has a `deactivate()` method ([`src/core/domain/example/resource.entity.ts:59-62`](../src/core/domain/example/resource.entity.ts)) and a passing unit test for it ([`test/unit/resource.entity.spec.ts:49-53`](../test/unit/resource.entity.spec.ts)) — but **nothing calls it**. There is no command, no handler, and no HTTP route. This is a perfect first feature: the hardest part (the business rule) is already written and tested. Your job is to **wire it through every layer**, the same way you would for any new piece of behavior.

By the end of this tutorial you will have:

1. Taught the domain to announce _"a resource was deactivated"_ as an event.
2. Written a **command** and **command handler** (the application layer / use case).
3. Added a new **HTTP endpoint** (the driving adapter).
4. Registered everything with the dependency injection container (the module).
5. Written and run **unit tests** for all of the above.

> **Reminder of the vocabulary used below** (see [Section B](#section-b-glossary--technology-primers) for full definitions):
>
> - **Domain event** — a small, immutable record of "something important happened", e.g. _"resource X was deactivated at time T"_. Other parts of the system (or other services, via a message broker) can react to it later without the original code knowing or caring who's listening.
> - **Command** — a plain object describing _"please do this"_ (e.g. "deactivate resource X"). It carries no logic itself.
> - **Command handler** — the class that knows _how_ to carry out a command. This is the "use case" / "application service" mentioned throughout this guide.
> - **Port** — a TypeScript interface (`IResourceRepository`, `IEventPublisher`) that the application layer depends on, without knowing which concrete class implements it. Think of it as a wall socket shape — any plug (adapter) of the right shape works.

#### Step 1 — Add a new domain event: `ResourceDeactivatedEvent`

**File:** [`src/core/domain/example/resource-events.ts`](../src/core/domain/example/resource-events.ts)

This file currently defines one event, `ResourceCreatedEvent`, which is raised by `Resource.create()`. Add a matching event for deactivation, following the exact same shape:

```typescript
// src/core/domain/example/resource-events.ts
import { v4 as uuidv4 } from 'uuid';

import { DomainEvent } from '~/core/domain/example/domain-event.base';

export interface ResourceCreatedPayload {
  resourceId: string;
  name: string;
  occurredAt: string;
}

export class ResourceCreatedEvent extends DomainEvent<ResourceCreatedPayload> {
  constructor(payload: ResourceCreatedPayload, correlationId?: string) {
    super(uuidv4(), 'example.resource.created', 'nest/api', payload, correlationId);
  }
}

// --- ADD EVERYTHING BELOW THIS LINE ---

/** The data carried by a "resource deactivated" event. */
export interface ResourceDeactivatedPayload {
  resourceId: string; // which resource was deactivated
  occurredAt: string; // ISO-8601 timestamp of when it happened
}

/**
 * Raised by Resource.deactivate(). Anything subscribed to
 * "example.resource.deactivated" (e.g. a notifications service,
 * a search-index updater) can react without this code knowing about it.
 */
export class ResourceDeactivatedEvent extends DomainEvent<ResourceDeactivatedPayload> {
  constructor(payload: ResourceDeactivatedPayload, correlationId?: string) {
    // 'example.resource.deactivated' is the event TYPE — this is the string
    // that subscribers filter on. Naming convention: <bounded-context>.<aggregate>.<past-tense-verb>
    super(uuidv4(), 'example.resource.deactivated', 'nest/api', payload, correlationId);
  }
}
```

> **Why this matters:** [`DomainEvent`](../src/core/domain/example/domain-event.base.ts) follows the **CloudEvents 1.0** envelope shape (`id`, `type`, `source`, `time`, `data`) — the same shape used by `@nuera/shared-contracts` in the related Nuera repos (see the root `CLAUDE.md`). Even though this boilerplate's [`LocalEventPublisher`](../src/adapters/driven/local/local-event.publisher.ts) only logs events today, defining them this way means a future swap to a real message broker (NATS, SQS, Kafka — see Appendix B) requires **zero changes to the domain layer**.

> ✅ **Checkpoint:** run `pnpm typecheck`. Expected output: `Found 0 errors.` — the new file compiles, but nothing uses it yet, so nothing else changes.

#### Step 2 — Make `Resource.deactivate()` raise the new event

**File:** [`src/core/domain/example/resource.entity.ts`](../src/core/domain/example/resource.entity.ts)

First, update the import at the top of the file (line 4) to bring in the new event alongside the existing one:

```typescript
// src/core/domain/example/resource.entity.ts  (line 4 — BEFORE)
import { ResourceCreatedEvent } from '~/core/domain/example/resource-events';
```

```typescript
// src/core/domain/example/resource.entity.ts  (line 4 — AFTER)
import { ResourceCreatedEvent, ResourceDeactivatedEvent } from '~/core/domain/example/resource-events';
```

Now update the `deactivate()` method (currently lines 59-62):

```typescript
// src/core/domain/example/resource.entity.ts — BEFORE
deactivate(): void {
  this._active = false;
  this._updatedAt = new Date();
}
```

```typescript
// src/core/domain/example/resource.entity.ts — AFTER
deactivate(): void {
  this._active = false;
  this._updatedAt = new Date();
  // Record that this happened, so the application layer can publish it
  // AFTER the change has been saved successfully (see Step 4).
  this.addDomainEvent(
    new ResourceDeactivatedEvent({
      resourceId: this.id,
      occurredAt: this._updatedAt.toISOString(),
    }),
  );
}
```

> **Why this matters:** `addDomainEvent()` (defined in [`AggregateRoot`](../src/core/domain/example/aggregate-root.base.ts), the base class every entity extends) just pushes the event onto an in-memory list — it does **not** send anything anywhere. The entity stays "pure": it has no idea whether anyone is listening, and it never talks to the database, an HTTP client, or a message queue directly. This is the Hexagonal Architecture rule from [Section 5](#5-import-rules) in action: `core/domain` may only import from `core/domain`.

> **Common mistake to avoid:** do not call `this.publisher.publish(...)` or any I/O from inside an entity method. If you find yourself wanting to `import` something from `adapters/` or `infrastructure/` into `core/domain`, stop — that is exactly the [`boundaries/element-types`](#5-import-rules) violation ESLint is configured to catch. The fix is always the same: raise an event here, and let the **application layer** (Step 4) decide what to do with it.

#### Step 3 — Update the existing domain test

**File:** [`test/unit/resource.entity.spec.ts`](../test/unit/resource.entity.spec.ts)

The existing test for `deactivate()` (lines 49-53) only checks that `active` becomes `false`. Update it to also verify the new event:

```typescript
// test/unit/resource.entity.spec.ts — BEFORE (lines 49-53)
it('deactivate marks inactive', () => {
  const r = Resource.create({ name: 'Active' });
  r.deactivate();
  expect(r.active).toBe(false);
});
```

```typescript
// test/unit/resource.entity.spec.ts — AFTER
it('deactivate marks inactive and raises ResourceDeactivatedEvent', () => {
  const r = Resource.create({ name: 'Active' });
  r.pullDomainEvents(); // discard the "created" event so we only look at "deactivated" below

  r.deactivate();
  expect(r.active).toBe(false);

  const events = r.pullDomainEvents();
  expect(events).toHaveLength(1);
  expect(events[0]).toBeInstanceOf(ResourceDeactivatedEvent);
  expect(events[0]?.type).toBe('example.resource.deactivated');
});
```

Add `ResourceDeactivatedEvent` to the existing import from `resource-events` at the top of the file (line 3):

```typescript
// test/unit/resource.entity.spec.ts (line 3 — AFTER)
import { ResourceCreatedEvent, ResourceDeactivatedEvent } from '~/core/domain/example/resource-events';
```

> ✅ **Checkpoint:** run the focused test file:
>
> ```bash
> pnpm test:unit -- resource.entity.spec.ts
> ```
>
> ```text
> # Expected output (key lines):
> PASS  test/unit/resource.entity.spec.ts
>   Resource (domain)
>     mutations
>       ✓ rename validates and updates timestamp
>       ✓ deactivate marks inactive and raises ResourceDeactivatedEvent
>
> Test Suites: 1 passed, 1 total
> Tests:       6 passed, 6 total
> ```
>
> If you see `Cannot find name 'ResourceDeactivatedEvent'`, you forgot the import — go back and add it.

#### Step 4 — Create the command and handler (application layer / use case)

**New file:** `src/core/application/example/deactivate-resource.command.ts`

> **Note:** in this repo, a command's message class and its handler class live **in the same file** (see [`create-resource.command.ts`](../src/core/application/example/create-resource.command.ts)). This is a deliberate convention — it keeps "what to do" and "how to do it" next to each other for a given use case.

```typescript
// src/core/application/example/deactivate-resource.command.ts
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { EVENT_PUBLISHER, type IEventPublisher } from '~/core/application/ports/event-publisher.port';
import { RESOURCE_REPOSITORY, type IResourceRepository } from '~/core/application/ports/resource.repository';
import { EntityNotFoundException } from '~/core/domain/example/exceptions';

// The COMMAND: a plain class describing the request. It carries data only —
// `ICommand` is an empty marker interface from @nestjs/cqrs that lets the
// CommandBus recognize this as something it can route.
export class DeactivateResourceCommand implements ICommand {
  constructor(public readonly resourceId: string) {}
}

// What the handler hands back to the controller. Small and serializable —
// never return the full domain entity directly (see Section 6, "no-any" /
// "encapsulation" rules — the entity has private fields).
export interface DeactivateResourceResult {
  id: string;
  active: boolean;
}

// @CommandHandler(DeactivateResourceCommand) registers this class with
// Nest's CommandBus, so `commandBus.execute(new DeactivateResourceCommand(id))`
// (called from the controller in Step 6) routes here automatically.
@CommandHandler(DeactivateResourceCommand)
export class DeactivateResourceCommandHandler implements ICommandHandler<
  DeactivateResourceCommand,
  DeactivateResourceResult
> {
  constructor(
    // @Inject(RESOURCE_REPOSITORY) asks Nest's DI container for "whatever
    // class is currently bound to this port" (see Step 7 — ExampleModule).
    // This handler only knows the IResourceRepository INTERFACE, never Prisma.
    @Inject(RESOURCE_REPOSITORY) private readonly repo: IResourceRepository,
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  async execute(command: DeactivateResourceCommand): Promise<DeactivateResourceResult> {
    const resource = await this.repo.findById(command.resourceId);

    // EntityNotFoundException is a DOMAIN exception (src/core/domain/example/exceptions.ts).
    // AllExceptionsFilter (src/infrastructure/filters/all-exceptions.filter.ts) converts
    // it into an HTTP 404 automatically — this handler never thinks about HTTP codes.
    if (!resource) {
      throw new EntityNotFoundException('Resource', command.resourceId);
    }

    resource.deactivate(); // domain logic — raises ResourceDeactivatedEvent (Step 2)
    await this.repo.save(resource); // persist the new state

    // Only pull and publish events AFTER a successful save — never before.
    const events = resource.pullDomainEvents();
    await this.publisher.publishAll(events);

    return { id: resource.id, active: resource.active };
  }
}
```

> **Why this matters — "Why not just call Prisma directly from here?"** Notice the handler imports `IResourceRepository` (a `core/application` interface, a.k.a. "port"), never `PrismaResourceRepository` (the `adapters/driven` implementation). If tomorrow this project switches from PostgreSQL to DynamoDB, **this file does not change** — only a new adapter is written and re-bound in the module (Step 7). This is the entire point of [Hexagonal Architecture](#section-b-glossary--technology-primers): the use case is testable and stable even as infrastructure changes underneath it.

> ✅ **Checkpoint:** run `pnpm typecheck`. Expected output: `Found 0 errors.`

#### Step 5 — Unit test the new handler

**New file:** `test/unit/deactivate-resource.command.spec.ts`

This mirrors the existing [`test/unit/create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts): construct the handler with **hand-written mock objects** for its two ports (`IResourceRepository`, `IEventPublisher`) — no database, no NestJS test module, no HTTP. This is what makes [Section 11's](#11-testing-guide) unit tests run in milliseconds.

```typescript
// test/unit/deactivate-resource.command.spec.ts
import {
  DeactivateResourceCommand,
  DeactivateResourceCommandHandler,
} from '~/core/application/example/deactivate-resource.command';
import type { IEventPublisher } from '~/core/application/ports/event-publisher.port';
import type { IResourceRepository } from '~/core/application/ports/resource.repository';
import { EntityNotFoundException } from '~/core/domain/example/exceptions';
import { Resource } from '~/core/domain/example/resource.entity';

describe('DeactivateResourceCommandHandler', () => {
  let repo: jest.Mocked<IResourceRepository>;
  let publisher: jest.Mocked<IEventPublisher>;
  let handler: DeactivateResourceCommandHandler;

  beforeEach(() => {
    // Hand-written fakes implementing each port. jest.fn() lets us assert
    // "was this called, and with what?" without a real database.
    repo = {
      findById: jest.fn(),
      paginate: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
      softDelete: jest.fn(),
    };
    publisher = {
      publish: jest.fn().mockResolvedValue(undefined),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };
    handler = new DeactivateResourceCommandHandler(repo, publisher);
  });

  it('deactivates the resource and publishes ResourceDeactivatedEvent', async () => {
    const resource = Resource.create({ name: 'Test Resource' });
    resource.pullDomainEvents(); // discard the "created" event
    repo.findById.mockResolvedValue(resource);

    const result = await handler.execute(new DeactivateResourceCommand(resource.id));

    expect(result.active).toBe(false);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(publisher.publishAll).toHaveBeenCalledTimes(1);
    const publishedEvents = publisher.publishAll.mock.calls[0]?.[0] ?? [];
    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0]?.type).toBe('example.resource.deactivated');
  });

  it('throws EntityNotFoundException when the resource does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(handler.execute(new DeactivateResourceCommand('missing-id'))).rejects.toThrow(EntityNotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publishAll).not.toHaveBeenCalled();
  });
});
```

> ✅ **Checkpoint:**
>
> ```bash
> pnpm test:unit -- deactivate-resource.command.spec.ts
> ```
>
> ```text
> # Expected output (key lines):
> PASS  test/unit/deactivate-resource.command.spec.ts
>   DeactivateResourceCommandHandler
>     ✓ deactivates the resource and publishes ResourceDeactivatedEvent
>     ✓ throws EntityNotFoundException when the resource does not exist
>
> Test Suites: 1 passed, 1 total
> Tests:       2 passed, 2 total
> ```

#### Step 6 — Add the HTTP endpoint (driving adapter)

**File:** [`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts)

First, extend the `@nestjs/common` import (line 1) to add `Param`, `ParseUUIDPipe`, and `Patch`:

```typescript
// src/adapters/driving/http/example/resource.controller.ts (line 1 — BEFORE)
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
```

```typescript
// src/adapters/driving/http/example/resource.controller.ts (line 1 — AFTER)
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
```

Add the import for the new command, keeping the alphabetical `import/order` from [Section 6](#6-coding-standards) (line 9-10):

```typescript
// src/adapters/driving/http/example/resource.controller.ts (lines 9-11 — AFTER)
import { CreateResourceCommand, type CreateResourceResult } from '~/core/application/example/create-resource.command';
import {
  DeactivateResourceCommand,
  type DeactivateResourceResult,
} from '~/core/application/example/deactivate-resource.command';
import { ListResourcesQuery, type ListResourcesResult } from '~/core/application/example/list-resources.query';
```

Now add the new endpoint method, anywhere inside the `ResourceController` class (after `list()` is a natural place):

```typescript
// src/adapters/driving/http/example/resource.controller.ts — NEW METHOD
@Patch(':id/deactivate')
@HttpCode(HttpStatus.OK)
@Roles('resource:write')
@ApiOperation({ summary: 'Deactivate a resource' })
@ApiResponse({ status: 200, type: ResourceResponseDto })
deactivate(@Param('id', new ParseUUIDPipe()) id: string): Promise<DeactivateResourceResult> {
  return this.commandBus.execute(new DeactivateResourceCommand(id));
}
```

Line-by-line:

- `@Patch(':id/deactivate')` — registers `PATCH /v1/resources/:id/deactivate` (the `version: '1'` and `path: 'resources'` come from the `@Controller(...)` decorator on the class, line 21).
- `@Roles('resource:write')` — re-uses the **same role** as `create()`. `RolesGuard` (registered via `@UseGuards(JwtAuthGuard, RolesGuard)` on the class) checks the caller's JWT for this role — see [Section 10](#10-security-guidelines).
- `@Param('id', new ParseUUIDPipe())` — NestJS validates that the `:id` URL segment is a syntactically valid UUID **before** your code runs. An invalid UUID (e.g. `/v1/resources/not-a-uuid/deactivate`) returns `400 Bad Request` automatically — your handler never sees it.
- The method body is one line: build a `DeactivateResourceCommand` and hand it to the `CommandBus`. **All** the logic is in the handler from Step 4 — this is what "controllers must not contain business logic" ([Section 4](#4-file-placement-rules)) looks like in practice.

> **Common mistake to avoid:** do not write `if (!resource) throw new NotFoundException(...)` here using Nest's HTTP-layer `NotFoundException`. That check belongs in the command handler (Step 4), using the **domain** `EntityNotFoundException`. Keeping it there means the same use case behaves identically whether it's called from HTTP, a CLI, or a message-queue listener in the future.

> ✅ **Checkpoint:** run `pnpm lint`. Expected output: `0 errors` related to this file (pre-existing CRLF warnings from [Section 8.7](#87-troubleshooting) are a separate, environmental issue).

#### Step 7 — Register the handler with the module

**File:** [`src/infrastructure/modules/example.module.ts`](../src/infrastructure/modules/example.module.ts)

Add the import (line 6-7, alphabetical) and add the handler class to the `HANDLERS` array (line 11):

```typescript
// src/infrastructure/modules/example.module.ts — BEFORE
import { CreateResourceCommandHandler } from '~/core/application/example/create-resource.command';
import { ListResourcesQueryHandler } from '~/core/application/example/list-resources.query';
import { ResourceCreatedHandler } from '~/core/application/example/resource-created.handler';
import { EVENT_PUBLISHER } from '~/core/application/ports/event-publisher.port';

const HANDLERS = [CreateResourceCommandHandler, ListResourcesQueryHandler, ResourceCreatedHandler];
```

```typescript
// src/infrastructure/modules/example.module.ts — AFTER
import { CreateResourceCommandHandler } from '~/core/application/example/create-resource.command';
import { DeactivateResourceCommandHandler } from '~/core/application/example/deactivate-resource.command';
import { ListResourcesQueryHandler } from '~/core/application/example/list-resources.query';
import { ResourceCreatedHandler } from '~/core/application/example/resource-created.handler';
import { EVENT_PUBLISHER } from '~/core/application/ports/event-publisher.port';

const HANDLERS = [
  CreateResourceCommandHandler,
  DeactivateResourceCommandHandler,
  ListResourcesQueryHandler,
  ResourceCreatedHandler,
];
```

> **Why this matters:** `HANDLERS` is spread into `providers: [...HANDLERS, ...]` (line 16). If you skip this step, the code still **compiles** — but at runtime, `commandBus.execute(new DeactivateResourceCommand(...))` throws `Error: command handler not found`, because nothing told `CqrsModule` that `DeactivateResourceCommandHandler` exists. This is the single most common "it compiles but doesn't work" mistake with CQRS in this codebase.

#### Step 8 — Run everything and verify end to end

1. **Static checks** (no server needed):

   ```bash
   pnpm lint && pnpm typecheck && pnpm test:unit
   ```

   ```text
   # Expected output (key lines):
   ✔ ESLint: 0 problems
   Found 0 errors. (typecheck)
   Test Suites: N passed, N total   (includes the 2 files you touched/added)
   ```

2. **Manual check over HTTP.** Make sure the database has data (see [Section 8.4-8.6](#84-database-setup)), then start the server:

   ```bash
   pnpm start:dev
   ```

3. List resources to find an `id` to deactivate:

   ```bash
   curl -s http://localhost:3000/v1/resources \
     -H "Authorization: Bearer $TOKEN" | jq '.data.items[0]'
   ```

   ```json
   // Expected output (one item from the seed data):
   { "id": "c2e1...-uuid", "name": "Acme Widget", "description": "...", "active": true }
   ```

4. Deactivate it:

   ```bash
   curl -s -X PATCH http://localhost:3000/v1/resources/c2e1...-uuid/deactivate \
     -H "Authorization: Bearer $TOKEN"
   ```

   ```json
   // Expected output:
   { "success": true, "data": { "id": "c2e1...-uuid", "active": false }, "message": "Request handled successfully", "meta": { ... } }
   ```

5. **Checkpoint:** call `GET /v1/resources` again — the same item now shows `"active": false`.

> **Note:** steps 3-4 require a valid Bearer token with the `resource:write` role (`$TOKEN`). **Intentionally omitted from boilerplate**: the exact command to mint such a token for _your_ Keycloak realm (You can obtain this via your Keycloak UI or by making a POST request to your realm token endpoint) — this depends on how your realm, client, and role mappings are configured (see [Section A](#section-a-prerequisites--toolchain-setup) and [Section 10](#10-security-guidelines)). If you don't have Keycloak configured yet, steps 1-2 (static checks) and the unit tests in Step 5 are sufficient to prove the feature is correctly wired.

> **Tip — what if `pnpm test:unit` fails on `prisma.deactivate is not a function` or similar?** It shouldn't — `DeactivateResourceCommandHandler` only depends on `IResourceRepository` (a hand-mocked interface in tests), never on Prisma directly. If you see a Prisma-related error, double-check Step 4's imports: you should be importing from `~/core/application/ports/resource.repository`, not from `~/adapters/driven/prisma/...`.

---

### 9.3 Trace the full request: `PATCH /v1/resources/:id/deactivate`

Now that the feature is wired up, here is **everything that happens**, in order, for a single request — connecting every layer from [Section 2](#2-architecture-overview) to actual code you just wrote.

```mermaid
sequenceDiagram
    actor Client
    participant Guards as JwtAuthGuard / RolesGuard
    participant Pipe as ParseUUIDPipe
    participant Controller as ResourceController
    participant Bus as CommandBus
    participant Handler as DeactivateResourceCommandHandler
    participant Domain as Resource (entity)
    participant Repo as PrismaResourceRepository
    participant DB as PostgreSQL
    participant Publisher as LocalEventPublisher
    participant Interceptor as ResponseTransformInterceptor

    Client->>Guards: PATCH /v1/resources/:id/deactivate (Authorization: Bearer ...)
    Guards->>Guards: verify JWT signature against Keycloak JWKS; check "resource:write" role
    Guards->>Pipe: request authorized
    Pipe->>Pipe: validate :id is a syntactically valid UUID
    Pipe->>Controller: deactivate(id)
    Controller->>Bus: execute(new DeactivateResourceCommand(id))
    Bus->>Handler: execute(command)
    Handler->>Repo: findById(id)
    Repo->>DB: SELECT * FROM resources WHERE id = $1 AND "deletedAt" IS NULL
    DB-->>Repo: row (or none)
    Repo-->>Handler: Resource entity | null
    alt resource not found
        Handler-->>Bus: throw EntityNotFoundException
        Bus-->>Controller: error propagates
        Controller-->>Client: 404 { success:false, error:{ code:"DOMAIN_ENTITY_NOT_FOUND", ... } }
    else resource found
        Handler->>Domain: resource.deactivate()
        Domain->>Domain: active=false, updatedAt=now, addDomainEvent(ResourceDeactivatedEvent)
        Handler->>Repo: save(resource)
        Repo->>DB: UPDATE resources SET active=false, "updatedAt"=... WHERE id=$1
        DB-->>Repo: ok
        Handler->>Domain: pullDomainEvents()
        Domain-->>Handler: [ResourceDeactivatedEvent]
        Handler->>Publisher: publishAll([event])
        Publisher->>Publisher: log "[event] example.resource.deactivated id=..."
        Handler-->>Bus: { id, active: false }
        Bus-->>Controller: { id, active: false }
        Controller->>Interceptor: return value
        Interceptor->>Interceptor: wrap in { success, data, message, meta }
        Interceptor-->>Client: 200 { success:true, data:{ id, active:false }, message:"...", meta:{...} }
    end
```

> **How to read this diagram:** time flows top to bottom. Each arrow is one method call or HTTP exchange; the box label is the file/class responsible. The `alt` / `else` block shows the **two possible outcomes** of the same request — "resource not found" vs. "resource found" — branching from the same point (`Repo-->>Handler`).

**Plain-English walkthrough, hop by hop:**

1. **Client → Guards.** The browser/`curl` sends `PATCH /v1/resources/<id>/deactivate` with an `Authorization: Bearer <jwt>` header.
2. **JwtAuthGuard** ([`src/common/guards/jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts)) fetches Keycloak's public keys (JWKS) and verifies the token's signature and `issuer`. If valid, it attaches `{ id, username, email, roles }` to the request as `req.user`. If invalid or missing → `401 Unauthorized`, and **nothing past this point runs**.
3. **RolesGuard** ([`src/common/guards/roles.guard.ts`](../src/common/guards/roles.guard.ts)) reads the `@Roles('resource:write')` metadata from Step 6's `deactivate()` method and checks `req.user.roles`. No match → `403 Forbidden`.
4. **ParseUUIDPipe** checks the `:id` URL segment is a valid UUID _before_ your controller code runs. Invalid → `400 Bad Request`.
5. **ResourceController.deactivate()** ([`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts)) does the absolute minimum: builds a `DeactivateResourceCommand` and asks the **CommandBus** to execute it. This is the boundary between "HTTP world" and "use-case world".
6. **CqrsModule's CommandBus** looks up which handler is `@CommandHandler(DeactivateResourceCommand)` — that's `DeactivateResourceCommandHandler` (Step 4), registered in `HANDLERS` (Step 7) — and calls its `execute()`.
7. **`repo.findById(id)`** — the handler asks the **port** (`IResourceRepository`) for the resource. At runtime, this is actually `PrismaResourceRepository` ([`src/adapters/driven/prisma/resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts)), which runs a `SELECT` against PostgreSQL and converts the raw row back into a `Resource` domain entity via `toDomain()`.
8. **Branch — not found:** if no row matched, the handler throws `EntityNotFoundException('Resource', id)` — a **domain** exception. `AllExceptionsFilter` ([`src/infrastructure/filters/all-exceptions.filter.ts`](../src/infrastructure/filters/all-exceptions.filter.ts)) catches it globally and converts it to `404 Not Found` with `{ success:false, error:{ code:"DOMAIN_ENTITY_NOT_FOUND", message:"..." } }`. The handler exits here — nothing is written to the database.
9. **Branch — found:** `resource.deactivate()` runs **inside the domain entity** — it flips `active` to `false`, updates `updatedAt`, and (after Step 2) records a `ResourceDeactivatedEvent` in its internal pending-events list. No I/O happens here.
10. **`repo.save(resource)`** — `PrismaResourceRepository.save()` runs a Prisma `upsert`, which here becomes an `UPDATE` (the row already exists).
11. **`resource.pullDomainEvents()`** — the handler retrieves and clears the pending events list (just the one `ResourceDeactivatedEvent`).
12. **`publisher.publishAll(events)`** — the handler hands the events to the **`IEventPublisher` port**. At runtime this is `LocalEventPublisher` ([`src/adapters/driven/local/local-event.publisher.ts`](../src/adapters/driven/local/local-event.publisher.ts)), which logs `[event] example.resource.deactivated id=...` at debug level.

    > **Deep Dive (optional on first read):** `LocalEventPublisher` is a stand-in. In a production deployment this port would be bound to an adapter that publishes to a real broker (see [ADR-002](#appendix-b-architecture-decision-records-reconstructed) in Appendix B). Because the handler only depends on the `IEventPublisher` _interface_, swapping the binding in `ExampleModule` (Step 7) is the **only** change required — the handler, the domain event, and this whole request flow stay identical.

13. **Handler returns `{ id, active: false }`** back through the `CommandBus` to the controller, which returns it as-is.
14. **`ResponseTransformInterceptor`** ([`src/common/interceptors/response-transform.interceptor.ts`](../src/common/interceptors/response-transform.interceptor.ts)) — registered globally — wraps that plain object in the standard envelope: `{ success: true, data: { id, active: false }, message: "...", meta: { timestamp, correlationId } }`.
15. **Client receives `200 OK`** with the envelope as the JSON body.

> **Why this matters:** every request in this codebase — not just this one — follows this same shape: **Guards → Pipes → Controller → Bus → Handler → Domain → Repository Port → Adapter → Database**, with the **`AllExceptionsFilter`** and **`ResponseTransformInterceptor`** wrapping the outermost edges for every route. Once you understand this one flow, you understand how every endpoint in the project works.

---

## 10. Security Guidelines

> **Plain English summary:** "Authentication" answers _"who are you?"_; "authorization" answers _"are you allowed to do this?"_. This API does neither itself — it **trusts Keycloak** (an external identity provider) for authentication, and reads **roles** out of the token Keycloak issued to decide authorization. Your job as a developer is mostly to (1) protect new endpoints with the right guards and roles, and (2) never let secrets leak into logs, code, or Git history.

### 10.1 Authentication: Keycloak + JWT (JWKS)

A **JWT** ("JSON Web Token") is a signed, tamper-proof piece of text the client sends with every request — think of it as a sealed, stamped ID card. **JWKS** ("JSON Web Key Set") is the public list of "stamps" (cryptographic keys) Keycloak uses to sign those ID cards.

[`JwtAuthGuard`](../src/common/guards/jwt-auth.guard.ts) implements this:

```typescript
// src/common/guards/jwt-auth.guard.ts (simplified)
const { payload } = await jwtVerify(token, this.jwks, {
  issuer: this.authConfig.issuer,
});
```

- `createRemoteJWKSet(new URL(authConfig.jwksUrl))` (constructor, line 32) downloads Keycloak's public keys once and caches them — `jose` re-fetches automatically if a token is signed with a key it doesn't recognize yet (e.g., after key rotation).
- `jwtVerify()` checks the token's **signature** (was it really signed by Keycloak's private key?) and **issuer** (does the `iss` claim match `KEYCLOAK_ISSUER` exactly?).
- On success, it builds `req.user = { id, username?, email?, roles }` from the token's claims — `realm_access.roles` plus `resource_access[<KEYCLOAK_CLIENT_ID>].roles` (lines 47-54).
- On any failure (missing header, bad signature, wrong issuer, expired token) → `401 Unauthorized`, immediately, before any of your code runs.

> **Deep Dive (optional on first read):** this is **local validation** — there is no network call to Keycloak on every request to ask "is this token still valid?" (that pattern is called _introspection_). Local validation is faster and removes Keycloak as a single point of failure for every request, at the cost of: a token cannot be instantly revoked before it expires (you must rely on short token lifetimes).

`AUTH_CONFIG` (the `jwksUrl` / `issuer` / `clientId` triple `JwtAuthGuard` depends on) is provided globally by [`ConfigModule`](../src/infrastructure/config/config.module.ts), built from `KEYCLOAK_JWKS_URL`, `KEYCLOAK_ISSUER`, and `KEYCLOAK_CLIENT_ID` ([`.env.example`](../.env.example)).

> **Warning — there is no global authentication guard.** Unlike many NestJS examples, `JwtAuthGuard` is **not** registered as an `APP_GUARD` in [`AppModule`](../src/infrastructure/app.module.ts). It is applied **per controller** via `@UseGuards(JwtAuthGuard, RolesGuard)` — see [`ResourceController`](../src/adapters/driving/http/example/resource.controller.ts), line 20. [`HealthController`](../src/infrastructure/health/health.controller.ts) has **no guards at all** and is fully public (by design — health checks must be reachable by load balancers without credentials).
>
> **What a beginner must never do:** when you create a new controller, **do not assume it is protected by default**. If you forget `@UseGuards(JwtAuthGuard, RolesGuard)`, your new endpoint is **completely open to the internet**. Always copy the guard setup from `ResourceController` for any controller that isn't an intentionally-public health/status endpoint.

### 10.2 Authorization: `@Roles()` and `RolesGuard`

[`@Roles(...roles)`](../src/common/decorators/roles.decorator.ts) attaches metadata (key: `ROLES_METADATA_KEY = 'roles'`) to a controller method or class — it does **nothing** by itself. [`RolesGuard`](../src/common/guards/roles.guard.ts) reads that metadata and checks it against `req.user.roles`:

```typescript
// src/common/guards/roles.guard.ts (simplified)
const required = this.reflector.getAllAndOverride<string[] | undefined>(ROLES_METADATA_KEY, [
  ctx.getHandler(),
  ctx.getClass(),
]);
if (!required || required.length === 0) return true; // no @Roles() → allowed
const userRoles = req.user?.roles ?? [];
const ok = required.some((r) => userRoles.includes(r));
if (!ok) throw new ForbiddenException(`Missing required role: one of [${required.join(', ')}]`);
```

> **Why this matters — guard ORDER is not optional.** `@UseGuards(JwtAuthGuard, RolesGuard)` runs guards **left to right**. `JwtAuthGuard` must run first to populate `req.user`; `RolesGuard` then reads `req.user?.roles`. If you ever write `@UseGuards(RolesGuard, JwtAuthGuard)` (reversed), `req.user` will be `undefined` when `RolesGuard` runs, `userRoles` becomes `[]`, and **every** role check fails with `403 Forbidden` — even for a perfectly valid token.

> **Common mistake to avoid:** `@Roles()` with **no** `@UseGuards(..., RolesGuard)` on the controller does nothing — the metadata is attached but nothing reads it, so the endpoint is reachable by **any authenticated user**, regardless of role. Always pair `@Roles(...)` with the class-level `@UseGuards(JwtAuthGuard, RolesGuard)`.

### 10.3 The safety net applied to every request

These four providers are registered globally in [`AppModule`](../src/infrastructure/app.module.ts) and run for **every** route, even ones with no guards:

| Provider                                                                                                                                                                   | Registered as     | What it does                                                                                                                                                                                                                      | Why this matters                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })`                                                                                         | `APP_PIPE`        | Validates every `@Body()`/`@Query()`/`@Param()` against its DTO's `class-validator` decorators; **strips** unknown fields (`whitelist`) and **rejects the request with 400** if extra fields are present (`forbidNonWhitelisted`) | A client cannot smuggle extra fields (e.g. `{ "name": "x", "isAdmin": true }`) into your DTOs — anything not declared with a `class-validator` decorator is dropped or rejected before your handler runs |
| [`AllExceptionsFilter`](../src/infrastructure/filters/all-exceptions.filter.ts)                                                                                            | `APP_FILTER`      | Catches **every** thrown error, maps it to a status code + `{ success:false, error:{code,message} }`, and logs 5xx errors server-side with `Logger.error`                                                                         | Stack traces and internal error details **never** reach the client — only a `code` and `message`                                                                                                         |
| `ThrottlerGuard`                                                                                                                                                           | `APP_GUARD`       | Rate-limits every route to `THROTTLE_LIMIT` requests per `THROTTLE_TTL` seconds (default: 100 req / 60s, per client)                                                                                                              | Basic protection against brute-force and accidental request loops — applies even to public routes like `/v1/health`                                                                                      |
| [`LoggingInterceptor`](../src/common/interceptors/logging.interceptor.ts) + [`ResponseTransformInterceptor`](../src/common/interceptors/response-transform.interceptor.ts) | `APP_INTERCEPTOR` | Logs `{ method, path, status, durationMs, userId, correlationId }` for every request; wraps every successful response in the standard envelope                                                                                    | Consistent structured logs and response shapes without per-controller boilerplate                                                                                                                        |

> **What a beginner must never do:** never bypass the DTO layer by reading `@Req() req: Request` and pulling fields off `req.body` directly. Doing so skips `ValidationPipe` entirely — exactly the kind of unvalidated input that leads to injection and mass-assignment vulnerabilities (OWASP Top 10).

### 10.4 Secrets & environment variables

- `.env` (your real, local secrets) is **git-ignored** — see [`.gitignore`](../.gitignore) lines 10-14 (`.env`, `.env.local`, `.env.*.local`, with `!.env.example` explicitly un-ignoring the template).
- [`.env.example`](../.env.example) is the **only** env file committed to Git. It must contain **placeholder** values only — never real credentials.
- From the table in [Section 8.3](#83-environment-setup), the variables that are **secrets** are: `DATABASE_URL` (embeds the DB password), `KEYCLOAK_CLIENT_SECRET`, and `OTEL_EXPORTER_OTLP_HEADERS` (often an API key). Treat `SENTRY_DSN` as sensitive too — anyone with it can send fake error events to your project.

> **Warning — the gitleaks secret scan is best-effort, not guaranteed.** [`.husky/pre-commit`](../.husky/pre-commit) runs `gitleaks protect --staged --redact --verbose` **only if `gitleaks` is installed on your machine**:
>
> ```sh
> # .husky/pre-commit (lines 9-14)
> if command -v gitleaks >/dev/null 2>&1; then
>   gitleaks protect --staged --redact --verbose
> else
>   echo "[husky] gitleaks not installed — skipping secret scan."
> fi
> ```
>
> If `gitleaks` is **not** installed, the hook prints a warning and the commit **still succeeds** — there is no enforced server-side (CI) secret scan as a backstop (see [Section 12](#12-cicd-guide)). Install gitleaks (see [Section A](#section-a-prerequisites--toolchain-setup)) so this check actually runs for you.

> **What a beginner must never do:**
>
> - Never run `git add -f .env` or otherwise force-add an ignored env file.
> - Never paste a real `KEYCLOAK_CLIENT_SECRET`, database password, or JWT into a commit message, code comment, GitHub issue, or chat — even "temporarily". Treat anything pasted into a chat tool as potentially permanent and indexed.
> - Never commit `.env.example` with anything that looks like a _real_ working credential — only obvious placeholders (`replace-with-your-client-secret`, `auth.example.com`).

### 10.5 Transport security: Helmet, CORS, and HTTPS

[`src/infrastructure/main.ts`](../src/infrastructure/main.ts) (lines 16-22) configures:

```typescript
app.use(helmet()); // sets security-related HTTP response headers
app.use(compression()); // gzip/deflate responses
app.enableCors({
  origin: env.CORS_ALLOWED_ORIGINS.length === 0 ? false : env.CORS_ALLOWED_ORIGINS,
  credentials: true,
});
```

- [`helmet()`](https://helmetjs.github.io/) sets headers like `X-Content-Type-Options: nosniff` and disables some risky defaults (e.g. `X-Powered-By`).
- **CORS** (Cross-Origin Resource Sharing) controls which **browser-based** origins (e.g. `http://localhost:5173` for a frontend dev server) may call this API directly from JavaScript. If `CORS_ALLOWED_ORIGINS` is empty (the `.env.example` default), `origin: false` means **no** cross-origin browser requests are allowed — only same-origin or non-browser clients (like `curl`, mobile apps, or server-to-server calls) can reach the API.
- **HTTPS/TLS** is **not enabled in this codebase** — the app listens on plain HTTP (`app.listen(env.APP_PORT)`). **Intentionally omitted from boilerplate**: TLS termination (Use a reverse proxy like Nginx or AWS API Gateway to handle TLS in production); in a real deployment, TLS is expected to be terminated by a reverse proxy, load balancer, or API gateway in front of this service.

> **What a beginner must never do:** never set `CORS_ALLOWED_ORIGINS` to `*` (or any wildcard) together with `credentials: true` — browsers reject this combination for good reason (it would let _any_ website make authenticated requests on a logged-in user's behalf). List specific origins only.

### 10.6 Logging and token hygiene

[`LoggingInterceptor`](../src/common/interceptors/logging.interceptor.ts) deliberately logs only `{ method, path, status, durationMs, userId, correlationId }` — **never** the request body, headers, or the `Authorization` header. `userId` comes from `req.user?.id` (set by `JwtAuthGuard`), so logs can be correlated to a user **without** logging the token itself.

> **Deep Dive (optional on first read) — pino redaction.** [`AppModule`](../src/infrastructure/app.module.ts)'s `LoggerModule.forRoot({ pinoHttp: { ... } })` does **not** currently configure a `redact` array (e.g. `redact: ['req.headers.authorization', 'req.headers.cookie']`), unlike the `@nuera/shared-logging` package referenced in the root `CLAUDE.md`. As long as you only use `Logger` the way `LoggingInterceptor` does — logging specific, named fields — this is not a problem. **It becomes a problem only if a future change logs `req.headers` or `req.body` wholesale.** If you add such logging, add `redact` to the `pinoHttp` config at the same time. See [Section 13](#13-common-mistakes--anti-patterns) for the worked example.

> **What a beginner must never do:**
>
> - Never `console.log()` or `Logger.log()` a JWT, refresh token, password, or `KEYCLOAK_CLIENT_SECRET` — even while debugging. (`no-console` is also an ESLint error outside `warn`/`error` — see [Section 6](#6-coding-standards) — but that rule does not stop you from logging a _secret value_ via `Logger.error(token)`.)
> - Never return `password`, `clientSecret`, or similar fields in an API response DTO, even for admin users.
> - Never disable `AllExceptionsFilter` or replace it with something that returns raw `error.stack` to the client, even temporarily "to debug production".

### 10.7 Security checklist summary

- [ ] New controller has `@UseGuards(JwtAuthGuard, RolesGuard)` unless it is **intentionally public** (like `/v1/health`).
- [ ] Every write/sensitive endpoint has an appropriate `@Roles(...)`.
- [ ] `@UseGuards(JwtAuthGuard, RolesGuard)` — guard order is `JwtAuthGuard` **before** `RolesGuard`.
- [ ] All request input goes through a DTO with `class-validator` decorators — never raw `req.body`.
- [ ] No secrets in code, comments, commit messages, or `.env.example`.
- [ ] `gitleaks` is installed locally so the pre-commit secret scan actually runs.
- [ ] No new code logs tokens, passwords, secrets, or full request headers/bodies.
- [ ] `CORS_ALLOWED_ORIGINS` lists specific origins — never `*`.

---

## 11. Testing Guide

> **Plain English summary:** this repo has **three** kinds of automated tests, each with its own Jest config, its own folder, and its own speed/realism trade-off. Unit tests are fast and check logic in isolation. Integration tests are slower and check that an adapter (e.g. the Prisma repository) really works against a real database. End-to-end (e2e) tests check the whole HTTP stack.

### 11.1 The test pyramid in this repo

| Layer           | Config file                                                   | Test location                               | File pattern    | What it tests                                                                                                        | Requires                                       |
| --------------- | ------------------------------------------------------------- | ------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Unit**        | [`jest.config.ts`](../jest.config.ts)                         | `src/**` and [`test/unit/`](../test/unit/)  | `*.spec.ts`     | Domain entities and CQRS handlers, with **hand-mocked ports** — no I/O at all                                        | Nothing (no Docker, no DB, no network)         |
| **Integration** | [`jest.integration.config.ts`](../jest.integration.config.ts) | [`test/integration/`](../test/integration/) | `*.int-spec.ts` | Driven adapters (e.g. `PrismaResourceRepository`) against a **real, throwaway PostgreSQL** started by Testcontainers | Docker running locally (or in CI)              |
| **E2E**         | [`jest.e2e.config.ts`](../jest.e2e.config.ts)                 | [`test/e2e/`](../test/e2e/)                 | `*.e2e-spec.ts` | Full HTTP request/response via `supertest` against a real, bootstrapped NestJS app                                   | Varies — see [11.5](#115-end-to-end-e2e-tests) |

> **Why this matters:** the further down this table you go, the more "real" the test is — and the slower and more fragile it becomes. The rule of thumb in this codebase: **business logic gets unit tests** (cheap, run on every save); **adapters get integration tests** (run before pushing); **critical user journeys get e2e tests** (run in CI). [Section 14's](#14-developer-checklist) pre-PR checklist reflects this.

### 11.2 Running tests — exact commands

```bash
# Run ALL unit tests (the default `pnpm test` is equivalent to plain `jest`,
# which picks up jest.config.ts automatically)
pnpm test:unit
```

```text
# Expected output (key lines):
PASS  test/unit/resource.entity.spec.ts
PASS  test/unit/create-resource.command.spec.ts

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
```

```bash
# Run ONE file — pass extra args to Jest after `--`
pnpm test:unit -- resource.entity.spec.ts
```

```bash
# Run ONE test by name (substring match on the `it(...)` description)
pnpm test:unit -- -t "deactivate marks inactive"
```

```bash
# Watch mode — re-runs affected tests as you edit files
pnpm test:unit -- --watch
# Expected: an interactive prompt — press "a" to run all tests, "q" to quit
```

```bash
# Coverage report
pnpm test:cov
# Expected output (key lines):
#   --------------------------|---------|----------|---------|---------|
#   File                      | % Stmts | % Branch | % Funcs | % Lines |
#   --------------------------|---------|----------|---------|---------|
#   All files                 |   xx.xx |    xx.xx |   xx.xx |   xx.xx |
# Full HTML report: coverage/unit/lcov-report/index.html
```

> **Note:** [`jest.config.ts`](../jest.config.ts)'s `collectCoverageFrom` deliberately **excludes** `**/*.module.ts`, `src/infrastructure/main.ts`, and `src/infrastructure/lambda.ts`. Module files are pure dependency-injection wiring (lists of providers — see [`ExampleModule`](../src/infrastructure/modules/example.module.ts)), and the two entrypoints are exercised by _running_ the app, not by unit tests. A 0% coverage number on these files is **expected and correct** — don't chase it.

### 11.3 Unit tests in depth

Unit tests construct classes **directly with `new`** and pass in **hand-written mock objects** for each port — no `Test.createTestingModule()`, no NestJS DI container, no database. [`test/unit/create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts) (and the `DeactivateResourceCommandHandler` test you wrote in [Section 9.2 Step 5](#step-5--unit-test-the-new-handler)) are the canonical examples:

```typescript
// test/unit/create-resource.command.spec.ts (excerpt)
repo = {
  findById: jest.fn(),
  paginate: jest.fn(),
  save: jest.fn().mockResolvedValue(undefined),
  softDelete: jest.fn(),
};
publisher = {
  publish: jest.fn().mockResolvedValue(undefined),
  publishAll: jest.fn().mockResolvedValue(undefined),
};
handler = new CreateResourceCommandHandler(repo, publisher);
```

`clearMocks: true` in [`jest.config.ts`](../jest.config.ts) automatically resets all `jest.fn()` call histories between tests — you never need to call `jest.clearAllMocks()` yourself in `afterEach`.

> **Why this matters:** because `repo` and `publisher` are just plain objects implementing the `IResourceRepository` / `IEventPublisher` **interfaces** (ports), these tests run in milliseconds and never touch a real database — exactly the benefit of [Hexagonal Architecture](#section-b-glossary--technology-primers) described in [Section 2](#2-architecture-overview).

### 11.4 Integration tests

[`test/integration/resource.repository.int-spec.ts`](../test/integration/resource.repository.int-spec.ts) tests the **real** `PrismaResourceRepository` against a **real** PostgreSQL — started fresh, in Docker, for this test run only:

```typescript
// test/integration/resource.repository.int-spec.ts (excerpt)
beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine').start();
  process.env['DATABASE_URL'] = container.getConnectionUri();

  // Apply migrations against the throwaway DB.
  execSync('pnpm prisma migrate deploy --schema=./prisma/schema', { env: process.env, stdio: 'inherit' });

  prisma = new PrismaService();
  await prisma.onModuleInit();
  repo = new PrismaResourceRepository(prisma);
}, 120_000);
```

```bash
pnpm test:integration
# Expected output (first run, may take 30-60s while Docker pulls postgres:16-alpine):
#   PASS  test/integration/resource.repository.int-spec.ts
#   PrismaResourceRepository (integration)
#     ✓ round-trips a Resource through save → findById
#     ✓ paginate respects page/pageSize
#     ✓ soft-deleted resources are filtered out of findById
```

- `--runInBand` (in `package.json`'s `test:integration` script) runs test files **sequentially**, not in parallel — important because each file may start its own Postgres container, and parallel container startups can exhaust resources or port ranges.
- `testTimeout: 60_000` in [`jest.integration.config.ts`](../jest.integration.config.ts) gives Testcontainers time to pull the `postgres:16-alpine` image and start the container on a fresh machine.

> **Warning — this depends on the same migration files discussed in [Section 8.4](#84-database-setup).** `prisma migrate deploy` **applies existing migration files** from `prisma/migrations/` — it does not generate new ones. If `prisma/migrations/` is empty (the state of a fresh clone of this boilerplate — see [Section 8.4](#84-database-setup) and [Section 13](#13-common-mistakes--anti-patterns)), `migrate deploy` against the fresh Testcontainers database succeeds but creates **no tables**, and `repo.save(...)` then fails with a Prisma error like `The table "public.resources" does not exist`. **Fix:** run `pnpm prisma migrate dev --schema=./prisma/schema --name init` once (as in Section 8.4) so `prisma/migrations/<timestamp>_init/` exists and is committed to Git — then `migrate deploy` has something to apply.

> **Required:** Docker must be running for `pnpm test:integration`. If Docker is not running, expect an error similar to `Could not find a working container runtime strategy`.

### 11.5 End-to-end (e2e) tests

[`test/e2e/health.e2e-spec.ts`](../test/e2e/health.e2e-spec.ts) is the current e2e suite — it boots **only** `HealthController` via `Test.createTestingModule({ controllers: [HealthController] })` and calls it over real HTTP using `supertest`:

```typescript
// test/e2e/health.e2e-spec.ts (excerpt)
const moduleRef = await Test.createTestingModule({ controllers: [HealthController] }).compile();
app = moduleRef.createNestApplication();
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
await app.init();
// ...
const res = await request(app.getHttpServer()).get('/v1/health').expect(200);
```

```bash
pnpm test:e2e
# Expected output:
#   PASS  test/e2e/health.e2e-spec.ts
#   Health (e2e)
#     ✓ GET /v1/health returns 200 with status ok
```

> **Note:** the file's own comment says it is _"a minimal e2e... Extend by importing `AppModule` once Postgres/NATS are reachable from CI."_ **Intentionally omitted from boilerplate**: a full e2e suite that boots `AppModule` (with database, auth, etc.) (To add one, spin up Testcontainers for Postgres and Keycloak in your Jest e2e setup) — today, only the dependency-free `HealthController` is covered this way. If you add e2e coverage for `ResourceController`, you will need a running Postgres (see [Section 8.4](#84-database-setup)) and a way to obtain a valid JWT (see [Section 10.1](#101-authentication-keycloak--jwt-jwks)).

### 11.6 How to read a failing test

Suppose you accidentally tighten the validation rule in [`Resource.validateName()`](../src/core/domain/example/resource.entity.ts) — changing `name.trim().length < 2` to `name.trim().length < 3` — and run:

```bash
pnpm test:unit -- resource.entity.spec.ts
```

You would see something like:

```text
FAIL  test/unit/resource.entity.spec.ts
  Resource (domain)
    create
      ✓ creates a valid resource and raises ResourceCreatedEvent
      ✕ trims whitespace from the name

  ● Resource (domain) › create › trims whitespace from the name

    ValidationException: Resource name must be at least 3 characters.

      65 |   private static validateName(name: string): void {
      66 |     if (!name || name.trim().length < 3) {
    > 67 |       throw new ValidationException('Resource name must be at least 3 characters.', { name: ['too short'] });
         |             ^
      68 |     }

      at Resource.validateName (src/core/domain/example/resource.entity.ts:67:13)
      at Resource.create (src/core/domain/example/resource.entity.ts:31:13)
      at Object.<anonymous> (test/unit/resource.entity.spec.ts:20:25)

Tests:       1 failed, 5 passed, 6 total
```

How to read this, top to bottom:

1. **`FAIL test/unit/resource.entity.spec.ts`** — which file failed. Open it.
2. **`✕ trims whitespace from the name`** — which specific `it(...)` block failed. This is the test's _description_ — it tells you _what behavior_ is broken, in plain English.
3. **The error type and message** (`ValidationException: Resource name must be at least 3 characters.`) — what actually went wrong. Here, the _production code_ threw an exception that the test didn't expect.
4. **The code frame** (the `>` arrow at line 67) — the **exact line in your source file** (not the test) where the error was thrown. This is usually where your recent edit is.
5. **The stack trace** (`at Resource.validateName ... at Resource.create ... at Object.<anonymous> (test/unit/resource.entity.spec.ts:20:25)`) — read **bottom to top** to follow the call chain: the test (line 20) called `Resource.create(...)`, which called `validateName(...)`, which threw.

**The fix:** in this scenario, line 66 should be reverted to `< 2` (matching the test's expectation and the documented rule "at least 2 characters"). In general: **a failing test tells you two things — what changed, and exactly where.** Start at the code frame, and work outward using the stack trace only if the immediate line isn't the cause.

> **Tip:** if a test fails with `Cannot find module '~/...'` instead of an assertion error, it's almost always a typo in an import path or a missing `moduleNameMapper` entry — not a logic bug. Compare against [`jest.config.ts`](../jest.config.ts)'s `moduleNameMapper: { '^~/(.*)$': '<rootDir>/src/$1' }`.

---

## 12. CI/CD Guide

> **Note:** "CI" (Continuous Integration) means: every time someone proposes a change, an automated process checks it (lint, type-check, tests, build) _before_ it's allowed to merge — like a spell-checker and grammar-checker that runs automatically before an article gets published. "CD" (Continuous Delivery/Deployment) means: once a change passes those checks, it is automatically packaged (and sometimes deployed) without a human manually running each step.

### 12.1 What exists today vs. what the docs describe

This section is unusually important to read carefully, because **the written documentation and the actual repository disagree** on this topic — and as a new contributor you need to know which one to trust (the repository).

[`CONTRIBUTING.md`](../CONTRIBUTING.md) says, in the "Pull requests" section:

```bash
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build
```

> The CI workflow runs the same checks.
> — [`CONTRIBUTING.md:149`](../CONTRIBUTING.md)

It also has a test table with a column literally titled **"Runs in CI"** ([`CONTRIBUTING.md:122-126`](../CONTRIBUTING.md)):

| Layer                                              | Where                               | Runs in CI                            |
| -------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| **Unit** (domain + use cases, ports mocked)        | `test/unit/**/*.spec.ts`            | yes — `pnpm test:unit`                |
| **Integration** (real Postgres via Testcontainers) | `test/integration/**/*.int-spec.ts` | optional, gated on `INTEGRATION=true` |
| **e2e** (supertest against bootstrapped app)       | `test/e2e/**/*.e2e-spec.ts`         | optional                              |

> **Warning:** Despite this language, **there is no CI pipeline in this repository.** GitHub Actions workflows live in a `.github/workflows/` directory by convention — searching this entire repository for `.github/**` returns **no files at all**. There is no `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/`, or any other CI configuration either.
>
> **What this means for you, practically:** nothing stops a broken PR from being opened, and nothing automatically runs `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, or `pnpm build` on your behalf when you push or open a PR. **You — and the [Husky hooks](#122-local-quality-gates-the-husky-pipeline) below — are the only checks that currently exist.** Treat the [PR checklist](#124-pull-request-checklist) in this section as **mandatory manual steps**, not as a safety net that will catch you if you skip them.

**Not enough evidence found in repository** to determine: which CI provider was originally intended (GitHub Actions is the most likely candidate, given the project is hosted on GitHub and `.github/workflows/` is the conventional location — but no workflow file, not even a disabled or commented-out one, exists to confirm this), what the workflow's exact steps would be beyond the PR checklist, or whether it would also run `test:integration` / `test:e2e` / publish a Docker image.

> **Tip for fixing this gap:** if your team decides to add CI, the fastest correct first step is to create `.github/workflows/ci.yml` that runs exactly the four commands from [`CONTRIBUTING.md:146`](../CONTRIBUTING.md) (`pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm build`) on every push and pull request — that turns the _documented_ behavior into _actual_ behavior with zero ambiguity, since the commands already exist and are already used manually.

### 12.2 Local quality gates: the Husky pipeline

Until a server-side CI pipeline exists, **the only automated checks in this repository run on your own machine**, triggered by Git itself via [Husky](https://typicode.github.io/husky/) hooks. A "Git hook" is a script that Git runs automatically at specific points in your workflow (e.g., "right before a commit is created"). Think of it as a sequence of checkpoints your change must pass through, in order, before it leaves your laptop:

```mermaid
flowchart TD
    A["git commit"] --> B["pre-commit hook<br/>(.husky/pre-commit)"]
    B --> B1["pnpm exec lint-staged<br/>→ eslint --fix --max-warnings 0<br/>→ prettier --write<br/>(staged *.ts, *.json, *.md, *.yml files only)"]
    B1 -->|lint error that --fix can't resolve| X1["Commit aborted"]
    B1 --> B2{"gitleaks installed?"}
    B2 -->|yes| B3["gitleaks protect --staged --redact --verbose"]
    B2 -->|no| B4["print warning, skip secret scan"]
    B3 -->|secret pattern detected| X1
    B3 --> C
    B4 --> C

    C["prepare-commit-msg hook<br/>(.husky/prepare-commit-msg)"]
    C --> C1{"Branch name matches<br/>^[A-Z]+-[0-9]+ ?"}
    C1 -->|"yes, e.g. NUE-123-add-deactivate"| C2["Prepend 'NUE-123' to the<br/>commit message (if not already present)"]
    C1 -->|"no, e.g. main, initial-boilerplate"| C3["Leave commit message unchanged"]
    C2 --> D
    C3 --> D

    D["commit-msg hook<br/>(.husky/commit-msg)"]
    D --> D1["pnpm exec commitlint --edit"]
    D1 -->|"violates Conventional Commits rules"| X2["Commit aborted"]
    D1 -->|passes| E["Commit created locally"]

    E --> F["git push"]
    F --> G["pre-push hook<br/>(.husky/pre-push)"]
    G --> G1["pnpm test:unit"]
    G1 -->|"any unit test fails"| X3["Push aborted"]
    G1 -->|all pass| H["Push succeeds → remote"]
```

Walking through each stage, with the **exact script content** from this repository:

**1. `pre-commit`** — [`.husky/pre-commit`](../.husky/pre-commit):

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged (ESLint + Prettier on staged files)
pnpm exec lint-staged

# Secret scan — fails commit if any secret detected.
# Requires gitleaks installed locally (https://github.com/gitleaks/gitleaks).
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks protect --staged --redact --verbose
else
  echo "[husky] gitleaks not installed — skipping secret scan."
  echo "        Install: https://github.com/gitleaks/gitleaks#installing"
fi
```

`lint-staged` is configured in [`lint-staged.config.cjs`](../lint-staged.config.cjs):

```js
module.exports = {
  '*.ts': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
```

It only runs against files you've `git add`-ed (the "staged" files) — not your whole working tree. `eslint --fix` will auto-correct anything it can (formatting, import order) and re-stage the fixed file; if it finds a problem it **can't** auto-fix (e.g., a real `boundaries/element-types` violation, or a `--max-warnings 0` violation that isn't auto-fixable), the commit is aborted with the error printed to your terminal.

> **Warning:** the gitleaks step is **best-effort only**. If `gitleaks` is not installed on your machine, the hook prints a warning and **lets the commit through anyway** — it does not fail closed. Install gitleaks locally if you want this check to actually run. See [Section 10.4](#104-secrets--environment-variables) for the full secrets-handling discussion.

**2. `prepare-commit-msg`** — [`.husky/prepare-commit-msg`](../.husky/prepare-commit-msg):

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Auto-prefix commit message with the branch name (e.g. NUE-123).
# Skip for merge/squash/amend commits.
COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

if [ -n "$COMMIT_SOURCE" ]; then
  exit 0
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
PREFIX=$(echo "$BRANCH" | grep -Eo '^[A-Z]+-[0-9]+' || true)

if [ -n "$PREFIX" ]; then
  CURRENT=$(cat "$COMMIT_MSG_FILE")
  case "$CURRENT" in
    *"$PREFIX"*) ;;
    *) printf "%s\n\n%s" "$PREFIX" "$CURRENT" > "$COMMIT_MSG_FILE" ;;
  esac
fi
```

Line by line:

- `COMMIT_SOURCE=$2` — Git passes a second argument when the commit message came from somewhere other than your editor (e.g., `merge`, `squash`, `commit -m`). If this is non-empty, the hook **exits immediately** (`exit 0`) and does nothing — so this hook only acts when you write a commit message interactively.
- `BRANCH=$(git rev-parse --abbrev-ref HEAD)` — gets your current branch name, e.g. `NUE-123-add-deactivate-endpoint`.
- `PREFIX=$(echo "$BRANCH" | grep -Eo '^[A-Z]+-[0-9]+' || true)` — extracts a leading ticket-style prefix (one-or-more uppercase letters, a hyphen, one-or-more digits) from the **start** of the branch name. For `NUE-123-add-deactivate-endpoint`, this captures `NUE-123`. For a branch like `main`, `master`, or `initial-boilerplate`, the regex matches nothing, so `PREFIX` is empty and the rest of the script does nothing.
- If a prefix was found and isn't already in the message, it's prepended as its own line, followed by a blank line, then your original message — e.g., typing `feat(resource): add deactivate endpoint` on branch `NUE-123-deactivate` produces:

  ```
  NUE-123

  feat(resource): add deactivate endpoint
  ```

> **Note:** This repository's three branches — `main`, `master`, and the currently-checked-out `initial-boilerplate` — **do not** match the `^[A-Z]+-[0-9]+` ticket pattern, so on this repo today this hook is effectively a no-op. It is written for a workflow where feature branches are named after issue-tracker tickets (e.g., Jira-style `NUE-123-...`). **Not enough evidence found in repository** for what `NUE` stands for or which issue tracker is in use — adopt your team's actual ticket prefix when naming branches if you want this automation to activate.

**3. `commit-msg`** — [`.husky/commit-msg`](../.husky/commit-msg):

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm exec commitlint --edit "$1"
```

This runs after `prepare-commit-msg` has had its chance to modify the message, and validates the **final** message text against the rules in [`commitlint.config.cjs`](../commitlint.config.cjs) — covered in detail in [12.3](#123-branch--commit-conventions) below. If validation fails, the commit is aborted and commitlint prints exactly which rule failed and why.

**4. `pre-push`** — [`.husky/pre-push`](../.husky/pre-push):

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run unit tests before pushing.
pnpm test:unit
```

This is the last local gate, and the only one that runs your **code** (not just lint/format/message rules) — the full unit test suite (`jest --config jest.config.ts`, the same config covered in [Section 11](#11-testing-guide)). If even one unit test fails, **the push is aborted** and nothing reaches the remote. Note that this only runs `test:unit` — `test:integration` and `test:e2e` are **not** part of any local hook, matching the "optional" / "gated on `INTEGRATION=true`" language in the CONTRIBUTING.md test table.

> **Common Mistake:** running `git push --no-verify` to "save time" when `pre-push` is slow. This skips the _only_ automated test run that currently exists for your change (see [12.1](#121-what-exists-today-vs-what-the-docs-describe) — there is no CI to catch it afterwards). If `pnpm test:unit` is failing, fix the test or the code; don't bypass the hook.

### 12.3 Branch & commit conventions

**Commit messages** are validated by [commitlint](https://commitlint.js.org/) using [`commitlint.config.cjs`](../commitlint.config.cjs):

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'scope-empty': [1, 'never'],
    'subject-case': [2, 'always', 'sentence-case'],
    'header-max-length': [2, 'always', 100],
  },
};
```

What each rule means in practice:

| Rule                | Setting                      | What it requires                                                                                                                                                   |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type-enum`         | error (`2`)                  | The commit type (the word before the optional scope) must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. |
| `scope-empty`       | warning (`1`), "never"       | You **should** include a scope in parentheses, e.g. `(resource)`, `(auth)` — but a missing scope only produces a warning, not a hard failure.                      |
| `subject-case`      | error (`2`), "sentence-case" | The text after `type(scope): ` must start with a capital letter (sentence case), e.g. `Add deactivate endpoint`, not `add deactivate endpoint`.                    |
| `header-max-length` | error (`2`), `100`           | The full first line (`type(scope): subject`) must be ≤ 100 characters.                                                                                             |

Putting it together, a valid commit message for the [Section 9 tutorial](#9-end-to-end-tutorial) feature would be:

```
feat(resource): Add deactivate endpoint
```

— `feat` is in the type-enum, `(resource)` is a scope, and `Add deactivate endpoint` starts with a capital letter and is well under 100 characters.

> **Tip:** these are the _same_ conventions described in [Section 6.6](#6-coding-standards) — commitlint just enforces them mechanically via the `commit-msg` hook from [12.2](#122-local-quality-gates-the-husky-pipeline), so a malformed commit message never makes it into history in the first place.

**Branch naming**, as established in [12.2](#122-local-quality-gates-the-husky-pipeline), is _expected_ (by the `prepare-commit-msg` hook) to follow a `TICKET-123-short-description` pattern where `TICKET-123` matches `^[A-Z]+-[0-9]+`. **Not enough evidence found in repository** for a formally documented branch-naming policy beyond this regex — there is no `BRANCHING.md` or equivalent.

> **Note:** As of this writing, this repository has three branches: `main`, `master`, and `initial-boilerplate` (the currently checked-out branch, which also exists as `origin/initial-boilerplate`). Having both `main` and `master` as remote branches is unusual — most repositories have one or the other, not both, as they typically serve the same "default branch" purpose historically (`master` was the older Git default; `main` is the modern default). **Not enough evidence found in repository** for which of `main` or `master` is the intended long-lived integration branch going forward, or why both exist. If you're setting up a new clone of this boilerplate, confirm with your team which one to base feature branches from and treat the other as a candidate for cleanup.

### 12.4 Pull request checklist

[`CONTRIBUTING.md`](../CONTRIBUTING.md) defines a single command to run before opening a PR ([`CONTRIBUTING.md:146`](../CONTRIBUTING.md)):

```bash
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build
```

Because of `&&`, each command only runs if the previous one succeeded — so the first failure stops the chain. Run through it manually and you should see:

| Step          | Command                                                        | What it checks                                                                                                               | Approx. time\*    |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1. Lint       | `pnpm lint` (= `eslint "{src,test}/**/*.ts" --max-warnings 0`) | Code style, import order, hexagonal `boundaries` rules, unused vars — **zero warnings allowed**                              | seconds to ~1 min |
| 2. Type-check | `pnpm typecheck` (= `tsc --noEmit`)                            | Full TypeScript compiler pass with **no output files** — catches type errors `eslint` doesn't                                | ~10-30s           |
| 3. Unit tests | `pnpm test:unit`                                               | Every `*.spec.ts` under `src/` and `test/unit/` ([Section 11.2](#112-running-tests--exact-commands))                         | seconds           |
| 4. Build      | `pnpm build` (= `nest build`)                                  | Confirms the project compiles to `dist/` the same way the [Dockerfile](#125-build--deployment-artifacts) does for production | ~10-20s           |

\*Approximate, depends on machine. **Not enough evidence found in repository** for exact CI timing since no CI exists to measure.

> **Warning:** [Section 12.2](#122-local-quality-gates-the-husky-pipeline) showed that the Husky hooks **only** run `lint-staged` (lint+format on staged files, not the whole project) at commit time and `pnpm test:unit` at push time. They do **not** run `pnpm typecheck` or `pnpm build`. This means a commit can pass every Git hook and still fail steps 2 and 4 of this checklist — **you must run the full checklist manually before opening a PR**, because nothing else will.

> **Common Mistake:** running only `pnpm lint:fix` and assuming that's "the checks". `lint:fix` (`eslint ... --fix`) auto-corrects what it can and exits 0 even if some files were changed — it doesn't tell you whether `pnpm typecheck` or `pnpm build` would pass. Always run the full four-command chain from `CONTRIBUTING.md:146` before pushing for review.

### 12.5 Build & deployment artifacts

Even without a CI/CD pipeline, this repository **does** contain the building blocks for packaging the application — they're just not yet wired into an automated pipeline.

**[`Dockerfile`](../Dockerfile)** — a two-stage ("multi-stage") build:

```dockerfile
# syntax=docker/dockerfile:1.7
# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile=false

COPY tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

RUN pnpm prisma:generate
RUN pnpm build

# Strip dev deps for runtime.
RUN pnpm prune --prod

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache tini && addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/package.json ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/prisma ./prisma

USER app
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/infrastructure/main.js"]
```

> **Note (multi-stage builds explained):** A multi-stage `Dockerfile` builds your app in one temporary image (`builder`, which has all the dev tools and source code) and then copies _only the finished artifacts_ — `package.json`, the production `node_modules` (after `pnpm prune --prod` removes dev dependencies), the compiled `dist/`, and the `prisma` folder (needed at runtime for the Prisma client/schema) — into a second, much smaller `runtime` image. The `builder` stage and everything not copied (source `.ts` files, dev dependencies, build caches) never exists in the final image. This keeps the production image small and avoids shipping your source code or build tools.

A few details worth noting:

- `RUN corepack enable && corepack prepare pnpm@9.0.0 --activate` — installs the **exact** pnpm version pinned in [`package.json`](../package.json)'s `packageManager` field (`pnpm@9.0.0`), so the Docker build uses the same package manager version as your local dev (assuming you also use `corepack`).
- `RUN apk add --no-cache tini && addgroup -S app && adduser -S app -G app` then `USER app` — the container runs as a **non-root user** (`app`), a security best practice: if the Node process is compromised, the attacker doesn't have root inside the container. `tini` is a minimal init process that correctly forwards signals (e.g., `SIGTERM` on `docker stop`) to the Node process — without it, Node may not shut down gracefully.
- `EXPOSE 3000` matches the `PORT` default in [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts) and the `api` service's port mapping in `docker-compose.yml`.
- `CMD ["node", "dist/infrastructure/main.js"]` is the same entry point as `pnpm start:prod` in `package.json`.

**[`docker-compose.yml`](../docker-compose.yml)** — the local development stack:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: nest_postgres
    environment:
      POSTGRES_USER: nest
      POSTGRES_PASSWORD: nest
      POSTGRES_DB: nest
    ports: ['5432:5432']
    volumes: ['pg_data:/var/lib/postgresql/data']
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U nest']
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    container_name: nest_redis
    ports: ['6379:6379']

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nest_api
    depends_on:
      postgres: { condition: service_healthy }
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://nest:nest@postgres:5432/nest?schema=public
      KEYCLOAK_BASE_URL: ${KEYCLOAK_BASE_URL}
      KEYCLOAK_REALM: ${KEYCLOAK_REALM}
      KEYCLOAK_CLIENT_ID: ${KEYCLOAK_CLIENT_ID}
      KEYCLOAK_CLIENT_SECRET: ${KEYCLOAK_CLIENT_SECRET}
      KEYCLOAK_JWKS_URL: ${KEYCLOAK_JWKS_URL}
      KEYCLOAK_ISSUER: ${KEYCLOAK_ISSUER}
      REDIS_URL: redis://redis:6379
      CORS_ALLOWED_ORIGINS: http://localhost:5173
    ports: ['3000:3000']

volumes:
  pg_data:
```

The file's own header comment is worth repeating, because it's the most accurate description of intended usage:

```
# Local development stack.
# Usage:  make dev     (recommended)  /  docker compose up -d
#
# Keycloak is NOT included here — point KEYCLOAK_* env vars at your hosted instance.
# Set them in a .env file (see .env.example); this compose file reads them automatically.
```

This `docker-compose.yml` builds the **production** `Dockerfile` (`build: { context: ., dockerfile: Dockerfile }`) for the `api` service — so `docker compose up --build` exercises the same multi-stage build described above, just without pushing the resulting image anywhere.

Note that the `api` service's `DATABASE_URL` here (`postgresql://nest:nest@postgres:5432/nest?schema=public`) is **hardcoded** to match the `postgres` service's credentials (`nest`/`nest`/`nest`) — this is the value you should also use in your local `.env` (see [Section 8.7's troubleshooting table](#87-troubleshooting) for the related `.env.example` mismatch).

**[`Makefile`](../Makefile)** — convenience wrappers around the above plus pnpm/Prisma scripts:

```makefile
dev: ## Start the full local stack (Postgres, Redis, API) with hot reload — Keycloak is external
	docker compose up -d postgres redis
	@echo "Waiting for Postgres…" && sleep 3
	pnpm prisma:generate && pnpm prisma:deploy
	pnpm start:dev

test-all: ## Run unit + integration + e2e
	pnpm test:unit && pnpm test:integration && pnpm test:e2e
```

> **Note:** `make dev` starts `postgres` and `redis` **as containers** but runs the **API itself directly on your host** via `pnpm start:dev` (NestJS watch mode) — it does **not** start the `api` service from `docker-compose.yml`. The `api` service definition in `docker-compose.yml` (which builds and runs the production Docker image) is only used if you explicitly run `docker compose up` (all services, including `api`) or `docker compose up api`. This matches the file header's "(recommended)" framing of `make dev` for day-to-day development — building a fresh Docker image on every code change would be far slower than NestJS's hot-reload.

**Not enough evidence found in repository** for: a container registry (e.g., ECR, Docker Hub, GHCR) that the built image would be pushed to, a deployment target (Kubernetes, ECS, a PaaS, a VM), an environment-promotion strategy (dev → staging → prod), or production secrets management (e.g., AWS Secrets Manager, Vault). The `Dockerfile` and `docker-compose.yml` provide everything needed to **build and run** the application in a container; what happens to that container _after_ `docker build` is not yet defined anywhere in this repository.

### 12.6 What happens when you push, open a PR, or merge — today vs. intended

| Event                         | What's _documented_ (CONTRIBUTING.md language)                                                                                                                                                                            | What _actually_ happens today                                                                                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git commit`                  | (not explicitly described as "CI")                                                                                                                                                                                        | The four [Husky hooks](#122-local-quality-gates-the-husky-pipeline) run **locally**: `lint-staged`, optional `gitleaks`, branch-prefix injection, `commitlint`.                                                                               |
| `git push`                    | (not explicitly described as "CI")                                                                                                                                                                                        | `pre-push` runs `pnpm test:unit` **locally**. If it fails, the push never leaves your machine.                                                                                                                                                |
| Open a pull request on GitHub | "The CI workflow runs the same checks" ([`CONTRIBUTING.md:149`](../CONTRIBUTING.md)) — implying `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build` runs automatically and reports a pass/fail status on the PR | **Nothing automated runs.** No `.github/workflows/` exists, so GitHub does not run any check, post any status, or block merging on failures. The PR can be merged regardless of whether the code lints, type-checks, builds, or passes tests. |
| Merge to `main` / `master`    | (not documented)                                                                                                                                                                                                          | **Nothing automated runs.** No deployment, no image build/push, no notification.                                                                                                                                                              |

> **Warning:** Because of the gap in the table above, **the only real protection against broken code reaching `main`/`master` today is whether each contributor personally ran the [PR checklist](#124-pull-request-checklist) from 12.4** — and whether their local Husky hooks were installed and not bypassed with `--no-verify`. Until `.github/workflows/ci.yml` (or equivalent) exists, treat every PR review as needing to **manually verify** that the author ran `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build` successfully, e.g. by asking for the output or pasting it into the PR description.

If/when CI is added, the most evidence-aligned design — requiring no new conventions, just running what already exists — would be:

```mermaid
flowchart LR
    PR["Pull request opened/updated"] --> CI["CI workflow (.github/workflows/ci.yml)<br/>— does not exist yet"]
    CI --> L["pnpm lint"]
    L --> T["pnpm typecheck"]
    T --> U["pnpm test:unit"]
    U --> B["pnpm build"]
    B -->|all pass| OK["✅ status check passes — mergeable"]
    L -->|fail| FAIL["❌ status check fails — blocked"]
    T -->|fail| FAIL
    U -->|fail| FAIL
    B -->|fail| FAIL
```

This mirrors [`CONTRIBUTING.md:146`](../CONTRIBUTING.md) exactly, requires no new tooling beyond a CI runner (e.g., GitHub Actions), and would close the documentation/reality gap described in [12.1](#121-what-exists-today-vs-what-the-docs-describe) without inventing any new process.

---

## 13. Common Mistakes & Anti-Patterns

> **Note:** Every item in this section is either (a) a **real** issue that was found in this repository by actually running the relevant tool — [13.1](#131-worked-example-a-real-boundarieselement-types-violation) was found and has since been fixed, kept here as a worked example — or (b) a mistake pattern that the repository's own structure (ESLint boundaries, naming conventions, test patterns) is specifically designed to prevent — meaning it's the mistake a new contributor is _most likely_ to make precisely because the guard rails exist for it. Read this section once before opening your first PR, then come back to it whenever `pnpm lint` or `pnpm typecheck` produces an error you don't understand.

### 13.1 Worked example: a real `boundaries/element-types` violation

[Section 5](#5-import-rules) introduces the ESLint `boundaries` plugin and its dependency matrix. Until recently, running `pnpm lint` on this repository produced exactly one violation:

```
src/common/filters/all-exceptions.filter.ts
  16:8  error  No rule allowing this dependency was found. File is of type 'common'. Dependency is of type 'domain'  boundaries/element-types
```

**This violation has since been fixed** (`pnpm lint` now reports **zero** `boundaries/element-types` violations) — the fix is described in Step 5 below and has been applied to this repository. The walkthrough is kept here because **how it was diagnosed and fixed** is the same process that applies to any future `boundaries/element-types` error you cause yourself.

**Step 1 — read the error literally.** ESLint was saying: _"the file `src/common/filters/all-exceptions.filter.ts` is classified as type `common`. At line 16, column 8, it imports something classified as type `domain`. No rule permits `common → domain`."_

**Step 2 — find the import.** Line 16 of the old `src/common/filters/all-exceptions.filter.ts` (now [`src/infrastructure/filters/all-exceptions.filter.ts`](../src/infrastructure/filters/all-exceptions.filter.ts)) was:

```ts
import {
  BaseException,
  BusinessRuleException,
  EntityNotFoundException,
  InfrastructureException,
  ValidationException,
} from '~/core/domain/example/exceptions';
```

This imports the domain exception hierarchy — `BaseException`, `ValidationException`, `EntityNotFoundException`, etc. — so that `AllExceptionsFilter.classify()` can do `instanceof ValidationException` checks and map each exception type to the correct HTTP status code (this is the same filter described in [Section 10.3](#103-the-global-safety-net)).

**Step 3 — check the matrix** in [`.eslintrc.cjs`](../.eslintrc.cjs):

```js
'boundaries/elements': [
  { type: 'domain', pattern: 'src/core/domain/**' },
  { type: 'application', pattern: 'src/core/application/**' },
  { type: 'adapters', pattern: 'src/adapters/**' },
  { type: 'infrastructure', pattern: 'src/infrastructure/**' },
  { type: 'common', pattern: 'src/common/**' },
],
// ...
'boundaries/element-types': [
  'error',
  {
    default: 'disallow',
    rules: [
      { from: 'domain', allow: ['domain'] },
      { from: 'application', allow: ['domain', 'application'] },
      { from: 'adapters', allow: ['application', 'domain', 'adapters', 'common'] },
      { from: 'infrastructure', allow: ['domain', 'application', 'adapters', 'infrastructure', 'common'] },
      { from: 'common', allow: ['common'] },
    ],
  },
],
```

`src/core/domain/example/exceptions.ts` matches the `domain` pattern. `src/common/filters/all-exceptions.filter.ts` matched the `common` pattern. The `common` rule says `allow: ['common']` only — so **any** import from `domain`, `application`, `adapters`, or `infrastructure` inside `src/common/**` is a violation, by design. `common` is meant to hold framework-agnostic, dependency-free helpers that _everything else_ can safely depend on ([Section 5](#5-import-rules)) — if `common` could import from `domain`, you could create circular dependency chains (`domain` → ... → `common` → `domain`).

**Step 4 — why did this exist if it's "wrong"?** `AllExceptionsFilter` _needs_ to know about the domain exception classes to do its job (mapping `ValidationException` → 400, `EntityNotFoundException` → 404, etc.). When the file was originally created, `src/common/filters/` was a reasonable-_sounding_ place for "a filter used by the whole app" — but it violated the one rule that makes `common` safe to depend on from anywhere.

**Step 5 — the fix (applied):** `AllExceptionsFilter` is registered as a global filter from [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts):

```ts
import { AllExceptionsFilter } from '~/infrastructure/filters/all-exceptions.filter';
// ...
{ provide: APP_FILTER, useClass: AllExceptionsFilter },
```

Per the matrix, `infrastructure` is allowed to import `domain`, `application`, `adapters`, `infrastructure`, **and** `common` — it's the one layer allowed to "wire everything together". The fix:

1. Moved the file from `src/common/filters/all-exceptions.filter.ts` to `src/infrastructure/filters/all-exceptions.filter.ts` (no changes to the file's _contents_ — the `instanceof` checks against `~/core/domain/example/exceptions` are now `infrastructure → domain`, which **is** allowed).
2. Updated the one import in `app.module.ts` from `~/common/filters/all-exceptions.filter` to `~/infrastructure/filters/all-exceptions.filter`.

This resolved the violation **without** weakening the `common: allow: ['common']` rule for every other file in `src/common/`, which is the option you should generally prefer: fix the misplaced file, don't loosen the rule that caught it.

> **Tip:** if you ever find yourself wanting to add `'domain'` (or anything else) to the `common` rule's `allow` list to make a lint error go away, stop — that almost always means a file is in the wrong folder, not that the rule is wrong. Ask "which layer does this file's _dependencies_ say it actually belongs to?" and move the file there instead.

### 13.2 Layering anti-patterns

| Anti-pattern                                                                                                                                                                                                                                             | Why it's wrong                                                                                                                                                                                                                                                                                                                                                                                                                             | What `pnpm lint` will tell you                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A command/query handler in `src/core/application/**` injects `PrismaService` directly instead of a `*RepositoryPort` (e.g. `IResourceRepository`)                                                                                                        | Couples your use case to Prisma — you can no longer unit-test the handler with a plain mock object, and per [ADR-001 / Section 2](#2-architecture-overview) the application layer must depend only on **abstractions** (ports), with concrete adapters injected via DI tokens                                                                                                                                                              | `boundaries/element-types`: `application → adapters` is **not** in `application`'s allow list (`['domain', 'application']`) — `PrismaService` lives in `src/adapters/driven/prisma/` |
| A file in `src/core/domain/**` imports a decorator from `@nestjs/common`, `class-validator`, or `@prisma/client`                                                                                                                                         | The domain layer must be a **plain TypeScript** model that could run with zero frameworks installed — this is what makes [Section 11.3](#113-unit-tests-in-depth)'s "no I/O, no mocks needed for the entity itself" unit tests possible. CONTRIBUTING.md states this explicitly: _"Domain layer is decorator-free. Anything from `@nestjs/_`, `@prisma/_`, `class-validator`, `@nestjs/swagger`belongs in`adapters/`or`infrastructure/`."_ | Not directly caught by `boundaries` (these are `node_modules`, not internal layers) — but reviewers should reject this in PR review; it's a **convention**, not a lint rule          |
| A repository adapter in `src/adapters/driven/prisma/**` imports something from `src/infrastructure/**` directly (e.g., reaching into `src/infrastructure/config/env.ts` for a connection string instead of receiving config via the Nest DI constructor) | `adapters` is allowed to depend on `application`, `domain`, `adapters`, and `common` — but **not** `infrastructure`. Infrastructure wires adapters together; adapters must not reach back up into the wiring layer                                                                                                                                                                                                                         | `boundaries/element-types`: `adapters → infrastructure` is **not** in `adapters`'s allow list (`['application', 'domain', 'adapters', 'common']`)                                    |

### 13.3 CQRS / handler anti-patterns

| Anti-pattern                                                                                                                                                                                                                      | Why it's wrong                                                                                                                                                                                                                                                                                                | Symptom                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adding a new `@CommandHandler` / `@QueryHandler` class but forgetting to add it to the feature module's `HANDLERS` array (e.g. [`src/infrastructure/modules/example.module.ts`](../src/infrastructure/modules/example.module.ts)) | NestJS's `CqrsModule` discovers handlers via Nest's DI container — a handler class that is never `provide`-d is never instantiated, so `CommandBus`/`QueryBus` doesn't know it exists                                                                                                                         | The handler's `.spec.ts` unit test passes (it instantiates the handler directly), but calling the endpoint at runtime fails — `CommandBus.execute(...)` / `QueryBus.execute(...)` cannot find a registered handler for that command/query class. [Section 9.2 Step 7](#92-add-a-deactivate-resource-endpoint) shows the correct registration |
| Mutating an entity's private fields directly from outside the entity (e.g., reaching into `resource['_status']` from a handler) instead of calling a public method like `resource.deactivate()`                                   | Bypasses the entity's **invariant checks** (e.g. `validateName`) and — critically — bypasses `addDomainEvent(...)`, so no domain event is recorded for `pullDomainEvents()` to return later. The state changes, but nothing downstream (audit log, event publisher) ever finds out                            | No compile error (TypeScript does flag `private`/`#`-prefixed access _if_ you're outside the class — but a cast like `as any` or `resource['_status'] = ...` defeats this). The bug is **silent**: the database row updates, but no event fires                                                                                              |
| Calling `repo.save(resource)` but forgetting `await this.publisher.publishAll(resource.pullDomainEvents())` afterward                                                                                                             | `pullDomainEvents()` both _returns and clears_ the entity's pending event list ([`src/core/domain/example/aggregate-root.base.ts`](../src/core/domain/example/aggregate-root.base.ts)) — if you never call it, the events are silently discarded the next time something calls it (or never published at all) | No error of any kind — `LocalEventPublisher` ([Section 9.3's Deep Dive](#93-trace-the-full-request-patch-v1resourcesiddeactivate)) just never gets called. You'd only notice this if you were asserting on published events in a test, e.g. `expect(mockPublisher.publishAll).toHaveBeenCalledWith(...)`                                     |

### 13.4 DTO & controller anti-patterns

[`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts) carries this comment, which is the single most important rule for this layer:

```ts
/**
 * Driving adapter — HTTP. This is the ONLY layer where Swagger decorators live.
 * Controllers MUST NOT contain business logic; they translate HTTP to CQRS messages.
 */
```

| Anti-pattern                                                                                                                                                                                     | Why it's wrong                                                                                                                                                                                                                                                                                                                                                                        | Correct pattern                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Putting validation/business logic inside a controller method — e.g. `if (body.name.length < 2) throw new BadRequestException(...)` before calling `commandBus.execute(...)`                      | Duplicates (and can drift from) the validation already done by the domain entity ([`Resource.validateName`](../src/core/domain/example/resource.entity.ts)) and by the DTO's `class-validator` decorators. Now there are **two** sources of truth for "what makes a valid name"                                                                                                       | Validate at the DTO boundary (`class-validator` decorators, enforced by the global `ValidationPipe`) and again as a domain invariant (`Resource.create()` / entity methods, [Section 9.2](#92-add-a-deactivate-resource-endpoint)). The controller itself stays a 2-3 line translation: `return this.commandBus.execute(new SomeCommand(...))` |
| Adding `@ApiTags`, `@ApiProperty`, `@ApiOperation`, etc. to a class outside `src/adapters/driving/http/**` (e.g. decorating a domain entity or a CQRS command class so "the docs look complete") | Pulls a presentation-layer concern (`@nestjs/swagger`) into `core/domain` or `core/application`, violating the decorator-free domain rule from [13.2](#132-layering-anti-patterns) and creating a `boundaries` violation (those layers don't list `adapters` or external Swagger types in their allow lists)                                                                          | Define a separate **response DTO** in `src/adapters/driving/http/<feature>/*.dto.ts` (see [`resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts) for `CreateResourceDto`, `ListResourcesQueryDto`, `ResourceResponseDto`) and decorate _that_ — the controller maps domain/application results onto it                      |
| Creating a new controller or endpoint without `@UseGuards(JwtAuthGuard, RolesGuard)` and an appropriate `@Roles(...)` decorator                                                                  | Per [Section 10.1](#101-authentication)'s Warning, there is **no global guard** — every controller is unprotected by default unless it explicitly opts in. An endpoint with no guards is reachable by **anyone**, including unauthenticated requests                                                                                                                                  | Copy the class-level decorators from `ResourceController`: `@UseGuards(JwtAuthGuard, RolesGuard)` on the controller class, plus `@Roles('<resource>:<action>')` on each method, in that guard order ([Section 10.2](#102-authorization))                                                                                                       |
| Adding a new field to a request DTO without a `class-validator` decorator (e.g. `name: string;` with no `@IsString()` / `@MinLength(...)`)                                                       | The global pipe is configured as `new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })` ([`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)). `forbidNonWhitelisted: true` means **any property without at least one validation decorator is rejected** — the request fails with a 400 before your controller method even runs | Every property on a request DTO needs at least one `class-validator` decorator (even `@IsOptional()` for optional fields), matching the pattern in [`CreateResourceDto`](../src/adapters/driving/http/example/resource.dto.ts)                                                                                                                 |

### 13.5 Testing anti-patterns

| Anti-pattern                                                                                                                                                                             | Why it's wrong                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Correct pattern                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In a unit test for a command/query handler, mocking `PrismaService` (or any concrete adapter class) instead of the **port** it implements (e.g. `IResourceRepository`)                   | The handler's constructor is typed against the port (`@Inject(RESOURCE_REPOSITORY) private readonly repo: IResourceRepository`), not against `PrismaService`. Mocking `PrismaService` means your test exercises a dependency the handler doesn't actually have, and doesn't verify the handler calls the port correctly                                                                                                                                                                                                                                                                                                    | Build a plain object implementing the port's methods as `jest.fn()`s, e.g. `{ save: jest.fn(), findById: jest.fn() }`, and provide it via the same DI token (`RESOURCE_REPOSITORY`). See [Section 11.3](#113-unit-tests-in-depth) and [`create-resource.command.spec.ts`](../test/unit/create-resource.command.spec.ts) |
| Running `pnpm test:integration` on a fresh clone and assuming a failure means your code is broken                                                                                        | [Section 8.4](#84-database-setup) and [Section 11.4](#114-integration-tests) both flag that `prisma/migrations/` does not exist in this repository — `prisma migrate deploy` (run by [`test/integration/resource.repository.int-spec.ts`](../test/integration/resource.repository.int-spec.ts)'s setup) is a no-op against an empty migrations folder, so the Testcontainers Postgres instance has **no tables**. The first thing to check when an integration test fails with a "relation does not exist" / "table not found" style error is **whether migrations exist and have been applied** — not your business logic | Run `pnpm prisma migrate dev --schema=./prisma/schema --name init` once to generate the initial migration (per [Section 8.4](#84-database-setup)) before relying on `pnpm test:integration`                                                                                                                             |
| Writing a new `it(...)` block that relies on a hand-written stub object's call history (e.g. `let calls: string[] = []`) being reset between tests, without resetting it in `beforeEach` | [`jest.config.ts`](../jest.config.ts) sets `clearMocks: true`, which automatically resets `jest.fn()` mock call history between tests — but it has **no effect** on plain objects/arrays you create yourself                                                                                                                                                                                                                                                                                                                                                                                                               | Either use `jest.fn()` for anything you need reset automatically, or explicitly reset hand-written state in a `beforeEach(() => { ... })` block                                                                                                                                                                         |

### 13.6 Tooling & process anti-patterns

These are covered in detail elsewhere in this guide — listed here together so you have one place to scan:

- **Bypassing Git hooks with `--no-verify`** (e.g. `git commit --no-verify`, `git push --no-verify`) — skips the _only_ automated checks that currently exist for this repo, since there is no CI pipeline ([Section 12.1](#121-what-exists-today-vs-what-the-docs-describe), [Section 12.2](#122-local-quality-gates-the-husky-pipeline)).
- **Running only `pnpm lint:fix` before opening a PR** and assuming that's sufficient — it doesn't run `pnpm typecheck`, `pnpm test:unit`, or `pnpm build`, all of which are part of the documented (manual) [PR checklist](#124-pull-request-checklist).
- **Assuming a green local commit/push means a green PR** — there is no CI to re-run anything server-side ([Section 12.6](#126-what-happens-when-you-push-open-a-pr-or-merge--today-vs-intended)). A passing `pre-push` only proves `pnpm test:unit` passed; it says nothing about `pnpm typecheck` or `pnpm build`.
- **Ignoring a wall of `prettier/prettier "Delete '␍'"` errors from `pnpm lint`** on Windows — this is a CRLF/LF line-ending mismatch, not a real code issue. See the fix in [Section 8.7's troubleshooting table](#87-troubleshooting).

### 13.7 Configuration & environment anti-patterns

Also covered in detail elsewhere — cross-referenced here:

- **Copying `.env.example`'s `DATABASE_URL` verbatim** when running against the `docker-compose.yml` Postgres — the credentials/database name don't match (`generic`/`generic`/`generic` vs. `nest`/`nest`/`nest`). See [Section 8.7](#87-troubleshooting).
- **Leaving placeholder `KEYCLOAK_*` values** from `.env.example` in your `.env` and then being confused by "invalid issuer" or JWKS fetch failures — these are **expected** with placeholder values; you need a real Keycloak realm. See [Section 8.3](#83-environment-setup) and [Section 8.7](#87-troubleshooting).
- **Skipping the initial Prisma migration** (`pnpm prisma migrate dev --schema=./prisma/schema --name init`) and then being surprised that `make dev`'s `pnpm prisma:deploy` didn't create any tables — `prisma:deploy` only _applies_ existing migrations, it doesn't generate new ones from the schema. See [Section 8.4](#84-database-setup).

---

## 14. Developer Checklist

> **Tip:** Copy this section into your PR description and check items off as you go. Because [Section 12.6](#126-what-happens-when-you-push-open-a-pr-or-merge--today-vs-intended) established that **no CI pipeline runs these checks for you**, a checked-off list in the PR description is the only evidence a reviewer has that they were run at all.

### 14.1 Before you start coding

- [ ] You're on a fresh branch off the correct base branch (confirm with your team whether that's `main` or `master` — see the [Note in Section 12.3](#123-branch--commit-conventions) about both existing).
- [ ] If your branch name follows the `TICKET-123-...` pattern, the [`prepare-commit-msg` hook](#122-local-quality-gates-the-husky-pipeline) will auto-prefix your commits with `TICKET-123`.
- [ ] If you'll run `pnpm test:integration`, you've confirmed `prisma/migrations/` exists and is applied (see [Section 8.4](#84-database-setup)) — otherwise the tests will fail for an environment reason, not a code reason.

### 14.2 Architecture & layering

- [ ] New files are placed according to the [folder contract in Section 4](#4-file-placement-rules) — domain in `core/domain/<feature>/`, ports in `core/application/ports/`, commands/queries/handlers in `core/application/<feature>/`, controllers+DTOs in `adapters/driving/http/<feature>/`, repository adapters in `adapters/driven/prisma/`.
- [ ] Domain code (`core/domain/**`) imports nothing from `@nestjs/*`, `@prisma/*`, `class-validator`, or `@nestjs/swagger` — it stays decorator-free (CONTRIBUTING.md, [Section 13.2](#132-layering-anti-patterns)).
- [ ] Application handlers (`core/application/**`) depend only on **ports** (abstract classes/interfaces in `core/application/ports/`), injected via DI tokens — never a concrete adapter class like `PrismaService` directly ([Section 13.2](#132-layering-anti-patterns)).
- [ ] Any new `@CommandHandler` / `@QueryHandler` is added to the owning module's `HANDLERS` array (e.g. [`example.module.ts`](../src/infrastructure/modules/example.module.ts)) — otherwise `CommandBus`/`QueryBus` won't find it at runtime ([Section 13.3](#133-cqrs--handler-anti-patterns)).
- [ ] Any new domain event is raised via `addDomainEvent(...)` inside an entity method, and the calling handler calls `publisher.publishAll(entity.pullDomainEvents())` after `repo.save(...)` ([Section 9.2](#92-add-a-deactivate-resource-endpoint), [Section 13.3](#133-cqrs--handler-anti-patterns)).
- [ ] `pnpm lint` reports **zero** `boundaries/element-types` violations (see [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) for how to read and fix one if you introduce it).

### 14.3 HTTP layer (controllers & DTOs)

- [ ] New/changed controllers have `@UseGuards(JwtAuthGuard, RolesGuard)` (in that order) unless the endpoint is **intentionally public**, in which case it's documented as such ([Section 10.1](#101-authentication), [Section 10.2](#102-authorization)).
- [ ] Every write/sensitive endpoint has an appropriate `@Roles('<resource>:<action>')`.
- [ ] Every request DTO field has at least one `class-validator` decorator — the global `ValidationPipe`'s `forbidNonWhitelisted: true` rejects anything without one ([Section 13.4](#134-dto--controller-anti-patterns)).
- [ ] All Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, etc.) live only in `src/adapters/driving/http/**`.
- [ ] Controller methods remain thin — translate HTTP → CQRS message and return the result; no `if`/business-rule logic in the controller ([Section 13.4](#134-dto--controller-anti-patterns)).

### 14.4 Tests

- [ ] At least one new unit test exists for new behavior (CONTRIBUTING.md: _"Every PR needs at least one unit test for the new behavior"_).
- [ ] Unit test mocks target **ports** (e.g. `IResourceRepository`, `IEventPublisher`), not concrete adapters ([Section 11.3](#113-unit-tests-in-depth), [Section 13.5](#135-testing-anti-patterns)).
- [ ] `pnpm test:unit` passes locally (this is also enforced by [`pre-push`](#122-local-quality-gates-the-husky-pipeline) — but verify _before_ you're mid-push).
- [ ] If you touched a Prisma repository adapter, you've run `pnpm test:integration` against a Postgres with migrations applied ([Section 11.4](#114-integration-tests)).

### 14.5 The mandatory pre-PR command chain

Run this exactly as written ([Section 12.4](#124-pull-request-checklist)), and stop at the first failure:

```bash
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build
```

- [ ] `pnpm lint` — zero errors, zero warnings (`--max-warnings 0`).
- [ ] `pnpm typecheck` — `tsc --noEmit` exits 0.
- [ ] `pnpm test:unit` — all suites pass.
- [ ] `pnpm build` — `nest build` exits 0, `dist/` is produced.

### 14.6 Commits, docs, and PR hygiene

- [ ] Commit messages follow Conventional Commits with a **sentence-case** subject and a scope, e.g. `feat(resource): Add deactivate endpoint` ([Section 12.3](#123-branch--commit-conventions)).
- [ ] If the change affects data flow between components, `docs/diagrams/` has been updated (CONTRIBUTING.md, "Document" step).
- [ ] If the change adds/changes an environment variable, `.env.example` and the table in [Section 8.3](#83-environment-setup) are updated together — don't let them drift further than they already have ([Section 8.7](#87-troubleshooting)).
- [ ] The PR description includes the output (or a screenshot) of the [14.5 command chain](#145-the-mandatory-pre-pr-command-chain) passing — since [no CI verifies this automatically](#126-what-happens-when-you-push-open-a-pr-or-merge--today-vs-intended), this is the reviewer's only evidence.

### 14.7 Security quick-check

This is the full [Section 10.7 checklist](#107-security-checklist-summary), repeated here so you don't have to scroll back:

- [ ] New controller has `@UseGuards(JwtAuthGuard, RolesGuard)` unless it is **intentionally public** (like `/v1/health`).
- [ ] Every write/sensitive endpoint has an appropriate `@Roles(...)`.
- [ ] `@UseGuards(JwtAuthGuard, RolesGuard)` — guard order is `JwtAuthGuard` **before** `RolesGuard`.
- [ ] All request input goes through a DTO with `class-validator` decorators — never raw `req.body`.
- [ ] No secrets in code, comments, commit messages, or `.env.example`.
- [ ] `gitleaks` is installed locally so the pre-commit secret scan actually runs.
- [ ] No new code logs tokens, passwords, secrets, or full request headers/bodies.
- [ ] `CORS_ALLOWED_ORIGINS` lists specific origins — never `*`.

---

## 15. Quick Reference

> **Tip:** This section is deliberately table-heavy and low on prose — keep it open in a tab while you work. Every row links back to the section with the full explanation.

### 15.1 Commands cheat sheet

From [`package.json`](../package.json) scripts and the [`Makefile`](../Makefile):

| Command                                                       | What it does                                                                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm install` (or `make install`)                            | Install dependencies                                                                                              |
| `pnpm start:dev`                                              | Start the API in watch mode (hot reload)                                                                          |
| `pnpm start:debug`                                            | Start with `--debug --watch` (Node inspector attached)                                                            |
| `pnpm start:prod`                                             | Run the compiled `dist/infrastructure/main.js` (what the Docker image runs)                                       |
| `pnpm build`                                                  | `nest build` → compile to `dist/`                                                                                 |
| `pnpm lint`                                                   | ESLint over `src/` and `test/`, zero warnings allowed                                                             |
| `pnpm lint:fix`                                               | Same, with `--fix`                                                                                                |
| `pnpm format`                                                 | Prettier `--write` over `src/` and `test/`                                                                        |
| `pnpm typecheck`                                              | `tsc --noEmit`                                                                                                    |
| `pnpm test:unit`                                              | Unit tests ([Section 11.2](#112-running-tests--exact-commands))                                                   |
| `pnpm test:integration`                                       | Integration tests, Testcontainers Postgres, `--runInBand`                                                         |
| `pnpm test:e2e`                                               | e2e tests, supertest, `--runInBand`                                                                               |
| `pnpm test:cov`                                               | Unit tests with coverage report                                                                                   |
| `pnpm prisma:generate`                                        | Regenerate the Prisma client from `prisma/schema/`                                                                |
| `pnpm prisma:migrate`                                         | `prisma migrate dev` — create + apply a new migration                                                             |
| `pnpm prisma:deploy`                                          | `prisma migrate deploy` — apply existing migrations only (no-op if none exist, [Section 8.4](#84-database-setup)) |
| `pnpm prisma:studio`                                          | Open Prisma Studio (DB browser GUI)                                                                               |
| `pnpm prisma:seed`                                            | Run `prisma/seed.ts`                                                                                              |
| `pnpm openapi:generate`                                       | Emit `openapi.json`                                                                                               |
| `pnpm postman:generate`                                       | Emit `postman-collection.json` from `openapi.json`                                                                |
| `make dev`                                                    | `docker compose up -d postgres redis`, then `prisma:generate && prisma:deploy`, then `pnpm start:dev`             |
| `make down`                                                   | `docker compose down`                                                                                             |
| `make migrate NAME=...`                                       | `prisma migrate dev --schema=./prisma/schema --name $(NAME)`                                                      |
| `make test-all`                                               | `test:unit && test:integration && test:e2e`                                                                       |
| `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build` | The [mandatory pre-PR chain](#145-the-mandatory-pre-pr-command-chain)                                             |

### 15.2 "Where do I put...?"

Condensed from [Section 4](#4-file-placement-rules):

| I'm adding...                                                                     | Goes in...                                                                                                                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A new entity, value object, domain event, or domain exception                     | `src/core/domain/<feature>/`                                                                                                                                       |
| A new abstract repository / publisher / external-service port                     | `src/core/application/ports/`                                                                                                                                      |
| A new command or query class                                                      | `src/core/application/<feature>/`                                                                                                                                  |
| A new `@CommandHandler` / `@QueryHandler`                                         | `src/core/application/<feature>/` (and register in the module's `HANDLERS` array)                                                                                  |
| A new HTTP controller, request/response DTO, or Swagger decorator                 | `src/adapters/driving/http/<feature>/`                                                                                                                             |
| A new Prisma repository implementing a port                                       | `src/adapters/driven/prisma/`                                                                                                                                      |
| A new outbound integration (NATS, message queue, 3rd-party API)                   | `src/adapters/driven/<integration>/`, behind a port                                                                                                                |
| A new guard, interceptor, filter, decorator, or middleware shared across features | `src/common/` (but see [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) — `common` may not import `core/domain` or `core/application`) |
| A new NestJS module wiring everything together                                    | `src/infrastructure/modules/`                                                                                                                                      |
| A new env var                                                                     | `src/infrastructure/config/env.ts` (Zod schema) **and** `.env.example` **and** the table in [Section 8.3](#83-environment-setup)                                   |
| A new Prisma model                                                                | A new/existing `.prisma` file in `prisma/schema/`, then `pnpm prisma:migrate`                                                                                      |

### 15.3 Import boundary cheat sheet

From [`.eslintrc.cjs`](../.eslintrc.cjs)'s `boundaries/element-types` (full discussion in [Section 5](#5-import-rules) and [Section 13.1-13.2](#131-worked-example-a-real-boundarieselement-types-violation)):

| From \ may import →   | `domain` | `application` | `adapters` | `infrastructure` | `common` |
| --------------------- | :------: | :-----------: | :--------: | :--------------: | :------: |
| `core/domain/**`      |    ✅    |      ❌       |     ❌     |        ❌        |    ❌    |
| `core/application/**` |    ✅    |      ✅       |     ❌     |        ❌        |    ❌    |
| `adapters/**`         |    ✅    |      ✅       |     ✅     |        ❌        |    ✅    |
| `infrastructure/**`   |    ✅    |      ✅       |     ✅     |        ✅        |    ✅    |
| `common/**`           |    ❌    |      ❌       |     ❌     |        ❌        |    ✅    |

**Rule of thumb:** dependencies only point "inward" (toward `domain`) or toward `common`/`infrastructure` from layers allowed to see them. If `pnpm lint` reports a `boundaries/element-types` error, the file is almost always in the wrong folder — see [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) for a full worked example.

### 15.4 Key ports, DI tokens & providers

| Token / class                                                                                   | Defined in                                                                                                    | Purpose                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RESOURCE_REPOSITORY` (`Symbol('IResourceRepository')`)                                         | [`src/core/application/ports/resource.repository.ts`](../src/core/application/ports/resource.repository.ts)   | DI token for the `IResourceRepository` port — implemented by `src/adapters/driven/prisma/resource.repository.ts`                                                   |
| `EVENT_PUBLISHER` (`Symbol('IEventPublisher')`)                                                 | [`src/core/application/ports/event-publisher.port.ts`](../src/core/application/ports/event-publisher.port.ts) | DI token for the `IEventPublisher` port — implemented by `LocalEventPublisher` ([Section 9.3 Deep Dive](#93-trace-the-full-request-patch-v1resourcesiddeactivate)) |
| `AUTH_CONFIG` (`Symbol('AUTH_CONFIG')`)                                                         | [`src/common/config/auth-config.token.ts`](../src/common/config/auth-config.token.ts)                         | DI token for `{ jwksUrl, issuer, clientId }`, provided by `ConfigModule`, consumed by `JwtAuthGuard`                                                               |
| `ENV_TOKEN` (`Symbol('APP_ENV')`)                                                               | [`src/infrastructure/config/config.module.ts`](../src/infrastructure/config/config.module.ts)                 | DI token for the validated `AppEnv` object (the Zod-parsed result of [`env.ts`](../src/infrastructure/config/env.ts))                                              |
| `APP_FILTER` → `AllExceptionsFilter`                                                            | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                     | Global exception filter ([Section 10.3](#103-the-global-safety-net), [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation))                 |
| `APP_INTERCEPTOR` → `LoggingInterceptor`, `ResponseTransformInterceptor`                        | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                     | Global request logging + response envelope wrapping                                                                                                                |
| `APP_GUARD` → `ThrottlerGuard`                                                                  | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                     | Global rate limiting, configured via `THROTTLE_TTL` / `THROTTLE_LIMIT`                                                                                             |
| `APP_PIPE` → `ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })` | [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                     | Global DTO validation ([Section 13.4](#134-dto--controller-anti-patterns))                                                                                         |

### 15.5 Domain exception → HTTP status mapping

From [`AllExceptionsFilter.classify()`](../src/infrastructure/filters/all-exceptions.filter.ts) ([Section 10.3](#103-the-global-safety-net), [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation)):

| Thrown as...                                                | HTTP status               | `error.code` in response envelope              |
| ----------------------------------------------------------- | ------------------------- | ---------------------------------------------- |
| `ValidationException`                                       | 400 Bad Request           | `DOMAIN_VALIDATION`                            |
| `EntityNotFoundException`                                   | 404 Not Found             | `DOMAIN_ENTITY_NOT_FOUND`                      |
| `BusinessRuleException`                                     | 422 Unprocessable Entity  | `DOMAIN_BUSINESS_RULE`                         |
| `InfrastructureException`                                   | 500 Internal Server Error | `INFRASTRUCTURE_ERROR`                         |
| Any other `BaseException` (e.g. `ApplicationException`)     | 500 Internal Server Error | `APPLICATION_ERROR` (or whatever `ex.code` is) |
| `HttpException` (Nest built-ins like `BadRequestException`) | `ex.getStatus()`          | `HTTP_<status>`                                |
| Anything else (unexpected `Error`, etc.)                    | 500 Internal Server Error | `INTERNAL_SERVER_ERROR`                        |

### 15.6 Environment variables at a glance

Full descriptions, defaults, and "is it a secret?" flags are in [Section 8.3](#83-environment-setup). Names and groups, from [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts):

| Group                    | Variables                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| App                      | `NODE_ENV`, `SERVICE_NAME`, `APP_PORT`, `API_PREFIX`, `LOG_LEVEL`                                                             |
| Database                 | `DATABASE_URL`                                                                                                                |
| Keycloak                 | `KEYCLOAK_BASE_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_JWKS_URL`, `KEYCLOAK_ISSUER` |
| Redis (optional)         | `REDIS_URL`, `CACHE_ENABLED`                                                                                                  |
| CORS                     | `CORS_ALLOWED_ORIGINS` (comma-separated)                                                                                      |
| Observability (optional) | `SENTRY_DSN`, `OTEL_ENABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS`                                     |
| Throttling               | `THROTTLE_TTL`, `THROTTLE_LIMIT`                                                                                              |
| Feature flags            | `FEATURE_FLAGS_OVERRIDES`                                                                                                     |

> **Note:** `loadEnv()` validates **all** of these with Zod at startup and throws (preventing the app from listening) if validation fails — so a missing required var (anything without `.default(...)` or `.optional()`, e.g. `DATABASE_URL`, `KEYCLOAK_BASE_URL`) fails fast with a printed JSON diff, rather than causing a mysterious runtime error later.

### 15.7 Key files map

| File                                                                                                                                      | What it is                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`src/infrastructure/main.ts`](../src/infrastructure/main.ts)                                                                             | Application bootstrap — helmet, compression, CORS, versioning, Swagger, `app.listen()` |
| [`src/infrastructure/app.module.ts`](../src/infrastructure/app.module.ts)                                                                 | Root module — global pipe/filter/interceptors/guard registration                       |
| [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts)                                                                 | Zod env schema + `loadEnv()`                                                           |
| [`src/infrastructure/config/config.module.ts`](../src/infrastructure/config/config.module.ts)                                             | `ENV_TOKEN` and `AUTH_CONFIG` providers                                                |
| [`src/core/domain/example/resource.entity.ts`](../src/core/domain/example/resource.entity.ts)                                             | The example aggregate root — entity, invariants, domain events                         |
| [`src/core/domain/example/exceptions.ts`](../src/core/domain/example/exceptions.ts)                                                       | Domain exception hierarchy                                                             |
| [`src/core/application/ports/resource.repository.ts`](../src/core/application/ports/resource.repository.ts)                               | `IResourceRepository` port + `RESOURCE_REPOSITORY` token                               |
| [`src/core/application/ports/event-publisher.port.ts`](../src/core/application/ports/event-publisher.port.ts)                             | `IEventPublisher` port + `EVENT_PUBLISHER` token                                       |
| [`src/adapters/driven/prisma/resource.repository.ts`](../src/adapters/driven/prisma/resource.repository.ts)                               | Prisma implementation of `IResourceRepository`                                         |
| [`src/adapters/driven/local/local-event.publisher.ts`](../src/adapters/driven/local/local-event.publisher.ts)                             | Logging-only `IEventPublisher` implementation                                          |
| [`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts)                 | The example REST controller                                                            |
| [`src/adapters/driving/http/example/resource.dto.ts`](../src/adapters/driving/http/example/resource.dto.ts)                               | Request/response DTOs with `class-validator` + Swagger decorators                      |
| [`src/infrastructure/modules/example.module.ts`](../src/infrastructure/modules/example.module.ts)                                         | Wires the example feature's controller, handlers, and adapters together                |
| [`src/infrastructure/filters/all-exceptions.filter.ts`](../src/infrastructure/filters/all-exceptions.filter.ts)                           | Global exception → HTTP response mapping                                               |
| [`src/common/guards/jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts) / [`roles.guard.ts`](../src/common/guards/roles.guard.ts) | Authentication (JWKS) and authorization (`@Roles`) guards                              |
| [`.eslintrc.cjs`](../.eslintrc.cjs)                                                                                                       | Layer boundary rules, import order, all other lint rules                               |
| [`prisma/schema/`](../prisma/schema/)                                                                                                     | Multi-file Prisma schema                                                               |
| [`docker-compose.yml`](../docker-compose.yml) / [`Dockerfile`](../Dockerfile) / [`Makefile`](../Makefile)                                 | Local stack, container build, convenience commands                                     |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md)                                                                                                   | Step-by-step "add a new vertical slice" guide, coding conventions, PR checklist        |

---

## 16. How to Read This Codebase & Get Unstuck

### 16.1 The "front door": the order things actually happen in

When the app starts, or when a request comes in, code executes in a specific order — and that order is also the **best reading order** when you're trying to understand "how does X work?":

```mermaid
flowchart TD
    A["src/infrastructure/main.ts<br/>bootstrap: helmet, compression, CORS,<br/>versioning, Swagger, app.listen()"] --> B["src/infrastructure/app.module.ts<br/>global pipe / filter / interceptors / guard,<br/>imports feature modules"]
    B --> C["src/infrastructure/modules/example.module.ts<br/>wires controller + handlers + repository + publisher"]
    C --> D["src/adapters/driving/http/example/resource.controller.ts<br/>HTTP entry point — guards, DTOs, CommandBus/QueryBus"]
    D --> E["src/core/application/example/*.command.ts or *.query.ts<br/>handler — orchestrates the use case"]
    E --> F["src/core/domain/example/resource.entity.ts<br/>business rules, invariants, domain events"]
    E --> G["src/adapters/driven/prisma/resource.repository.ts<br/>persistence, implements IResourceRepository"]
    E --> H["src/adapters/driven/local/local-event.publisher.ts<br/>implements IEventPublisher"]
```

If you're new to this codebase, **read these files in this order** for the example slice — it mirrors [Section 9.3's request trace](#93-trace-the-full-request-patch-v1resourcesiddeactivate) and is the fastest path to "I understand how a feature works end-to-end here."

### 16.2 General debugging flowchart

When _something_ is broken and you don't yet know what category it falls into, start here:

```mermaid
flowchart TD
    Start(["Something is broken"]) --> Q1{"Does the app<br/>start at all?<br/>(pnpm start:dev)"}
    Q1 -->|No — exits immediately,<br/>prints '❌ Invalid environment<br/>configuration'| EnvErr["Zod env validation failed.<br/>Check the printed JSON diff against<br/>src/infrastructure/config/env.ts<br/>and your .env — see Section 8.3 / 8.7"]
    Q1 -->|"No — Nest DI error,<br/>'Nest can't resolve dependencies'"| DiErr["A provider/token isn't registered<br/>in a module. Check the module's<br/>'providers' array and HANDLERS list —<br/>see Section 13.3 / 15.4"]
    Q1 -->|Yes, app is running| Q2{"Is the failure in<br/>pnpm lint / typecheck / test?"}

    Q2 -->|"pnpm lint fails"| LintErr["Read the rule name in the error.<br/>'boundaries/element-types' → Section 13.1 / 15.3.<br/>'prettier/prettier Delete CR' → Section 8.7 (CRLF)"]
    Q2 -->|"pnpm typecheck fails"| TypeErr["tsc error with file:line.<br/>Usually a strict-mode issue — check<br/>noUncheckedIndexedAccess / exactOptionalPropertyTypes<br/>in tsconfig.json (Section 6 / Appendix B ADR-004)"]
    Q2 -->|"pnpm test:unit / :integration / :e2e fails"| TestErr["Read the FAIL output top-to-bottom —<br/>see Section 11.6 'How to read a failing test'.<br/>Integration test failing on missing table?<br/>→ Section 8.4 / 11.4 (no prisma/migrations/)"]
    Q2 -->|No, app runs and builds| Q3{"What does the<br/>HTTP response look like?"}

    Q3 -->|"401 Unauthorized"| AuthErr["Missing/invalid Bearer token, wrong<br/>KEYCLOAK_ISSUER, or JWKS unreachable<br/>→ Section 10.1 / CONTRIBUTING.md Troubleshooting"]
    Q3 -->|"403 Forbidden"| RoleErr["Token valid but missing required role —<br/>check @Roles(...) on the endpoint vs<br/>realm_access.roles in the JWT → Section 10.2"]
    Q3 -->|"400 / 404 / 422 with<br/>{ success: false, error: { code, ... } }"| DomainErr["A domain exception was thrown —<br/>look up error.code in Section 15.5's<br/>exception → status mapping table"]
    Q3 -->|"500 with code INTERNAL_SERVER_ERROR<br/>or INFRASTRUCTURE_ERROR"| InfraErr["Check server logs (LoggingInterceptor /<br/>AllExceptionsFilter logs the full error).<br/>Often a Prisma/DB connectivity issue —<br/>verify DATABASE_URL → Section 8.7"]
```

### 16.3 Error message decoder

A quick lookup from **the literal text of an error** to **where to look**:

| Error message looks like...                                                                                                  | What it means                                                                                                                            | Where to look                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `❌ Invalid environment configuration: { ... }` at startup                                                                   | A required env var is missing/invalid per the Zod schema                                                                                 | [`src/infrastructure/config/env.ts`](../src/infrastructure/config/env.ts), [Section 8.3](#83-environment-setup)                                                                                                |
| `Nest can't resolve dependencies of the X (?). Please make sure that the argument Y at index Z is available...`              | A constructor parameter's DI token isn't provided by any imported module                                                                 | [Section 15.4](#154-key-ports-dis-tokens--providers) (check the token is in some module's `providers`/`exports`); also check [Section 13.3](#133-cqrs--handler-anti-patterns) for the `HANDLERS` array pattern |
| `No rule allowing this dependency was found. File is of type 'X'. Dependency is of type 'Y'  boundaries/element-types`       | An import crosses a forbidden hexagonal-layer boundary                                                                                   | [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) (worked example), [Section 15.3](#153-import-boundary-cheat-sheet) (matrix)                                                       |
| `prettier/prettier  Delete '␍'` (often hundreds of times)                                                                    | Windows CRLF line endings vs. repo's LF requirement                                                                                      | [Section 8.7](#87-troubleshooting)                                                                                                                                                                             |
| `Cannot find module '~/...' from '...'`                                                                                      | Typo in an import path, or a config missing the `~/*` → `src/*` mapping                                                                  | [Section 11.6's Tip](#116-how-to-read-a-failing-test) — compare against [`jest.config.ts`](../jest.config.ts)'s `moduleNameMapper` and [`tsconfig.json`](../tsconfig.json)'s `paths`                           |
| `UnauthorizedException: Missing bearer token`                                                                                | Request had no `Authorization: Bearer <token>` header                                                                                    | [Section 10.1](#101-authentication)                                                                                                                                                                            |
| `UnauthorizedException: Invalid token: ...` (e.g. "exp claim timestamp check failed", "unexpected issuer")                   | Token expired, wrong issuer, or JWKS endpoint unreachable                                                                                | [Section 10.1](#101-authentication), CONTRIBUTING.md Troubleshooting (`KEYCLOAK_ISSUER`/`KEYCLOAK_JWKS_URL`, `host.docker.internal` in Docker)                                                                 |
| `ForbiddenException` / 403 from `RolesGuard`                                                                                 | JWT is valid but `realm_access.roles` doesn't include a role required by `@Roles(...)`                                                   | [Section 10.2](#102-authorization)                                                                                                                                                                             |
| `{ "success": false, "error": { "code": "DOMAIN_VALIDATION", ... } }` (or `DOMAIN_ENTITY_NOT_FOUND`, `DOMAIN_BUSINESS_RULE`) | A domain exception was thrown deliberately — this is **expected behavior**, not a bug, unless the _condition_ that triggered it is wrong | [Section 15.5](#155-domain-exception--http-status-mapping); trace back to the entity/handler method named in the stack trace                                                                                   |
| Prisma `P2021` / `relation "..." does not exist`                                                                             | The database has no tables — migrations were never applied                                                                               | [Section 8.4](#84-database-setup), [Section 11.4](#114-integration-tests)                                                                                                                                      |
| `ECONNREFUSED` connecting to Postgres/Redis                                                                                  | The `postgres`/`redis` containers aren't running, or `DATABASE_URL`/`REDIS_URL` point at the wrong host/port                             | [Section 8.7](#87-troubleshooting) — check `docker compose ps` and that `.env`'s `DATABASE_URL` matches `docker-compose.yml`'s credentials                                                                     |

### 16.4 Tracing any endpoint, generalized

[Section 9.3](#93-trace-the-full-request-patch-v1resourcesiddeactivate) traced one specific endpoint (`PATCH /v1/resources/:id/deactivate`) in full. To trace **any** endpoint in this codebase (including ones you add yourself), follow the same five-question method:

1. **"Where does the HTTP request land?"** — find the `@Controller(...)` class with the matching `@Get`/`@Post`/`@Patch`/`@Delete` route in `src/adapters/driving/http/<feature>/`. Note its `@UseGuards(...)` and `@Roles(...)`.
2. **"What CQRS message does it send?"** — the controller method body is `return this.commandBus.execute(new SomeCommand(...))` or `this.queryBus.execute(new SomeQuery(...))`. Find that class in `src/core/application/<feature>/`.
3. **"Which handler picks it up?"** — search for `@CommandHandler(SomeCommand)` / `@QueryHandler(SomeQuery)` — usually in the same file or directory. Confirm it's listed in the feature module's `HANDLERS` array ([Section 13.3](#133-cqrs--handler-anti-patterns)).
4. **"What domain rules/events does it touch?"** — inside the handler, follow calls into `src/core/domain/<feature>/*.entity.ts` (static factory methods like `.create()`, instance methods like `.deactivate()`, `.rename()`) and note any `addDomainEvent(...)` calls.
5. **"Where does data go in/out, and what gets published?"** — follow `repo.save(...)` / `repo.findById(...)` to `src/adapters/driven/prisma/<feature>.repository.ts`, and `publisher.publishAll(...)` to `src/adapters/driven/local/local-event.publisher.ts` (or whatever implements `IEventPublisher` in your environment).

This is the same five files/questions every time — once you've done it for one endpoint, every other endpoint in the codebase follows the identical shape.

### 16.5 Where to go next

| If you want...                                                                                                                      | Go to...                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Definitions of unfamiliar terms                                                                                                     | [Appendix A — Glossary](#appendix-a-glossary) (and [Section B](#section-b-glossary--technology-primers) for the longer primers)   |
| The reasoning behind major architectural choices                                                                                    | [Appendix B — Architecture Decision Records (Reconstructed)](#appendix-b-architecture-decision-records-reconstructed)             |
| To verify a claim made anywhere in this guide against the actual repository                                                         | [Appendix C — Evidence Map](#appendix-c-evidence-map)                                                                             |
| Visual diagrams (system context, hexagonal layers, request lifecycle, event flow/outbox, auth flow, deployment, folder layout, ERD) | [`docs/diagrams/`](../docs/diagrams/) — render with the methods listed in [`docs/diagrams/README.md`](../docs/diagrams/README.md) |
| The narrative architecture document this guide cross-references throughout                                                          | [`ARCHITECTURE.md`](../ARCHITECTURE.md)                                                                                           |
| Step-by-step instructions for adding a new vertical slice (entity → port → handler → controller → module)                           | [`CONTRIBUTING.md`](../CONTRIBUTING.md), and the worked example in [Section 9.2](#92-add-a-deactivate-resource-endpoint)          |
| To re-read this guide from the start in recommended order                                                                           | [Section 0](#section-0-how-to-use-this-guide--recommended-reading-order)                                                          |

> **Note:** If, after working through this section, you've found a genuine error or gap in this guide itself (a citation that no longer matches the code, a command that no longer works), that's valuable — it likely means the **code changed** since this guide was generated (`Generated: 2026-06-10` per the title page). Treat the **code** as the source of truth, and consider this guide a snapshot that should be regenerated or corrected as the codebase evolves.

---

## Appendix A. Glossary

> **Note:** This is an **alphabetical, one-line-per-term** index for quick lookup while reading code. For the same terms explained from scratch with everyday analogies (recommended for a first read), see [Section B — Glossary & Technology Primers](#section-b-glossary--technology-primers).

| Term                                                 | One-line definition                                                                                                                                                                                  | Details                                                                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Adapter                                              | Code that implements a port for a specific technology (e.g. the Prisma repository implements `IResourceRepository`).                                                                                 | [Section B](#section-b-glossary--technology-primers)                                                                 |
| ADR (Architecture Decision Record)                   | A short document recording an architectural decision, the context that drove it, and its consequences.                                                                                               | [Appendix B](#appendix-b-architecture-decision-records-reconstructed)                                                |
| Aggregate / Aggregate Root                           | A cluster of related domain objects that must change together, accessed only through one root entity.                                                                                                | [Section B](#section-b-glossary--technology-primers)                                                                 |
| API (Application Programming Interface)              | A set of URLs/endpoints a program can call to read or change data.                                                                                                                                   | [Section B](#section-b-glossary--technology-primers)                                                                 |
| API versioning                                       | Putting a version number in the URL (e.g. `/v1/...`) so the API can evolve without breaking existing clients.                                                                                        | [Section B](#section-b-glossary--technology-primers)                                                                 |
| CI/CD (Continuous Integration / Continuous Delivery) | Automated checks (CI) and automated packaging/deployment (CD) that run on every change. **Not implemented in this repo** — see [Section 12.1](#121-what-exists-today-vs-what-the-docs-describe).     | [Section 12](#12-cicd-guide)                                                                                         |
| Command                                              | A request to _change_ something, handled by exactly one `@CommandHandler`.                                                                                                                           | [Section B](#section-b-glossary--technology-primers)                                                                 |
| commitlint                                           | Tool that validates commit messages against Conventional Commits rules via the `commit-msg` Git hook.                                                                                                | [Section 12.3](#123-branch--commit-conventions)                                                                      |
| Conventional Commits                                 | A standard commit-message format (`type(scope): Subject`) that tools can parse for changelogs and validation.                                                                                        | [Section 12.3](#123-branch--commit-conventions)                                                                      |
| CORS (Cross-Origin Resource Sharing)                 | Browser rules controlling which origins (websites) may call your API from JavaScript; configured here via `CORS_ALLOWED_ORIGINS`.                                                                    | [Section 10.5](#105-transport-security)                                                                              |
| Correlation ID                                       | A unique ID (header `x-correlation-id`) attached to a request so all its logs can be grouped together.                                                                                               | [Section B](#section-b-glossary--technology-primers)                                                                 |
| CQRS (Command Query Responsibility Segregation)      | Splitting "write" (Commands) from "read" (Queries) into separate classes and handlers via `@nestjs/cqrs`.                                                                                            | [Section B](#section-b-glossary--technology-primers)                                                                 |
| CRLF / LF (line endings)                             | Windows (`\r\n`, CRLF) vs. Unix (`\n`, LF) line endings; this repo's Prettier config requires LF, causing CRLF checkouts to fail `pnpm lint`.                                                        | [Section 8.7](#87-troubleshooting)                                                                                   |
| DDD (Domain-Driven Design)                           | Modeling code around real business concepts (entities, value objects, domain events) using the business's own language.                                                                              | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Decorator                                            | A `@SomeName(...)` annotation attaching metadata/behavior to a class, method, or parameter — central to NestJS.                                                                                      | [Section B](#section-b-glossary--technology-primers)                                                                 |
| DI (Dependency Injection)                            | A class receives its dependencies from outside (via its constructor) rather than creating them itself.                                                                                               | [Section B](#section-b-glossary--technology-primers)                                                                 |
| DI container                                         | The framework component (Nest's application context) that builds and hands out dependencies based on `@Module()` configuration.                                                                      | [Section B](#section-b-glossary--technology-primers)                                                                 |
| DI token                                             | A unique key (often a `Symbol`, e.g. `RESOURCE_REPOSITORY`) used to bind an abstract port to a concrete implementation in a Nest module's `providers`.                                               | [Section 15.4](#154-key-ports-dis-tokens--providers)                                                                 |
| Domain Event                                         | A record that "something important happened" in the business domain (e.g. `ResourceDeactivatedEvent`), raised via `addDomainEvent(...)`.                                                             | [Section B](#section-b-glossary--technology-primers)                                                                 |
| DTO (Data Transfer Object)                           | A plain class describing the shape + validation rules of data entering/leaving an API endpoint.                                                                                                      | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Entity                                               | An object with a persistent identity (`id`) — its other properties may change, but it remains "the same thing".                                                                                      | [Section B](#section-b-glossary--technology-primers)                                                                 |
| ESLint boundaries plugin                             | `eslint-plugin-boundaries` — enforces which folders (layers) may import from which other folders, per [`.eslintrc.cjs`](../.eslintrc.cjs).                                                           | [Section 5](#5-import-rules), [Section 15.3](#153-import-boundary-cheat-sheet)                                       |
| Event-Driven Architecture                            | A style where components communicate by emitting and reacting to events rather than calling each other directly.                                                                                     | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Filter (Exception Filter)                            | NestJS code that catches thrown errors and turns them into a consistent HTTP response — here, `AllExceptionsFilter`.                                                                                 | [Section 10.3](#103-the-global-safety-net)                                                                           |
| gitleaks                                             | An open-source secret scanner; run (if installed) by the `pre-commit` hook to block commits containing secrets.                                                                                      | [Section 10.4](#104-secrets--environment-variables), [Section 12.2](#122-local-quality-gates-the-husky-pipeline)     |
| Guard                                                | NestJS code that decides whether a request is allowed to proceed — here, `JwtAuthGuard` (authentication) and `RolesGuard` (authorization).                                                           | [Section 10.1](#101-authentication), [Section 10.2](#102-authorization)                                              |
| Helmet                                               | Express/NestJS middleware that sets security-related HTTP response headers; enabled in [`main.ts`](../src/infrastructure/main.ts).                                                                   | [Section 10.5](#105-transport-security)                                                                              |
| Hexagonal Architecture (Ports & Adapters)            | An architecture style where business logic sits at the center and only talks to the outside world through ports/adapters.                                                                            | [Section 2](#2-architecture-overview), [Appendix B ADR-001](#appendix-b-architecture-decision-records-reconstructed) |
| Husky                                                | A tool that runs scripts ("Git hooks") automatically at Git lifecycle points (commit, push, etc.).                                                                                                   | [Section 12.2](#122-local-quality-gates-the-husky-pipeline)                                                          |
| Idempotency / idempotent                             | An operation that produces the same result no matter how many times it's repeated.                                                                                                                   | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Interceptor                                          | NestJS code that transforms a request before, and/or a response after, a handler runs — here, `LoggingInterceptor` and `ResponseTransformInterceptor`.                                               | [Section 10.3](#103-the-global-safety-net)                                                                           |
| JWKS (JSON Web Key Set)                              | A published set of public keys used to verify a JWT's signature; fetched from `KEYCLOAK_JWKS_URL` via `jose`.                                                                                        | [Section 10.1](#101-authentication)                                                                                  |
| JWT (JSON Web Token)                                 | A signed, self-contained token proving identity and permissions, issued by Keycloak.                                                                                                                 | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Keycloak                                             | The open-source identity provider (login server) used by this project to issue JWTs.                                                                                                                 | [Section 10.1](#101-authentication)                                                                                  |
| lint-staged                                          | Runs linters/formatters only on staged files (not the whole repo) — configured in [`lint-staged.config.cjs`](../lint-staged.config.cjs).                                                             | [Section 12.2](#122-local-quality-gates-the-husky-pipeline)                                                          |
| Middleware                                           | Code that runs on every (or selected) incoming request before it reaches a controller — here, `CorrelationIdMiddleware`.                                                                             | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Migration                                            | A versioned, reproducible database schema change, applied via `prisma migrate`.                                                                                                                      | [Section 8.4](#84-database-setup)                                                                                    |
| Multi-stage Docker build                             | A `Dockerfile` pattern using a temporary `builder` stage (with dev tools/source) and a smaller `runtime` stage (only compiled output + prod deps).                                                   | [Section 12.5](#125-build--deployment-artifacts)                                                                     |
| Onion Architecture                                   | The same idea as Hexagonal, drawn as concentric rings — domain at the center, dependencies always pointing inward.                                                                                   | [Section B](#section-b-glossary--technology-primers)                                                                 |
| ORM (Object-Relational Mapper)                       | A library (here, Prisma) that lets you work with database rows as typed code objects instead of raw SQL.                                                                                             | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Pipe                                                 | NestJS code that transforms/validates incoming data before it reaches a controller method — here, the global `ValidationPipe`.                                                                       | [Section 13.4](#134-dto--controller-anti-patterns)                                                                   |
| Port                                                 | An interface defined by the application core describing what it needs from the outside world (e.g. `IResourceRepository`).                                                                           | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Prisma                                               | The ORM used in this project; generates a type-safe client from a multi-file schema in `prisma/schema/`.                                                                                             | [Appendix B ADR-003](#appendix-b-architecture-decision-records-reconstructed)                                        |
| Query                                                | A request to _read_ something, with no side effects, handled by a `@QueryHandler`.                                                                                                                   | [Section B](#section-b-glossary--technology-primers)                                                                 |
| REST                                                 | An API style where each URL represents a "resource" and HTTP verbs (GET/POST/PATCH/DELETE) say what to do to it.                                                                                     | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Repository (pattern)                                 | An abstraction letting application code save/load domain objects without knowing the storage technology.                                                                                             | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Seed (data)                                          | Sample/test data inserted into the database via `pnpm prisma:seed` to make local development realistic.                                                                                              | [Section 8.5](#85-first-run)                                                                                         |
| Soft delete                                          | "Deleting" a row by setting `deletedAt` instead of physically removing it.                                                                                                                           | [Section B](#section-b-glossary--technology-primers)                                                                 |
| SSO (Single Sign-On)                                 | Logging in once and being trusted across multiple applications, via Keycloak.                                                                                                                        | [Section B](#section-b-glossary--technology-primers)                                                                 |
| supertest                                            | A library for making HTTP assertions against a running (in-memory) NestJS app — used by e2e tests.                                                                                                   | [Section 11.5](#115-end-to-end-e2e-tests)                                                                            |
| Swagger / OpenAPI                                    | A standard format for describing a REST API plus tooling that generates interactive docs from it; served at `/docs`.                                                                                 | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Testcontainers                                       | A library that spins up real, throwaway Docker containers (e.g. Postgres) for integration tests.                                                                                                     | [Section 11.4](#114-integration-tests)                                                                               |
| Throttling / rate limiting                           | Limiting how many requests a client can make per time window — here, `ThrottlerGuard`, `THROTTLE_TTL`/`THROTTLE_LIMIT`.                                                                              | [Section 10.3](#103-the-global-safety-net)                                                                           |
| Transactional Outbox (pattern)                       | Writing a business change and an "event to send" record in the same DB transaction, dispatched later by a separate process. The `OutboxEvent` Prisma model exists; **no dispatcher is implemented**. | [Appendix B ADR-002](#appendix-b-architecture-decision-records-reconstructed)                                        |
| Use case                                             | The application-layer class orchestrating one business operation — usually a Command or Query handler.                                                                                               | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Value Object                                         | An object defined entirely by its data, with no identity of its own (e.g. an `Email` value object).                                                                                                  | [Section B](#section-b-glossary--technology-primers)                                                                 |
| Vertical slice                                       | A feature implemented across all layers (domain → application → adapters → infrastructure) end-to-end, e.g. the "example/Resource" slice.                                                            | [Section 3](#3-repository-structure), [CONTRIBUTING.md](../CONTRIBUTING.md)                                          |
| Zod                                                  | A TypeScript schema/validation library used to validate environment variables at startup (`env.ts`).                                                                                                 | [Section B](#section-b-glossary--technology-primers)                                                                 |

---

## Appendix B. Architecture Decision Records (Reconstructed)

> **Note:** This repository contains **no `adr/` directory and no existing ADR documents** (confirmed by searching the entire repository for files matching `*adr*`). The five ADRs below are **reconstructed** — written by inferring the decision, its likely context, and its consequences from the actual code, configuration, and dependencies present in the repository. They are formatted as standard ADRs (Status / Context / Decision / Consequences / Evidence) so they can be dropped into a real `adr/` directory as a starting point, but they document decisions **as observed**, not decisions someone wrote down at the time. Where the _reasoning_ behind a decision can't be confirmed from the repository, this is stated explicitly rather than invented.

### ADR-001: Hexagonal Architecture (Ports & Adapters) with CQRS

- **Status:** Accepted (observed in current code structure)

- **Context:** A NestJS backend boilerplate needs an architecture that (a) keeps business rules testable without a database, message broker, or HTTP server running, (b) gives a consistent place for new features to live so multiple developers/teams can work without constant naming/placement debates, and (c) separates "write" operations (which change state and may have side effects like domain events) from "read" operations (which don't).

- **Decision:** Structure the codebase in four layers — `core/domain` (entities, value objects, domain events, domain exceptions; zero framework dependencies), `core/application` (ports as abstract classes/interfaces, plus Commands/Queries and their `@CommandHandler`/`@QueryHandler` via `@nestjs/cqrs`), `adapters` (`driving/http` for controllers+DTOs, `driven/prisma` and `driven/local` for outbound implementations of ports), and `infrastructure` (NestJS modules, bootstrap, config, wiring). Enforce the dependency direction (`domain` ← `application` ← `adapters` ← `infrastructure`, with `common` as a dependency-free utility layer) at lint time using `eslint-plugin-boundaries`.

- **Consequences:**
  - _Positive:_ Domain logic (`Resource` entity, its invariants, its events) can be unit-tested with zero mocks beyond plain objects ([Section 11.3](#113-unit-tests-in-depth)). Swapping an adapter (e.g. `LocalEventPublisher` → a real broker publisher) requires no changes to domain or application code ([Section 9.3 Deep Dive](#93-trace-the-full-request-patch-v1resourcesiddeactivate)).
  - _Negative:_ More files and indirection for a simple CRUD operation than a "fat controller + service" style would require — visible in the [Section 9.2 tutorial](#92-add-a-deactivate-resource-endpoint), where adding one new endpoint touches six files.
  - _Enforcement has a known gap:_ the boundary rules are enforced by `pnpm lint`, which (per [Section 12.1](#121-what-exists-today-vs-what-the-docs-describe)) does not run in any CI pipeline — violations are only caught if a developer runs `pnpm lint` locally. [Section 13.1](#131-worked-example-a-real-boundarieselement-types-violation) documents a real violation that was previously present in this codebase and went unnoticed until `pnpm lint` was run manually — a reminder of what this gap allows to slip through.

- **Evidence:** [`src/core/`](../src/core/), [`src/adapters/`](../src/adapters/), [`src/infrastructure/`](../src/infrastructure/), [`.eslintrc.cjs`](../.eslintrc.cjs) `boundaries/elements` and `boundaries/element-types`, [`package.json`](../package.json) `@nestjs/cqrs` dependency, [Section 2](#2-architecture-overview), [Section 5](#5-import-rules).

### ADR-002: Event publishing via a swappable `IEventPublisher` port, with `LocalEventPublisher` as the default and a `OutboxEvent` model reserved for a future transactional outbox

- **Status:** Partially implemented (port + default adapter exist; outbox dispatcher does not)

- **Context:** Domain entities raise domain events (e.g. `ResourceCreatedEvent`, `ResourceDeactivatedEvent`) that other parts of a real system (other services, audit logs, search indexes) might need to react to. A boilerplate needs to demonstrate _where_ this hook lives without forcing every consumer of the boilerplate to stand up a message broker (NATS, Kafka, etc.) just to run the example slice.

- **Decision:** Define an `IEventPublisher` port (`EVENT_PUBLISHER` token) with a `publishAll(events)` method. Provide one default implementation, `LocalEventPublisher`, which simply logs each event at debug level — no network calls, no broker dependency. Separately, define an `OutboxEvent` Prisma model (`outbox_events` table: `eventType`, `payload`, `correlationId`, `occurredAt`, `publishedAt`, `attempts`, `lastError`) intended for a future transactional-outbox dispatcher that would write business state and an outbox row in one transaction, then publish and mark `publishedAt` asynchronously.

- **Consequences:**
  - _Positive:_ The example slice runs with zero external messaging infrastructure — `make dev` only needs Postgres and Redis. Any consumer of this boilerplate can implement `IEventPublisher` for their broker of choice and rebind `EVENT_PUBLISHER` in `ExampleModule` without touching domain/application code (CONTRIBUTING.md, [Section 9.3](#93-trace-the-full-request-patch-v1resourcesiddeactivate)).
  - _Negative / Gap:_ The `OutboxEvent` model exists in [`prisma/schema/example.prisma`](../prisma/schema/example.prisma) with a comment referencing "a scheduled dispatcher" that publishes to NATS — but **no such dispatcher exists in this codebase**, no code writes to `OutboxEvent`, and `LocalEventPublisher` does not use it. A developer reading the Prisma schema alone would reasonably (but incorrectly) assume the outbox pattern is fully wired up.
  - **Not enough evidence found in repository** to determine whether the outbox dispatcher was removed, never finished, or is planned for a later iteration.

- **Evidence:** [`src/core/application/ports/event-publisher.port.ts`](../src/core/application/ports/event-publisher.port.ts), [`src/adapters/driven/local/local-event.publisher.ts`](../src/adapters/driven/local/local-event.publisher.ts), [`prisma/schema/example.prisma`](../prisma/schema/example.prisma) `OutboxEvent` model and its comment, [Section 9.3](#93-trace-the-full-request-patch-v1resourcesiddeactivate).

### ADR-003: Prisma as the ORM, with a multi-file schema via the `prismaSchemaFolder` preview feature

- **Status:** Accepted (observed)

- **Context:** The project needs type-safe database access from TypeScript, with migrations that are reproducible across developer machines, CI (if added), and Testcontainers-based integration tests. As the number of bounded contexts/aggregates grows, a single monolithic `schema.prisma` file becomes unwieldy.

- **Decision:** Use Prisma 5.18 (`@prisma/client` + `prisma` devDependency) as the ORM, with `previewFeatures = ["prismaSchemaFolder"]` enabled in [`prisma/schema/base.prisma`](../prisma/schema/base.prisma) so the schema can be split across multiple `.prisma` files in `prisma/schema/` (currently `base.prisma` for `generator`/`datasource`, and `example.prisma` for the `Resource` and `OutboxEvent` models) — all commands pass `--schema=./prisma/schema` to operate on the whole folder.

- **Consequences:**
  - _Positive:_ New bounded contexts can add their own `.prisma` file without merge conflicts in a shared schema file. The generated `@prisma/client` gives compile-time-checked queries matching [Section 6](#6-coding-standards)'s strict-TypeScript conventions.
  - _Negative / Gap:_ `prisma migrate deploy` (run by `make dev` and by [`test/integration/resource.repository.int-spec.ts`](../test/integration/resource.repository.int-spec.ts)) only **applies existing** migrations — it does not generate new ones. Because **no `prisma/migrations/` directory exists in this repository**, this command is currently a no-op, and the database has no tables until someone runs `pnpm prisma migrate dev --schema=./prisma/schema --name init` manually ([Section 8.4](#84-database-setup), [Section 11.4](#114-integration-tests)).
  - The [`PrismaService`](../src/adapters/driven/prisma/prisma.service.ts) docblock describes Prisma Client extensions for soft-delete filtering and audit-field (`createdBy`/`updatedBy`) population — **these extensions are not present in the file**, and `request-context.ts` (which would supply the "current user" for audit fields) does not exist anywhere in the repository. The `Resource` model's `createdBy`/`updatedBy`/`deletedAt` columns exist in the schema but are not automatically populated by anything observed.

- **Evidence:** [`prisma/schema/base.prisma`](../prisma/schema/base.prisma), [`prisma/schema/example.prisma`](../prisma/schema/example.prisma), [`package.json`](../package.json) `prisma`/`@prisma/client` versions and `prisma:*` scripts, [`src/adapters/driven/prisma/prisma.service.ts`](../src/adapters/driven/prisma/prisma.service.ts), [Section 8.4](#84-database-setup).

### ADR-004: Maximally strict TypeScript configuration as a project-wide quality gate

- **Status:** Accepted (observed)

- **Context:** A boilerplate intended to be cloned and extended by many developers benefits from the compiler catching as many classes of bugs as possible at build time, before they reach tests or production — especially bugs related to `undefined`/`null` handling, which are a common source of runtime errors in TypeScript projects that don't enable the strictest flags.

- **Decision:** Enable `strict: true` plus every additional strictness flag TypeScript 5.5 offers that isn't implied by `strict`: `noUncheckedIndexedAccess` (array/object index access returns `T | undefined`), `exactOptionalPropertyTypes` (an optional property `foo?: string` cannot be explicitly set to `undefined`, only omitted), `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, and `forceConsistentCasingInFileNames` — all enforced via `pnpm typecheck` (`tsc --noEmit`), one of the [four mandatory pre-PR checks](#124-pull-request-checklist).

- **Consequences:**
  - _Positive:_ Entire categories of bugs (accessing an array element that might not exist, accidentally passing `undefined` where a key must be omitted entirely, forgetting a `return` in one branch of a function) are compile errors, not runtime surprises.
  - _Negative:_ Code that's idiomatic in "normal strict" TypeScript (e.g. `const first = items[0]` used without a check) requires extra handling under `noUncheckedIndexedAccess` — this is a real adjustment for developers coming from less-strict codebases, and is called out in [Section 6](#6-coding-standards).
  - _Process gap:_ As with [ADR-001](#adr-001-hexagonal-architecture-ports--adapters-with-cqrs), `pnpm typecheck` is part of the [documented PR checklist](#124-pull-request-checklist) but is **not** run by any Git hook ([Section 12.2](#122-local-quality-gates-the-husky-pipeline)) or CI pipeline ([Section 12.1](#121-what-exists-today-vs-what-the-docs-describe)) — it relies entirely on the developer running it manually.

- **Evidence:** [`tsconfig.json`](../tsconfig.json), [`package.json`](../package.json) `typecheck` script, [Section 6](#6-coding-standards), [Section 12.4](#124-pull-request-checklist).

### ADR-005: Keycloak-issued JWTs validated locally via JWKS, applied per-controller rather than globally

- **Status:** Accepted (observed), with a notable scope decision (see Consequences)

- **Context:** The API needs to authenticate requests (who is calling?) and authorize them (are they allowed to do this?), using a centralized identity provider so that user accounts/roles are managed in one place (Keycloak) rather than in this service's own database. Validating every request against Keycloak over the network (token introspection) would add latency and a hard runtime dependency on Keycloak's availability for _every_ request.

- **Decision:** Validate JWTs **locally** using `jose`'s `createRemoteJWKSet` + `jwtVerify` against Keycloak's JWKS endpoint (`KEYCLOAK_JWKS_URL`), checking the `issuer` claim against `KEYCLOAK_ISSUER` ([`JwtAuthGuard`](../src/common/guards/jwt-auth.guard.ts)). On success, attach `{ id, username, email, roles }` (merging `realm_access.roles` and `resource_access[clientId].roles`) to `req.user`. Authorization is a separate `RolesGuard` reading a `@Roles(...)` decorator's metadata and comparing against `req.user.roles`. Apply both guards **per-controller** via `@UseGuards(JwtAuthGuard, RolesGuard)`, rather than registering `JwtAuthGuard` as a global `APP_GUARD`.

- **Consequences:**
  - _Positive:_ No per-request network call to Keycloak (`jose`'s `createRemoteJWKSet` caches and auto-rotates the JWKS) — low latency, and the API stays up even if Keycloak is briefly unreachable for already-validated tokens. Roles from both realm and client scopes are merged into one list, simplifying `@Roles(...)` checks.
  - _Negative / Risk:_ Because there is **no global guard**, a new controller is **unauthenticated and unauthorized by default** unless the developer remembers to add `@UseGuards(JwtAuthGuard, RolesGuard)`. [`HealthController`](../src/infrastructure/health/health.controller.ts) is fully public — currently the _only_ controller besides `ResourceController`, so this is a two-controller codebase where the omission is easy to miss but would scale badly: every new controller is a new opportunity to forget the guards ([Section 10.1](#101-authentication) Warning, [Section 14.3](#143-http-layer-controllers--dtos)).
  - **Not enough evidence found in repository** for whether the per-controller approach was a deliberate choice (e.g. to keep `/v1/health` trivially public without a `@Public()` decorator/exception list) or simply how the example slice was first written and never revisited. A global `JwtAuthGuard` + an explicit `@Public()` decorator (the inverse of the current "opt-in to security" model) is a common alternative that would close this gap — but introducing it is outside the scope of this guide (no source code is modified by this guide).

- **Evidence:** [`src/common/guards/jwt-auth.guard.ts`](../src/common/guards/jwt-auth.guard.ts), [`src/common/guards/roles.guard.ts`](../src/common/guards/roles.guard.ts), [`src/common/config/auth-config.token.ts`](../src/common/config/auth-config.token.ts), [`src/adapters/driving/http/example/resource.controller.ts`](../src/adapters/driving/http/example/resource.controller.ts), [`src/infrastructure/health/health.controller.ts`](../src/infrastructure/health/health.controller.ts), [Section 10.1](#101-authentication), [Section 10.2](#102-authorization).

---

<!-- NEXT -->
