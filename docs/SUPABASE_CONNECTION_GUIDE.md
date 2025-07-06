# Supabase Connection Guide

This guide explains how to connect your Cricket Academy project to Supabase.

## Prerequisites

- A Supabase account
- Node.js and npm installed
- Basic knowledge of SQL

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign in or create an account
2. Click "New Project" and follow the setup wizard
3. Choose a name for your project and set a secure database password
4. Select a region closest to your users
5. Wait for your project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on the "Settings" icon (gear icon) in the left sidebar
3. Select "API" from the settings menu
4. You'll find two important pieces of information:
   - **Project URL**: This is your Supabase project URL
   - **anon/public** key: This is your public API key for client-side operations
   - **service_role** key: This is your private API key for admin operations (keep this secure!)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_SUPABASE=true

# For seeding script (admin operations)
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Create Database Tables

You have two options for creating the necessary database tables:

### Option 1: Using the SQL Editor in Supabase

1. Go to your Supabase project dashboard
2. Click on the "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL from `supabase/migrations/20240701_initial_schema.sql`
5. Click "Run" to execute the SQL

### Option 2: Using Supabase Migrations (Advanced)

1. Install the Supabase CLI:
   ```
   npm install -g supabase
   ```

2. Login to Supabase:
   ```
   supabase login
   ```

3. Link your project:
   ```
   supabase link --project-ref your_project_id
   ```

4. Push the migrations:
   ```
   supabase db push
   ```

## Step 5: Seed the Database

To populate your database with initial data:

1. Make sure you've set the `SUPABASE_SERVICE_KEY` environment variable
2. Run the seeding script:
   ```
   npm run seed:supabase
   ```

## Step 6: Test the Connection

1. Start your development server:
   ```
   npm run dev
   ```

2. Navigate to the Supabase connection test page (if available)
3. Verify that the connection is successful

## Troubleshooting

### Connection Issues

- **Error: Failed to fetch**: Check that your Supabase URL and API key are correct
- **Error: JWT expired**: Your API key may be expired or invalid
- **Error: Database connection error**: Your Supabase project may be in maintenance mode

### Database Issues

- **Error: relation "programs" does not exist**: The database tables haven't been created
- **Error: permission denied for table programs**: Check your RLS (Row Level Security) policies

### Environment Variable Issues

- **Error: Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')**: Make sure your environment variables are properly loaded

## Using Supabase in Your Code

### Basic Query Example

```typescript
import { supabase } from '@/integrations/supabase/client';

// Fetch all active programs
async function getPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'active');
    
  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
  
  return data;
}
```

### Using the Supabase Service

```typescript
import supabaseService from '@/services/supabase';

// Get all programs
const { data } = await supabaseService.programs.getPrograms();

// Get a specific program
const { data } = await supabaseService.programs.getProgramById('123');

// Submit a contact form
await supabaseService.contacts.submitContact({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  message: 'I want to join the program'
});
```

### Using React Hooks

```typescript
import { useSupabaseQuery } from '@/hooks/use-supabase';

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
      {programs?.map(program => (
        <div key={program.id}>{program.title}</div>
      ))}
    </div>
  );
}
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)