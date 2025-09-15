require('dotenv').config({ path: '.env.local' });
const { supabaseAdmin } = require('../src/lib/supabase.ts');

async function updateEventDates() {
  try {
    console.log('🔄 Updating event dates to future dates...');
    
    if (!supabaseAdmin) {
      console.log('❌ Supabase not configured properly');
      return;
    }

    // Update events to have future dates in 2025
    const updates = [
      {
        id: 'youth-leadership-summit-2024',
        start_date: '2025-11-15T09:00:00+00',
        end_date: '2025-11-15T17:00:00+00'
      },
      {
        id: 'digital-skills-workshop',
        start_date: '2025-12-08T10:00:00+00',
        end_date: '2025-12-08T16:00:00+00'
      },
      {
        id: 'community-impact-awards',
        start_date: '2025-12-20T18:00:00+00',
        end_date: '2025-12-20T22:00:00+00'
      }
    ];

    for (const update of updates) {
      console.log(`📅 Updating ${update.id}...`);
      
      const { error } = await supabaseAdmin
        .from('events')
        .update({ 
          start_date: update.start_date,
          end_date: update.end_date 
        })
        .eq('id', update.id);

      if (error) {
        console.log(`❌ Failed to update ${update.id}:`, error.message);
      } else {
        console.log(`✅ Updated ${update.id} successfully`);
      }
    }

    // Verify the updates
    console.log('\n🔍 Verifying updated events...');
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('id, title, start_date, status')
      .order('start_date', { ascending: true });

    if (error) {
      console.log('❌ Failed to fetch events:', error.message);
    } else {
      console.log(`✅ Found ${events.length} events:`);
      events.forEach(event => {
        console.log(`  📅 ${event.title}: ${new Date(event.start_date).toLocaleDateString()}`);
      });
    }

    // Test API endpoint
    console.log('\n🌐 Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/events');
      if (response.ok) {
        const apiData = await response.json();
        console.log(`✅ API now returns ${apiData.events?.length || 0} events`);
      } else {
        console.log('⚠️  API endpoint status:', response.status);
      }
    } catch (apiError) {
      console.log('⚠️  API test failed:', apiError.message);
      console.log('💡 Make sure the dev server is running with: npm run dev');
    }

    console.log('\n🎉 Event dates update complete!');
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
}

updateEventDates();