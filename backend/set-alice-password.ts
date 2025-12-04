/**
 * Set password for Alice test user
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
});

async function setAlicePassword() {
  try {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [hash, 'alice@example.com']
    );
    
    console.log('✅ Password set for alice@example.com');
    console.log('   Email: alice@example.com');
    console.log('   Password: password123');
    console.log('\nYou can now log in with these credentials in the app!');
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

setAlicePassword();

