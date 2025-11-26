-- EsusuHub Database Schema
-- Comprehensive schema for savings groups (Esusu) management app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Core user information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    handle VARCHAR(50) UNIQUE NOT NULL, -- @username
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    bvn VARCHAR(11), -- Bank Verification Number (Nigeria)
    nin VARCHAR(11), -- National Identification Number
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    occupation VARCHAR(255),
    monthly_income DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive'))
);

-- User profiles - Extended user information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}',
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    kyc_documents JSONB, -- Store document URLs and types
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings groups (Esusu circles)
CREATE TABLE savings_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    admin_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    monthly_contribution DECIMAL(15,2) NOT NULL,
    total_members INTEGER NOT NULL,
    current_members INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    payout_order VARCHAR(20) DEFAULT 'fixed' CHECK (payout_order IN ('fixed', 'random', 'bidding')),
    penalty_fee DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'active', 'completed', 'suspended')),
    group_image_url TEXT,
    rules TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group memberships
CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES savings_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    position INTEGER, -- Payout position in the group
    join_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'left')),
    total_contributed DECIMAL(15,2) DEFAULT 0,
    last_payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id),
    UNIQUE(group_id, position)
);

-- Group invitations
CREATE TABLE group_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES savings_groups(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES users(id) ON DELETE CASCADE,
    invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_date TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Payment accounts (bank accounts, mobile money, digital wallets)
CREATE TABLE payment_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('bank', 'mobile', 'digital')),
    account_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    
    -- Bank account fields
    bank_name VARCHAR(255),
    account_number VARCHAR(20),
    bank_code VARCHAR(10),
    
    -- Mobile money fields
    phone_number VARCHAR(20),
    mobile_provider VARCHAR(100),
    
    -- Digital wallet fields
    wallet_provider VARCHAR(100),
    wallet_username VARCHAR(255),
    
    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contributions/Payments
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES savings_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('bank', 'card', 'mobile', 'cash')),
    payment_account_id UUID REFERENCES payment_accounts(id),
    transaction_reference VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'stopped')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date DATE,
    late_fee DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts (when members receive their turn)
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES savings_groups(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payout_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'completed', 'failed')),
    transaction_reference VARCHAR(255) UNIQUE,
    payment_account_id UUID REFERENCES payment_accounts(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banking accounts (for the banking service)
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('savings', 'current', 'fixed_deposit')),
    account_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    available_balance DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'NGN',
    interest_rate DECIMAL(5,4) DEFAULT 0,
    minimum_balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed', 'pending_approval')),
    opened_date DATE DEFAULT CURRENT_DATE,
    maturity_date DATE, -- For fixed deposits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank account applications
CREATE TABLE bank_account_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('savings', 'current', 'fixed_deposit')),
    employment_status VARCHAR(50),
    employer_name VARCHAR(255),
    monthly_income DECIMAL(15,2),
    purpose_of_account TEXT,
    initial_deposit DECIMAL(15,2),
    preferred_branch VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    approval_date TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank transactions
CREATE TABLE bank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'fee', 'interest')),
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_number VARCHAR(255) UNIQUE,
    recipient_account VARCHAR(255), -- For transfers
    recipient_bank VARCHAR(255), -- For external transfers
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    value_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('payment_due', 'payment_received', 'payout_ready', 'group_invite', 'system', 'banking')),
    related_id UUID, -- Can reference group_id, contribution_id, etc.
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'group', 'contribution', 'payout', etc.
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_handle ON users(handle);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
CREATE INDEX idx_contributions_group_id ON contributions(group_id);
CREATE INDEX idx_contributions_payment_date ON contributions(payment_date);
CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_transactions_account_id ON bank_transactions(account_id);
CREATE INDEX idx_bank_transactions_date ON bank_transactions(transaction_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_groups_updated_at BEFORE UPDATE ON savings_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_memberships_updated_at BEFORE UPDATE ON group_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_accounts_updated_at BEFORE UPDATE ON payment_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_account_applications_updated_at BEFORE UPDATE ON bank_account_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies will be added after connecting to Supabase
-- These ensure users can only access their own data

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('app_name', 'EsusuHub', 'Application name'),
('default_currency', 'NGN', 'Default currency for the application'),
('max_group_members', '50', 'Maximum number of members allowed in a savings group'),
('min_contribution_amount', '1000', 'Minimum contribution amount in base currency'),
('max_contribution_amount', '10000000', 'Maximum contribution amount in base currency'),
('invitation_expiry_days', '7', 'Number of days before group invitations expire'),
('late_payment_grace_days', '3', 'Grace period for late payments before penalties apply'),
('default_penalty_percentage', '5', 'Default penalty percentage for late payments'),
('banking_service_enabled', 'true', 'Whether banking services are enabled'),
('savings_interest_rate', '2.5', 'Annual interest rate for savings accounts'),
('current_interest_rate', '1.0', 'Annual interest rate for current accounts'),
('fixed_deposit_interest_rate', '8.0', 'Annual interest rate for fixed deposit accounts');