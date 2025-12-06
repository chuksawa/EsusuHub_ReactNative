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
  connectionTimeoutMillis: 10000, // Increased to 10 seconds for Supabase
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
  // Override timeout when using connection string
  poolConfig.connectionTimeoutMillis = 10000;
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
    console.error('   Connection timeout set to 10 seconds');
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL;
      const maskedUrl = url.replace(/:[^:@]+@/, ':****@'); // Mask password
      console.error(`   DATABASE_URL: ${maskedUrl.substring(0, 50)}...`);
    }
  });

export default pool;

