# Supabase Integration

This project uses Supabase as the database backend. This document explains how to use Supabase in this project.

## Setup

1. The Supabase client is already configured in `src/integrations/supabase/client.ts`.
2. Database types are defined in `src/integrations/supabase/types.ts`.

## Environment Variables

The following environment variables are used:

- `VITE_USE_SUPABASE`: Set to `true` to use Supabase (default is `true`)
- `SUPABASE_URL`: The URL of your Supabase project (for seeding script)
- `SUPABASE_SERVICE_KEY`: The service key for admin operations (for seeding script)

## Database Schema

The database has the following tables:

### Programs

Stores information about cricket training programs.

```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  age_group TEXT NOT NULL,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL,
  max_students INTEGER NOT NULL,
  current_students INTEGER DEFAULT 0,
  features JSONB NOT NULL,
  status TEXT DEFAULT 'active',
  coach JSONB NOT NULL,
  schedule JSONB NOT NULL,
  equipment JSONB NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  start_date TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  image TEXT NOT NULL,
  prerequisites JSONB NOT NULL,
  certification_provided BOOLEAN DEFAULT false,
  discount JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contacts

Stores contact form submissions.

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enrollments

Stores program enrollments and payment information.

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id),
  student_info JSONB NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_intent_id TEXT NOT NULL,
  amount_paid INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Services

The following services are available:

### Supabase Service

Located at `src/services/supabase.ts`, this service provides functions for interacting with the Supabase database:

- `programsService`: Functions for managing programs
- `contactsService`: Functions for managing contacts
- `paymentsService`: Functions for managing enrollments and payments

### API Service

Located at `src/services/api.ts`, this service provides a unified API for the frontend:

- It uses Supabase when `USE_SUPABASE` is `true`
- It falls back to mock data or REST API when Supabase is not available

## Hooks

The following hooks are available for using Supabase in React components:

### useSupabaseQuery

```tsx
const { data, loading, error, refetch } = useSupabaseQuery(
  'table_name',
  (query) => query.select('*').eq('status', 'active'),
  [dependency1, dependency2]
);
```

### useSupabaseSubscription

```tsx
const { loading, error } = useSupabaseSubscription([
  {
    table: 'table_name',
    event: 'INSERT',
    callback: (payload) => {
      console.log('New record inserted:', payload);
    },
  },
]);
```

## Seeding the Database

To seed the database with initial data:

1. Set the `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` environment variables
2. Run `npm run seed:supabase`

## Example Usage

```tsx
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery } from '@/hooks/use-supabase';

// In a React component
function ProgramsList() {
  const { data: programs, loading, error } = useSupabaseQuery(
    'programs',
    (query) => query.select('*').eq('status', 'active').order('price'),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {programs?.map((program) => (
        <div key={program.id}>{program.title}</div>
      ))}
    </div>
  );
}
```