# Optician Pro Makefile
# Quick commands for development

.PHONY: help install dev test test-e2e lint format clean db-migrate db-seed docs

# Default target
help:
	@echo "Optician Pro - Available Commands"
	@echo "=================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install        Install all dependencies"
	@echo "  make install-server Install backend dependencies"
	@echo "  make install-client Install frontend dependencies"
	@echo "  make install-docs   Install documentation dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev            Start all development servers"
	@echo "  make dev-server     Start backend server only"
	@echo "  make dev-client     Start frontend server only"
	@echo "  make dev-docs       Start documentation server only"
	@echo ""
	@echo "Testing:"
	@echo "  make test           Run all tests"
	@echo "  make test-server    Run backend tests"
	@echo "  make test-client    Run frontend tests"
	@echo "  make test-e2e       Run E2E tests"
	@echo "  make test-coverage  Run all tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint           Run all linters"
	@echo "  make lint-fix       Fix linting issues"
	@echo "  make format         Format all code"
	@echo "  make typecheck      Type check all TypeScript"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate     Run database migrations"
	@echo "  make db-seed        Seed database with demo data"
	@echo "  make db-reset       Reset database (WARNING: deletes all data)"
	@echo "  make db-studio      Open Prisma Studio"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs           Build documentation"
	@echo "  make docs-serve     Serve documentation locally"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean          Clean all node_modules and build files"
	@echo "  make update         Update all dependencies"
	@echo ""

# Installation
install: install-server install-client install-docs
	@echo "✅ All dependencies installed"

install-server:
	cd server && npm install

install-client:
	cd client && npm install

install-docs:
	cd docs && npm install

# Development
dev:
	@echo "Starting all development servers..."
	@make dev-server &
	@make dev-client &
	@echo "Backend: http://localhost:8080"
	@echo "Frontend: http://localhost:3000"

dev-server:
	cd server && npm run dev

dev-client:
	cd client && npm run dev

dev-docs:
	cd docs && npm start

# Testing
test:
	@echo "Running all tests..."
	./scripts/test.sh

test-server:
	cd server && npm test

test-client:
	cd client && npm test -- --run

test-e2e:
	cd client && npm run test:e2e

test-coverage:
	@echo "Running tests with coverage..."
	cd server && npm run test:coverage
	cd client && npm run test:coverage

# Code Quality
lint:
	cd server && npm run lint
	cd client && npm run lint

lint-fix:
	cd server && npm run lint:fix
	cd client && npm run lint

format:
	cd server && npm run format
	cd client && npm run format

typecheck:
	cd server && npm run typecheck
	cd client && npm run typecheck

# Database
db-migrate:
	cd server && npx prisma migrate dev

db-seed:
	cd server && npx prisma db seed

db-reset:
	cd server && npx prisma migrate reset --force

db-studio:
	cd server && npx prisma studio

# Documentation
docs:
	cd docs && npm run build

docs-serve:
	cd docs && npm run serve

# Maintenance
clean:
	@echo "Cleaning node_modules and build files..."
	rm -rf server/node_modules server/dist server/coverage
	rm -rf client/node_modules client/.next client/coverage
	rm -rf docs/node_modules docs/build
	@echo "✅ Cleaned"

update:
	@echo "Updating dependencies..."
	cd server && npx npm-check-updates -u && npm install
	cd client && npx npm-check-updates -u && npm install
	cd docs && npx npm-check-updates -u && npm install
	@echo "✅ Dependencies updated"
