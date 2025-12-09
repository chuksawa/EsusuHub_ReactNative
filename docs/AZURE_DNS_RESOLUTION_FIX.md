# Fix DNS Resolution Error (ENOTFOUND)

## Error
```
getaddrinfo ENOTFOUND db.tsfvtkvkejjbxjuiixgx.supabase.co
```

This means Azure App Service cannot resolve the Supabase hostname.

## Solution 1: Verify Correct Supabase Hostname

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project

2. **Get Connection String:**
   - **Settings** → **Database**
   - Under **Connection string**, select **Transaction** mode
   - Copy the connection string
   - **Verify the hostname** - it should be: `db.[PROJECT-REF].supabase.co`

3. **Check if hostname matches:**
   - Your current: `db.tsfvtkvkejjbxjuiixgx.supabase.co`
   - Supabase shows: `db.?????.supabase.co`
   - **They must match exactly!**

## Solution 2: Use Connection Pooling URL (Recommended)

Supabase provides a **Connection Pooling** URL that might work better:

1. **Supabase Dashboard** → **Settings** → **Database**
2. **Connection string** → Select **"Session" mode** (for connection pooling)
3. **Copy the connection string**
4. **Update DATABASE_URL in Azure:**
   - Azure Portal → Your App → **Configuration** → **Application settings**
   - Update `DATABASE_URL` with the connection pooling URL
   - Should look like: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`

**Note:** Connection pooling uses port `6543` instead of `5432`.

## Solution 3: Check Azure Networking

1. **Azure Portal** → Your App Service
2. **Networking** (left menu)
3. **Check:**
   - **Outbound traffic** - should allow all
   - **VNet integration** - if enabled, might block external DNS
   - **Access restrictions** - shouldn't affect outbound

## Solution 4: Use IP Address (Temporary Workaround)

If DNS continues to fail, you can try using the IP address:

1. **Find Supabase IP:**
   ```powershell
   nslookup db.tsfvtkvkejjbxjuiixgx.supabase.co
   ```

2. **Update DATABASE_URL:**
   ```
   postgresql://postgres:sieQK72VRwSbZEiJ@[IP_ADDRESS]:5432/postgres?sslmode=require
   ```

**Note:** IP addresses can change, so this is temporary.

## Solution 5: Check Azure App Service Plan

Some App Service plans have networking restrictions:

1. **Overview** → Check your **App Service plan**
2. **If Free tier:** Upgrade to Basic (B1) or higher
3. **Free tier** may have DNS/networking limitations

## Quick Test: Verify Hostname

Test if the hostname resolves from your local machine:

```powershell
nslookup db.tsfvtkvkejjbxjuiixgx.supabase.co
```

If it resolves locally but not from Azure, it's an Azure networking issue.

## Recommended Fix

**Try Solution 2 first** (Connection Pooling URL):
- More reliable
- Better for production
- Handles connections better

## After Fixing

1. **Restart the app:**
   - Azure Portal → **Overview** → **Restart**

2. **Test again:**
   ```powershell
   Invoke-WebRequest -Uri "https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"Test123!","phone":"1234567890","fullName":"Test User"}'
   ```

3. **Check Log Stream** for successful connection

