# Disable RLS for Development - Quick Fix

## Problem
Bob's registration created a mock user because Supabase RLS (Row Level Security) is blocking database inserts.

## Quick Fix: Disable RLS in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run This SQL
```sql
-- Disable RLS on users table for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Step 3: Verify
```sql
-- Check if RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';
```

Should show: `rowsecurity = false`

### Step 4: Try Registering Bob Again
1. Register Bob Test again in the app
2. Check database: `cd backend && npx tsx list-users.ts`
3. Bob should now appear in the database!

## Alternative: Create RLS Policy for Inserts

If you want to keep RLS enabled but allow inserts:

```sql
-- Allow anyone to insert (for registration)
CREATE POLICY "Allow public registration" ON users
  FOR INSERT
  WITH CHECK (true);
```

## Check Backend Logs

When you register Bob, check the backend terminal. You should see:

**Before fix (mock user):**
```
💾 [REGISTER] Inserting user into database...
⚠️  Dev mode: Creating mock user due to database restrictions
```

**After fix (real insert):**
```
💾 [REGISTER] Inserting user into database...
✅ [REGISTER] User inserted successfully: <uuid>
```

## Important Note

**⚠️ Only disable RLS in development!** Re-enable it before production:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

