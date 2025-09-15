-- Simple Events Tables Only - No Cleanup
-- Use this if you want to create just the events tables without touching existing data

-- Create the main events table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  venue VARCHAR(255),
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_tickets INTEGER NOT NULL DEFAULT 0,
  available_tickets INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ticket purchases table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS ticket_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_reference VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_event_id ON ticket_purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_email ON ticket_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_payment_reference ON ticket_purchases(payment_reference);

-- Insert sample data (only if events don't already exist)
INSERT INTO events (id, title, description, start_date, end_date, location, venue, status, ticket_price, max_tickets, available_tickets) 
SELECT * FROM (VALUES
  ('youth-leadership-summit-2024', 'Youth Leadership Summit 2024', 'Empowering the next generation of leaders through interactive workshops and networking.', TIMESTAMP WITH TIME ZONE '2024-11-15 09:00:00+00', TIMESTAMP WITH TIME ZONE '2024-11-15 17:00:00+00', 'Accra', 'Accra International Conference Centre', 'published', 75::DECIMAL(10,2), 300, 180),
  ('digital-skills-workshop', 'Digital Skills Workshop', 'Learn essential digital skills for the modern workplace including coding and digital marketing.', TIMESTAMP WITH TIME ZONE '2024-12-08 10:00:00+00', TIMESTAMP WITH TIME ZONE '2024-12-08 16:00:00+00', 'Kumasi', 'University of Ghana, Legon', 'published', 30::DECIMAL(10,2), 50, 45),
  ('community-impact-awards', 'Community Impact Awards', 'Celebrating young changemakers and their contributions to community development.', TIMESTAMP WITH TIME ZONE '2024-12-20 18:00:00+00', TIMESTAMP WITH TIME ZONE '2024-12-20 22:00:00+00', 'Accra', 'Kempinski Hotel Gold Coast City', 'published', 50::DECIMAL(10,2), 200, 0)
) AS v(id, title, description, start_date, end_date, location, venue, status, ticket_price, max_tickets, available_tickets)
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = v.id);

-- Enable RLS (only if not already enabled)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'events' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE events ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'ticket_purchases' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create simple policies (avoid conflicts by using unique names)
DO $$
BEGIN
    -- Drop and recreate policies to avoid conflicts
    DROP POLICY IF EXISTS "events_public_select" ON events;
    DROP POLICY IF EXISTS "events_all_operations" ON events;
    DROP POLICY IF EXISTS "purchases_all_operations" ON ticket_purchases;
    
    -- Create new policies
    CREATE POLICY "events_public_select" ON events FOR SELECT USING (status = 'published');
    CREATE POLICY "events_all_operations" ON events FOR ALL USING (true);
    CREATE POLICY "purchases_all_operations" ON ticket_purchases FOR ALL USING (true);
END $$;

-- Success message
SELECT 'Events tables setup completed successfully!' as message;