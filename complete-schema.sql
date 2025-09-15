
-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR BAOME APPLICATION
-- =====================================================

-- 1. USERS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_message TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_reference VARCHAR(255) UNIQUE NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_reference VARCHAR(255) UNIQUE NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  start_date DATE,
  end_date DATE,
  location VARCHAR(255),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. NEWSLETTER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. EVENTS TABLE
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

-- 10. TICKET PURCHASES TABLE
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

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_payment_reference ON donations(payment_reference);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Programs indexes
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON programs(created_at);

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON newsletter_subscriptions(is_active);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_event_id ON ticket_purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_email ON ticket_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_payment_reference ON ticket_purchases(payment_reference);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - allow all operations for now)
-- Drop existing policies first to avoid conflicts
DO $$
BEGIN
    -- Only drop policies if tables exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        DROP POLICY IF EXISTS "Allow all operations on users" ON users;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        DROP POLICY IF EXISTS "Allow all operations on products" ON products;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'donations') THEN
        DROP POLICY IF EXISTS "Allow all operations on donations" ON donations;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'programs') THEN
        DROP POLICY IF EXISTS "Allow all operations on programs" ON programs;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        DROP POLICY IF EXISTS "Allow all operations on blog_posts" ON blog_posts;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'contacts') THEN
        DROP POLICY IF EXISTS "Allow all operations on contacts" ON contacts;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'newsletter_subscriptions') THEN
        DROP POLICY IF EXISTS "Allow all operations on newsletter_subscriptions" ON newsletter_subscriptions;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
        DROP POLICY IF EXISTS "Allow all operations on events" ON events;
        DROP POLICY IF EXISTS "Public can view published events" ON events;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ticket_purchases') THEN
        DROP POLICY IF EXISTS "Allow all operations on ticket_purchases" ON ticket_purchases;
    END IF;
END $$;

-- Create new policies
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on donations" ON donations FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on programs" ON programs FOR ALL USING (true);
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on newsletter_subscriptions" ON newsletter_subscriptions FOR ALL USING (true);
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on ticket_purchases" ON ticket_purchases FOR ALL USING (true);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample products (if not exists)
INSERT INTO products (name, description, price, image_url, category, in_stock, stock_quantity) 
SELECT * FROM (VALUES
  ('Youth Empowerment T-Shirt', 'Comfortable cotton t-shirt with youth empowerment message', 25.00, '/images/products/tshirt.jpg', 'Clothing', true, 50),
  ('Community Support Hoodie', 'Warm hoodie supporting community development', 45.00, '/images/products/hoodie.jpg', 'Clothing', true, 30),
  ('Education Fund Donation', 'Support education initiatives in local communities', 100.00, '/images/products/education.jpg', 'Donations', true, 999),
  ('Healthcare Support Package', 'Support healthcare initiatives in rural areas', 75.00, '/images/products/healthcare.jpg', 'Donations', true, 500)
) AS v(name, description, price, image_url, category, in_stock, stock_quantity)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = v.name);

-- Insert sample programs (if not exists)
INSERT INTO programs (title, description, category, status, location, max_participants)
SELECT * FROM (VALUES
  ('Youth Leadership Training', 'Empowering young leaders with essential skills for community development', 'Education', 'active', 'Accra, Ghana', 50),
  ('Healthcare Outreach', 'Providing basic healthcare services to rural communities', 'Healthcare', 'active', 'Kumasi, Ghana', 100),
  ('Skills Development Workshop', 'Teaching practical skills for economic empowerment', 'Training', 'active', 'Tamale, Ghana', 75)
) AS v(title, description, category, status, location, max_participants)
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE title = v.title);

-- Insert sample blog posts (if not exists)
INSERT INTO blog_posts (title, content, excerpt, status, published_at)
SELECT * FROM (VALUES
  ('Empowering Communities Through Education', 'Education is the foundation of community development...', 'How education initiatives are transforming local communities', 'published', NOW()),
  ('The Impact of Youth Leadership Programs', 'Young leaders are the future of our communities...', 'Exploring the benefits of youth leadership development', 'published', NOW()),
  ('Healthcare Access in Rural Areas', 'Access to healthcare is a fundamental human right...', 'Addressing healthcare challenges in rural communities', 'published', NOW())
) AS v(title, content, excerpt, status, published_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title = v.title);

-- Insert sample events (if not exists)
INSERT INTO events (id, title, description, start_date, end_date, location, venue, status, ticket_price, max_tickets, available_tickets)
SELECT * FROM (VALUES
  ('youth-leadership-summit-2024', 'Youth Leadership Summit 2024', 'Empowering the next generation of leaders through interactive workshops and networking.', TIMESTAMP WITH TIME ZONE '2024-11-15 09:00:00+00', TIMESTAMP WITH TIME ZONE '2024-11-15 17:00:00+00', 'Accra', 'Accra International Conference Centre', 'published', 75::DECIMAL(10,2), 300, 180),
  ('digital-skills-workshop', 'Digital Skills Workshop', 'Learn essential digital skills for the modern workplace including coding and digital marketing.', TIMESTAMP WITH TIME ZONE '2024-12-08 10:00:00+00', TIMESTAMP WITH TIME ZONE '2024-12-08 16:00:00+00', 'Kumasi', 'University of Ghana, Legon', 'published', 30::DECIMAL(10,2), 50, 45),
  ('community-impact-awards', 'Community Impact Awards', 'Celebrating young changemakers and their contributions to community development.', TIMESTAMP WITH TIME ZONE '2024-12-20 18:00:00+00', TIMESTAMP WITH TIME ZONE '2024-12-20 22:00:00+00', 'Accra', 'Kempinski Hotel Gold Coast City', 'published', 50::DECIMAL(10,2), 200, 0)
) AS v(id, title, description, start_date, end_date, location, venue, status, ticket_price, max_tickets, available_tickets)
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = v.id);
