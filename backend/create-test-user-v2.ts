/**
 * Create a second test user - check what columns we can actually insert
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

    // Check what columns we can actually insert into
    const columnCheck = await pool.query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('email', 'phone', 'encrypted_password', 'full_name', 'tenant_id', 'email_confirmed_at', 'password_hash')
      ORDER BY column_name
    `);
    
    console.log('Available columns for insert:');
    columnCheck.rows.forEach(col => {
      console.log(`  - ${col.column_name} (nullable: ${col.is_nullable}, default: ${col.column_default || 'none'})`);
    });
    console.log('');

    // Try different approaches
    let result;
    let success = false;

    // Approach 1: Try with encrypted_password
    try {
      console.log('Trying with encrypted_password...');
      result = await pool.query(
        `INSERT INTO users (email, phone, encrypted_password, full_name, tenant_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, full_name, created_at`,
        [email, phone, passwordHash, fullName, tenantId]
      );
      success = true;
    } catch (e1: any) {
      console.log(`  Failed: ${e1.message}`);
      
      // Approach 2: Try with password_hash
      try {
        console.log('Trying with password_hash...');
        result = await pool.query(
          `INSERT INTO users (email, phone, password_hash, full_name, tenant_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, email, full_name, created_at`,
          [email, phone, passwordHash, fullName, tenantId]
        );
        success = true;
      } catch (e2: any) {
        console.log(`  Failed: ${e2.message}`);
        throw new Error(`Both approaches failed. Last error: ${e2.message}`);
      }
    }

    if (success && result) {
      const user = result.rows[0];
      console.log('\n✅ Test user created successfully!\n');
      console.log('📧 Login credentials:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Name: ${user.full_name}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('\n💡 You can now use these credentials to log in to the app!');
    }

    await pool.end();
  } catch (error: any) {
    console.error('\n❌ Error creating user:', error.message);
    console.error('\n💡 Alternative: Use the registration API endpoint or register through the app UI');
    await pool.end();
    process.exit(1);
  }
}

createTestUser();

