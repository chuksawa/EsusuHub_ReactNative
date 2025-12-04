import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
});

async function checkPasswordColumn() {
  try {
    // Check password-related columns
    const cols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND (column_name LIKE '%password%' OR column_name LIKE '%encrypt%')
      ORDER BY column_name
    `);
    
    console.log('Password-related columns:');
    cols.rows.forEach(c => console.log('  -', c.column_name));
    
    // Check Alice's actual data
    const alice = await pool.query('SELECT * FROM users WHERE email = $1', ['alice@example.com']);
    if (alice.rows[0]) {
      console.log('\nAlice user data keys:');
      Object.keys(alice.rows[0]).forEach(k => {
        if (k.includes('password') || k.includes('encrypt')) {
          console.log('  -', k, ':', alice.rows[0][k] ? '[HIDDEN]' : 'null');
        }
      });
    }
    
    await pool.end();
  } catch (error: any) {
    console.error('Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkPasswordColumn();

