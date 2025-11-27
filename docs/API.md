# API Documentation

## Base URL

```
Production: https://api.esusuhub.com/api
Development: http://localhost:5166/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600,
    "user": {
      "id": "user-id",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### Groups

#### Get My Groups
```http
GET /groups/my-groups
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "group-id",
      "name": "Family Savings",
      "description": "Monthly family savings",
      "monthlyContribution": 50000,
      "currency": "NGN",
      "maxMembers": 12,
      "currentMembers": 5,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Group by ID
```http
GET /groups/{groupId}
Authorization: Bearer <token>
```

#### Create Group
```http
POST /groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Group",
  "description": "Group description",
  "monthlyContribution": 50000,
  "maxMembers": 12,
  "cycleDuration": 12
}
```

#### Join Group
```http
POST /groups/{groupId}/join
Authorization: Bearer <token>
```

#### Leave Group
```http
POST /groups/{groupId}/leave
Authorization: Bearer <token>
```

### Payments

#### Get Payment Methods
```http
GET /payments/methods
Authorization: Bearer <token>
```

#### Process Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "groupId": "group-id",
  "amount": 50000,
  "paymentMethodId": "method-id",
  "description": "Monthly contribution"
}
```

### User

#### Get Profile
```http
GET /users/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Upload Avatar
```http
POST /users/me/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>
```

### Notifications

#### Get Notifications
```http
GET /notifications?page=1&pageSize=20
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /notifications/{id}/read
Authorization: Bearer <token>
```

#### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error message",
  "status": 400,
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Rate Limiting

API requests are rate-limited:
- **Authenticated**: 100 requests per minute
- **Unauthenticated**: 20 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Pagination

List endpoints support pagination:

```
GET /groups?page=1&pageSize=20
```

**Response:**
```json
{
  "data": {
    "items": [...],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

