import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    // Check auth.users directly
    const result = await pool.query(
      `SELECT id, email, encrypted_password, email_confirmed_at, created_at
       FROM auth.users 
       WHERE email = $1`,
      ['alice@example.com']
    );
    
    console.log('Found', result.rows.length, 'user(s) in auth.users');
    result.rows.forEach((row, i) => {
      console.log(`\nUser ${i + 1}:`);
      console.log('  ID:', row.id);
      console.log('  Email:', row.email);
      console.log('  Has password:', row.encrypted_password !== null);
      console.log('  Password type:', typeof row.encrypted_password);
      if (row.encrypted_password) {
        console.log('  Password (first 30 chars):', String(row.encrypted_password).substring(0, 30));
      }
    });
    
    await pool.end();
  } catch (error: any) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

check();

