# Career OS

Next.js application with TypeScript, Tailwind CSS, and ESLint.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ESLint** (`eslint-config-next` with Core Web Vitals + TypeScript)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler |

## Project Structure

```
src/
  app/              # App Router routes and layouts
  components/       # React components
    ui/             # Reusable UI primitives
  hooks/            # Custom React hooks
  lib/              # Shared utilities
  types/            # Shared TypeScript types
```

Path alias: `@/*` → `src/*`
