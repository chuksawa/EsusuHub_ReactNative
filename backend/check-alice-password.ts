import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    const result = await pool.query(
      `SELECT 
         COALESCE(pu.id, au.id) as id,
         au.email,
         COALESCE(pu.phone, au.phone) as phone,
         pu.full_name,
         au.encrypted_password::text as encrypted_password,
         au.email_confirmed_at,
         au.deleted_at
       FROM auth.users au
       LEFT JOIN public.users pu ON pu.auth_user_id = au.id
       WHERE au.email = $1 
       LIMIT 1`,
      ['alice@example.com']
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('User found:', user.email);
      console.log('Password type:', typeof user.encrypted_password);
      console.log('Password value:', JSON.stringify(user.encrypted_password));
      console.log('Password keys:', Object.keys(user.encrypted_password || {}));
      console.log('Raw row:', JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('User not found');
    }
    
    await pool.end();
  } catch (error: any) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

check();

