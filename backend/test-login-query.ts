/**
 * Test the login query to see if encrypted_password column exists
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
});

async function testQuery() {
  try {
    console.log('Testing login query for alice@example.com...');
    const result = await pool.query(
      `SELECT id, email, phone, encrypted_password, full_name, email_confirmed_at, deleted_at 
       FROM public.users 
       WHERE email = $1 
       LIMIT 1`,
      ['alice@example.com']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Query successful! Found user:', result.rows[0].email);
      console.log('Columns returned:', Object.keys(result.rows[0]));
    } else {
      console.log('⚠️  Query successful but no user found');
    }
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Query failed:', error.message);
    console.error('Error code:', error.code);
    await pool.end();
    process.exit(1);
  }
}

testQuery();

