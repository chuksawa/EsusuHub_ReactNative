# Railway Start Command

## Correct Start Command

In Railway Dashboard → Your Service → Settings → **Start Command**, use:

```
npm start
```

**OR** (if Railway doesn't recognize npm):

```
node dist/server.js
```

## Why?

- Your `package.json` has: `"start": "node dist/server.js"`
- Your `Dockerfile` uses: `CMD ["node", "dist/server.js"]`
- Both are equivalent, but `npm start` is preferred

## What NOT to Use

❌ `npm run start:backend` - This script doesn't exist
❌ `npm run dev` - This is for development only
❌ `tsx watch src/server.ts` - This won't work in production (no TypeScript source)

## If Railway is Using Docker

If Railway is building from your Dockerfile (which it should), the start command in the Dockerfile (`CMD ["node", "dist/server.js"]`) will be used automatically, and you might not need to set a custom start command at all.

**Check:**
- Settings → Source → Is Dockerfile detected?
- If yes, you can leave Start Command empty or use `npm start`

## Troubleshooting

**"Command not found: npm"**
- Use: `node dist/server.js` instead

**"Cannot find module 'dist/server.js'"**
- Build failed - check Deployments tab
- Ensure TypeScript compiled successfully

**"Port already in use"**
- Railway sets PORT automatically
- Your code should use: `process.env.PORT || 5166`

