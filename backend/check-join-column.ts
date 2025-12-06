import { pool } from './src/config/database';

async function checkJoinColumn() {
  try {
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'group_memberships' 
      AND (column_name LIKE '%join%' OR column_name LIKE '%date%')
      ORDER BY column_name
    `);
    console.log('Join/Date related columns in group_memberships:');
    result.rows.forEach(r => console.log(`  - ${r.column_name}`));
    await pool.end();
  } catch (error: any) {
    console.error('Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkJoinColumn();

