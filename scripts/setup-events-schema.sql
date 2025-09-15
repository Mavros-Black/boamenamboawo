-- Events Management Database Schema
-- This file contains SQL commands to set up the events management system

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  venue VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  image_url TEXT,
  max_attendees INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket types table
CREATE TABLE ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL,
  sold_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sale_start_date TIMESTAMP WITH TIME ZONE,
  sale_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket purchases table
CREATE TABLE ticket_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE CASCADE,
  purchaser_name VARCHAR(255) NOT NULL,
  purchaser_email VARCHAR(255) NOT NULL,
  purchaser_phone VARCHAR(20),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference VARCHAR(255),
  payment_method VARCHAR(50),
  attended BOOLEAN DEFAULT false,
  attendance_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table (for tracking actual attendance)
CREATE TABLE event_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  ticket_purchase_id UUID REFERENCES ticket_purchases(id) ON DELETE CASCADE,
  attendee_name VARCHAR(255) NOT NULL,
  attendee_email VARCHAR(255),
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event analytics table (for storing computed metrics)
CREATE TABLE event_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  total_tickets_sold INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_attendees INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX idx_ticket_purchases_event_id ON ticket_purchases(event_id);
CREATE INDEX idx_ticket_purchases_email ON ticket_purchases(purchaser_email);
CREATE INDEX idx_ticket_purchases_payment_status ON ticket_purchases(payment_status);
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);

-- Triggers to update analytics
CREATE OR REPLACE FUNCTION update_event_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert analytics for the affected event
  INSERT INTO event_analytics (
    event_id, 
    total_tickets_sold, 
    total_revenue, 
    total_attendees,
    last_updated
  )
  VALUES (
    COALESCE(NEW.event_id, OLD.event_id),
    (SELECT COALESCE(SUM(quantity), 0) FROM ticket_purchases WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND payment_status = 'paid'),
    (SELECT COALESCE(SUM(total_amount), 0) FROM ticket_purchases WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND payment_status = 'paid'),
    (SELECT COUNT(*) FROM event_attendees WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)),
    NOW()
  )
  ON CONFLICT (event_id) 
  DO UPDATE SET
    total_tickets_sold = EXCLUDED.total_tickets_sold,
    total_revenue = EXCLUDED.total_revenue,
    total_attendees = EXCLUDED.total_attendees,
    last_updated = EXCLUDED.last_updated;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_analytics_on_purchase
  AFTER INSERT OR UPDATE OR DELETE ON ticket_purchases
  FOR EACH ROW EXECUTE FUNCTION update_event_analytics();

CREATE TRIGGER trigger_update_analytics_on_attendance
  AFTER INSERT OR UPDATE OR DELETE ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION update_event_analytics();

-- Row Level Security (RLS) policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for events table
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view all events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    created_by = auth.uid()
  );

-- Policies for ticket types
CREATE POLICY "Public can view active ticket types" ON ticket_types
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (SELECT 1 FROM events WHERE events.id = ticket_types.event_id AND events.status = 'published')
  );

CREATE POLICY "Admins can manage ticket types" ON ticket_types
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for ticket purchases
CREATE POLICY "Users can view their own purchases" ON ticket_purchases
  FOR SELECT USING (
    purchaser_email = auth.jwt() ->> 'email' OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can create purchases" ON ticket_purchases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all purchases" ON ticket_purchases
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for attendees
CREATE POLICY "Admins can manage attendees" ON event_attendees
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for analytics
CREATE POLICY "Admins can view analytics" ON event_analytics
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');