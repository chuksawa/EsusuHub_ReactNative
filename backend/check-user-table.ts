import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    // First, try to find alice in public.users
    console.log('Checking public.users...');
    const publicResult = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'"
    );
    console.log('Columns in public.users:', publicResult.rows.map(r => r.column_name));
    
    // Try to query alice
    try {
      const alice = await pool.query("SELECT * FROM public.users WHERE email = 'alice@example.com' LIMIT 1");
      console.log('Found alice in public.users:', alice.rows.length > 0);
      if (alice.rows.length > 0) {
        console.log('Alice columns:', Object.keys(alice.rows[0]));
      }
    } catch (e: any) {
      console.log('Error querying public.users:', e.message);
    }
    
    // Check auth.users
    console.log('\nChecking auth.users...');
    try {
      const authResult = await pool.query(
        "SELECT column_name FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users'"
      );
      console.log('Columns in auth.users:', authResult.rows.map(r => r.column_name));
    } catch (e: any) {
      console.log('Cannot access auth.users:', e.message);
    }
    
    await pool.end();
  } catch (error: any) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

check();

