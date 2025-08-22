-- =====================================================
-- CREATE MISSING TABLES ONLY
-- =====================================================

-- 1. PROGRAMS TABLE
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

-- 2. BLOG POSTS TABLE
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

-- 3. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES
-- =====================================================

CREATE POLICY "Allow all operations on programs" ON programs FOR ALL USING (true);
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert sample programs
INSERT INTO programs (title, description, category, status, location, max_participants) VALUES
  ('Youth Leadership Training', 'Empowering young leaders with essential skills for community development', 'Education', 'active', 'Accra, Ghana', 50),
  ('Healthcare Outreach', 'Providing basic healthcare services to rural communities', 'Healthcare', 'active', 'Kumasi, Ghana', 100),
  ('Skills Development Workshop', 'Teaching practical skills for economic empowerment', 'Training', 'active', 'Tamale, Ghana', 75);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, status, published_at) VALUES
  ('Empowering Communities Through Education', 'Education is the foundation of community development. Our programs focus on providing quality education to underserved communities...', 'How education initiatives are transforming local communities', 'published', NOW()),
  ('The Impact of Youth Leadership Programs', 'Young leaders are the future of our communities. Through our leadership programs, we empower youth to take charge...', 'Exploring the benefits of youth leadership development', 'published', NOW()),
  ('Healthcare Access in Rural Areas', 'Access to healthcare is a fundamental human right. Our healthcare outreach programs bring essential services...', 'Addressing healthcare challenges in rural communities', 'published', NOW());
