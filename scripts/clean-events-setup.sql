-- Clean Events Setup for Boa Me Youth Empowerment
-- This script ensures a clean setup by dropping any existing events-related objects first

-- =====================================================
-- CLEAN UP EXISTING EVENTS OBJECTS
-- =====================================================

-- First, disable RLS to avoid issues during cleanup
ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_analytics DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies that might reference non-existent tables/columns
DO $$ 
BEGIN
    -- Drop policies for ticket_types (if table exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ticket_types') THEN
        DROP POLICY IF EXISTS "Public can view active ticket types" ON ticket_types;
        DROP POLICY IF EXISTS "Admins can manage ticket types" ON ticket_types;
    END IF;
    
    -- Drop policies for event_attendees (if table exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_attendees') THEN
        DROP POLICY IF EXISTS "Admins can manage attendees" ON event_attendees;
    END IF;
    
    -- Drop policies for event_analytics (if table exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_analytics') THEN
        DROP POLICY IF EXISTS "Admins can view analytics" ON event_analytics;
    END IF;
    
    -- Drop policies for ticket_purchases (if table exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ticket_purchases') THEN
        DROP POLICY IF EXISTS "Users can view their own purchases" ON ticket_purchases;
        DROP POLICY IF EXISTS "Users can create purchases" ON ticket_purchases;
        DROP POLICY IF EXISTS "Admins can manage all purchases" ON ticket_purchases;
        DROP POLICY IF EXISTS "Allow all operations on ticket_purchases" ON ticket_purchases;
    END IF;
    
    -- Drop policies for events (if table exists)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
        DROP POLICY IF EXISTS "Public can view published events" ON events;
        DROP POLICY IF EXISTS "Users can view all events" ON events;
        DROP POLICY IF EXISTS "Admins can manage events" ON events;
        DROP POLICY IF EXISTS "Allow all operations on events" ON events;
    END IF;
END $$;

-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS update_event_analytics() CASCADE;
DROP TRIGGER IF EXISTS trigger_update_analytics_on_purchase ON ticket_purchases;
DROP TRIGGER IF EXISTS trigger_update_analytics_on_attendance ON event_attendees;

-- Drop existing tables in correct order (child tables first)
DROP TABLE IF EXISTS event_analytics CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS ticket_purchases CASCADE;
DROP TABLE IF EXISTS ticket_types CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- =====================================================
-- CREATE EVENTS TABLES
-- =====================================================

-- Create the main events table
CREATE TABLE events (
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
CREATE TABLE ticket_purchases (
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

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_ticket_purchases_event_id ON ticket_purchases(event_id);
CREATE INDEX idx_ticket_purchases_email ON ticket_purchases(customer_email);
CREATE INDEX idx_ticket_purchases_payment_reference ON ticket_purchases(payment_reference);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

INSERT INTO events (id, title, description, start_date, end_date, location, venue, status, ticket_price, max_tickets, available_tickets) VALUES
('youth-leadership-summit-2024', 'Youth Leadership Summit 2024', 'Empowering the next generation of leaders through interactive workshops and networking.', '2024-11-15 09:00:00+00', '2024-11-15 17:00:00+00', 'Accra', 'Accra International Conference Centre', 'published', 75, 300, 180),
('digital-skills-workshop', 'Digital Skills Workshop', 'Learn essential digital skills for the modern workplace including coding and digital marketing.', '2024-12-08 10:00:00+00', '2024-12-08 16:00:00+00', 'Kumasi', 'University of Ghana, Legon', 'published', 30, 50, 45),
('community-impact-awards', 'Community Impact Awards', 'Celebrating young changemakers and their contributions to community development.', '2024-12-20 18:00:00+00', '2024-12-20 22:00:00+00', 'Accra', 'Kempinski Hotel Gold Coast City', 'published', 50, 200, 0);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE CLEAN POLICIES
-- =====================================================

-- Simple policies for events
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "events_admin_all" ON events
  FOR ALL USING (true);

-- Simple policies for ticket purchases
CREATE POLICY "ticket_purchases_all" ON ticket_purchases
  FOR ALL USING (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 'Events table created' as status, count(*) as record_count FROM events;
SELECT 'Ticket purchases table created' as status, count(*) as record_count FROM ticket_purchases;