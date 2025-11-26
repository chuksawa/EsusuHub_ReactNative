# EsusuHub Database Schema Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    %% Core User Management
    users {
        uuid id PK
        varchar email UK
        varchar phone UK
        varchar password_hash
        varchar full_name
        varchar handle UK
        text avatar_url
        boolean is_verified
        varchar bvn
        varchar nin
        date date_of_birth
        text address
        varchar city
        varchar state
        varchar country
        varchar occupation
        decimal monthly_income
        timestamp created_at
        timestamp updated_at
        timestamp last_login
        varchar status
    }
    
    user_profiles {
        uuid id PK
        uuid user_id FK
        varchar emergency_contact_name
        varchar emergency_contact_phone
        varchar emergency_contact_relationship
        varchar preferred_language
        jsonb notification_preferences
        varchar kyc_status
        jsonb kyc_documents
        timestamp created_at
        timestamp updated_at
    }

    %% Savings Groups (Esusu)
    savings_groups {
        uuid id PK
        varchar name
        text description
        uuid admin_id FK
        decimal monthly_contribution
        integer total_members
        integer current_members
        date start_date
        date end_date
        varchar payout_order
        decimal penalty_fee
        varchar status
        text group_image_url
        text rules
        timestamp created_at
        timestamp updated_at
    }
    
    group_memberships {
        uuid id PK
        uuid group_id FK
        uuid user_id FK
        varchar role
        integer position
        date join_date
        varchar status
        decimal total_contributed
        date last_payment_date
        timestamp created_at
        timestamp updated_at
    }
    
    group_invitations {
        uuid id PK
        uuid group_id FK
        uuid invited_by FK
        uuid invited_user_id FK
        text message
        varchar status
        timestamp sent_date
        timestamp responded_date
        timestamp expires_at
    }
    
    contributions {
        uuid id PK
        uuid group_id FK
        uuid user_id FK
        decimal amount
        varchar payment_method
        uuid payment_account_id FK
        varchar transaction_reference UK
        varchar status
        timestamp payment_date
        date due_date
        decimal late_fee
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    payouts {
        uuid id PK
        uuid group_id FK
        uuid recipient_id FK
        decimal amount
        date payout_date
        varchar status
        varchar transaction_reference UK
        uuid payment_account_id FK
        text notes
        timestamp created_at
        timestamp updated_at
    }

    %% Payment Methods
    payment_accounts {
        uuid id PK
        uuid user_id FK
        varchar account_type
        varchar account_name
        varchar display_name
        varchar bank_name
        varchar account_number
        varchar bank_code
        varchar phone_number
        varchar mobile_provider
        varchar wallet_provider
        varchar wallet_username
        boolean is_default
        boolean is_verified
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    %% Banking Services
    bank_accounts {
        uuid id PK
        uuid user_id FK
        varchar account_number UK
        varchar account_type
        varchar account_name
        decimal balance
        decimal available_balance
        varchar currency
        decimal interest_rate
        decimal minimum_balance
        varchar status
        date opened_date
        date maturity_date
        timestamp created_at
        timestamp updated_at
    }
    
    bank_account_applications {
        uuid id PK
        uuid user_id FK
        varchar account_type
        varchar employment_status
        varchar employer_name
        decimal monthly_income
        text purpose_of_account
        decimal initial_deposit
        varchar preferred_branch
        varchar status
        timestamp application_date
        timestamp review_date
        timestamp approval_date
        text reviewer_notes
        timestamp created_at
        timestamp updated_at
    }
    
    bank_transactions {
        uuid id PK
        uuid account_id FK
        varchar transaction_type
        decimal amount
        decimal balance_after
        text description
        varchar reference_number UK
        varchar recipient_account
        varchar recipient_bank
        varchar status
        timestamp transaction_date
        date value_date
        timestamp created_at
    }

    %% System Tables
    notifications {
        uuid id PK
        uuid user_id FK
        varchar title
        text message
        varchar type
        uuid related_id
        boolean is_read
        text action_url
        timestamp created_at
    }
    
    activity_logs {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb details
        inet ip_address
        text user_agent
        timestamp created_at
    }
    
    system_settings {
        uuid id PK
        varchar key UK
        text value
        text description
        timestamp created_at
        timestamp updated_at
    }

    %% Relationships
    users ||--o{ user_profiles : "has profile"
    users ||--o{ savings_groups : "administers"
    users ||--o{ group_memberships : "member of"
    users ||--o{ group_invitations : "invites"
    users ||--o{ group_invitations : "invited to"
    users ||--o{ contributions : "makes"
    users ||--o{ payouts : "receives"
    users ||--o{ payment_accounts : "owns"
    users ||--o{ bank_accounts : "has"
    users ||--o{ bank_account_applications : "applies for"
    users ||--o{ notifications : "receives"
    users ||--o{ activity_logs : "performs"
    
    savings_groups ||--o{ group_memberships : "has members"
    savings_groups ||--o{ group_invitations : "sends invites"
    savings_groups ||--o{ contributions : "receives"
    savings_groups ||--o{ payouts : "distributes"
    
    payment_accounts ||--o{ contributions : "used for"
    payment_accounts ||--o{ payouts : "used for"
    
    bank_accounts ||--o{ bank_transactions : "has transactions"
```

## Table Relationships Summary

### Core User Flow
1. **User Registration** → `users` table with basic info
2. **Profile Completion** → `user_profiles` with extended details
3. **KYC Verification** → Updates verification status

### Savings Groups Flow
1. **Group Creation** → `savings_groups` with admin user
2. **Member Invitation** → `group_invitations` sent to users
3. **Group Membership** → `group_memberships` when invitation accepted
4. **Monthly Contributions** → `contributions` tracking payments
5. **Payout Distribution** → `payouts` when member's turn arrives

### Banking Flow
1. **Account Application** → `bank_account_applications`
2. **Account Approval** → Creates `bank_accounts`
3. **Banking Transactions** → `bank_transactions` for all activities
4. **Payment Integration** → Links to `payment_accounts`

### System Features
- **Notifications** → All user alerts and messages
- **Activity Logs** → Audit trail of all user actions
- **System Settings** → Configurable application parameters

## Key Design Principles

### Security
- UUID primary keys for all tables
- Row Level Security (RLS) ready for Supabase
- Proper foreign key constraints
- Unique constraints on sensitive fields

### Performance
- Indexed fields for common queries
- Optimized for mobile app usage patterns
- Efficient relationship structures

### Scalability
- JSONB fields for flexible data storage
- Extensible user profiles and settings
- Support for multiple payment methods

### Nigerian Banking Integration
- BVN (Bank Verification Number) support
- NIN (National Identification Number) support
- Naira (NGN) currency default
- Local banking and mobile money providers

This diagram represents a production-ready database schema that can handle both savings group management and comprehensive banking services for Nigerian users.