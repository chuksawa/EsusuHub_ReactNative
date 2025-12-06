/**
 * Create bond@example.com directly in the database
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';
import { hashPassword } from './src/utils/password';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createBond() {
  try {
    console.log('Creating bond@example.com in database...');
    
    // Hash password
    const hashedPassword = await hashPassword('Password123!');
    console.log('Password hashed');
    
    // Get tenant_id
    let tenantId = null;
    try {
      const tenantResult = await pool.query('SELECT id FROM tenants LIMIT 1');
      tenantId = tenantResult.rows[0]?.id || null;
    } catch (e) {
      console.warn('Could not get tenant_id, continuing with null');
    }
    
    // First, create in auth.users
    console.log('Creating in auth.users...');
    const authResult = await pool.query(
      `INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, created_at, updated_at, phone
      )
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        $1,
        $2,
        NOW(),
        NOW(),
        NOW(),
        $3
      )
      RETURNING id, email`,
      ['bond@example.com', hashedPassword, '+2348000000001']
    );
    
    const authUser = authResult.rows[0];
    console.log('✅ Created in auth.users:', authUser.id);
    
    // Then create in public.users
    console.log('Creating in public.users...');
    const publicResult = await pool.query(
      `INSERT INTO public.users (
        id, tenant_id, auth_user_id, email, full_name, phone, created_at, updated_at
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW(),
        NOW()
      )
      RETURNING id, email, full_name`,
      [tenantId, authUser.id, 'bond@example.com', 'Bond Test', '+2348000000001']
    );
    
    const publicUser = publicResult.rows[0];
    console.log('✅ Created in public.users:', publicUser.id);
    
    console.log('\n✅ User created successfully!');
    console.log('Auth User ID:', authUser.id);
    console.log('Public User ID:', publicUser.id);
    console.log('Email:', authUser.email);
    console.log('Full Name:', publicUser.full_name);
    console.log('\nYou can now login with:');
    console.log('  Email: bond@example.com');
    console.log('  Password: Password123!');
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message?.includes('permission denied') || error.message?.includes('row-level security')) {
      console.error('\n⚠️  This error is likely due to Supabase RLS policies.');
      console.error('You may need to:');
      console.error('1. Disable RLS on auth.users and public.users tables in Supabase dashboard');
      console.error('2. Or use Supabase Auth API to create users');
    }
    await pool.end();
    process.exit(1);
  }
}

createBond();

