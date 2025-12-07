# Azure DevOps Agent Pool Setup

## Good News: No Setup Required!

The pipeline I created (`azure-pipelines.yml`) uses **Microsoft-hosted agents** by default, which means:

✅ **No agent pool setup needed**  
✅ **No infrastructure to manage**  
✅ **Works immediately** - just create the pipeline!

The line `vmImage: 'ubuntu-latest'` automatically uses Microsoft's hosted Ubuntu agents.

## Understanding Agent Pools

### Microsoft-Hosted Agents (Default - Recommended)

**What it is:**
- Pre-configured virtual machines provided by Microsoft
- Automatically available in all Azure DevOps organizations
- No setup or maintenance required
- Free for public projects, included in paid plans

**When to use:**
- ✅ Most projects (including yours)
- ✅ When you want zero infrastructure management
- ✅ For standard builds and deployments

**How it works:**
```yaml
pool:
  vmImage: 'ubuntu-latest'  # Uses Microsoft-hosted agent automatically
```

### Self-Hosted Agents (Optional)

**What it is:**
- Agents you install and run on your own machines
- More control over environment
- Can be cheaper for high usage
- Requires setup and maintenance

**When to use:**
- When you need specific software/tools not available on Microsoft agents
- When you have high build volume (cost savings)
- When you need to access on-premises resources

## Your Current Pipeline (No Changes Needed)

Your `azure-pipelines.yml` is already configured correctly:

```yaml
pool:
  vmImage: 'ubuntu-latest'  # ✅ This uses Microsoft-hosted agents - no setup needed!
```

**This will work immediately** when you create the pipeline in Azure DevOps!

## Creating Your Pipeline (Step-by-Step)

### Step 1: Create Pipeline in Azure DevOps

1. Go to your Azure DevOps project
2. Navigate to **Pipelines** → **Pipelines**
3. Click **"New pipeline"** or **"Create Pipeline"**

### Step 2: Select Repository

1. Choose **"Azure Repos Git"** (your Azure DevOps repo)
2. Select your repository
3. Select the branch (usually `main` or `master`)

### Step 3: Configure Pipeline

1. Choose **"Existing Azure Pipelines YAML file"**
2. Select the path: `backend/azure-pipelines.yml`
3. Click **"Continue"**

### Step 4: Review Pipeline

You'll see the pipeline YAML. It should look like:

```yaml
trigger:
  branches:
    include:
      - main
      - master
      - develop

pool:
  vmImage: 'ubuntu-latest'  # ← Uses Microsoft-hosted agent

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
  # ... rest of pipeline
```

### Step 5: Add Pipeline Variables

Before running, add the Railway token:

1. Click **"Variables"** (top right of pipeline editor)
2. Click **"New variable"**
3. Add:
   - **Name:** `RAILWAY_TOKEN`
   - **Value:** Your Railway token (get from Railway Dashboard → Project → Settings → Tokens)
   - **☑️ Keep this value secret** (important!)
4. Click **"Save"**

### Step 6: Run Pipeline

1. Click **"Save"** to save the pipeline
2. Click **"Run"** to test it
3. The pipeline will:
   - Use Microsoft-hosted Ubuntu agent (automatic)
   - Install Node.js 18
   - Install Railway CLI
   - Build your TypeScript code
   - Deploy to Railway

## If You Still Want Self-Hosted Agents

If you have specific requirements for self-hosted agents, here's how to set them up:

### Option A: Azure VM Agent

1. **Create Azure VM**
   - Go to Azure Portal
   - Create a new VM (Ubuntu 20.04 or 22.04)
   - Size: Standard_B2s or larger
   - Allow SSH access

2. **Install Agent on VM**
   ```bash
   # SSH into your VM
   ssh your-vm-ip

   # Create agent directory
   mkdir myagent && cd myagent

   # Download agent
   wget https://vstsagentpackage.azureedge.net/agent/2.220.0/vsts-agent-linux-x64-2.220.0.tar.gz
   tar zxvf vsts-agent-linux-x64-2.220.0.tar.gz

   # Configure agent
   ./config.sh
   ```

3. **Configure in Azure DevOps**
   - Go to **Project Settings** → **Agent pools**
   - Click **"New agent pool"**
   - Name it (e.g., "Self-Hosted")
   - Add your VM as an agent

4. **Update Pipeline**
   ```yaml
   pool:
     name: Self-Hosted  # Use your pool name
     # Or use vmImage for Microsoft-hosted
   ```

### Option B: Local Machine Agent

1. **Install Agent on Your Machine**
   - Download agent from Azure DevOps
   - Go to **Project Settings** → **Agent pools** → **Default**
   - Click **"New agent"**
   - Follow download and setup instructions

2. **Run Agent**
   ```bash
   # Windows
   .\run.cmd

   # Linux/Mac
   ./run.sh
   ```

## Troubleshooting

### "No agent available"

**If using Microsoft-hosted agents:**
- This shouldn't happen - they're always available
- Check if your organization has pipeline limits
- Verify you're using `vmImage: 'ubuntu-latest'`

**If using self-hosted agents:**
- Ensure agent is running: `./run.sh` or `.\run.cmd`
- Check agent is online in Azure DevOps → Agent pools
- Verify agent has required capabilities

### "Agent pool not found"

- Make sure you're using the correct pool name
- For Microsoft-hosted, use `vmImage` instead of `name`
- Check pool exists in Project Settings → Agent pools

### "Pipeline fails to start"

- Check your Azure DevOps organization has pipeline permissions
- Verify you have "Queue builds" permission
- Check if there are organization-level restrictions

## Recommended Setup for Your Project

**Use Microsoft-hosted agents** (current setup):

✅ **Pros:**
- Zero setup
- Always available
- Pre-configured with common tools
- No maintenance
- Secure and isolated

✅ **Your pipeline works immediately**

❌ **Cons:**
- Limited customization
- Build time counts against quotas (usually fine)

**This is the best choice for most projects, including yours!**

## Next Steps

1. ✅ Your pipeline is already configured correctly
2. ✅ Just create it in Azure DevOps (no agent setup needed)
3. ✅ Add `RAILWAY_TOKEN` as a pipeline variable
4. ✅ Run and deploy!

See `AZURE_DEVOPS_RAILWAY.md` for complete deployment guide.

