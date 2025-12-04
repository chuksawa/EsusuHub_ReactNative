import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'esusuhub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Enable SSL for Supabase connections
  ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.DB_HOST?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
};

// Use DATABASE_URL if provided (for Supabase/production)
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Supabase requires SSL
  if (process.env.DATABASE_URL.includes('supabase')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
}

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process - let the server handle reconnection
});

// Test database connection asynchronously (non-blocking)
pool.query('SELECT NOW()')
  .then((res) => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('⚠️  Database connection error:', err.message);
    console.error('   Server will continue but database operations may fail');
    console.error('   Check your DATABASE_URL in .env file');
  });

export default pool;

