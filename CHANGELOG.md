# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-11

### Added

- Initial release of the NestJS hexagonal/DDD/CQRS/event-driven boilerplate.
- `Resource` example aggregate with full CRUD vertical slice (domain, application, adapters, infrastructure).
- Prisma + PostgreSQL persistence with multi-file schema and transactional outbox pattern.
- Keycloak-based JWT authentication and role-based authorization guards.
- Local event publisher for domain events (swappable for a real broker).
- Structured logging via `nestjs-pino`, request correlation IDs, and global exception handling.
- Swagger/OpenAPI documentation, Postman collection generation, and AsyncAPI event docs.
- Health check endpoint (`GET /v1/health`).
- Unit, integration, and e2e test suites with Jest and Supertest.
- ESLint, Prettier, Husky, and commitlint tooling for code quality and conventional commits.
