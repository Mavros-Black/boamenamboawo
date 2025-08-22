const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixAdminRole() {
  try {
    console.log('🔍 Checking admin user...')
    
    // First, let's check if the admin user exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error listing users:', listError)
      return
    }
    
    console.log(`📊 Found ${users.users.length} users:`)
    users.users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`)
      console.log(`    Role: ${user.user_metadata?.role || 'No role set'}`)
      console.log(`    Metadata:`, user.user_metadata)
    })
    
    // Find the admin user
    const adminUser = users.users.find(user => user.email === 'admin@boamenameboawo.com')
    
    if (!adminUser) {
      console.log('❌ Admin user not found!')
      return
    }
    
    console.log('✅ Found admin user:', adminUser.email)
    console.log('Current metadata:', adminUser.user_metadata)
    
    // Check if role is already set
    if (adminUser.user_metadata?.role === 'admin') {
      console.log('✅ Admin role is already set correctly!')
      return
    }
    
    // Update the admin user's role
    console.log('🔄 Updating admin user role...')
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          ...adminUser.user_metadata,
          role: 'admin'
        }
      }
    )
    
    if (updateError) {
      console.error('❌ Error updating admin user:', updateError)
      return
    }
    
    console.log('✅ Admin user role updated successfully!')
    console.log('Updated user:', updateData.user)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixAdminRole()
