/**
 * Create a second test user for testing
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
});

async function createTestUser() {
  try {
    const email = 'bob@example.com';
    const phone = '+2348000000001';
    const fullName = 'Bob Test';
    const password = 'password123';

    // Check if user already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  User already exists!');
      console.log(`   Email: ${email}`);
      console.log(`   ID: ${existing.rows[0].id}`);
      await pool.end();
      return;
    }

    // Get tenant_id (use the same as Alice)
    const tenantResult = await pool.query('SELECT tenant_id FROM users LIMIT 1');
    const tenantId = tenantResult.rows[0]?.tenant_id;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user - try with minimal required fields first
    let result;
    try {
      result = await pool.query(
        `INSERT INTO users (email, phone, encrypted_password, full_name, tenant_id, email_confirmed_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING id, email, full_name, created_at`,
        [email, phone, passwordHash, fullName, tenantId]
      );
    } catch (insertError: any) {
      // If that fails, try without email_confirmed_at
      console.log('First insert failed, trying alternative...');
      result = await pool.query(
        `INSERT INTO users (email, phone, encrypted_password, full_name, tenant_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, full_name, created_at`,
        [email, phone, passwordHash, fullName, tenantId]
      );
    }

    const user = result.rows[0];

    console.log('✅ Test user created successfully!\n');
    console.log('📧 Login credentials:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Created: ${user.created_at}`);
    console.log('\n💡 You can now use these credentials to log in to the app!');

    await pool.end();
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createTestUser();

