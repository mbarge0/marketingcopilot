-- ============================================================================
-- Marketing Co-Pilot - Database Schema with Row-Level Security
-- ============================================================================
-- Project: Marketing Co-Pilot (24-Hour MVP)
-- Database: Supabase PostgreSQL
-- Version: 1.0
-- Last Updated: November 6, 2025
-- 
-- INSTRUCTIONS:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all tables are created successfully
-- 3. Verify RLS is enabled on all tables
-- 4. Test RLS policies with test users
-- 5. Seed demo data (see bottom of file)
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users Table
-- ----------------------------------------------------------------------------
-- Extends Supabase auth.users with app-specific profile data
-- Auth is handled by Supabase Auth (auth.users)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login TIMESTAMPTZ,
  is_demo_mode BOOLEAN DEFAULT FALSE NOT NULL
);

-- Add comment for documentation
COMMENT ON TABLE users IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN users.is_demo_mode IS 'If true, user is viewing demo data without OAuth connection';

-- ----------------------------------------------------------------------------
-- Google Ads Accounts Table
-- ----------------------------------------------------------------------------
-- Stores OAuth connections to Google Ads accounts
-- Tokens are encrypted at rest using pgcrypto

CREATE TABLE IF NOT EXISTS google_ads_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  customer_id TEXT NOT NULL, -- Google Ads customer ID (e.g., "123-456-7890")
  account_name TEXT NOT NULL, -- Display name from Google Ads
  access_token TEXT NOT NULL, -- Encrypted access token
  refresh_token TEXT NOT NULL, -- Encrypted refresh token
  token_expires_at TIMESTAMPTZ NOT NULL,
  connected_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_synced_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'expired', 'error', 'disconnected')),
  error_message TEXT,
  
  -- Constraints
  CONSTRAINT google_ads_accounts_user_customer_unique UNIQUE (user_id, customer_id)
);

-- Add comment for documentation
COMMENT ON TABLE google_ads_accounts IS 'OAuth connections to Google Ads accounts';
COMMENT ON COLUMN google_ads_accounts.customer_id IS 'Google Ads customer ID in format XXX-XXX-XXXX';
COMMENT ON COLUMN google_ads_accounts.access_token IS 'Encrypted OAuth access token';
COMMENT ON COLUMN google_ads_accounts.refresh_token IS 'Encrypted OAuth refresh token';

-- ----------------------------------------------------------------------------
-- Campaigns Cache Table
-- ----------------------------------------------------------------------------
-- Caches campaign data from Google Ads API
-- Refreshed every 5 minutes via background job

CREATE TABLE IF NOT EXISTS campaigns_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES google_ads_accounts(id) ON DELETE CASCADE NOT NULL,
  campaign_id TEXT NOT NULL, -- Google Ads campaign ID
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'PAUSED', 'REMOVED', 'ENDED')),
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('PERFORMANCE_MAX', 'SEARCH', 'DISPLAY', 'VIDEO', 'SHOPPING')),
  daily_budget_micros BIGINT NOT NULL, -- Budget in micros (1,000,000 micros = $1)
  total_budget_micros BIGINT, -- Total budget if set
  
  -- Metrics (cached from Google Ads API)
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  cost_micros BIGINT DEFAULT 0, -- Spend in micros
  conversions NUMERIC(10, 2) DEFAULT 0,
  ctr NUMERIC(5, 4), -- Click-through rate (percentage)
  cpc_micros BIGINT, -- Cost per click in micros
  cpa_micros BIGINT, -- Cost per acquisition in micros
  roas NUMERIC(10, 2), -- Return on ad spend
  
  -- Metadata
  cached_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metrics_date DATE DEFAULT CURRENT_DATE, -- Date for which metrics are valid
  
  -- Constraints
  CONSTRAINT campaigns_cache_account_campaign_unique UNIQUE (account_id, campaign_id, metrics_date)
);

-- Add comment for documentation
COMMENT ON TABLE campaigns_cache IS 'Cached campaign data from Google Ads API, refreshed every 5 minutes';
COMMENT ON COLUMN campaigns_cache.campaign_id IS 'Google Ads campaign ID (numeric string)';
COMMENT ON COLUMN campaigns_cache.daily_budget_micros IS 'Daily budget in micros (1,000,000 micros = $1 USD)';

-- ----------------------------------------------------------------------------
-- Campaign Historical Metrics Table
-- ----------------------------------------------------------------------------
-- Stores historical metrics for anomaly detection
-- Used to calculate 7-day averages for z-score analysis

