# Cricket Academy Web Application Information

## Summary
A comprehensive web application for a cricket academy featuring a public-facing website with program information, facilities, gallery, and testimonials, along with an admin dashboard for content management. The project uses a React frontend with a Node.js backend and supports both Supabase and Hostinger MySQL database integrations.

## Structure
- **src/**: React frontend application with TypeScript
- **backend/**: Node.js backend API with Express and MongoDB
- **server/**: Simple Express server for handling file uploads and admin operations
- **scripts/**: Utility scripts for database setup and migration
- **supabase/**: Supabase database migrations and configuration
- **public/**: Static assets including images and icons

## Projects

### Frontend Application (React)
**Configuration File**: package.json

#### Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.5.3
**Build System**: Vite 5.4.1
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- React 18.3.1
- React Router DOM 6.26.2
- Supabase JS 2.50.0
- TanStack React Query 5.56.2
- Shadcn UI components (Radix UI)
- MySQL2 3.14.1

**Development Dependencies**:
- Vite 5.4.1
- ESLint 9.9.0
- Tailwind CSS 3.4.11
- Concurrently 8.2.2

#### Build & Installation
```bash
npm install
npm run dev           # Development mode
npm run dev:full      # Run frontend and server
npm run build         # Production build
```

### Backend API (Node.js)
**Configuration File**: backend/package.json

#### Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.3.3
**Build System**: ts-node 10.9.2
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- Express 4.18.2
- Mongoose 8.0.3
- bcryptjs 2.4.3
- jsonwebtoken 9.0.2
- Multer 1.4.5-lts.1

**Development Dependencies**:
- TypeScript 5.3.3
- ts-node 10.9.2
- Nodemon 3.0.2

#### Build & Installation
```bash
cd backend
npm install
npm run dev     # Development mode
npm run build   # Compile TypeScript
npm start       # Production mode
```

### Server (Express)
**Configuration File**: server/package.json

#### Language & Runtime
**Language**: JavaScript
**Version**: Node.js (ES Modules)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- Express 4.18.2
- CORS 2.8.5
- Multer 1.4.5-lts.1

#### Build & Installation
```bash
cd server
npm install
npm start
```

## Database Integration

### Hostinger MySQL
**Configuration**: src/integrations/hostinger/client.ts
**Connection**: Environment variables (VITE_DB_HOST, VITE_DB_USER, VITE_DB_PASSWORD, VITE_DB_NAME, VITE_DB_PORT)
**Migration**: scripts/migrate-to-hostinger.js, scripts/hostinger-schema.sql

### Supabase (Legacy)
**Configuration**: src/services/supabase.ts
**Connection**: Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
**Migration**: supabase/migrations/20240701_initial_schema.sql, supabase/migrations/20240702_admin_features.sql

## Admin Dashboard
**Status**: Currently not working properly
**Issue**: Admin operations are failing
**Components**: Admin functionality is implemented in src/services/admin.ts
**Database**: Uses Hostinger MySQL client for database operations
**Operations**: Manage testimonials, facilities, and gallery images

## Testing
**Scripts**: Located in scripts/ directory
**Test Files**:
- scripts/test-achievements-api.js
- scripts/test-db-connection.js
- scripts/test-hostinger-connection.js
- scripts/test-server.js