# Fix: Agent Version Error

## The Problem

You're seeing this error:
```
No agent found in pool Default which satisfies the specified demands: Agent.Version -gtVersion 2.182.1
```

This means:
- Your pipeline is trying to use the "Default" agent pool (self-hosted)
- Either no agent is set up, or the agent version is too old

## Solution 1: Use Microsoft-Hosted Agents (Recommended)

If you haven't set up a self-hosted agent, switch back to Microsoft-hosted:

### Update Your Pipeline

Make sure your `azure-pipelines.yml` uses:

```yaml
pool:
  vmImage: 'ubuntu-latest'  # Microsoft-hosted
```

**NOT:**
```yaml
pool:
  name: Default  # This is for self-hosted agents
```

### Request Parallelism Grant

If you get parallelism error with Microsoft-hosted:
1. Request free grant: https://aka.ms/azpipelines-parallelism-request
2. Wait 24-48 hours for approval
3. Pipeline will work automatically after approval

## Solution 2: Set Up Self-Hosted Agent

If you want to use self-hosted agents (no parallelism grant needed):

### Step 1: Download Agent

1. Go to Azure DevOps → **Project Settings** → **Agent pools**
2. Click **"Default"** (or create a new pool)
3. Click **"New agent"**
4. Select your OS:
   - **Windows**: Download and extract ZIP
   - **Linux/Mac**: Download and extract tar.gz

### Step 2: Configure Agent

**Windows:**
```powershell
# Extract the agent files
# Navigate to agent directory
cd agent

# Run configuration
.\config.cmd

# When prompted:
# - Server URL: https://dev.azure.com/YourOrgName
# - Authentication: PAT (Personal Access Token)
#   - Create PAT: User Settings → Personal Access Tokens → New Token
#   - Scopes: Agent Pools (Read & manage)
# - Agent pool: Default
# - Agent name: (choose a name, e.g., "MyAgent")
# - Work folder: (press Enter for default)
# - Run as service: Y (recommended)
```

**Linux/Mac:**
```bash
# Extract the agent files
tar -xzf vsts-agent-*.tar.gz
cd vsts-agent-*

# Run configuration
./config.sh

# Follow prompts (similar to Windows)
```

### Step 3: Run Agent

**If running as service (Windows):**
```powershell
# Agent runs automatically as Windows service
# Check status:
Get-Service vstsagent*
```

**If running manually:**
```powershell
# Windows
.\run.cmd

# Linux/Mac
./run.sh
```

### Step 4: Update Agent (If Version Too Old)

If your agent version is too old:

1. **Stop the agent:**
   ```powershell
   # Windows service
   Stop-Service vstsagent*
   
   # Or if running manually, press Ctrl+C
   ```

2. **Download latest agent:**
   - Go to Azure DevOps → Agent pools → Default → New agent
   - Download latest version

3. **Replace agent files:**
   - Backup your `config.json` file
   - Extract new agent files
   - Copy your `config.json` back
   - Run agent again

4. **Or reconfigure:**
   ```powershell
   # Remove old config
   .\config.cmd remove
   
   # Configure with new agent
   .\config.cmd
   ```

### Step 5: Verify Agent

1. Go to Azure DevOps → **Project Settings** → **Agent pools** → **Default**
2. You should see your agent listed
3. Status should be "Online" (green)
4. Version should be 2.182.1 or higher

## Solution 3: Remove Version Requirement

If you have an agent but version check is failing, you can make the pipeline more flexible:

Update your pipeline to not require specific version:

```yaml
pool:
  name: Default
  demands: []  # No specific demands - accepts any agent
```

Or specify minimum capabilities instead:

```yaml
pool:
  name: Default
  demands:
    - Agent.OS -equals Linux  # or Windows, macOS
```

## Quick Fix: Switch to Microsoft-Hosted

**Easiest solution** - just use Microsoft-hosted agents:

1. **Update `azure-pipelines.yml`:**
   ```yaml
   pool:
     vmImage: 'ubuntu-latest'  # Microsoft-hosted
   ```

2. **Request parallelism grant:**
   - https://aka.ms/azpipelines-parallelism-request
   - Takes 24-48 hours

3. **Deploy manually while waiting:**
   - Use Railway Dashboard
   - Or deploy from local machine with Railway CLI

## Check Your Current Pipeline

Look at your `azure-pipelines.yml`:

**✅ Correct (Microsoft-hosted):**
```yaml
pool:
  vmImage: 'ubuntu-latest'
```

**❌ Wrong (if no self-hosted agent):**
```yaml
pool:
  name: Default
```

## Recommended Approach

**For most users:**
1. ✅ Use Microsoft-hosted agents (`vmImage: 'ubuntu-latest'`)
2. ✅ Request free parallelism grant
3. ✅ Deploy manually via Railway Dashboard while waiting
4. ✅ Once grant approved, pipeline works automatically

**Only use self-hosted if:**
- You need specific software/tools
- You have high build volume
- You want to avoid parallelism limits

## Troubleshooting

### "Agent pool not found"
- Check pool name is correct
- Verify pool exists in Project Settings → Agent pools

### "Agent offline"
- Check agent is running: `.\run.cmd` or service status
- Verify network connectivity
- Check agent logs in `_diag` folder

### "Version too old"
- Download latest agent from Azure DevOps
- Reconfigure with new agent files
- Or remove version requirement from pipeline

## Summary

**If you see this error:**
1. Check if you're using `pool: name: Default` (self-hosted)
2. Either set up a self-hosted agent OR switch to Microsoft-hosted
3. For Microsoft-hosted, request parallelism grant
4. For self-hosted, download and configure agent

**Quickest fix:** Use Microsoft-hosted and request the free grant!