CREATE TABLE IF NOT EXISTS campaign_historical_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES google_ads_accounts(id) ON DELETE CASCADE NOT NULL,
  campaign_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  
  -- Daily metrics
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  cost_micros BIGINT DEFAULT 0,
  conversions NUMERIC(10, 2) DEFAULT 0,
  ctr NUMERIC(5, 4),
  cpc_micros BIGINT,
  cpa_micros BIGINT,
  roas NUMERIC(10, 2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT campaign_historical_metrics_unique UNIQUE (account_id, campaign_id, metric_date)
);

-- Add comment for documentation
COMMENT ON TABLE campaign_historical_metrics IS 'Historical daily metrics for campaigns, used for anomaly detection';
COMMENT ON COLUMN campaign_historical_metrics.metric_date IS 'Date for which these metrics apply';

-- ----------------------------------------------------------------------------
-- AI Insights Table
-- ----------------------------------------------------------------------------
-- Stores AI-generated insights and recommendations

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES google_ads_accounts(id) ON DELETE CASCADE,
  campaign_id TEXT, -- Google Ads campaign ID (nullable for account-level insights)
  
  -- Insight details
  type TEXT NOT NULL CHECK (type IN ('budget_overspend', 'performance_anomaly', 'optimization', 'alert')),
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'opportunity', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  suggested_actions TEXT[], -- Array of action IDs (e.g., ['pause_campaign', 'increase_budget'])
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE NOT NULL,
  dismissed_at TIMESTAMPTZ,
  action_taken TEXT, -- Which action was taken (if any)
  action_taken_at TIMESTAMPTZ
);

-- Add comment for documentation
COMMENT ON TABLE insights IS 'AI-generated insights and recommendations for campaigns';
COMMENT ON COLUMN insights.suggested_actions IS 'Array of action identifiers user can take';

-- ----------------------------------------------------------------------------
-- Campaign Creation Jobs Table
-- ----------------------------------------------------------------------------
-- Tracks campaign creation jobs (async operations)

CREATE TABLE IF NOT EXISTS campaign_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES google_ads_accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Job status
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Input data
  input_data JSONB NOT NULL, -- User's natural language input
  structured_data JSONB, -- AI-extracted structured fields
  campaign_config JSONB, -- Final campaign configuration before publishing
  
  -- Output data
  google_campaign_id TEXT, -- Google Ads campaign ID if successful
  error_code TEXT,
  error_message TEXT,
  error_details JSONB, -- Full error response from Google Ads API
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Add comment for documentation
COMMENT ON TABLE campaign_jobs IS 'Tracks async campaign creation jobs';
COMMENT ON COLUMN campaign_jobs.input_data IS 'Original user input (natural language)';
COMMENT ON COLUMN campaign_jobs.structured_data IS 'AI-extracted structured campaign data';
COMMENT ON COLUMN campaign_jobs.campaign_config IS 'Final campaign configuration sent to Google Ads API';

-- ----------------------------------------------------------------------------
-- Budget Alerts Table
-- ----------------------------------------------------------------------------
-- Tracks budget alerts and auto-pause events

CREATE TABLE IF NOT EXISTS budget_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES google_ads_accounts(id) ON DELETE CASCADE NOT NULL,
  campaign_id TEXT NOT NULL,
  
  -- Alert details
  alert_type TEXT NOT NULL CHECK (alert_type IN ('budget_warning', 'budget_exceeded', 'auto_pause_24h')),
  threshold_percentage NUMERIC(5, 2), -- Percentage of budget (e.g., 90.00 for 90%)
  current_spend_micros BIGINT NOT NULL,
  budget_limit_micros BIGINT NOT NULL,
  
  -- Action taken
  action_taken TEXT, -- 'paused', 'alerted', 'none'
  auto_paused BOOLEAN DEFAULT FALSE NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- Add comment for documentation
COMMENT ON TABLE budget_alerts IS 'Tracks budget alerts and auto-pause events for safety';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Google Ads Accounts indexes
CREATE INDEX IF NOT EXISTS idx_google_ads_accounts_user_id ON google_ads_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_google_ads_accounts_status ON google_ads_accounts(status);
CREATE INDEX IF NOT EXISTS idx_google_ads_accounts_expires_at ON google_ads_accounts(token_expires_at);

