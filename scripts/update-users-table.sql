-- Update users table to include password field for authentication
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Insert a default admin user (password: admin123)
INSERT INTO public.users (id, name, email, password, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@boamenameboawo.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq', -- bcrypt hash of 'admin123'
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert a default test user (password: user123)
INSERT INTO public.users (id, name, email, password, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test User',
  'user@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq', -- bcrypt hash of 'user123'
  'user',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

