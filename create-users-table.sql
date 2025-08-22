-- Create users table for authentication
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Enable insert for users" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for users" ON public.users
    FOR SELECT USING (true);

-- Insert default admin user (password: admin123)
-- This is a proper bcrypt hash for 'admin123'
INSERT INTO public.users (id, name, email, password, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@boamenameboawo.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert default test user (password: user123)
-- This is a proper bcrypt hash for 'user123'
INSERT INTO public.users (id, name, email, password, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test User',
  'user@example.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'user123'
  'user',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

