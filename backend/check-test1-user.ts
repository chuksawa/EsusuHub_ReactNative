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
      ['test1@example.com']
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('User found:');
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Full Name:', user.full_name);
      console.log('  Has Password:', !!user.encrypted_password);
      if (user.encrypted_password) {
        console.log('  Password Hash (first 30 chars):', user.encrypted_password.substring(0, 30));
      }
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

