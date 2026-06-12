.PHONY: help install dev down logs build test lint typecheck migrate seed studio openapi clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start the full local stack (Postgres, Redis, API) with hot reload
	docker compose up -d postgres redis
	@echo "Waiting for Postgres…" && sleep 3
	pnpm prisma:generate && pnpm prisma:deploy
	pnpm start:dev

down: ## Stop the local stack
	docker compose down

logs: ## Tail logs from the local stack
	docker compose logs -f --tail=100

build: ## Compile TypeScript to dist/
	pnpm build

test: ## Run unit tests
	pnpm test:unit

test-all: ## Run unit + integration + e2e
	pnpm test:unit && pnpm test:integration && pnpm test:e2e

lint: ## ESLint with zero warnings allowed
	pnpm lint

typecheck: ## tsc --noEmit
	pnpm typecheck

migrate: ## Create a new Prisma migration (use NAME=... to set the name)
	pnpm prisma migrate dev --schema=./prisma/schema --name $(NAME)

seed: ## Run the Prisma seed
	pnpm prisma:seed

studio: ## Open Prisma Studio
	pnpm prisma:studio

openapi: ## Emit openapi.json + Postman collection
	pnpm openapi:generate && pnpm postman:generate

clean: ## Remove dist + caches
	rm -rf dist coverage .pnpm-store node_modules/.cache
