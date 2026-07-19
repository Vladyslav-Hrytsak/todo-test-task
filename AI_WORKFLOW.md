# AI Workflow Report

## Tools used

- **Claude (Anthropic)** — primary AI pair-programmer throughout this project, used via chat interface with step-by-step guidance.
- **Prisma CLI / TypeScript compiler** — used conventionally, not AI-assisted, but flagged here since error messages from these tools were frequently pasted back into the AI conversation for diagnosis.

## How I used AI in this project

I used Claude as a **teaching-oriented pair programmer**, not as a black-box code generator. My explicit instruction to the assistant was to build the project step-by-step, explain each architectural decision, and never move to the next layer until I understood and verified the current one. Concretely, my workflow per step looked like this:

1. Ask for one bounded unit of work (e.g. "Repository layer for Task").
2. Receive the code together with an explanation of *why* a pattern was chosen (e.g. why singleton Prisma client, why layered controller → service → repository, why optimistic updates only for the toggle mutation and not for create/update).
3. Run it locally, paste back the **exact terminal output or IDE error** when something failed.
4. Get a root-cause explanation before the fix — not just the fix — so I could recognize the same class of error in the future.
5. Commit at each working checkpoint, so the git history reflects an incremental, reviewable build process rather than one giant dump.

## Where AI meaningfully helped

- **Diagnosing fast-moving ecosystem breakage.** This project happened to collide with several very recent breaking changes: Prisma 7's config/adapter split, Tailwind v4's import syntax, and a shadcn/ui build (`base-sera` on Base UI rather than Radix) with a different callback signature for `Select`/`Slider`. These are the kind of dated-training-data traps that are hard to debug from memory alone — AI was useful here mainly as a fast root-cause analyst reading real stack traces I pasted in, not as a source of ground truth by itself.
- **Monorepo + deployment configuration.** Getting Render (backend) and Vercel (frontend) to agree on root directories, CORS origin, SSL for managed Postgres, and environment variables took several iterations of real error logs → diagnosis → fix. This is exactly the kind of environment-specific debugging where pasting the actual log back and forth is faster than guessing.
- **Consistent architectural discipline.** Because I asked for the same layered pattern (Router → Controller → Service → Repository) I already use at work, the AI kept the structure consistent across ~10 files instead of drifting.

## Where I did not just accept AI output as-is

- I ran every terminal command myself and only proceeded once I saw the actual result (not the assistant's assumption of what would happen). Several fixes were revised after real logs proved the first hypothesis wrong (e.g. the CORS `ERR_INVALID_CHAR` issue and the eventual discovery that the deployed frontend was pointed at a placeholder backend URL from an earlier instructional example, not my real Render domain).
- I made the explicit call to use **Node.js/Express/TypeScript** instead of the "preferred" Python/FastAPI mentioned in the test task and in Lily's email, because I don't know Python yet and would rather submit a solid, well-tested Node solution than a shaky Python one produced mostly by AI. I'd rather be transparent about that trade-off than pretend otherwise.
- I chose not to add a full date-picker component (Calendar + Popover) for the due date field, using a native `<input type="date">` instead — a deliberate scope trade-off given the "optional bonus" nature of that field, not an AI suggestion I didn't evaluate.

## Testing approach

Unit tests (Jest) cover the `TaskService` business logic in isolation, with the `TaskRepository` mocked — so they verify things like "throws NotFoundError when updating a non-existent task" without touching a real database. Integration tests (Supertest) run against a real, isolated PostgreSQL test database (a separate Docker container, migrated with `prisma migrate deploy`, wiped between tests) and exercise the actual HTTP routes end-to-end: validation errors, search, filter, sort, toggle, delete. I asked the assistant to help me design both layers so that unit tests stay fast/isolated and integration tests stay realistic, rather than only having one or the other.
