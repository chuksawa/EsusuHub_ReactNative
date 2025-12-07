# Railway CLI Token Login (Recommended)

Token authentication is more reliable than pairing codes. Here's how to set it up:

## Step 1: Get Your Railway Token

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in to your account

2. **Navigate to Account Settings**
   - Click your profile icon (top right)
   - Select **"Account Settings"** or **"Developer Settings"**
   - Or go directly to: https://railway.app/account/tokens

3. **Create a New Token**
   - Click **"New Token"** or **"Create Token"**
   - Give it a name: `CLI Access` or `Local Development`
   - Click **"Create"**
   - **IMPORTANT**: Copy the token immediately - you won't see it again!

## Step 2: Set Token as Environment Variable

**Note:** Railway CLI v4.12.0 doesn't support `--token` flag. Use environment variable instead.

### Option A: Set Token for Current Session (Quick)

```powershell
# Set token as environment variable (PowerShell)
$env:RAILWAY_TOKEN="your-token-here"

# Verify it's set
echo $env:RAILWAY_TOKEN
```

### Option B: Permanent Environment Variable (Windows)

To make it persistent across sessions:

1. **Via System Settings:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to **Advanced** tab → **Environment Variables**
   - Under **User variables**, click **New**
   - Variable name: `RAILWAY_TOKEN`
   - Variable value: `your-token-here`
   - Click **OK**

2. **Or via PowerShell (Current User):**
   ```powershell
   [System.Environment]::SetEnvironmentVariable("RAILWAY_TOKEN", "your-token-here", "User")
   ```

3. **Restart your terminal** for changes to take effect

## Step 3: Verify Authentication

After setting the token, Railway CLI will use it automatically. Verify:

```powershell
# Check if you're authenticated
railway whoami

# Should show your Railway username/email
# If it works, you're authenticated!
```

**Note:** You don't need to run `railway login` when using `RAILWAY_TOKEN` environment variable - it's used automatically.

## Step 4: Initialize and Deploy

Once logged in:

```powershell
# Make sure you're in the backend directory
cd backend

# Initialize Railway project
railway init

# Follow the prompts:
# - Create new project or link to existing? (Choose based on your needs)
# - Project name: (Enter a name or press Enter for default)

# Set environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require"
railway variables set JWT_SECRET="your-secret-here"
railway variables set JWT_REFRESH_SECRET="your-refresh-secret-here"

# Deploy
railway up
```

## Troubleshooting Token Login

### "Invalid token"
- Make sure you copied the entire token (no spaces)
- Token might have expired - create a new one
- Check you're using the correct token format

### "Token not found"
- Verify the token is set: `echo $env:RAILWAY_TOKEN`
- Make sure you're in the same terminal session where you set it
- Try setting it again

### "Not authenticated"
- Run `railway login --token YOUR_TOKEN` again
- Or set the environment variable and verify with `railway whoami`

## Security Notes

- **Never commit tokens to Git** - add to `.gitignore`
- **Don't share tokens** - each developer should have their own
- **Rotate tokens regularly** - delete old ones and create new ones
- **Use different tokens** for different environments (dev, staging, prod)

## Alternative: Use Railway Dashboard

If CLI continues to have issues, you can deploy entirely via the Railway dashboard:

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Use "Empty Project" or "Deploy from Git" (if Azure DevOps is supported)
4. Configure everything via the web interface

See [AZURE_DEVOPS_RAILWAY.md](./AZURE_DEVOPS_RAILWAY.md) for dashboard deployment steps.

