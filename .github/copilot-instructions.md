# Copilot Instructions - Felipe Ramos API

## Project Overview
Microservices-based Node.js/TypeScript backend for an AI-powered interactive portfolio and career management platform. Features real-time Socket.IO communication, OpenAI integration, PostgreSQL database with custom ORM, Redis caching, and Docker deployment.

**Tech Stack**: Node.js 20+, TypeScript 5, Express 5, Socket.IO 4.8+, OpenAI API, PostgreSQL 8.16+, Redis (ioredis 5.6+), Puppeteer 24.15+

## Architecture Patterns

### Microservices Structure
The backend runs as **independent containerized services** that communicate via Redis pub/sub:
- **AI Service** (`src/containers/ai.service.ts`) - OpenAI GPT integration with specialized assistants
- **Socket Server** (`src/containers/socket-server.service.ts`) - Real-time WebSocket communication on port 5000
- **API Server** (`src/containers/api-server.service.ts`) - RESTful HTTP/HTTPS endpoints on port 7000
- **Slack Service** (`src/containers/slack.service.ts`) - Slack bot integration on port 4000
- **VirtualBrowser Service** (`src/containers/virtual-browser.service.ts`) - Puppeteer automation for PDF generation and LinkedIn scraping

Each service extends `Microservice` class (see `src/services/Microservice/Microservice.ts`) which provides Redis-based event communication via `EventEndpoint` pattern.

### Event-Driven Communication
Services communicate through **Redis pub/sub channels**:
```typescript
// Example: Sending events between services
microservice.sendTo('/path/to/endpoint', data, callback);
microservice.publishEvent('eventName', data);
```

Key pattern: Event endpoints in `src/containers/routes/` define inter-service communication paths, not HTTP routes.

### Socket.IO Namespace Architecture
Real-time features use **dedicated namespaces** (`src/containers/namespaces/`):
- `/cv-chat` - AI assistant conversations
- `/cover-letter` - Real-time cover letter generation with status updates
- `/opportunities` - Job opportunity management and CV summary generation

Import namespaces from `src/containers/namespaces/index.ts` and attach to Socket.IO server in socket-server service.

### Database Service Pattern
Custom **PostgreSQL ORM** (`src/services/Database/PostgresDB/`) with fluent query builders:
```typescript
// Query pattern
await db.select('schema_name', 'table_name')
  .where({ field: value })
  .orderBy('created_at', 'DESC')
  .exec();

// Insert pattern  
await db.insert('schema_name', 'table_name')
  .data({ field: value })
  .exec();
```

**Schema structure** in `src/database/schemas/` defines tables with fields. Tables auto-sync on startup (adds missing columns, removes extra ones).

Key schemas: `users_schema`, `companies_schema`, `skills_schema`, `experiences_schema`, `curriculums_schema`, `opportunities_schema`, `letters_schema`, `languages_schema`, `educations_schema`.

### Route Organization
**RESTful routes** in `src/routes/` use the `Route` service class for JWT auth and role-based access:
```typescript
// Protected route pattern
const route = new Route({
  method: 'POST',
  path: '/resource/create',
  isAuth: true,
  roles: ['admin', 'master'],
  handler: async (req, res) => { /* ... */ }
});
```

Routes are attached to Express app in `src/containers/routes/` files during API server startup.

## Development Workflows

### Running Services
**Local development** (each service in separate terminal):
```bash
npm run watch:ai              # AI service with auto-reload
npm run watch:socket-server   # Socket server with auto-reload
npm run watch:api-server      # API server with auto-reload
npm run watch:virtual-browser # VirtualBrowser service
```

**Docker deployment** (recommended):
```bash
docker-compose up -d          # Start all services
docker-compose logs -f [service-name]  # View logs
docker-compose down           # Stop all services
```

Services depend on **Redis and PostgreSQL** being healthy (see `docker-compose.yml` health checks).

### Database Initialization
Database **auto-initializes** on first run:
1. Creates schemas from `src/database/schemas/`
2. Creates tables with field definitions
3. Syncs table columns (adds missing, removes extra)
4. Creates master user from `MASTER_USER_*` env vars

**Master user** (role: 'master') is created from environment variables - never hardcoded.

### Build and Deployment
```bash
npm run build      # TypeScript → JavaScript (outputs to dist/)
npm run start      # Run built JavaScript (production)
npm run clean      # Remove dist directory
```

**TypeScript config** uses `Node16` module resolution (see `tsconfig.json`). Path alias `@/*` maps to `src/*`.

## Project-Specific Conventions

### Service File Naming
- **Container files**: `*.service.ts` in `src/containers/` - entry points for microservices
- **Route files**: `*.route.ts` in `src/routes/` - HTTP endpoint handlers
- **Service classes**: Class files in `src/services/[ServiceName]/` with PascalCase folder names

### TypeScript Patterns
- **Types**: `*.types.ts` files alongside implementation files
- **Interfaces**: Prefer `interface` over `type` for object shapes
- **Error handling**: Custom error classes in service directories (e.g., `ErrorDatabase.ts`, `ErrorAICore.ts`)

