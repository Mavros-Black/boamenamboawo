require('dotenv').config({ path: '.env.local' });
const { supabaseAdmin } = require('../src/lib/supabase.ts');

async function setupEventsTable() {
  try {
    console.log('🚀 Setting up events table in Supabase...');
    
    if (!supabaseAdmin) {
      console.log('❌ Supabase not configured properly');
      return;
    }

    // Create the events table with a simple approach
    console.log('📝 Creating events table...');
    
    // First, let's try to create the events table directly using Supabase client
    // Since we can't execute arbitrary SQL, we'll need to create this in the Supabase dashboard
    // But let's check if we can create it programmatically
    
    // Check if table exists first
    const { data: existingData, error: checkError } = await supabaseAdmin
      .from('events')
      .select('*')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ Events table already exists!');
      console.log('📊 Current records:', existingData.length);
      return;
    }
    
    console.log('❌ Events table does not exist.');
    console.log('🔧 Please create the events table manually in Supabase Dashboard:');
    console.log('');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to "Table Editor" in the sidebar');
    console.log('3. Click "Create a new table"');
    console.log('4. Copy and paste the SQL from scripts/setup-events-schema.sql');
    console.log('5. Or use the SQL Editor to run the schema');
    console.log('');
    console.log('📄 The schema file is located at: scripts/setup-events-schema.sql');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupEventsTable();