# Quick Start Guide

## ✅ Setup Complete!

Your backend API is now configured and ready to use.

## Database Connection

✅ **Connected to Supabase**
- PostgreSQL 17.6
- 15 tables found
- Seeded test data available

## Server Status

The server runs on: **http://localhost:5166**

### Health Check
```bash
curl http://localhost:5166/health
```

## Available Endpoints

### Base URL
- Development: `http://localhost:5166/api`
- Production: Update `API_BASE_URL` in `.env`

### Quick Test Endpoints

1. **Health Check**
   ```
   GET http://localhost:5166/health
   ```

2. **Register User**
   ```
   POST http://localhost:5166/api/auth/register
   Body: {
     "email": "test@example.com",
     "phone": "+2341234567890",
     "password": "password123",
     "fullName": "Test User",
     "handle": "testuser"
   }
   ```

3. **Login**
   ```
   POST http://localhost:5166/api/auth/login
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Testing Database Connection

Test your database connection anytime:
```bash
npx tsx test-connection.ts
```

## Next Steps

1. ✅ Database connected
2. ✅ Server configured
3. 🔄 Test API endpoints
4. 🔄 Connect React Native app
5. 🔄 Deploy to production

## Troubleshooting

### Server won't start
- Check if port 5166 is available
- Verify `.env` file has correct `DATABASE_URL`
- Check database connection with `npx tsx test-connection.ts`

### Database connection errors
- Verify Supabase project is active
- Check connection string in `.env`
- Ensure SSL is enabled (automatic for Supabase)

### API errors
- Check server logs
- Verify JWT secrets are set in `.env`
- Ensure all required environment variables are set

## Seeded Test Data

Your database has test data with these IDs:
- Savings Group: `27c27b6e-72f9-46bd-83d4-09228bf08a4b`
- Group Membership: `73391402-613f-4a22-a9c0-019f5f8d5bd3`
- Payment Account: `b704e86a-05b5-4f13-81c2-7772b0f56410`
- Contribution: `a0c5f69d-eb8b-44ec-8201-b70a9747fbef`
- Notification: `48d0180d-978f-40e2-a98f-c20dec75a22f`

You can use these IDs to test API endpoints.

## Documentation

- [API Endpoints Reference](./API_ENDPOINTS.md) - Complete API documentation
- [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration details
- [README](./README.md) - Full setup guide

