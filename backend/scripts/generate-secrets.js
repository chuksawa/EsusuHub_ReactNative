#!/usr/bin/env node

/**
 * Generate secure random secrets for JWT tokens
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('\n🔐 Generate Secure JWT Secrets\n');
console.log('Copy these to your Railway environment variables:\n');
console.log('─'.repeat(60));
console.log(`JWT_SECRET=${generateSecret()}`);
console.log(`JWT_REFRESH_SECRET=${generateSecret()}`);
console.log('─'.repeat(60));
console.log('\n✅ Secrets generated! Make sure to save these securely.\n');

