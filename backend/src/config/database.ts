import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Check if this is a Supabase connection
const isSupabase = process.env.DATABASE_URL?.includes('supabase') || 
                   process.env.DATABASE_URL?.includes('pooler.supabase.com') ||
                   process.env.DB_HOST?.includes('supabase');

// Build pool config
const poolConfig: PoolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10 seconds for Supabase
};

// Use DATABASE_URL if provided (for Supabase/production)
if (process.env.DATABASE_URL) {
  let connectionString = process.env.DATABASE_URL;
  
  // For Supabase, remove sslmode from URL and handle SSL via config
  // This ensures our SSL config (rejectUnauthorized: false) is used
  if (isSupabase) {
    // Remove sslmode parameter from connection string
    connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');
    // Set SSL config explicitly
    poolConfig.ssl = { rejectUnauthorized: false };
  }
  
  poolConfig.connectionString = connectionString;
} else {
  // Use individual parameters (for local development)
  poolConfig.host = process.env.DB_HOST || 'localhost';
  poolConfig.port = parseInt(process.env.DB_PORT || '5432', 10);
  poolConfig.database = process.env.DB_NAME || 'esusuhub';
  poolConfig.user = process.env.DB_USER || 'postgres';
  poolConfig.password = process.env.DB_PASSWORD || 'postgres';
  
  // Enable SSL for Supabase even with individual params
  if (isSupabase) {
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
    console.error('   Connection timeout set to 10 seconds');
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL;
      const maskedUrl = url.replace(/:[^:@]+@/, ':****@'); // Mask password
      console.error(`   DATABASE_URL: ${maskedUrl.substring(0, 50)}...`);
    }
  });

export default pool;

