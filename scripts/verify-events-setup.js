require('dotenv').config({ path: '.env.local' });
const { supabaseAdmin } = require('../src/lib/supabase.ts');

async function verifyEventsSetup() {
  try {
    console.log('🔍 Verifying events setup...');
    
    if (!supabaseAdmin) {
      console.log('❌ Supabase not configured properly');
      return;
    }

    // Test events table
    console.log('\n📋 Testing events table...');
    const { data: eventsData, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('*')
      .limit(5);
    
    if (eventsError) {
      console.log('❌ Events table error:', eventsError.message);
    } else {
      console.log('✅ Events table working!');
      console.log(`📊 Found ${eventsData.length} events`);
      if (eventsData.length > 0) {
        console.log('📝 Sample event:', {
          id: eventsData[0].id,
          title: eventsData[0].title,
          price: eventsData[0].ticket_price,
          available: eventsData[0].available_tickets
        });
      }
    }

    // Test ticket purchases table
    console.log('\n🎫 Testing ticket purchases table...');
    const { data: purchasesData, error: purchasesError } = await supabaseAdmin
      .from('ticket_purchases')
      .select('*')
      .limit(5);
    
    if (purchasesError) {
      console.log('❌ Ticket purchases table error:', purchasesError.message);
    } else {
      console.log('✅ Ticket purchases table working!');
      console.log(`📊 Found ${purchasesData.length} purchases`);
    }

    // Test API endpoint
    console.log('\n🌐 Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/events');
      if (response.ok) {
        const apiData = await response.json();
        console.log('✅ API endpoint working!');
        console.log(`📊 API returned ${apiData.events?.length || 0} events`);
      } else {
        console.log('⚠️  API endpoint returned status:', response.status);
      }
    } catch (apiError) {
      console.log('⚠️  API endpoint test failed:', apiError.message);
      console.log('💡 Make sure the dev server is running with: npm run dev');
    }

    console.log('\n🎉 Events setup verification complete!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyEventsSetup();