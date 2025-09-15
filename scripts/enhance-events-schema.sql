-- Enhanced Events Schema for Towaba-App
-- Phase 1: Multiple Ticket Types & Enhanced Event Details

-- =====================================================
-- TICKET TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 'Early Bird', 'Regular', 'VIP', 'Student'
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2), -- For showing discounts
  max_quantity INTEGER DEFAULT 0, -- 0 = unlimited
  sold_quantity INTEGER DEFAULT 0,
  available_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  available_until TIMESTAMP WITH TIME ZONE,
  benefits TEXT[], -- Array of benefits for this ticket type
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SPEAKERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS event_speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  expertise_areas TEXT[],
  session_title VARCHAR(255),
  session_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AGENDA/SCHEDULE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS event_agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  session_type VARCHAR(50) DEFAULT 'session', -- 'session', 'break', 'networking', 'keynote'
  speaker_id UUID REFERENCES event_speakers(id) ON DELETE SET NULL,
  location_details VARCHAR(255), -- Room name, online link, etc.
  is_mandatory BOOLEAN DEFAULT false,
  max_attendees INTEGER, -- For breakout sessions
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EVENT RESOURCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS event_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50), -- 'pdf', 'video', 'audio', 'presentation'
  file_size BIGINT, -- in bytes
  access_level VARCHAR(50) DEFAULT 'all', -- 'all', 'premium', 'vip'
  is_downloadable BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REGISTRATION QUESTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS event_registration_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- 'text', 'select', 'multi_select', 'boolean', 'date'
  options TEXT[], -- For select/multi_select questions
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROMO CODES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS event_promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  applicable_ticket_types UUID[], -- Array of ticket_type IDs, empty = all types
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENHANCED TICKET PURCHASES TABLE
-- =====================================================
-- Update existing ticket_purchases table
ALTER TABLE ticket_purchases 
ADD COLUMN IF NOT EXISTS ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES event_promo_codes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS registration_data JSONB, -- Store custom registration answers
ADD COLUMN IF NOT EXISTS group_registration_id UUID, -- For group bookings
ADD COLUMN IF NOT EXISTS special_requirements TEXT;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_active ON ticket_types(is_active);
CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_agenda_event_id ON event_agenda(event_id);
CREATE INDEX IF NOT EXISTS idx_event_agenda_time ON event_agenda(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_event_resources_event_id ON event_resources(event_id);
CREATE INDEX IF NOT EXISTS idx_event_resources_access ON event_resources(access_level);
CREATE INDEX IF NOT EXISTS idx_registration_questions_event_id ON event_registration_questions(event_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON event_promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_event_id ON event_promo_codes(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_ticket_type ON ticket_purchases(ticket_type_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_group ON ticket_purchases(group_registration_id);

-- =====================================================
-- SAMPLE DATA FOR EXISTING EVENTS
-- =====================================================

-- Insert ticket types for existing events
INSERT INTO ticket_types (event_id, name, description, price, original_price, max_quantity, available_from, available_until, benefits) VALUES
-- Youth Leadership Summit ticket types
('youth-leadership-summit-2025', 'Early Bird', 'Limited time early bird pricing', 35.00, 50.00, 100, '2024-12-01 00:00:00+00', '2025-01-15 23:59:59+00', ARRAY['Event materials', 'Welcome kit', 'Networking lunch']),
('youth-leadership-summit-2025', 'Regular', 'Standard admission ticket', 50.00, 50.00, 200, '2025-01-16 00:00:00+00', '2025-03-10 23:59:59+00', ARRAY['Event materials', 'Networking lunch']),
('youth-leadership-summit-2025', 'Student', 'Special pricing for students with valid ID', 25.00, 50.00, 50, '2024-12-01 00:00:00+00', '2025-03-10 23:59:59+00', ARRAY['Event materials', 'Student networking session']),
('youth-leadership-summit-2025', 'VIP', 'Premium access with exclusive benefits', 100.00, 100.00, 25, '2024-12-01 00:00:00+00', '2025-03-10 23:59:59+00', ARRAY['Priority seating', 'VIP lunch', 'Exclusive speaker meet & greet', 'Premium gift bag', 'Certificate of completion']),

-- Digital Skills Workshop ticket types
('digital-skills-workshop-2025', 'Early Bird', 'Save 25% with early registration', 22.50, 30.00, 50, '2024-12-01 00:00:00+00', '2025-02-01 23:59:59+00', ARRAY['Workshop materials', 'Digital toolkit access']),
('digital-skills-workshop-2025', 'Regular', 'Standard workshop admission', 30.00, 30.00, 80, '2025-02-02 00:00:00+00', '2025-02-25 23:59:59+00', ARRAY['Workshop materials']),
('digital-skills-workshop-2025', 'Student', 'Discounted rate for students', 20.00, 30.00, 30, '2024-12-01 00:00:00+00', '2025-02-25 23:59:59+00', ARRAY['Workshop materials', 'Student resource pack']),

-- Entrepreneurship Bootcamp ticket types
('entrepreneurship-bootcamp-2025', 'Early Bird', 'Early bird special pricing', 67.50, 75.00, 40, '2024-12-01 00:00:00+00', '2025-03-01 23:59:59+00', ARRAY['Bootcamp materials', 'Business plan template', 'Mentorship session']),
('entrepreneurship-bootcamp-2025', 'Regular', 'Standard bootcamp ticket', 75.00, 75.00, 60, '2025-03-02 00:00:00+00', '2025-04-10 23:59:59+00', ARRAY['Bootcamp materials', 'Business plan template']),
('entrepreneurship-bootcamp-2025', 'Premium', 'Includes 1-on-1 mentoring', 120.00, 120.00, 20, '2024-12-01 00:00:00+00', '2025-04-10 23:59:59+00', ARRAY['All materials', 'Business plan template', '3 mentorship sessions', 'Startup toolkit', 'Follow-up support']);

-- Insert sample speakers
INSERT INTO event_speakers (event_id, name, title, bio, expertise_areas, session_title, session_description, sort_order) VALUES
('youth-leadership-summit-2025', 'Dr. Akosua Mensah', 'Leadership Development Expert', 'Dr. Mensah has over 15 years of experience in youth development and leadership training across Africa.', ARRAY['Leadership', 'Youth Development', 'Public Speaking'], 'Transformational Leadership in the Digital Age', 'Learn how to lead effectively in our rapidly changing world.', 1),
('youth-leadership-summit-2025', 'Kwame Asante', 'Social Entrepreneur', 'Founder of multiple successful social enterprises focused on youth empowerment in Ghana.', ARRAY['Entrepreneurship', 'Social Impact', 'Innovation'], 'Building Sustainable Social Enterprises', 'Discover how to create businesses that drive positive social change.', 2),
('digital-skills-workshop-2025', 'Sarah Osei', 'Tech Innovation Specialist', 'Leading expert in digital transformation and technology adoption in developing markets.', ARRAY['Digital Marketing', 'Technology', 'Innovation'], 'Mastering Digital Tools for Career Growth', 'Essential digital skills every young professional needs to succeed.', 1),
('entrepreneurship-bootcamp-2025', 'Michael Boateng', 'Startup Mentor', 'Serial entrepreneur and investor with 20+ years building successful businesses in West Africa.', ARRAY['Business Strategy', 'Investment', 'Scaling'], 'From Idea to Market: Startup Success Strategies', 'Learn the proven frameworks for launching and scaling your business.', 1);

-- Insert sample agenda items
INSERT INTO event_agenda (event_id, title, description, start_time, end_time, session_type, sort_order) VALUES
-- Youth Leadership Summit agenda
('youth-leadership-summit-2025', 'Registration & Welcome', 'Event check-in and welcome refreshments', '2025-03-15 08:00:00+00', '2025-03-15 09:00:00+00', 'registration', 1),
('youth-leadership-summit-2025', 'Opening Keynote', 'Transformational Leadership in the Digital Age', '2025-03-15 09:00:00+00', '2025-03-15 10:30:00+00', 'keynote', 2),
('youth-leadership-summit-2025', 'Coffee Break', 'Networking break with refreshments', '2025-03-15 10:30:00+00', '2025-03-15 11:00:00+00', 'break', 3),
('youth-leadership-summit-2025', 'Panel Discussion', 'Building Sustainable Social Enterprises', '2025-03-15 11:00:00+00', '2025-03-15 12:30:00+00', 'session', 4),
('youth-leadership-summit-2025', 'Networking Lunch', 'Lunch and networking opportunities', '2025-03-15 12:30:00+00', '2025-03-15 14:00:00+00', 'networking', 5),
('youth-leadership-summit-2025', 'Workshop Sessions', 'Interactive leadership skill-building workshops', '2025-03-15 14:00:00+00', '2025-03-15 16:00:00+00', 'session', 6),
('youth-leadership-summit-2025', 'Closing Ceremony', 'Wrap-up and next steps', '2025-03-15 16:00:00+00', '2025-03-15 17:00:00+00', 'session', 7);

-- Insert sample promo codes
INSERT INTO event_promo_codes (event_id, code, description, discount_type, discount_value, max_uses, valid_until) VALUES
('youth-leadership-summit-2025', 'YOUTH2025', 'Special discount for youth organizations', 'percentage', 15.00, 50, '2025-03-01 23:59:59+00'),
('digital-skills-workshop-2025', 'DIGITAL15', '15% off for early adopters', 'percentage', 15.00, 30, '2025-02-15 23:59:59+00'),
('entrepreneurship-bootcamp-2025', 'STARTUP20', '$20 off for aspiring entrepreneurs', 'fixed_amount', 20.00, 25, '2025-04-01 23:59:59+00');

-- Insert sample resources
INSERT INTO event_resources (event_id, title, description, file_type, access_level, sort_order) VALUES
('youth-leadership-summit-2025', 'Leadership Development Workbook', 'Comprehensive guide with exercises and frameworks', 'pdf', 'all', 1),
('youth-leadership-summit-2025', 'Networking Contact Template', 'Template for organizing your professional contacts', 'pdf', 'all', 2),
('youth-leadership-summit-2025', 'VIP Exclusive: Advanced Leadership Strategies', 'In-depth strategies for experienced leaders', 'pdf', 'vip', 3),
('digital-skills-workshop-2025', 'Digital Marketing Toolkit', 'Essential tools and templates for digital marketing', 'pdf', 'all', 1),
('entrepreneurship-bootcamp-2025', 'Business Plan Template', 'Professional business plan template with examples', 'pdf', 'all', 1),
('entrepreneurship-bootcamp-2025', 'Startup Financial Models', 'Excel templates for financial planning', 'spreadsheet', 'premium', 2);

-- Insert sample registration questions
INSERT INTO event_registration_questions (event_id, question, question_type, is_required, sort_order) VALUES
('youth-leadership-summit-2025', 'What is your current leadership experience level?', 'select', false, 1),
('youth-leadership-summit-2025', 'Do you have any dietary restrictions?', 'text', false, 2),
('youth-leadership-summit-2025', 'What do you hope to achieve from this summit?', 'text', true, 3),
('digital-skills-workshop-2025', 'What is your current skill level with digital tools?', 'select', true, 1),
('digital-skills-workshop-2025', 'Which topics are you most interested in?', 'multi_select', false, 2),
('entrepreneurship-bootcamp-2025', 'Do you currently have a business idea?', 'boolean', false, 1),
('entrepreneurship-bootcamp-2025', 'What industry is your business idea in?', 'select', false, 2);

COMMIT;