#!/usr/bin/env node

const bcrypt = require('bcryptjs')

async function generateHash() {
  const passwords = ['admin123', 'user123']
  
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10)
    console.log(`Password: ${password}`)
    console.log(`Hash: ${hash}`)
    
    // Test verification
    const isValid = await bcrypt.compare(password, hash)
    console.log(`Verification: ${isValid}`)
    console.log('---')
  }
}

generateHash().catch(console.error)
