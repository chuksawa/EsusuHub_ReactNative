/**
 * List all users in database
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

async function listUsers() {
  try {
    // First check what columns exist
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('id', 'email', 'full_name', 'phone', 'email_confirmed_at', 'confirmed_at', 'created_at')
      ORDER BY ordinal_position
    `);
    
    const availableColumns = columns.rows.map(r => r.column_name).join(', ');
    console.log('Available columns:', availableColumns);
    console.log('');
    
    const users = await pool.query(
      `SELECT id, email, full_name, phone, created_at 
       FROM users 
       ORDER BY created_at`
    );

    console.log('📋 All users in database:\n');
    
    users.rows.forEach((u, i) => {
      console.log(`${i + 1}. ${u.full_name || 'N/A'}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   Phone: ${u.phone || 'N/A'}`);
      console.log(`   ID: ${u.id}`);
      console.log(`   Verified: ${u.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Created: ${u.created_at}`);
      console.log('');
    });

    console.log(`Total users: ${users.rows.length}\n`);
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

listUsers();

