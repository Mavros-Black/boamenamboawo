const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupEnhancedSchema() {
  try {
    console.log('🚀 Setting up enhanced events schema...')

    // 1. Create ticket_types table
    console.log('📝 Creating ticket_types table...')
    const { error: ticketTypesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ticket_types (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          original_price DECIMAL(10,2),
          max_quantity INTEGER DEFAULT 0,
          sold_quantity INTEGER DEFAULT 0,
          available_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          available_until TIMESTAMP WITH TIME ZONE,
          benefits TEXT[],
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (ticketTypesError) {
      console.error('❌ Error creating ticket_types:', ticketTypesError.message)
    } else {
      console.log('✅ ticket_types table created')
    }

    // 2. Create event_speakers table
    console.log('📝 Creating event_speakers table...')
    const { error: speakersError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (speakersError) {
      console.error('❌ Error creating event_speakers:', speakersError.message)
    } else {
      console.log('✅ event_speakers table created')
    }

    // 3. Create event_agenda table
    console.log('📝 Creating event_agenda table...')
    const { error: agendaError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS event_agenda (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_time TIMESTAMP WITH TIME ZONE NOT NULL,
          end_time TIMESTAMP WITH TIME ZONE NOT NULL,
          session_type VARCHAR(50) DEFAULT 'session',
          speaker_id UUID REFERENCES event_speakers(id) ON DELETE SET NULL,
          location_details VARCHAR(255),
          is_mandatory BOOLEAN DEFAULT false,
          max_attendees INTEGER,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (agendaError) {
      console.error('❌ Error creating event_agenda:', agendaError.message)
    } else {
      console.log('✅ event_agenda table created')
    }

    // 4. Create event_promo_codes table
    console.log('📝 Creating event_promo_codes table...')
    const { error: promoError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS event_promo_codes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
          code VARCHAR(50) NOT NULL UNIQUE,
          description TEXT,
          discount_type VARCHAR(20) NOT NULL,
          discount_value DECIMAL(10,2) NOT NULL,
          max_uses INTEGER DEFAULT 1,
          used_count INTEGER DEFAULT 0,
          valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          valid_until TIMESTAMP WITH TIME ZONE,
          min_purchase_amount DECIMAL(10,2) DEFAULT 0,
          applicable_ticket_types UUID[],
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (promoError) {
      console.error('❌ Error creating event_promo_codes:', promoError.message)
    } else {
      console.log('✅ event_promo_codes table created')
    }

    // 5. Add columns to ticket_purchases
    console.log('📝 Enhancing ticket_purchases table...')
    const { error: enhanceError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE ticket_purchases 
        ADD COLUMN IF NOT EXISTS ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES event_promo_codes(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS original_amount DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS registration_data JSONB,
        ADD COLUMN IF NOT EXISTS group_registration_id UUID,
        ADD COLUMN IF NOT EXISTS special_requirements TEXT;
      `
    })

    if (enhanceError) {
      console.log('⚠️ Note: Some columns may already exist in ticket_purchases')
    } else {
      console.log('✅ ticket_purchases table enhanced')
    }

    console.log('\n🎉 Enhanced schema setup complete!')

  } catch (error) {
    console.error('❌ Failed to setup enhanced schema:', error.message)
    process.exit(1)
  }
}

async function insertSampleData() {
  try {
    console.log('\n📊 Inserting sample ticket types...')

    // Insert ticket types for Youth Leadership Summit
    const { error: insertError } = await supabase
      .from('ticket_types')
      .insert([
        {
          event_id: 'youth-leadership-summit-2025',
          name: 'Early Bird',
          description: 'Limited time early bird pricing',
          price: 35.00,
          original_price: 50.00,
          max_quantity: 100,
          available_from: '2024-12-01T00:00:00Z',
          available_until: '2025-01-15T23:59:59Z',
          benefits: ['Event materials', 'Welcome kit', 'Networking lunch'],
          sort_order: 1
        },
        {
          event_id: 'youth-leadership-summit-2025',
          name: 'Regular',
          description: 'Standard admission ticket',
          price: 50.00,
          original_price: 50.00,
          max_quantity: 200,
          available_from: '2025-01-16T00:00:00Z',
          available_until: '2025-03-10T23:59:59Z',
          benefits: ['Event materials', 'Networking lunch'],
          sort_order: 2
        },
        {
          event_id: 'youth-leadership-summit-2025',
          name: 'Student',
          description: 'Special pricing for students with valid ID',
          price: 25.00,
          original_price: 50.00,
          max_quantity: 50,
          available_from: '2024-12-01T00:00:00Z',
          available_until: '2025-03-10T23:59:59Z',
          benefits: ['Event materials', 'Student networking session'],
          sort_order: 3
        },
        {
          event_id: 'youth-leadership-summit-2025',
          name: 'VIP',
          description: 'Premium access with exclusive benefits',
          price: 100.00,
          original_price: 100.00,
          max_quantity: 25,
          available_from: '2024-12-01T00:00:00Z',
          available_until: '2025-03-10T23:59:59Z',
          benefits: ['Priority seating', 'VIP lunch', 'Exclusive speaker meet & greet', 'Premium gift bag', 'Certificate of completion'],
          sort_order: 4
        }
      ])

    if (insertError) {
      console.log('⚠️ Note: Sample data may already exist')
    } else {
      console.log('✅ Sample ticket types inserted')
    }

    // Insert sample promo codes
    const { error: promoInsertError } = await supabase
      .from('event_promo_codes')
      .insert([
        {
          event_id: 'youth-leadership-summit-2025',
          code: 'YOUTH2025',
          description: 'Special discount for youth organizations',
          discount_type: 'percentage',
          discount_value: 15.00,
          max_uses: 50,
          valid_until: '2025-03-01T23:59:59Z'
        }
      ])

    if (promoInsertError) {
      console.log('⚠️ Note: Sample promo codes may already exist')
    } else {
      console.log('✅ Sample promo codes inserted')
    }

  } catch (error) {
    console.error('❌ Failed to insert sample data:', error.message)
  }
}

async function main() {
  await setupEnhancedSchema()
  await insertSampleData()
  
  // Verify setup
  console.log('\n🔍 Verifying setup...')
  const { data: ticketTypes, error } = await supabase
    .from('ticket_types')
    .select('event_id, name, price')
    .eq('event_id', 'youth-leadership-summit-2025')

  if (error) {
    console.log('❌ Error verifying:', error.message)
  } else {
    console.log(`✅ Found ${ticketTypes.length} ticket types for Youth Leadership Summit:`)
    ticketTypes.forEach(tt => {
      console.log(`   - ${tt.name}: GH₵${tt.price}`)
    })
  }

  console.log('\n🎯 Next Steps:')
  console.log('1. Update the events API to return ticket types')
  console.log('2. Enhance the event detail page UI with ticket selection')
  console.log('3. Implement enhanced registration form')
  
  process.exit(0)
}

main()