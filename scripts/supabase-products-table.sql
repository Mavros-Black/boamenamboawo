-- Create products table
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this for better security)
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, in_stock, stock_quantity) VALUES
  ('Youth Empowerment T-Shirt', 'Comfortable cotton t-shirt with youth empowerment message', 25.00, '/images/products/tshirt.jpg', 'Clothing', true, 50),
  ('Community Support Hoodie', 'Warm hoodie supporting community development', 45.00, '/images/products/hoodie.jpg', 'Clothing', true, 30),
  ('Education Fund Donation', 'Support education initiatives in local communities', 100.00, '/images/products/education.jpg', 'Donations', true, 999),
  ('Healthcare Support Package', 'Support healthcare initiatives in rural areas', 75.00, '/images/products/healthcare.jpg', 'Donations', true, 500);
