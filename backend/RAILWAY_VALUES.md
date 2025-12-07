# Railway Deployment Values

**Save this file - you'll need these values in Railway Dashboard!**

## Environment Variables for Railway

Copy these into Railway Dashboard → Your Service → Variables:

```
NODE_ENV=production
```

```
PORT=5166
```

```
DATABASE_URL=postgresql://postgres:sieQK72VRwSbZEiJ@db.tsfvtkvkejjbxjuiixgx.supabase.co:5432/postgres?sslmode=require
```
*(Get the full URL from `backend/.env` file - replace YOUR_PASSWORD with actual password)*

```
JWT_SECRET=ede315d278c155c2f594397365395d1d1b36fc70ff2ce50c3b03cc67b60fe169a9c68d44cd3fd16b858b4a753adedba204eaf102700694de0fb678883d91474d
```

```
JWT_REFRESH_SECRET=5f836eeeefdd17d622eaa0c1c2a3b19944b6d6bef8daf0c7b0813b361f8b45bf0211038291354854d7457a0c4214a381fbb113917ade191b8ec01c86203b9d28
```

```
CORS_ORIGIN=*
```
*(Or specific: https://your-frontend.com,http://localhost:3000)*

## Next Steps

1. Go to https://railway.app
2. Create new project
3. Add service
4. Set root directory: `backend`
5. Add all variables above
6. Railway will auto-deploy!

See `backend/docs/DASHBOARD_DEPLOY_NOW.md` for detailed steps.

