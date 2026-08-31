# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

Always respond to the user in Russian, regardless of the language of the request or of code/comments in the repository.

## Project overview

TimeSpent is a React SPA that converts a user's salary and work schedule into "hours of work" needed to pay for each expense category, so the cost of a lifestyle is felt in time rather than money. State (work schedule, salary, expense groups) is entered by the user and persisted client-side only — there is no backend.

## Commands

```bash
npm run dev      # start Vite dev server
npm run build    # tsc typecheck + vite production build
npm run preview  # preview a production build locally
npm run lint     # biome lint
npm run format   # biome format --write
npm run check    # biome check --write (lint + format, fixes in place)
```

There is no test runner configured in this repo (no `test` script, no test files) — do not assume Jest/Vitest exists.

Biome (not ESLint/Prettier) is the linter and formatter; `lint-staged` runs `biome check --write` on staged `.{js,ts,jsx,tsx}` files via a Husky `pre-commit` hook. Indentation/whitespace rules live in `.editorconfig` and should not be duplicated elsewhere (see `EDITOR_SETUP.md`).

## Architecture

The codebase follows **Feature-Sliced Design (FSD)** under `src/`:

- `app/` — composition root: `index.tsx` mounts `<Providers><MainPage /></Providers>`; `providers/` wires `ThemeProvider` (outer) and an i18next `I18nProvider` (inner); global Tailwind styles live in `app/styles`.
- `pages/` — route-level composition only (currently a single `main` page combining `SettingsSidebar` and `TimeSpentCalculator`). This app has no router.
- `widgets/` — composite UI not tied to one feature's business logic (`themeChange`, `languageChange`).
- `features/` — business logic, one directory per feature (`timeSpentCalculator`, `settingsSidebar`), each typically with `ui/`, `store/`, `types/`, `lib/`, and its own `i18n.ts`.
- `entities/` — reserved by FSD convention, unused so far.
- `shared/` — cross-feature building blocks: `shared/ui` (shadcn/radix-based primitives), `shared/lib` (utils, hooks, i18n setup, storage).

Import alias `@/*` maps to `src/*` (`tsconfig.json` + `vite.config.ts`).

### State management

Two independent Zustand stores in `features/timeSpentCalculator/store/`, both using `persist` with a **custom throttled storage adapter** (`shared/lib/throttledStorage.ts`, 500ms debounce) instead of raw `localStorage`, to avoid writing on every keystroke:

- `settingsStore.ts` — work schedule (`Dayjs` fields) and salary. `Dayjs` objects are serialized to strings by `persist` and must be manually rehydrated back into `Dayjs` via `parseWorkTimeSettings` in both `updateWorkTime` and `onRehydrateStorage` — when touching this store, keep both conversion paths in sync.
- `groupsStore.ts` — expense groups/items. On first run (`onRehydrateStorage`, empty `groups`), it seeds default groups using an **inline duplicate translation table** (not `i18next`, since `i18n` may not be initialized yet during store rehydration) keyed off the raw `timespent-language` localStorage key. If you add/rename a default group's translation key in `features/timeSpentCalculator/i18n.ts`, update this inline table too or the seeded defaults will drift from the displayed translations.

### i18n

`shared/lib/i18n/i18n.ts` initializes a single `i18next` instance with a `common` namespace (`shared/lib/i18n/locales/{ru,en}.ts`). Each feature/widget then calls `injectTranslation(namespace, { ru, en })` from its own `i18n.ts` file (side-effect import — these files are imported for effect, not for named exports) to register a per-feature namespace at module load time. Russian is the default/fallback language; language choice persists to the `timespent-language` localStorage key, read directly (not via the zustand stores) by both `i18n.ts` and `groupsStore.ts`'s seeding logic.

### UI components / styling

Tailwind CSS v4 (via `@tailwindcss/vite`, no separate `tailwind.config`) + shadcn/ui (`components.json`, style `new-york`) with Radix primitives, generated into `shared/ui/`. Use the shadcn CLI conventions (`cn()` from `shared/lib/utils`, `class-variance-authority`) already established in existing `shared/ui/*.tsx` files rather than introducing a different styling approach.

### Forms — mid-migration, two patterns coexist

The project migrated from MUI to shadcn/Tailwind and is now (branch `feature/hook-form`) migrating ad-hoc `useState` forms to `react-hook-form` + `zod`. As a result there are currently **three different form patterns** in the tree; know which is current before copying one:

- `shared/ui/form.tsx` — the shadcn-generated primitives (`FormField`/`FormItem`/`FormControl`/`FormMessage`, context-based) re-exported from `shared/ui/form/index.ts` as `ShadcnForm`/`ShadcnFormField`/etc.
- `shared/ui/form/` — a thinner in-house wrapper (`Form`, `FormField`) built on top of the shadcn primitives, intended as the go-forward API (`Form` takes a zod `schema` + `defaultValues` + `onSubmit` and provides `FormProvider` internally).
- `shared/lib/hooks/use-form-with-validation.ts` — an earlier standalone hook wrapping `useForm`/`zodResolver`, currently unused by any component; treat as superseded by `shared/ui/form/form.tsx` rather than extending it.
- `features/timeSpentCalculator/ui/AddGroupForm.tsx` still uses raw `useState` + manual validation (not yet migrated).
- `features/timeSpentCalculator/ui/TimeSpentForm.tsx` uses `react-hook-form` directly (not the `shared/ui/form` wrapper) with its own inline zod schema, which duplicates but does not exactly match `features/timeSpentCalculator/lib/validation/schemas.ts::workTimeSchema` (different time validation: `z.iso.time()` vs a regex). Reconcile these if you touch work-time validation, rather than adding a third variant.

When adding a new form, prefer `shared/ui/form/form.tsx`'s `Form` + `shared/ui/form/form-field.tsx`'s `FormField`, and put the zod schema in `features/*/lib/validation/schemas.ts`.

## Deployment

Deploys to GitHub Pages via GitHub Actions on push to `main` (see `DEPLOYMENT.md`). `vite.config.ts` sets `base: '/timespent/'` only when `NODE_ENV === 'production'`, so local dev/preview serve from `/`.
