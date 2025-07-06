-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
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

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL,
  student_info JSONB NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_intent_id TEXT NOT NULL,
  amount_paid INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Create stored procedures for table creation
CREATE OR REPLACE FUNCTION create_programs_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'programs') THEN
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
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_contacts_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contacts') THEN
    CREATE TABLE contacts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_enrollments_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrollments') THEN
    CREATE TABLE enrollments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      program_id UUID NOT NULL,
      student_info JSONB NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      payment_intent_id TEXT NOT NULL,
      amount_paid INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add foreign key if programs table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'programs') THEN
      ALTER TABLE enrollments 
      ADD CONSTRAINT fk_enrollments_program 
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;