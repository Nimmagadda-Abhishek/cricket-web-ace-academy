-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
-- Note: This needs to be done through the Supabase dashboard or API

-- Set up Row Level Security (RLS) policies
-- Gallery table policies
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gallery" 
  ON gallery FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert to gallery" 
  ON gallery FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to gallery" 
  ON gallery FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from gallery" 
  ON gallery FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Facilities table policies
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to facilities" 
  ON facilities FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert to facilities" 
  ON facilities FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to facilities" 
  ON facilities FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from facilities" 
  ON facilities FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Testimonials table policies
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to testimonials" 
  ON testimonials FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert to testimonials" 
  ON testimonials FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to testimonials" 
  ON testimonials FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from testimonials" 
  ON testimonials FOR DELETE 
  USING (auth.role() = 'authenticated');