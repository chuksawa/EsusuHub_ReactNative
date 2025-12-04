/**
 * Quick database connection test
 * Run with: npx tsx test-connection.ts
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const poolConfig: any = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
};

const pool = new Pool(poolConfig);

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...\n');
    
    // Test 1: Basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database connection successful!');
    console.log(`   Current time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}\n`);
    
    // Test 2: Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📊 Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Test 3: Check seeded data (if exists)
    try {
      const groupCheck = await pool.query('SELECT COUNT(*) as count FROM savings_groups');
      const memberCheck = await pool.query('SELECT COUNT(*) as count FROM group_memberships');
      const contributionCheck = await pool.query('SELECT COUNT(*) as count FROM contributions');
      
      console.log('\n📦 Seeded data:');
      console.log(`   Savings Groups: ${groupCheck.rows[0].count}`);
      console.log(`   Group Memberships: ${memberCheck.rows[0].count}`);
      console.log(`   Contributions: ${contributionCheck.rows[0].count}`);
    } catch (err) {
      console.log('\n⚠️  Could not check seeded data (tables may not exist yet)');
    }
    
    console.log('\n✅ All tests passed! Database is ready to use.\n');
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your DATABASE_URL in .env file');
    console.error('2. Verify your Supabase project is active');
    console.error('3. Check if your IP is allowed in Supabase dashboard');
    console.error('4. Ensure SSL is enabled (should be automatic)\n');
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();

