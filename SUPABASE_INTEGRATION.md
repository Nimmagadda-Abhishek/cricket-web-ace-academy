# Supabase Integration for Cricket Academy Project

## Overview

This document outlines the changes made to integrate Supabase as the database backend for the Cricket Academy project.

## Changes Made

1. **Database Schema Definition**
   - Updated `src/integrations/supabase/types.ts` with proper table definitions for:
     - Programs
     - Contacts
     - Enrollments

2. **Supabase Service**
   - Created `src/services/supabase.ts` with services for:
     - Programs management
     - Contact form submissions
     - Enrollment and payment tracking
     - Data transformation utilities

3. **API Service Update**
   - Modified `src/services/api.ts` to:
     - Use Supabase when enabled
     - Fall back to mock data or REST API when needed
     - Maintain backward compatibility

4. **React Hooks**
   - Created `src/hooks/use-supabase.ts` with:
     - `useSupabaseQuery`: For data fetching with automatic refetching
     - `useSupabaseSubscription`: For real-time updates

5. **Database Seeding**
   - Created `scripts/seed-supabase.ts` to populate the database with initial data
   - Added `scripts/mock-data.ts` with sample data
   - Added `seed:supabase` script to package.json

6. **Example Component**
   - Created `src/components/admin/ProgramsManager.tsx` as an example of using Supabase in a React component

7. **Documentation**
   - Added `src/integrations/supabase/README.md` with detailed usage instructions

## How to Use

### Basic Usage

```tsx
// Import the Supabase client
import { supabase } from '@/integrations/supabase/client';

// Use the client directly
const { data, error } = await supabase
  .from('programs')
  .select('*')
  .eq('status', 'active');
```

### Using the API Service

```tsx
// Import the API service
import api from '@/services/api';

// Use the service
const { data } = await api.programs.getPrograms();
```

### Using React Hooks

```tsx
// Import the hook
import { useSupabaseQuery } from '@/hooks/use-supabase';

// Use the hook in a component
const { data, loading, error } = useSupabaseQuery(
  'programs',
  (query) => query.select('*').eq('status', 'active'),
  []
);
```

## Next Steps

1. **Create Database Tables**
   - Run the SQL commands in the README to create the necessary tables in Supabase

2. **Seed the Database**
   - Set the required environment variables
   - Run `npm run seed:supabase`

3. **Update Components**
   - Modify existing components to use the Supabase services instead of mock data

4. **Add Authentication**
   - Implement Supabase authentication for admin features

5. **Add Storage**
   - Use Supabase storage for image uploads and management