### AI Integration
**Two OpenAI assistants**:
- `OPENAI_ASSISTANT_ID` - General portfolio assistant trained on Felipe's background
- `OPENAI_ASSISTANT_BUILD_CV` - Specialized CV summary generation assistant

AICore service (`src/services/AICore/`) provides chat session management with thread persistence:
```typescript
const chat = await aiCore.startChat({ systemMessage: '...', smPath: 'prompts/file.md' });
const response = chat.response()
  .addCell('user', 'message content')
  .stream({ onOutputTextDelta: (chunk) => {...} });
```

System prompts stored in `src/prompts/` as markdown files.

### PDF Generation
**VirtualBrowser service** uses Puppeteer to:
- Generate CV PDFs from Next.js frontend pages
- Scrape LinkedIn job postings (handles modals, expandable content)
- Auto-regenerate PDFs when CV data changes (event-driven)

PDFs stored in shared volume (`shared_data` in Docker) accessible to API server for downloads.

### Authentication Flow
1. **Login** at `POST /auth/login` returns JWT token
2. **Token** stored in HTTP-only cookie by Express session middleware
3. **Protected routes** check `req.user` populated by Route service JWT middleware
4. **Roles**: `master` (owner), `admin` (content manager), `user` (viewer)

Role checks in Route service - `isAuth: true` requires authentication, `roles: ['admin', 'master']` restricts access.

### Language Sets
**Multi-language support** via `language_set` field (values: 'en', 'pt' from `src/app.config.ts`):
- Main entities (skills, companies, experiences, etc.) have primary language
- Create additional language versions via `create-set` endpoints
- Frontend requests specific language, backend returns matching set

Pattern: Base table has main data, language-specific content in separate records linked by foreign key.

## Critical Integration Points

### Socket-Frontend Communication
Frontend (`feliperamos-dev`) connects to Socket.IO server on port 5000:
- Namespace URLs: `${SERVER_HOST}:${SOCKET_PORT}/cv-chat`, `/cover-letter`, `/opportunities`
- Events follow pattern: `event-name` (kebab-case), data is always JSON
- Status updates during AI generation: `status`, `complete`, `error` events

### API-Frontend Communication  
Frontend makes HTTP requests to API server on port 7000:
- Authentication via cookie-based sessions (no Bearer tokens in requests)
- CORS configured for frontend origin (see `CORS_ORIGIN` env var)
- RESTful conventions: `POST` create, `GET` read, `PATCH` update, `DELETE` delete

### Redis Usage
- **Sessions**: Express session store
- **Pub/sub**: Inter-service event communication (channel = service ID)
- **Cache**: Future use (not heavily utilized yet)

Connection via `REDIS_URL` env var. All microservices share same Redis instance.

### Database Relationships
- **User** → one-to-many → Companies, Skills, Experiences, Curriculums, Languages, Educations
- **Company** → one-to-many → Opportunities
- **Opportunity** → many-to-one → Company, Curriculum
- **Curriculum** → many-to-many → Skills, Experiences, Languages, Educations (via junction tables)
- **Letter** → many-to-one → User, Company, Opportunity

Foreign keys enforced in database schema definitions (`src/database/schemas/`).

## Testing & Debugging

### Environment Setup
Copy `.env.example` → `.env.local` with required variables:
- OpenAI keys and assistant IDs
- Database credentials (host, port, user, password, database name)
- Redis URL
- JWT secret
- Master user credentials
- Server ports

### Debug Commands
```bash
npm run dev:inspect          # Start with Node.js inspector
npm run debug:socket-fresh   # Clean socket debug (PowerShell script)
npm run clean:cache          # Clear ts-node and npm cache
```

### Common Issues
- **Port conflicts**: Check if ports 5000, 7000, 4000, 5432, 6000 are available
- **Database connection**: Verify PostgreSQL is running and credentials match
- **Redis connection**: Check Redis is accessible at configured URL
- **Docker networking**: Services communicate via `feliperamos-net` bridge network
- **PDF generation**: VirtualBrowser needs Chrome/Chromium dependencies in Docker

### Logs
Services log with prefix `[service-name]` for easy filtering. Check Docker logs with `docker-compose logs -f [service-name]`.

## Key Files Reference

- `app.ts` - Multi-service launcher (spawns all containers)
- `src/app.config.ts` - Locale and model configuration
- `src/global/globals.ts` - Global type definitions and utilities
- `src/database/index.ts` - Database initialization entry point
- `src/services/index.ts` - Service class exports
- `docker-compose.yml` - Multi-service Docker orchestration with health checks

## Style Guidelines

- **Imports**: Use `@/` alias for `src/` imports
- **Async/await**: Prefer over promises/callbacks
- **Error handling**: Always wrap database/external service calls in try-catch
- **Logging**: Use `console.log`/`console.error` with service name prefix
- **Type safety**: Enable strict mode checks, avoid `any` except for external libraries
