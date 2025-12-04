# EsusuHub API Endpoints Reference

Complete list of all API endpoints available in the EsusuHub backend.

## Base URL
- Development: `http://localhost:5166/api`
- Production: `https://api.esusuhub.com/api`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "phone": "+2341234567890",
    "password": "password123",
    "fullName": "John Doe",
    "handle": "johndoe"
  }
  ```
- **Response:** User object with access and refresh tokens

### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** User object with access and refresh tokens

### Refresh Token
- **POST** `/api/auth/refresh-token`
- **Body:**
  ```json
  {
    "refreshToken": "refresh_token_here"
  }
  ```
- **Response:** New access and refresh tokens

### Get Current User
- **GET** `/api/auth/me`
- **Response:** Complete user profile

### Logout
- **POST** `/api/auth/logout`
- **Response:** Success message

### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

### Reset Password
- **POST** `/api/auth/reset-password`
- **Body:**
  ```json
  {
    "token": "reset_token",
    "password": "newpassword123"
  }
  ```

### Verify Email
- **POST** `/api/auth/verify-email`
- **Body:**
  ```json
  {
    "token": "verification_token"
  }
  ```

### Resend Verification
- **POST** `/api/auth/resend-verification`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

---

## User Endpoints

### Get User Profile
- **GET** `/api/users/me`
- **Response:** Complete user profile with extended information

### Update User Profile
- **PUT** `/api/users/me`
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "handle": "johndoe",
    "phone": "+2341234567890",
    "dateOfBirth": "1990-01-01",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "occupation": "Software Developer",
    "monthlyIncome": 500000,
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+2341234567891",
      "relationship": "Spouse"
    },
    "preferredLanguage": "en",
    "notificationPreferences": {
      "email": true,
      "sms": true,
      "push": true
    }
  }
  ```

### Upload Avatar
- **POST** `/api/users/me/avatar`
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with `file` field
- **Response:**
  ```json
  {
    "avatarUrl": "/uploads/avatars/avatar-1234567890.jpg"
  }
  ```

### Get User Achievements
- **GET** `/api/users/me/achievements`
- **Response:** Array of achievements

### Get User Transactions
- **GET** `/api/users/me/transactions?page=1&pageSize=10`
- **Response:** Paginated list of transactions

### Search Users
- **GET** `/api/users/search?q=john`
- **Response:** Array of matching users

---

## Groups Endpoints

### Get All Groups
- **GET** `/api/groups?myGroupsOnly=true&page=1&pageSize=20`
- **Query Parameters:**
  - `myGroupsOnly` (boolean): Filter to user's groups only
  - `page` (number): Page number
  - `pageSize` (number): Items per page

### Get My Groups
- **GET** `/api/groups/my-groups`
- **Response:** Array of groups user is a member of

### Get Group by ID
- **GET** `/api/groups/:id`
- **Response:** Complete group details

### Create Group
- **POST** `/api/groups`
- **Body:**
  ```json
  {
    "name": "Family Savings",
    "description": "Monthly family contribution",
    "monthlyContribution": 50000,
    "totalMembers": 12,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "payoutOrder": "fixed",
    "penaltyFee": 2500,
    "groupImageUrl": "https://example.com/image.jpg",
    "rules": "No late payments allowed"
  }
  ```

### Update Group
- **PUT** `/api/groups/:id`
- **Body:** Same as create (all fields optional)

### Delete Group
- **DELETE** `/api/groups/:id`
- **Note:** Only group admin can delete

### Get Group Members
- **GET** `/api/groups/:id/members`
- **Response:** Array of group members

### Get Group Activity
- **GET** `/api/groups/:id/activity`
- **Response:** Array of contributions and payouts

### Join Group
- **POST** `/api/groups/:id/join`
- **Response:** Success message

### Leave Group
- **POST** `/api/groups/:id/leave`
- **Response:** Success message

### Get Group Configuration
- **GET** `/api/groups/configuration`
- **Response:** System configuration for groups

---

## Payments Endpoints

### Get Payment Methods
- **GET** `/api/payments/methods`
- **Response:** Array of available payment methods

### Get Payment Accounts
- **GET** `/api/payments/accounts`
- **Response:** Array of user's payment accounts

### Process Payment
- **POST** `/api/payments`
- **Body:**
  ```json
  {
    "groupId": "uuid-here",
    "amount": 50000,
    "paymentMethod": "bank",
    "paymentAccountId": "uuid-here",
    "dueDate": "2024-01-15",
    "notes": "Monthly contribution"
  }
  ```

### Get Payment History
- **GET** `/api/payments/history?page=1&pageSize=10&groupId=uuid`
- **Query Parameters:**
  - `page` (number): Page number
  - `pageSize` (number): Items per page
  - `groupId` (uuid, optional): Filter by group

### Get Payment by ID
- **GET** `/api/payments/:id`
- **Response:** Payment details

---

## Notifications Endpoints

### Get Notifications
- **GET** `/api/notifications?page=1&pageSize=20&unreadOnly=true`
- **Query Parameters:**
  - `page` (number): Page number
  - `pageSize` (number): Items per page
  - `unreadOnly` (boolean): Filter unread only

### Mark Notification as Read
- **PUT** `/api/notifications/:id/read`

### Mark All as Read
- **PUT** `/api/notifications/read-all`

### Delete Notification
- **DELETE** `/api/notifications/:id`

### Get Notification Settings
- **GET** `/api/notifications/settings`
- **Response:**
  ```json
  {
    "email": true,
    "sms": true,
    "push": true
  }
  ```

### Update Notification Settings
- **PUT** `/api/notifications/settings`
- **Body:**
  ```json
  {
    "email": true,
    "sms": false,
    "push": true
  }
  ```

---

## Banking Endpoints

### Get Bank Accounts
- **GET** `/api/banking/accounts`
- **Response:** Array of user's bank accounts

### Get Bank Account by ID
- **GET** `/api/banking/accounts/:id`
- **Response:** Bank account details

### Apply for Bank Account
- **POST** `/api/banking/accounts/apply`
- **Body:**
  ```json
  {
    "accountType": "savings",
    "employmentStatus": "employed",
    "employerName": "Company Name",
    "monthlyIncome": 500000,
    "purposeOfAccount": "Savings",
    "initialDeposit": 10000,
    "preferredBranch": "Lagos Main"
  }
  ```

### Get Account Applications
- **GET** `/api/banking/accounts/applications`
- **Response:** Array of account applications

### Get Transactions
- **GET** `/api/banking/transactions?accountId=uuid&page=1&pageSize=20`
- **Query Parameters:**
  - `accountId` (uuid, optional): Filter by account
  - `page` (number): Page number
  - `pageSize` (number): Items per page

### Create Deposit
- **POST** `/api/banking/transactions/deposit`
- **Body:**
  ```json
  {
    "accountId": "uuid-here",
    "amount": 10000,
    "description": "Initial deposit"
  }
  ```

### Create Withdrawal
- **POST** `/api/banking/transactions/withdraw`
- **Body:**
  ```json
  {
    "accountId": "uuid-here",
    "amount": 5000,
    "description": "Cash withdrawal"
  }
  ```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED` - Authentication required
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Input validation failed
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_ERROR` - Server error

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

