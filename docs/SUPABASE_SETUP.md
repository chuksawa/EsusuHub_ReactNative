# Supabase Database Setup

This document outlines the Supabase database configuration and the changes made by the Supabase AI assistant.

## Database Changes Made by Supabase AI Assistant

The Supabase AI assistant has made the following changes to your database:

### 1. Row Level Security (RLS) Policies
RLS policies have been created on the following tables to ensure tenant-scoped access:
- `users`
- `user_profiles`
- `savings_groups`
- `group_memberships`
- `contributions`
- `payouts`
- `payment_accounts`
- `notifications`
- `bank_accounts`
- `bank_transactions`
- `bank_account_applications`

These policies ensure users can only access their own data and data they're authorized to see.

### 2. Additional Indexes
Additional indexes have been created for better query performance. The existing indexes from `database-schema.sql` are still in place, and additional ones have been added by Supabase.

### 3. Seeded Test Data
The following test data has been seeded with these IDs:

- **Savings Group**: `27c27b6e-72f9-46bd-83d4-09228bf08a4b`
- **Group Membership**: `73391402-613f-4a22-a9c0-019f5f8d5bd3`
- **Payment Account**: `b704e86a-05b5-4f13-81c2-7772b0f56410`
- **Contribution**: `a0c5f69d-eb8b-44ec-8201-b70a9747fbef`
- **Notification**: `48d0180d-978f-40e2-a98f-c20dec75a22f`

## Connecting Backend to Supabase

### Option 1: Using Connection String (Recommended)

1. Get your Supabase connection string from the Supabase dashboard:
   - Go to Project Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

2. Add to your `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Option 2: Using Individual Parameters

1. Get your Supabase database credentials:
   - Host: `db.[PROJECT-REF].supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: Your database password

2. Add to your `.env` file:
   ```env
   DB_HOST=db.[PROJECT-REF].supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   ```

## SSL Connection

Supabase requires SSL connections. The backend is configured to use SSL when connecting via `DATABASE_URL`. If you're using individual parameters, you may need to enable SSL in the connection configuration.

## RLS Policies and Backend

The backend API uses service role credentials or connection pooling, which bypasses RLS policies. This is the correct approach for a backend API server. The RLS policies are primarily for:
- Direct database access from client applications
- Supabase client libraries
- Additional security layer

Your backend API should use the service role key or connection pooling URL to have full database access.

## Verifying Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Check the console for:
   ```
   Database connected successfully
   ```

3. Test an endpoint:
   ```bash
   curl http://localhost:5166/health
   ```

## Important Notes

- **Never expose your service role key or database password** in client-side code
- Use environment variables for all sensitive credentials
- The backend API bypasses RLS policies (this is intentional for API access)
- RLS policies protect direct database access from clients
- Keep your `.env` file in `.gitignore`

## Troubleshooting

### Connection Timeout
- Check your Supabase project is active
- Verify your IP is not blocked (check Supabase dashboard)
- Ensure you're using the correct connection string

### Authentication Failed
- Verify your database password is correct
- Check if you're using the right user (should be `postgres`)
- Ensure SSL is enabled

### RLS Policy Errors
- These shouldn't affect the backend API if using service role
- If you see RLS errors, check your connection configuration

## Next Steps

1. Update your `.env` file with Supabase credentials
2. Test the database connection
3. Run a test API call to verify everything works
4. Consider setting up database migrations for future schema changes

