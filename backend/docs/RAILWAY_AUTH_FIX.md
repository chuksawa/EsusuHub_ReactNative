# Fix Railway CLI Authentication

If you're getting "Unauthorized. Please login with `railway login`", here's how to fix it.

**Common Issue:** Browser shows "Authentication successful" but CLI still says "Unauthorized" - see [RAILWAY_BROWSER_AUTH_FIX.md](./RAILWAY_BROWSER_AUTH_FIX.md) for this specific problem.

## The Problem

Railway CLI v4.12.0 has authentication issues:
- Browser login with pairing codes expires quickly
- Token authentication may not work directly with `railway login --token`

## Solution 1: Use Railway Token (Most Reliable)

### Step 1: Get Your Token

1. Go to [railway.app](https://railway.app)
2. Sign in
3. Click your profile (top right) → **Account Settings**
4. Go to **Tokens** section
5. Click **"New Token"** or **"Create Token"**
6. Name it (e.g., "Local Deploy")
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Set Token as Environment Variable

**PowerShell (Current Session):**
```powershell
$env:RAILWAY_TOKEN="your-token-here"
```

**Verify it's set:**
```powershell
echo $env:RAILWAY_TOKEN
```

**Make it Permanent (Optional):**
```powershell
[System.Environment]::SetEnvironmentVariable("RAILWAY_TOKEN", "your-token-here", "User")
# Restart terminal for changes to take effect
```

### Step 3: Verify Authentication

```powershell
railway whoami
```

**If it still says "Unauthorized":**
- Railway CLI v4.12.0 may not automatically use `RAILWAY_TOKEN`
- Try Solution 2 (Browser Login) instead
- Or use Railway Dashboard (Solution 3)

## Solution 2: Browser Login (Quick Method)

**Important:** You must be FAST with pairing codes!

```powershell
railway login --browserless
```

**Steps:**
1. Run the command
2. **IMMEDIATELY** copy the URL and pairing code
3. Open the URL in your browser **right away**
4. Enter the pairing code **immediately** (they expire in seconds!)
5. Complete authentication

**If it fails:**
- Pairing codes expire very quickly
- Try again and be faster
- Or use Solution 1 (Token) or Solution 3 (Dashboard)

## Solution 3: Use Railway Dashboard (No CLI Needed)

If CLI authentication keeps failing, deploy via web dashboard:

1. **Go to Railway Dashboard:**
   - [railway.app](https://railway.app)
   - Sign in

2. **Create Project:**
   - Click **"New Project"**
   - Select **"Empty Project"**

3. **Add Service:**
   - Click **"+ New"** → **"Empty Service"**

4. **Configure:**
   - **Settings** → **Source** → Set root directory: `backend`
   - Railway will detect Dockerfile automatically

5. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add all required variables

6. **Deploy:**
   - Railway will build and deploy automatically
   - Or click **"Deploy"** to trigger manually

**No CLI authentication needed!**

## Solution 4: Update Railway CLI

Try updating to the latest version:

```powershell
npm uninstall -g @railway/cli
npm install -g @railway/cli@latest
railway login
```

## Verify Authentication Works

After authenticating, verify:

```powershell
railway whoami
```

Should show your Railway username/email.

## If Nothing Works

**Use Railway Dashboard:**
- No CLI needed
- No authentication issues
- Works immediately
- See [RAILWAY_SIMPLE_DEPLOY.md](./RAILWAY_SIMPLE_DEPLOY.md) Method 3

## Quick Reference

**Get Token:**
- Railway Dashboard → Account Settings → Tokens → New Token

**Set Token:**
```powershell
$env:RAILWAY_TOKEN="your-token"
```

**Verify:**
```powershell
railway whoami
```

**If still fails:**
- Use Railway Dashboard (web UI)
- No CLI authentication needed

## Next Steps After Authentication

Once authenticated:

```powershell
cd backend
railway init
railway up
```

Or use the deploy script:
```powershell
.\deploy.ps1
```

