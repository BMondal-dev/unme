# OpenCode.md for unme Repository

## Build, Lint, Format, Typecheck, and Test
- Build: `npm run build`, `npm run build.client`, `npm run build.server`, `npm run build.preview`
- Lint: `npm run lint` (uses ESLint on src/**/*.ts*)
- Format: `npm run fmt` (prettier + tailwind plugin), check: `npm run fmt.check`
- Typecheck: `npm run build.types` (tsc --incremental --noEmit)
- Dev: `npm run dev` (Vite dev server)
- Preview: `npm run preview` (production preview)
- Qwik CLI: `npm run qwik <cmd>`

## Code Style
- Prettier enforced (see `.prettierrc.js`): trailing commas, double quotes, 2 spaces, tailwindcss plugin
- Imports: `import type { T } from ...` for type-only, absolute or relative as seen in `src/`
- Use TypeScript types everywhere; code uses `type`, `interface`, and Qwik City `type` imports
- Naming: camelCase for vars/functions, PascalCase for types/components
- Prefer functional/stateless components `component$` (Qwik)
- Error handling: check/return on invalid input/values
- Use Qwik signals/hooks idiomatically; avoid side effects in components
- Place reusable code in `/src/components`, routing in `/src/routes`
- No Cursor or Copilot instructions found

## Running a single test
- No test runner found (e.g. Jest/Vitest). Please specify if testing is set up.
