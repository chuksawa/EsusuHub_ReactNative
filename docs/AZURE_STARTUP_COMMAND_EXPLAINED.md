# Azure Startup Command - Where to Set It

## Important: You DON'T Run This Locally!

The startup command is a **configuration setting in Azure Portal**, not something you run in your terminal.

## What It Does

Azure App Service needs to know **how to start your Node.js server**. The startup command tells Azure what command to run when your app container starts.

## Where to Set It

### Step-by-Step:

1. **Go to Azure Portal:** https://portal.azure.com
2. **Open your Web App:** `esusuhub-backend`
3. **Left menu** → **Configuration**
4. **General settings** tab (should be selected by default)
5. **Scroll down** to find **"Startup Command"** field
6. **Enter:** `npm start` (or `node dist/server.js`)
7. **Click "Save"** (top of page)
8. **Restart** your Web App (Overview → Restart)

## Visual Guide

```
Azure Portal
  └─ Your Web App (esusuhub-backend)
      └─ Configuration (left menu)
          └─ General settings (tab)
              └─ Startup Command: [npm start]  ← Enter here
                  └─ Save button (top)
```

## What Happens

When Azure starts your app:
1. Container/app starts
2. Azure runs: `npm start` (or whatever you set)
3. This executes: `node dist/server.js` (from your package.json)
4. Your server starts

## Which Command to Use?

### If Using Docker Deployment:
- **Startup Command:** Leave **EMPTY**
- Dockerfile already has: `CMD ["node", "dist/server.js"]`
- Azure will use the Dockerfile command

### If Using Code Deployment (Oryx):
- **Startup Command:** `npm start`
- OR: `node dist/server.js`
- Azure needs to know how to start your app

## How to Check Your Deployment Type

1. **Deployment Center** → **Settings**
2. **Build provider:**
   - **"Docker Container"** = Docker deployment (leave startup command empty)
   - **"App Service build service"** = Code deployment (set startup command)

## Example Configuration

### Docker Deployment:
```
Configuration → General settings:
  Startup Command: [empty]
  
Deployment Center → Settings:
  Build provider: Docker Container
  Dockerfile path: backend/Dockerfile
```

### Code Deployment:
```
Configuration → General settings:
  Startup Command: npm start
  
Configuration → Application settings:
  SCM_REPOSITORY_PATH = backend
  POST_BUILD_COMMAND = npm run build
```

## Troubleshooting

**"Where do I run this command?"**
- ❌ NOT in your local terminal
- ✅ In Azure Portal → Configuration → General settings → Startup Command

**"Do I need to set this?"**
- If Docker: No (leave empty)
- If Code: Yes (set to `npm start`)

**"What if I don't set it?"**
- Docker: Will use Dockerfile CMD (should work)
- Code: App won't start (no command to run)

## Summary

- **Location:** Azure Portal → Your Web App → Configuration → General settings → Startup Command
- **Docker:** Leave empty
- **Code:** Set to `npm start`
- **You don't run it locally** - Azure runs it automatically

