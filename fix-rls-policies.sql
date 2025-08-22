-- Fix RLS policies for donations table
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;

CREATE POLICY "Enable insert for donations" ON public.donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for donations" ON public.donations
    FOR SELECT USING (true);

-- Fix RLS policies for orders table
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Enable insert for orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for orders" ON public.orders
    FOR SELECT USING (true);

-- Fix RLS policies for contact_messages table
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

CREATE POLICY "Enable insert for contact_messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for contact_messages" ON public.contact_messages
    FOR SELECT USING (true);

-- Fix RLS policies for newsletter_subscriptions table
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;

CREATE POLICY "Enable insert for newsletter_subscriptions" ON public.newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for newsletter_subscriptions" ON public.newsletter_subscriptions
    FOR SELECT USING (true);

-- Alternative: Disable RLS temporarily for testing (uncomment if needed)
-- ALTER TABLE public.donations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.newsletter_subscriptions DISABLE ROW LEVEL SECURITY;

