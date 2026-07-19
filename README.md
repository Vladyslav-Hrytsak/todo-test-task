# Todo App — Junior Full-Stack Test Task

A full-stack task management application built as a test task submission. Backend in Node.js/Express/TypeScript (chosen over the suggested Python/FastAPI — see [AI_WORKFLOW.md](AI_WORKFLOW.md) for why), frontend in Next.js.

**Live app:** https://todo-test-task-five.vercel.app
**Backend API:** https://todo-test-task.onrender.com/api

> Note: the backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time may take 30–50 seconds to respond — this is expected, not a bug.

## Features

- Create, list, and delete tasks
- Mark tasks as done / undone
- Search tasks by title or description
- Filter by status (all / done / undone)
- Assign priority (1–10) with a slider
- Sort by priority, creation date, or due date, ascending or descending
- Optional category and due date fields, with overdue highlighting
- PostgreSQL persistence (not in-memory)
- Polished UI with shadcn/ui components

## Tech stack

**Backend:** Node.js, Express, TypeScript, Prisma 7 ORM, PostgreSQL, Zod validation, Jest + Supertest
**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, TanStack React Query, axios

## Architecture

### Backend — layered architecture

```
Router → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Router** — defines HTTP endpoints, wires them to controllers
- **Controller** — parses request, validates input (Zod), calls service, shapes HTTP response
- **Service** — business logic and invariants (e.g. "task must exist to be updated"), knows nothing about HTTP or Prisma directly
- **Repository** — the only layer that talks to Prisma/SQL; swapping ORM or database would only touch this layer

Centralized error handling via a custom `AppError` hierarchy (`NotFoundError`, `ValidationError`) caught by a single Express error-handling middleware, plus an `asyncHandler` wrapper so controllers don't need manual try/catch.

### Frontend — feature-based structure

```
src/
├── app/                      # Next.js App Router pages
├── components/ui/            # shadcn/ui primitives
└── features/tasks/
    ├── api/                  # axios calls + React Query key factory
    ├── components/           # TaskForm, TaskFilters, TaskList, TaskItem
    ├── hooks/                # useTasks, useCreateTask, useUpdateTask, useToggleTask, useDeleteTask
    └── types/                # TypeScript types mirroring the backend contract
```

Server state lives in React Query, not component state — mutations invalidate the relevant query keys on success. The toggle-done mutation additionally uses an **optimistic update with rollback on error**, since it's the most frequent user interaction and shouldn't feel delayed by a network round-trip.

## Running locally

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

### Backend

```bash
cd backend
npm install
docker compose up -d postgres
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Running tests

```bash
cd backend
docker compose up -d postgres_test
DATABASE_URL="postgresql://todo_user:todo_password@localhost:5433/todo_db_test?schema=public" npx prisma migrate deploy
npm test
```

19 tests covering `TaskService` business logic (unit, repository mocked) and `/api/tasks` routes (integration, real test database).

## Trade-offs and things I'd do differently with more time

- **Types are duplicated** between `backend/src/types/task.types.ts` and `frontend/src/features/tasks/types/task.types.ts` since this is two separate repos/deployments rather than a proper monorepo with shared packages (npm workspaces / Turborepo would solve this).
- **No drag-and-drop reordering** — the "bonus feature" list mentioned it, but given the existing sort-by-priority feature already covers the core use case, I prioritized test coverage and deployment robustness instead.
- **Native `<input type="date">`** instead of a full Calendar+Popover component for due dates — a deliberate scope call for an optional field, not an oversight.
- **Optimistic updates** are used only for the toggle mutation, not create/update/delete — those are less frequent interactions where a brief loading state is acceptable and simpler to reason about.

See [AI_WORKFLOW.md](AI_WORKFLOW.md) for a detailed breakdown of how AI was used throughout the build process.
