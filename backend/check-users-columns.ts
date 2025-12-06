/**
 * Check what columns exist in the users table
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

async function checkColumns() {
  try {
    // Check all columns in users table
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columns in users table:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Check specifically for password columns
    const passwordCols = columns.rows.filter(c => 
      c.column_name.toLowerCase().includes('password') || 
      c.column_name.toLowerCase().includes('encrypt')
    );
    
    console.log('\n🔐 Password-related columns:');
    if (passwordCols.length > 0) {
      passwordCols.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('  No password columns found!');
    }
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkColumns();

