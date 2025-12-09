# Migrating from Supabase to Azure SQL

## Important Decision: PostgreSQL vs SQL Server

Your current schema uses **PostgreSQL** features:
- `UUID` type with `uuid-ossp` extension
- `JSONB` type
- PostgreSQL-specific functions

You have **two options**:

### Option 1: Azure Database for PostgreSQL (Recommended) ✅

**Best fit** - Same database engine, minimal changes needed.

**Benefits:**
- ✅ Same PostgreSQL engine (no schema changes needed)
- ✅ Supports UUID, JSONB, all your current features
- ✅ Minimal code changes
- ✅ Same connection library (`pg`)
- ✅ Better performance (same region as App Service)

**Cost:** ~$25-50/month (Basic tier)

### Option 2: Azure SQL Database (SQL Server)

**Requires significant changes** - Different database engine.

**Benefits:**
- ✅ Native Azure integration
- ✅ Advanced security features
- ✅ Lower cost (~$5-15/month)

**Challenges:**
- ❌ Different SQL syntax
- ❌ No UUID extension (use `uniqueidentifier`)
- ❌ No JSONB (use `nvarchar(max)` with JSON functions)
- ❌ Schema migration required
- ❌ Code changes needed

## Recommended: Azure Database for PostgreSQL

Since your codebase is built for PostgreSQL, **Option 1 is strongly recommended**.

## Migration Steps: Azure Database for PostgreSQL

### Step 1: Create Azure Database for PostgreSQL

1. **Azure Portal** → **Create a resource**
2. **Search:** "Azure Database for PostgreSQL"
3. **Select:** "Flexible Server" (recommended)
4. **Fill in:**
   - **Server name:** `esusuhub-postgres` (must be globally unique)
   - **Resource group:** Same as your App Service
   - **Location:** Same region as App Service (Canada Central)
   - **PostgreSQL version:** 14 or 15
   - **Compute + storage:** Basic tier (1 vCore, 32GB storage) - ~$25/month
   - **Admin username:** `postgres` (or your choice)
   - **Password:** Create strong password (save it!)
5. **Networking:**
   - **Public access:** Allow (or configure VNet if needed)
   - **Firewall rules:** Add Azure services (check box)
   - **Add current client IP** (for initial setup)
6. **Review + Create** → **Create**

### Step 2: Configure Firewall

1. **Azure Portal** → Your PostgreSQL server
2. **Networking** → **Firewall rules**
3. **Add rule:**
   - **Rule name:** `AllowAzureServices`
   - **Start IP:** `0.0.0.0`
   - **End IP:** `0.0.0.0`
   - **Description:** Allow all Azure services
4. **Save**

### Step 3: Create Database

1. **Azure Portal** → Your PostgreSQL server
2. **Databases** → **Create**
3. **Database name:** `esusuhub`
4. **Create**

### Step 4: Run Schema Migration

**Option A: Using Azure Portal Query Editor**

1. **Azure Portal** → Your PostgreSQL server
2. **Query editor** (left menu)
3. **Login** with admin credentials
4. **Select database:** `esusuhub`
5. **Paste your schema** from `database-schema.sql`
6. **Run**

**Option B: Using psql from Local Machine**

```powershell
# Install PostgreSQL client tools if needed
# Or use Azure Cloud Shell (has psql pre-installed)

# Get connection string from Azure Portal
# Connection strings → PostgreSQL → Copy

psql "host=esusuhub-postgres.postgres.database.azure.com port=5432 dbname=esusuhub user=postgres@esusuhub-postgres sslmode=require"

# Then run:
\i database-schema.sql
```

**Option C: Using Azure CLI**

```powershell
# Install Azure CLI extension
az extension add --name db-up

# Create database and run schema
az postgres flexible-server db create \
  --resource-group EsusuHub-RG \
  --server-name esusuhub-postgres \
  --database-name esusuhub

# Then connect and run schema manually
```

### Step 5: Update Connection String

**Get connection string from Azure:**

1. **Azure Portal** → Your PostgreSQL server
2. **Connection strings** (left menu)
3. **Copy PostgreSQL connection string**
4. **Format:**
   ```
   postgresql://postgres@esusuhub-postgres:YOUR_PASSWORD@esusuhub-postgres.postgres.database.azure.com:5432/esusuhub?sslmode=require
   ```

**Update in Azure App Service:**

1. **Azure Portal** → Your App Service (`esusuhubappserver`)
2. **Configuration** → **Application settings**
3. **Update `DATABASE_URL`:**
   ```
   postgresql://postgres@esusuhub-postgres:YOUR_PASSWORD@esusuhub-postgres.postgres.database.azure.com:5432/esusuhub?sslmode=require
   ```
4. **Save**

### Step 6: Update Database Config (Optional)

Your `backend/src/config/database.ts` should work as-is, but you can update SSL config:

```typescript
// Azure Database for PostgreSQL requires SSL
ssl: process.env.DATABASE_URL?.includes('database.azure.com') || 
     process.env.DB_HOST?.includes('database.azure.com')
  ? { rejectUnauthorized: false }
  : undefined,
```

### Step 7: Test Connection

1. **Restart App Service:**
   - Azure Portal → **Overview** → **Restart**

2. **Check Log Stream:**
   - Should see: `✅ Database connected successfully`

3. **Test API:**
   ```powershell
   Invoke-WebRequest -Uri "https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"Test123!","phone":"1234567890","fullName":"Test User"}'
   ```

## Migration Checklist

- [ ] Create Azure Database for PostgreSQL
- [ ] Configure firewall rules
- [ ] Create database (`esusuhub`)
- [ ] Run schema migration (`database-schema.sql`)
- [ ] Update `DATABASE_URL` in App Service
- [ ] Restart App Service
- [ ] Test connection (check Log Stream)
- [ ] Test API endpoints
- [ ] Migrate existing data (if any)

## Cost Comparison

**Supabase:**
- Free tier available
- Paid: ~$25/month

**Azure Database for PostgreSQL:**
- Basic tier: ~$25-50/month
- Same region as App Service = better performance

## Benefits After Migration

✅ **No DNS issues** - Same Azure network
✅ **Better performance** - Same region
✅ **Simpler stack** - All Azure
✅ **Better monitoring** - Azure Monitor integration
✅ **Easier scaling** - Azure-native scaling
✅ **Better security** - Azure security features

## Next Steps

1. **Create Azure Database for PostgreSQL** (Step 1)
2. **Run schema migration** (Step 4)
3. **Update connection string** (Step 5)
4. **Test!**

This should resolve your DNS issues and give you better performance! 🎉

