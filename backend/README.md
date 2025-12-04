# EsusuHub Backend API

Backend API server for the EsusuHub React Native application.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **User Management**: User profiles, settings, and search
- **Savings Groups**: Create, manage, and join Esusu savings groups
- **Payments**: Process contributions and track payment history
- **Notifications**: Real-time notifications system
- **Banking**: Bank account management and transactions

## Tech Stack

- **Node.js** with **Express**
- **TypeScript** for type safety
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 12 (or Supabase account)
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - Database connection details (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for Supabase)
   - JWT secrets
   - API base URL
   - CORS origin

3. **Set up the database:**
   
   **Option A: Local PostgreSQL**
   - Create a PostgreSQL database
   - Run the schema from `../database-schema.sql`:
     ```bash
     psql -U postgres -d esusuhub -f ../database-schema.sql
     ```
   
   **Option B: Supabase (Recommended)**
   - The database schema has already been set up in Supabase
   - RLS policies, indexes, and test data have been configured
   - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for connection details

4. **Create uploads directory:**
   ```bash
   mkdir -p uploads/avatars
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5166`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/me/avatar` - Upload avatar
- `GET /api/users/me/achievements` - Get user achievements
- `GET /api/users/me/transactions` - Get user transactions
- `GET /api/users/search?q=query` - Search users

### Groups
- `GET /api/groups` - Get all groups (with optional filtering)
- `GET /api/groups/my-groups` - Get user's groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create new group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `GET /api/groups/:id/members` - Get group members
- `GET /api/groups/:id/activity` - Get group activity
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group
- `GET /api/groups/configuration` - Get group configuration

### Payments
- `GET /api/payments/methods` - Get payment methods
- `GET /api/payments/accounts` - Get payment accounts
- `POST /api/payments` - Process payment/contribution
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment by ID

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings` - Update notification settings

### Banking
- `GET /api/banking/accounts` - Get bank accounts
- `GET /api/banking/accounts/:id` - Get bank account by ID
- `POST /api/banking/accounts/apply` - Apply for bank account
- `GET /api/banking/accounts/applications` - Get account applications
- `GET /api/banking/transactions` - Get transactions
- `POST /api/banking/transactions/deposit` - Create deposit
- `POST /api/banking/transactions/withdraw` - Create withdrawal

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route handlers
│   ├── utils/            # Utility functions
│   └── server.ts         # Main server file
├── dist/                 # Compiled JavaScript (generated)
├── uploads/              # Uploaded files
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers

## Environment Variables

See `.env.example` for all available environment variables.

## Database

The database schema is defined in `../database-schema.sql`. Make sure to run this before starting the server.

## Notes

- Payment processing is currently simulated. In production, integrate with a payment gateway.
- Email verification and password reset require email service configuration.
- File uploads are stored locally. For production, use cloud storage (S3, etc.).

## License

ISC

