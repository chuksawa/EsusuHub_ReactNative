# Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
API_BASE_URL=http://localhost:5166/api

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Supabase Configuration (if used)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Environment
NODE_ENV=development

# Push Notifications (if using FCM)
FCM_SERVER_KEY=your_fcm_server_key

# Deep Linking
DEEP_LINK_SCHEME=esusuhub
UNIVERSAL_LINK_DOMAIN=esusuhub.com
```

## Production Environment

For production, update the values:

```env
API_BASE_URL=https://api.esusuhub.com/api
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
NODE_ENV=production
```

## Security Notes

- Never commit `.env` file to version control
- Use environment variables in CI/CD
- Rotate keys regularly
- Use different keys for dev/staging/production

