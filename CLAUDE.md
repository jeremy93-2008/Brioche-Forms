# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brioche Forms is a form builder application built with Next.js 16, React 19, Tailwind CSS 4, and Drizzle ORM. It uses Turso (libSQL) as the database and Stack Auth for authentication.

## Common Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:generate      # Generate Drizzle migrations from schema
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Drizzle Studio to inspect the database
```

## Architecture Overview

### Custom Server Framework

The codebase implements a custom server function framework located in `src/_server/__internals/`. This is a middleware-based request handling system inspired by tRPC/Next.js server actions.

**Key concepts:**
- **`defineServerRequest`** (`src/_server/__internals/defineServerRequest.ts`): Entry point for all server actions. Composes handlers with middlewares and plugins to create typed server functions that return `IReturnAction<T>`.
- **Plugins**: Extend the server environment (`env`) with functionality:
  - `LoggingPlugin`: Provides debug logging
  - `EventsDispatcherPlugin`: Handles event dispatching for domain events
  - `MultipartParserPlugin`: Parses multipart form data (e.g., file uploads)
- **Middlewares**: Run before handlers to validate, authenticate, or authorize requests:
  - `requireAuth()`: Validates user authentication via Stack Auth
  - `requireValidation(schema)`: Validates input with Zod schemas
  - `requireResourceAccess()`: Checks user permissions for resources
- **Handlers**: Business logic that receives `(data, ctx, env)` and returns `IReturnAction<T>`.

**Request lifecycle:**
1. Request enters via `defineServerRequest(handler, middlewares)`
2. Plugins build the `env` (environment) object
3. Hooks run: `beforeRequest`, `beforeMiddlewares`
4. Middlewares execute sequentially, enriching `ctx` (context)
5. Hooks run: `afterMiddlewares`, `beforeHandler`
6. Handler executes with validated data and context
7. Hooks run: `afterHandler`, `afterRequest`
8. Returns `{ status: 'success', data: T }` or `{ status: 'error', error: {...} }`

### Domain-Driven Structure

Server logic is organized by domain in `src/_server/domains/`:
- `form/`: Form CRUD operations
- `page/`: Page management within forms
- `section/`: Section management (text, image, video, question)
- `notification/`: User notifications
- `media/`: Media upload and management

Each domain contains functions that encapsulate business logic and database transactions.

### Handlers Layer

`src/_server/_handlers/` contains the glue between Next.js server actions and domain logic:
- `actions/`: Server actions called from the client (mutations)
- `queries/`: Server functions for data fetching

Each handler file exports a default server function created via `defineServerRequest()`.

### Database Schema

Database schema is defined in `db/tables.ts` using Drizzle ORM with SQLite (Turso):
- **Forms** (`formsTable`): Root entity for forms
- **Pages** (`pagesTable`): Multi-page forms support
- **Sections** (`sectionsTable`): Containers for form elements
- **Content types**: `textsTable`, `imagesTable`, `videosTable`, `questionsTable`, `choicesTable`
- **Responses**: `responsesTable`, `answersTable`, `multipleChoicesTable`
- **Sharing**: `sharedFormsTable`, `sharedFoldersTable`
- **Media**: `mediaTable` for uploaded assets

All tables use text IDs (UUIDv7 via `uuid` package) and cascade deletions.

### Client-Side State Management

**Optimistic Updates:**
The codebase uses React's `useOptimistic` hook for instant UI feedback:
- `SingleFormSelectedProvider` (`src/_provider/forms/single-form-selected.tsx`): Wraps form editing pages with optimistic state
- Helper functions in `src/_provider/forms/services/`:
  - `updateById()`: Updates nested form objects
  - `createById()`: Inserts new items into form structure
  - `deleteById()`: Removes items from form structure

**SWR for Data Fetching:**
Uses SWR for server data fetching with automatic revalidation.

**Custom Hooks:**
- `useServerActionState` (`src/_hooks/useServerActionState/`): Manages server action state transitions (idle/loading/success/error)
- `useAfterSaveOptimisticData` (`src/_hooks/useAfterSaveOptimisticData/`): Synchronizes optimistic updates after server confirmation
- `useReturnActionUtils` (`src/_hooks/useReturnActionUtils/`): Utilities for handling `IReturnAction` responses

### Form Data Model

Forms have a hierarchical structure:
```
Form
└── Pages (ordered)
    └── Sections (ordered)
        └── Content (ordered):
            - Text (rich text via BlockNote)
            - Image
            - Video
            - Question (with choices for single/multiple choice)
```

The `order` field uses a lexicographic ordering system (e.g., "latest", custom strings) to enable reordering without updating all sibling records.

### Event System

`src/_server/_events/` defines domain events:
- `FormUpdated`: Dispatched when forms are modified
- Events are dispatched via the `EventsDispatcherPlugin` during request lifecycle

### Authentication

Stack Auth integration (`@stackframe/stack`):
- Client setup: `src/_stack/client.tsx`
- Server setup: `src/_stack/server.tsx`
- Protected routes use `ProtectedPage` component (`src/_provider/protected-page.tsx`)

### Templates

UI templates in `src/_template/` represent major page layouts:
- `getting_started/`: Landing page
- `list_of_forms/`: Dashboard view
- `build_form/`: Form builder (main editing interface)
- `top_header/`: Shared header component

### Important Patterns

1. **Server Actions Location**: All server actions must be in files marked with `'use server'` directive at the top and should be in `src/_server/_handlers/`.

2. **Validation**: Always use Zod schemas created via `createInsertSchema` from `drizzle-zod` for input validation in handlers.

3. **Transactions**: Use `db.transaction()` for operations that modify multiple tables (e.g., creating a form with default page/section).

4. **IDs**: Generate UUIDs via `v7 as uuidv7` from the `uuid` package for all new records.

5. **Return Types**: Server actions return `IReturnAction<T>`:
   ```typescript
   type IReturnAction<T> =
     | { status: 'success', data: T }
     | { status: 'error', error: { message: string, trace?: string } }
   ```

6. **Temporary IDs**: Client-side uses temporary IDs (prefixed with `TEMP_`) for optimistic updates before server confirmation. See `src/_constants/temp.ts` and `src/_utils/temp-id.ts`.

7. **Media Uploads**: Media files are uploaded to Vercel Blob Storage via `@vercel/blob` and tracked in the `mediaTable`.

## Environment Variables

Required in `.env` or `.env.local`:
- `TURSO_DATABASE_URL`: Turso database connection URL
- `TURSO_AUTH_TOKEN`: Turso authentication token
- Stack Auth credentials (see Stack Auth documentation)

## Tech Stack

- **Framework**: Next.js 16 with App Router and React 19
- **Styling**: Tailwind CSS 4
- **Database**: Turso (libSQL) via Drizzle ORM
- **Auth**: Stack Auth
- **UI Components**: Radix UI primitives with shadcn/ui
- **Rich Text**: BlockNote editor
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **File Storage**: Vercel Blob