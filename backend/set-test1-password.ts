/**
 * Set a password for test1@example.com in the database
 * Usage: npx tsx set-test1-password.ts <password>
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';
import { hashPassword } from './src/utils/password';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setPassword() {
  const password = process.argv[2] || 'Password123!'; // Default password
  
  try {
    console.log('Setting password for test1@example.com...');
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed');
    
    // Update auth.users
    const result = await pool.query(
      `UPDATE auth.users 
       SET encrypted_password = $1, 
           updated_at = NOW()
       WHERE email = 'test1@example.com'
       RETURNING id, email`,
      [hashedPassword]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Password set successfully for:', result.rows[0].email);
      console.log('You can now login with: test1@example.com /', password);
    } else {
      console.log('❌ User not found');
    }
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

setPassword();

