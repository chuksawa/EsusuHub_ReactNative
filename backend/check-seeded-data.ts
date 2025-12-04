/**
 * Check seeded data in database
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

async function checkSeededData() {
  try {
    console.log('📊 Checking seeded data...\n');

    // Check users
    const users = await pool.query('SELECT id, email, full_name, phone FROM users ORDER BY created_at LIMIT 5');
    console.log('👥 Users:');
    users.rows.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.full_name} (${u.email}) - ID: ${u.id}`);
    });

    // First check what columns exist
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'savings_groups'
      ORDER BY ordinal_position
    `);
    console.log('\n📋 Savings Groups columns:');
    columns.rows.forEach(c => console.log(`   - ${c.column_name}`));

    // Check groups
    const groups = await pool.query(`
      SELECT sg.*, u.full_name as creator_name
      FROM savings_groups sg
      LEFT JOIN users u ON sg.created_by = u.id
      ORDER BY sg.created_at
    `);
    console.log('\n💰 Savings Groups:');
    groups.rows.forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.name}`);
      console.log(`      - Description: ${g.description || 'N/A'}`);
      console.log(`      - Settings: ${JSON.stringify(g.settings || {})}`);
      console.log(`      - Created by: ${g.creator_name} (${g.created_by})`);
      console.log(`      - Tenant ID: ${g.tenant_id}`);
      console.log(`      - Group ID: ${g.id}`);
    });

    // Check memberships columns first
    const membershipColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'group_memberships'
      ORDER BY ordinal_position
    `);
    console.log('\n📋 Group Memberships columns:');
    membershipColumns.rows.forEach(c => console.log(`   - ${c.column_name}`));

    // Check memberships
    const memberships = await pool.query(`
      SELECT gm.*, u.full_name, sg.name as group_name
      FROM group_memberships gm
      JOIN users u ON gm.user_id = u.id
      JOIN savings_groups sg ON gm.group_id = sg.id
      ORDER BY gm.joined_at
    `);
    console.log('\n👤 Group Memberships:');
    memberships.rows.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.full_name} is ${m.role} in "${m.group_name}"`);
      console.log(`      - Joined: ${m.joined_at}`);
      console.log(`      - Meta: ${JSON.stringify(m.meta || {})}`);
      console.log(`      - User ID: ${m.user_id}, Group ID: ${m.group_id}`);
    });

    // Check contributions columns first
    const contributionColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contributions'
      ORDER BY ordinal_position
      LIMIT 10
    `);
    console.log('\n📋 Contributions columns:');
    contributionColumns.rows.forEach(c => console.log(`   - ${c.column_name}`));

    // Check contributions
    const contributions = await pool.query(`
      SELECT c.*, u.full_name, sg.name as group_name
      FROM contributions c
      JOIN users u ON c.payer_user_id = u.id
      JOIN savings_groups sg ON c.group_id = sg.id
      ORDER BY c.created_at
      LIMIT 5
    `);
    console.log('\n💵 Contributions:');
    contributions.rows.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.full_name} contributed ${c.amount} NGN to "${c.group_name}"`);
      console.log(`      - Status: ${c.status}`);
      console.log(`      - Contribution ID: ${c.id}`);
    });

    console.log('\n✅ Data check complete!\n');
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error checking data:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkSeededData();

