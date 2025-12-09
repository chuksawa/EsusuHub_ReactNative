# Azure App Service Plan Naming Rules

## Plan Name Requirements

- ❌ **No spaces** allowed
- ❌ **No special characters** (except hyphens and underscores)
- ✅ **Alphanumeric** and hyphens/underscores only
- ✅ **3-40 characters** long

## Valid Plan Names

✅ **Good:**
- `BasicB1`
- `B1`
- `esusuhub-plan-b1`
- `EsusuHub_Plan_B1`
- `plan-basic-b1`

❌ **Bad:**
- `Basic B1` (has space)
- `Basic-B1` (might work, but avoid)
- `Basic/B1` (has slash)
- `Basic.B1` (has period)

## When Creating/Upgrading Plan

### Option 1: Use Default Name

Azure will suggest a name like:
- `EsusuHub-Plan-B1`
- Or similar auto-generated name

**Just accept the default** - it will work!

### Option 2: Custom Name

If you want to name it yourself:
- **Use:** `BasicB1` or `B1` or `esusuhub-b1`
- **Avoid:** Spaces, special characters

## Quick Upgrade Steps

1. **Overview** → Click your **App Service plan name**
2. **Scale up (App Service plan)**
3. **Select pricing tier:** Basic B1
4. **Plan name:** Use default or `BasicB1` (no spaces!)
5. **Click "Apply"**
6. **Wait 5-10 minutes**

## After Upgrade

1. **Configuration** → **General settings**
2. **Stack:** Change to **"Docker"**
3. **Save**
4. **Deployment Center** → **Settings** → **Docker Container**

## Summary

- **Plan name:** No spaces! Use `BasicB1` or default
- **Tier:** Basic B1 (the pricing tier, not the name)
- **After upgrade:** Change Stack to Docker

