# Fix RLS to Allow User Registration

## Problem
Bob's registration created a mock user instead of inserting into the database because Supabase RLS (Row Level Security) is blocking direct inserts.

## Solution Options

### Option 1: Disable RLS for Development (Quick Fix)

In Supabase SQL Editor, run:
```sql
-- Temporarily disable RLS for users table (development only!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** Only do this in development! Re-enable RLS before production.

### Option 2: Create RLS Policy to Allow Inserts

In Supabase SQL Editor:
```sql
-- Allow anyone to insert into users table (for registration)
CREATE POLICY "Allow public registration" ON users
  FOR INSERT
  WITH CHECK (true);
```

### Option 3: Use Service Role Key (Recommended for Backend)

Update `.env` to use Supabase service role key instead of anon key:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Then modify the backend to use service role for inserts (bypasses RLS).

## Check What Happened

Look at your backend terminal logs when Bob registered. You should see one of:

**If RLS blocked:**
```
💾 [REGISTER] Inserting user into database...
⚠️  Dev mode: Creating mock user due to database restrictions
Database insert failed - Supabase RLS or schema issue: new row violates row-level security
```

**If timeout:**
```
💾 [REGISTER] Inserting user into database...
Database insert timeout - using dev mode workaround
```

## Recommended: Disable RLS for Development

For now, the quickest fix is to disable RLS in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Run:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```
3. Try registering Bob again
4. Check database: `npx tsx list-users.ts`

## After Fixing

Once RLS is disabled or policy is created:
1. Try registering Bob again
2. Check database to confirm Bob is there
3. Bob should be able to login

