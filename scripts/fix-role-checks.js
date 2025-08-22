const fs = require('fs')
const path = require('path')

// Files that need fixing
const filesToFix = [
  'src/app/dashboard/reports/page.tsx',
  'src/app/dashboard/finance/page.tsx',
  'src/app/dashboard/events/page.tsx',
  'src/app/dashboard/donations/page.tsx',
  'src/app/dashboard/orders/page.tsx',
  'src/app/dashboard/analytics/page.tsx'
]

function fixRoleChecks() {
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`🔧 Fixing ${filePath}...`)
      
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Replace the problematic pattern
      const oldPattern = /if \(user\?\.role !== 'admin'\) \{[\s\S]*?router\.push\('\/dashboard'\)[\s\S]*?\}/
      const newPattern = `const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }`
      
      content = content.replace(oldPattern, newPattern)
      
      // Also fix any remaining user?.role references
      content = content.replace(/user\?\.role/g, 'user?.user_metadata?.role || \'user\'')
      
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Fixed ${filePath}`)
    } else {
      console.log(`❌ File not found: ${filePath}`)
    }
  })
}

fixRoleChecks()
