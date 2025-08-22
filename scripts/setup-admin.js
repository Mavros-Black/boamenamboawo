const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...')
    
    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@boamenameboawo.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Error creating admin user:', authError.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@boamenameboawo.com')
    console.log('🔑 Password: admin123')
    console.log('👤 Role: admin')
    console.log('\n🎉 You can now log in with these credentials!')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupAdmin()

