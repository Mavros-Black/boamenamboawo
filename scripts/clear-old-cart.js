// Script to clear old cart data from localStorage
console.log('🧹 Clearing old cart data from localStorage...')

// Clear the old cart key
localStorage.removeItem('cart')

// Clear any user-specific cart keys that might exist
const keysToRemove = []
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key && key.startsWith('cart_')) {
    keysToRemove.push(key)
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key)
  console.log(`🗑️ Removed: ${key}`)
})

console.log('✅ Old cart data cleared!')
console.log('📝 Note: New cart data will be user-specific and will only show for logged-in users.')
