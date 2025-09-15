-- Simple Events Table Setup for Boa Me Youth Empowerment
-- Run this in your Supabase SQL Editor

-- Create the main events table
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

-- Create ticket purchases table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_event_id ON ticket_purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_email ON ticket_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_payment_reference ON ticket_purchases(payment_reference);

-- Insert sample events data
INSERT INTO events (id, title, description, start_date, end_date, location, venue, status, ticket_price, max_tickets, available_tickets) VALUES
('youth-leadership-summit-2024', 'Youth Leadership Summit 2024', 'Empowering the next generation of leaders through interactive workshops and networking.', '2024-11-15 09:00:00+00', '2024-11-15 17:00:00+00', 'Accra', 'Accra International Conference Centre', 'published', 75, 300, 180),
('digital-skills-workshop', 'Digital Skills Workshop', 'Learn essential digital skills for the modern workplace including coding and digital marketing.', '2024-12-08 10:00:00+00', '2024-12-08 16:00:00+00', 'Kumasi', 'University of Ghana, Legon', 'published', 30, 50, 45),
('community-impact-awards', 'Community Impact Awards', 'Celebrating young changemakers and their contributions to community development.', '2024-12-20 18:00:00+00', '2024-12-20 22:00:00+00', 'Accra', 'Kempinski Hotel Gold Coast City', 'published', 50, 200, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Create simple policies (allow public read for published events)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Public can view published events" ON events;
DROP POLICY IF EXISTS "Allow all operations on events" ON events;
DROP POLICY IF EXISTS "Allow all operations on ticket_purchases" ON ticket_purchases;

-- Create new policies
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow all operations on events" ON events
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on ticket_purchases" ON ticket_purchases
  FOR ALL USING (true);