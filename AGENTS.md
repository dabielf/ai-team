<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Frontend

- Before any frontend change, use the /shadcn skill if it isn't already loaded in the session

## Git

- Never create branches, worktrees, or commits automatically. Only do so when the user explicitly asks for that specific action in the current request.
- Leave changes uncommitted in the working tree on the current branch and let the user decide when and how to commit.

## Database

- Apply schema changes only with `npm run db:push` (`drizzle-kit push`). Never use migrations: no `drizzle-kit generate`, no `drizzle-kit migrate`, no migration files or folders.
- The schema lives in `lib/db/schema.ts`; edit it, then push.
- This is a development project. There is no backwards compatibility and the data is worthless. Prefer data loss: never backfill, migrate, or preserve existing rows, and never spend effort on keeping old data working. Every schema change means a clean slate.

## Forms

One schema validates a form on both sides. Reference implementation: `components/bot-dialog.tsx`, `actions/bot.ts`, `insertBotSchema` in `lib/db/schema.ts`.

- **Schema**: in `lib/db/schema.ts`, next to its table. `createInsertSchema(table, { refinements })` from `drizzle-zod`, then `.pick()` only the fields the user edits. Server-set fields (`userId`, `id`, timestamps) stay out. Export the inferred type (`InsertBot`).
- **Server action**: `actions/<entity>.ts` with `"use server"`. Take `userId` from `await auth.protect()`, `safeParse` the input with the same schema, write with Drizzle, `revalidatePath`, return `{ id }` or `{ error }`.
- **Component**: `components/<entity>-dialog.tsx`, a client component following the shadcn React Hook Form guide (https://ui.shadcn.com/docs/forms/react-hook-form.md):
  - `useForm` with `zodResolver(<schema>)`; one `Controller` per field rendering `Field data-invalid` + control `aria-invalid` + `FieldError`.
  - Read live values with `useWatch` (`form.watch` trips the `react-hooks/incompatible-library` lint).
  - Client-generated values (avatar seeds) live in form state, changed with `form.setValue`.
  - Give the `<form>` an `id`; the submit button sits in `DialogFooter` with `form="<id>"`, `disabled` and a `Spinner` while `formState.isSubmitting`.
  - Feedback with `toast.add` from `@/components/ui/toast` (Base UI). On success: toast, close the dialog, reset the form.
- **Install**: add packages with `npm install --legacy-peer-deps`; `@hookform/resolvers` pulls an optional zod 3 peer that breaks plain installs.

## DiceBear

Use DiceBear 10. Documentation: https://www.dicebear.com/llms.txt

There are seven native cores with identical output, not one library with
wrappers. Use the one matching this project's language. Do not reach for the
JavaScript core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v10 + github.com/dicebear/styles/v10
    Dart        dicebear_core + dicebear_styles
    C#          DiceBear.Core + DiceBear.Styles

Every style page carries a loading snippet for all seven, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/10.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all seven cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/10.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/10.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/10.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other six cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go,
Dart or C# API attributed to DiceBear is invented rather than outdated.