-- Campaigns Cache indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_cache_account_id ON campaigns_cache(account_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_cache_campaign_id ON campaigns_cache(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_cache_status ON campaigns_cache(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_cache_cached_at ON campaigns_cache(cached_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_cache_account_date ON campaigns_cache(account_id, metrics_date);

-- Historical Metrics indexes
CREATE INDEX IF NOT EXISTS idx_historical_metrics_account_campaign ON campaign_historical_metrics(account_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_historical_metrics_date ON campaign_historical_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_historical_metrics_account_date ON campaign_historical_metrics(account_id, metric_date DESC);

-- Insights indexes
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_account_id ON insights(account_id);
CREATE INDEX IF NOT EXISTS idx_insights_campaign_id ON insights(campaign_id);
CREATE INDEX IF NOT EXISTS idx_insights_dismissed ON insights(dismissed);
CREATE INDEX IF NOT EXISTS idx_insights_priority ON insights(priority);
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON insights(created_at DESC);

-- Campaign Jobs indexes
CREATE INDEX IF NOT EXISTS idx_campaign_jobs_user_id ON campaign_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_jobs_status ON campaign_jobs(status);
CREATE INDEX IF NOT EXISTS idx_campaign_jobs_created_at ON campaign_jobs(created_at DESC);

-- Budget Alerts indexes
CREATE INDEX IF NOT EXISTS idx_budget_alerts_account_campaign ON budget_alerts(account_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_budget_alerts_created_at ON budget_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_budget_alerts_resolved ON budget_alerts(resolved_at) WHERE resolved_at IS NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_ads_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_historical_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_alerts ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Users Policies
-- ----------------------------------------------------------------------------

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- Google Ads Accounts Policies
-- ----------------------------------------------------------------------------

-- Users can read their own connected accounts
CREATE POLICY "Users can read own Google Ads accounts"
  ON google_ads_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own accounts
CREATE POLICY "Users can insert own Google Ads accounts"
  ON google_ads_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own accounts
CREATE POLICY "Users can update own Google Ads accounts"
  ON google_ads_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own accounts
CREATE POLICY "Users can delete own Google Ads accounts"
  ON google_ads_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Campaigns Cache Policies
-- ----------------------------------------------------------------------------

-- Users can read campaigns from their connected accounts
CREATE POLICY "Users can read campaigns from own accounts"
  ON campaigns_cache FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM google_ads_accounts
      WHERE google_ads_accounts.id = campaigns_cache.account_id
      AND google_ads_accounts.user_id = auth.uid()
    )
  );

-- Service role can insert/update campaigns (via API routes)
-- Note: API routes use service role, so they bypass RLS
-- This policy is for direct database access if needed

-- ----------------------------------------------------------------------------
-- Historical Metrics Policies
-- ----------------------------------------------------------------------------

-- Users can read historical metrics from their accounts
CREATE POLICY "Users can read historical metrics from own accounts"
  ON campaign_historical_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM google_ads_accounts
      WHERE google_ads_accounts.id = campaign_historical_metrics.account_id
      AND google_ads_accounts.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Insights Policies
-- ----------------------------------------------------------------------------

-- Users can read their own insights
CREATE POLICY "Users can read own insights"
  ON insights FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own insights (dismiss, mark action taken)
CREATE POLICY "Users can update own insights"
  ON insights FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can insert insights (via API routes)

-- ----------------------------------------------------------------------------
-- Campaign Jobs Policies
-- ----------------------------------------------------------------------------

-- Users can read their own campaign jobs
CREATE POLICY "Users can read own campaign jobs"
  ON campaign_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own campaign jobs
CREATE POLICY "Users can insert own campaign jobs"
  ON campaign_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can update jobs (via API routes)

-- ----------------------------------------------------------------------------
-- Budget Alerts Policies
-- ----------------------------------------------------------------------------

-- Users can read alerts from their accounts
CREATE POLICY "Users can read budget alerts from own accounts"
  ON budget_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM google_ads_accounts
      WHERE google_ads_accounts.id = budget_alerts.account_id
      AND google_ads_accounts.user_id = auth.uid()
    )
  );

-- Service role can insert/update alerts (via API routes)

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: Encrypt Token
-- ----------------------------------------------------------------------------
-- Encrypts OAuth tokens before storing
-- Uses pgcrypto with a secret key from environment

CREATE OR REPLACE FUNCTION encrypt_token(token TEXT)
RETURNS TEXT AS $$
BEGIN
  -- In production, use a proper encryption key from environment
  -- For MVP, we'll use a simple base64 encoding (NOT secure for production)
  -- TODO: Replace with proper encryption using pgcrypto encrypt()
  RETURN encode(convert_to(token, 'UTF8'), 'base64');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Function: Decrypt Token
-- ----------------------------------------------------------------------------
-- Decrypts OAuth tokens after retrieval

CREATE OR REPLACE FUNCTION decrypt_token(encrypted_token TEXT)
RETURNS TEXT AS $$
BEGIN
  -- In production, use proper decryption
  -- For MVP, decode base64
  RETURN convert_from(decode(encrypted_token, 'base64'), 'UTF8');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Function: Get Campaign Metrics (7-day average)
-- ----------------------------------------------------------------------------
-- Calculates 7-day average metrics for anomaly detection

CREATE OR REPLACE FUNCTION get_campaign_7day_average(
  p_account_id UUID,
  p_campaign_id TEXT,
  p_metric_name TEXT
)
RETURNS NUMERIC AS $$
DECLARE
  avg_value NUMERIC;
BEGIN
  SELECT AVG(
    CASE p_metric_name
      WHEN 'cpa' THEN cpa_micros / 1000000.0
      WHEN 'ctr' THEN ctr
      WHEN 'roas' THEN roas
      WHEN 'cpc' THEN cpc_micros / 1000000.0
      ELSE NULL
    END
  ) INTO avg_value
  FROM campaign_historical_metrics
  WHERE account_id = p_account_id
    AND campaign_id = p_campaign_id
    AND metric_date >= CURRENT_DATE - INTERVAL '7 days'
    AND metric_date < CURRENT_DATE;
  
  RETURN COALESCE(avg_value, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DEMO DATA (Seed Data)
-- ============================================================================

-- Insert demo campaigns (for demo mode)
-- Note: These are synthetic and don't require real Google Ads accounts
-- 
-- IMPORTANT: Demo mode uses a special demo user account
-- In your application, create a demo user first, then use their account_id

-- Step 1: Create a demo user (if not exists)
-- This should be done via Supabase Auth UI or API, then insert into users table
-- For reference, the demo user_id would be something like: '00000000-0000-0000-0000-000000000000'

-- Step 2: Create a demo Google Ads account entry
-- This is a placeholder account that doesn't require real OAuth
INSERT INTO google_ads_accounts (
  id,
  user_id,
  customer_id,
  account_name,
  access_token,
  refresh_token,
  token_expires_at,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Demo account UUID
  '00000000-0000-0000-0000-000000000000', -- Demo user UUID (replace with actual demo user)
  '000-000-0000', -- Placeholder customer ID
  'Demo Account',
  encrypt_token('demo_access_token'), -- Encrypted placeholder token
  encrypt_token('demo_refresh_token'), -- Encrypted placeholder token
  NOW() + INTERVAL '1 year', -- Far future expiry
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert demo campaigns linked to demo account
INSERT INTO campaigns_cache (
  account_id,
  campaign_id,
  name,
  status,
  campaign_type,
  daily_budget_micros,
  impressions,
  clicks,
  cost_micros,
  conversions,
  ctr,
  cpc_micros,
  cpa_micros,
  roas,
  metrics_date
) VALUES
-- Use the demo account_id from above
('00000000-0000-0000-0000-000000000001', 'demo_001', 'Summer Sale 2025', 'ACTIVE', 'PERFORMANCE_MAX', 100000000, 15847, 432, 87430000, 12, 0.0273, 202430, 7285833, 4.2, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'demo_002', 'Holiday Collection', 'ACTIVE', 'PERFORMANCE_MAX', 50000000, 8234, 187, 52300000, 4, 0.0227, 279679, 13075000, 2.8, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'demo_003', 'New Product Launch', 'PAUSED', 'SEARCH', 75000000, 12456, 312, 68900000, 8, 0.0250, 220833, 8612500, 3.5, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'demo_004', 'Brand Awareness', 'ACTIVE', 'DISPLAY', 30000000, 45678, 234, 28700000, 2, 0.0051, 122650, 14350000, 1.8, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'demo_005', 'Retargeting Campaign', 'ACTIVE', 'PERFORMANCE_MAX', 60000000, 9876, 456, 58900000, 15, 0.0462, 129167, 3926667, 5.1, CURRENT_DATE)
ON CONFLICT (account_id, campaign_id, metrics_date) DO NOTHING;

-- NOTE: In your application code, handle demo mode differently:
-- 1. Check if user.is_demo_mode = TRUE
-- 2. If demo mode, query campaigns_cache WHERE account_id = demo_account_id
-- 3. Don't require OAuth connection for demo mode

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify schema is set up correctly:

-- 1. Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
-- ORDER BY table_name;

-- 2. Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN (
--   'users', 'google_ads_accounts', 'campaigns_cache', 
--   'campaign_historical_metrics', 'insights', 'campaign_jobs', 'budget_alerts'
-- );

-- 3. Check indexes exist
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Token Encryption: Currently using base64 encoding (NOT secure)
--    TODO: Replace with proper encryption using pgcrypto encrypt() with a secret key
--    Store encryption key in Supabase Vault or environment variable

-- 2. Demo Data: Demo campaigns use NULL account_id
--    In implementation, create a special demo account or handle demo mode differently

-- 3. Micros Conversion: Google Ads API uses micros (1,000,000 micros = $1)
--    Always convert to/from dollars in application layer

-- 4. RLS Bypass: API routes use Supabase service role key, which bypasses RLS
--    Ensure API routes validate user_id matches auth.uid() before operations

-- 5. Historical Metrics: Store daily snapshots for anomaly detection
--    Consider archiving old data (>90 days) to a separate table

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

