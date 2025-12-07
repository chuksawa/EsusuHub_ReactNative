# Check Bob's Registration

## Issue
Bob's registration appeared successful, but no record found in database.

## Possible Causes

### 1. Mock User Created (Most Likely)
The backend has fallback logic that creates a **mock user** if:
- Database insert times out (>5 seconds)
- Supabase RLS (Row Level Security) blocks the insert
- Database permission errors

**Check backend logs for:**
- `⚠️  Dev mode: Creating mock user due to database restrictions`
- `_devNote: 'Mock user created - database insert blocked by Supabase RLS'`
- `_devNote: 'Mock user created - database insert timeout'`

### 2. Database Insert Actually Succeeded
Check if Bob is in the database with a different query or check recent logs.

## Check Backend Logs

Look at the backend terminal when Bob registered. You should see one of:

**If real insert:**
```
💾 [REGISTER] Inserting user into database...
✅ [REGISTER] User inserted successfully: <user-id>
```

**If mock user:**
```
💾 [REGISTER] Inserting user into database...
⚠️  Dev mode: Creating mock user due to database restrictions
```

## Check Database

Run:
```powershell
cd backend
npx tsx list-users.ts
```

This will show all users in the database.

## Solution: Fix RLS or Use Supabase Auth

If RLS is blocking inserts, we have two options:

### Option 1: Disable RLS for inserts (Development Only)
In Supabase SQL Editor:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Option 2: Use Supabase Auth API
Instead of direct database inserts, use Supabase's authentication API which handles RLS automatically.

## Next Steps

1. Check backend logs to see what happened
2. Run `list-users.ts` to check database
3. If mock user was created, we need to fix RLS or use Supabase Auth

