# Fixed Configuration Issues

## Problems Found:
1. ✅ **Config was set to `localhost:5166`** - Changed to `10.0.2.2:5166` (standard Android emulator address)
2. ✅ **Server wasn't running** - Started the backend server

## What Changed:

### `src/config/env.ts`
Changed from:
```typescript
return 'http://localhost:5166/api';  // ❌ Won't work from emulator
```

To:
```typescript
return 'http://10.0.2.2:5166/api';  // ✅ Standard emulator address
```

## Next Steps:

1. **Reload the React Native app** to pick up the new config:
   - Press `R` twice in Metro bundler, or
   - Shake device → "Reload"

2. **Verify server is running:**
   - Check backend terminal for: `🚀 Server running on port 5166`
   - Or run: `netstat -ano | findstr :5166`

3. **Try registering Bob again**

## If `10.0.2.2` Still Doesn't Work:

Try your computer's IP instead. Update `src/config/env.ts` line 36:
```typescript
return 'http://10.0.0.187:5166/api';  // Your computer's IP
```

Then reload the app again.

