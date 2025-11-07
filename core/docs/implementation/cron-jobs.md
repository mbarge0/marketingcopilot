# Budget Monitoring with Vercel Cron Jobs
## Marketing Co-Pilot - Scheduled Job Implementation

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## Overview

Budget monitoring requires **scheduled background jobs** that run every 5 minutes to check campaign spend and trigger alerts/auto-pause. Since Vercel serverless functions are stateless, we use **Vercel Cron Jobs** to run these checks.

---

## Architecture

```
┌─────────────────────┐
│  Vercel Cron Job    │
│  Runs every 5 min   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API Route          │
│  /api/cron/         │
│  monitor-budgets    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  1. Query DB        │
│     Get active      │
│     demo campaigns  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. For each        │
│     campaign:       │
│     - Fetch spend   │
│     - Check budget  │
│     - Trigger alert │
│     - Auto-pause    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. Update DB       │
│     - Log alerts    │
│     - Update status │
└─────────────────────┘
```

---

## Step 1: Configure Vercel Cron Job

### 1.1 Create `vercel.json`

**File: `vercel.json` (root directory)**

```json
{
  "crons": [
    {
      "path": "/api/cron/monitor-budgets",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Schedule Explanation:**
- `*/5 * * * *` = Every 5 minutes
- Format: `minute hour day month weekday`
- Alternative schedules:
  - `*/1 * * * *` = Every 1 minute (for testing)
  - `0 * * * *` = Every hour
  - `0 */6 * * *` = Every 6 hours

### 1.2 Create Cron Job Endpoint

**File: `app/api/cron/monitor-budgets/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createGoogleAdsClient, pauseCampaign } from '@/lib/google-ads/api';
import { refreshGoogleAdsToken } from '@/lib/google-ads/token-refresh';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Vercel Cron Job: Monitor campaign budgets
 * Runs every 5 minutes
 * 
 * Security: Verify request comes from Vercel Cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verify request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      checked: 0,
      alerts_triggered: 0,
      campaigns_paused: 0,
      errors: [] as string[],
    };

    // 1. Get all active demo campaigns
    const { data: accounts, error: accountsError } = await supabase
      .from('google_ads_accounts')
      .select('id, user_id, customer_id, access_token, refresh_token, status')
      .eq('status', 'active');

    if (accountsError) throw accountsError;

    // 2. For each account, check campaigns
    for (const account of accounts || []) {
      try {
        // Get campaigns from cache (recently updated)
        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns_cache')
          .select('*')
          .eq('account_id', account.id)
          .eq('status', 'ACTIVE')
          .like('name', '[DEMO]%') // Only monitor demo campaigns
          .gte('cached_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()); // Updated in last 10 min

        if (campaignsError) {
          results.errors.push(`Failed to fetch campaigns for account ${account.id}: ${campaignsError.message}`);
          continue;
        }

        // 3. For each campaign, check budget
        for (const campaign of campaigns || []) {
          results.checked++;

          const dailyBudgetDollars = campaign.daily_budget_micros / 1_000_000;
          const currentSpendDollars = campaign.cost_micros / 1_000_000;
          const spendPercentage = (currentSpendDollars / dailyBudgetDollars) * 100;

          // Check for budget warning (90% threshold)
          if (spendPercentage >= 90 && spendPercentage < 100) {
            // Check if alert already sent today
            const { data: existingAlert } = await supabase
              .from('budget_alerts')
              .select('id')
              .eq('account_id', account.id)
              .eq('campaign_id', campaign.campaign_id)
              .eq('alert_type', 'budget_warning')
              .gte('created_at', new Date().toISOString().split('T')[0])
              .single();

            if (!existingAlert) {
              // Create alert
              await supabase.from('budget_alerts').insert({
                account_id: account.id,
                campaign_id: campaign.campaign_id,
                alert_type: 'budget_warning',
                threshold_percentage: 90,
                current_spend_micros: campaign.cost_micros,
                budget_limit_micros: campaign.daily_budget_micros,
                action_taken: 'alerted',
              });

              // Create insight for user
              await supabase.from('insights').insert({
                user_id: account.user_id,
                account_id: account.id,
                campaign_id: campaign.campaign_id,
                type: 'budget_overspend',
                priority: 'critical',
                title: 'Budget Warning',
                message: `Campaign "${campaign.name}" has spent $${currentSpendDollars.toFixed(2)} of $${dailyBudgetDollars.toFixed(2)} daily budget (${spendPercentage.toFixed(1)}%)`,
                suggested_actions: ['pause_campaign', 'increase_budget', 'investigate'],
              });

              results.alerts_triggered++;
            }
          }

          // Check for budget exceeded (100% threshold)
          if (spendPercentage >= 100) {
            // Check if already paused
            const { data: existingAlert } = await supabase
              .from('budget_alerts')
              .select('id, auto_paused')
              .eq('account_id', account.id)
              .eq('campaign_id', campaign.campaign_id)
              .eq('alert_type', 'budget_exceeded')
              .gte('created_at', new Date().toISOString().split('T')[0])
              .single();

            if (!existingAlert || !existingAlert.auto_paused) {
              // Auto-pause campaign via Google Ads API
              try {
                // Refresh token if needed before creating client
                const freshAccessToken = await refreshGoogleAdsToken(account.id);
                
                const customer = createGoogleAdsClient(
                  freshAccessToken,
                  account.refresh_token,
                  process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
                  account.customer_id
                );

                await pauseCampaign(customer, campaign.campaign_id);

                // Log alert
                await supabase.from('budget_alerts').insert({
                  account_id: account.id,
                  campaign_id: campaign.campaign_id,
                  alert_type: 'budget_exceeded',
                  threshold_percentage: 100,
                  current_spend_micros: campaign.cost_micros,
                  budget_limit_micros: campaign.daily_budget_micros,
                  action_taken: 'paused',
                  auto_paused: true,
                });

                // Create insight
                await supabase.from('insights').insert({
                  user_id: account.user_id,
                  account_id: account.id,
                  campaign_id: campaign.campaign_id,
                  type: 'budget_overspend',
                  priority: 'critical',
                  title: 'Campaign Auto-Paused',
                  message: `Campaign "${campaign.name}" was auto-paused after exceeding daily budget of $${dailyBudgetDollars.toFixed(2)}`,
                  suggested_actions: ['resume_campaign', 'increase_budget'],
                });

                results.campaigns_paused++;
              } catch (pauseError: any) {
                results.errors.push(
                  `Failed to pause campaign ${campaign.campaign_id}: ${pauseError.message}`
                );
              }
            }
          }
        }
      } catch (accountError: any) {
        results.errors.push(`Error processing account ${account.id}: ${accountError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error: any) {
    console.error('Budget monitoring error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to monitor budgets',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Helper function to pause campaign (from google-ads-api-examples.ts)
async function pauseCampaign(customer: any, campaignId: string): Promise<void> {
  // Implementation from google-ads-api-examples.ts
  // ...
}
```

---

## Step 2: Auto-Pause After 24 Hours

### 2.1 Create 24-Hour Auto-Pause Cron Job

**File: `app/api/cron/auto-pause-24h/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createGoogleAdsClient, pauseCampaign } from '@/lib/google-ads/api';
import { refreshGoogleAdsToken } from '@/lib/google-ads/token-refresh';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Vercel Cron Job: Auto-pause campaigns after 24 hours
 * Runs every hour
 */
export async function GET(request: NextRequest) {
  try {
    // Verify request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      checked: 0,
      campaigns_paused: 0,
      errors: [] as string[],
    };

    // Find campaigns created 24+ hours ago that are still active
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const { data: jobs, error: jobsError } = await supabase
      .from('campaign_jobs')
      .select('id, account_id, user_id, google_campaign_id, created_at')
      .eq('status', 'completed')
      .not('google_campaign_id', 'is', null)
      .lte('created_at', twentyFourHoursAgo.toISOString());

    if (jobsError) throw jobsError;

    for (const job of jobs || []) {
      if (!job.google_campaign_id) continue;

      results.checked++;

      // Check if campaign is still active
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns_cache')
        .select('status, name')
        .eq('account_id', job.account_id)
        .eq('campaign_id', job.google_campaign_id)
        .eq('status', 'ACTIVE')
        .single();

      if (campaignError || !campaign) {
        // Campaign already paused or doesn't exist
        continue;
      }

      // Check if already auto-paused
      const { data: existingAlert } = await supabase
        .from('budget_alerts')
        .select('id')
        .eq('account_id', job.account_id)
        .eq('campaign_id', job.google_campaign_id)
        .eq('alert_type', 'auto_pause_24h')
        .single();

      if (existingAlert) {
        // Already auto-paused
        continue;
      }

      // Get account for API access
      const { data: account, error: accountError } = await supabase
        .from('google_ads_accounts')
        .select('id, customer_id, access_token, refresh_token')
        .eq('id', job.account_id)
        .single();

      if (accountError || !account) {
        results.errors.push(`Account not found for job ${job.id}`);
        continue;
      }

      try {
        // Refresh token if needed before creating client
        const freshAccessToken = await refreshGoogleAdsToken(account.id);
        
        // Pause campaign
        const customer = createGoogleAdsClient(
          freshAccessToken,
          account.refresh_token,
          process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          account.customer_id
        );

        await pauseCampaign(customer, job.google_campaign_id);

        // Log alert
        await supabase.from('budget_alerts').insert({
          account_id: job.account_id,
          campaign_id: job.google_campaign_id,
          alert_type: 'auto_pause_24h',
          threshold_percentage: null,
          current_spend_micros: 0,
          budget_limit_micros: 0,
          action_taken: 'paused',
          auto_paused: true,
        });

        // Create insight
        await supabase.from('insights').insert({
          user_id: job.user_id,
          account_id: job.account_id,
          campaign_id: job.google_campaign_id,
          type: 'alert',
          priority: 'info',
          title: 'Campaign Auto-Paused (24h Safety)',
          message: `Campaign "${campaign.name}" was auto-paused after 24 hours (demo safety feature)`,
          suggested_actions: ['resume_campaign'],
        });

        results.campaigns_paused++;
      } catch (pauseError: any) {
        results.errors.push(
          `Failed to pause campaign ${job.google_campaign_id}: ${pauseError.message}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error: any) {
    console.error('24h auto-pause error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to auto-pause campaigns',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

### 2.2 Update `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/monitor-budgets",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/auto-pause-24h",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## Step 3: Refresh Campaign Data (Background Sync)

### 3.1 Create Data Sync Cron Job

**File: `app/api/cron/sync-campaigns/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createGoogleAdsClient, fetchCampaigns } from '@/lib/google-ads/api';
import { refreshGoogleAdsToken } from '@/lib/google-ads/token-refresh';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Vercel Cron Job: Sync campaign data from Google Ads API
 * Runs every 5 minutes
 */
export async function GET(request: NextRequest) {
  try {
    // Verify request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      accounts_synced: 0,
      campaigns_updated: 0,
      errors: [] as string[],
    };

    // Get all active accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('google_ads_accounts')
      .select('id, customer_id, access_token, refresh_token, status')
      .eq('status', 'active');

    if (accountsError) throw accountsError;

    for (const account of accounts || []) {
      try {
        // Refresh token if needed before creating client
        const freshAccessToken = await refreshGoogleAdsToken(account.id);
        
        // Create Google Ads client
        const customer = createGoogleAdsClient(
          freshAccessToken,
          account.refresh_token,
          process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          account.customer_id
        );

        // Fetch campaigns (today's metrics)
        const today = new Date();
        const campaigns = await fetchCampaigns(customer, {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        });

        // Update cache
        for (const campaign of campaigns) {
          const { error: upsertError } = await supabase
            .from('campaigns_cache')
            .upsert(
              {
                account_id: account.id,
                campaign_id: campaign.campaign_id,
                name: campaign.name,
                status: campaign.status,
                campaign_type: campaign.campaign_type,
                daily_budget_micros: campaign.daily_budget_micros,
                total_budget_micros: campaign.total_budget_micros,
                impressions: campaign.metrics.impressions,
                clicks: campaign.metrics.clicks,
                cost_micros: campaign.metrics.cost_micros,
                conversions: campaign.metrics.conversions,
                ctr: campaign.metrics.ctr,
                cpc_micros: campaign.metrics.cpc_micros,
                cpa_micros: campaign.metrics.cpa_micros,
                roas: campaign.metrics.roas,
                metrics_date: today.toISOString().split('T')[0],
                cached_at: new Date().toISOString(),
              },
              {
                onConflict: 'account_id,campaign_id,metrics_date',
              }
            );

          if (upsertError) {
            results.errors.push(
              `Failed to update campaign ${campaign.campaign_id}: ${upsertError.message}`
            );
          } else {
            results.campaigns_updated++;
          }
        }

        // Update account last_synced_at
        await supabase
          .from('google_ads_accounts')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', account.id);

        results.accounts_synced++;
      } catch (accountError: any) {
        results.errors.push(`Error syncing account ${account.id}: ${accountError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error: any) {
    console.error('Campaign sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync campaigns',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

### 3.2 Final `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/monitor-budgets",
      "schedule": "*/5 * * * *",
      "description": "Check campaign budgets and trigger alerts/auto-pause"
    },
    {
      "path": "/api/cron/auto-pause-24h",
      "schedule": "0 * * * *",
      "description": "Auto-pause campaigns after 24 hours"
    },
    {
      "path": "/api/cron/sync-campaigns",
      "schedule": "*/5 * * * *",
      "description": "Sync campaign data from Google Ads API"
    }
  ]
}
```

---

## Step 4: Environment Variables

Add to `.env`:

```bash
# Cron Job Security
CRON_SECRET=your-random-secret-key-here

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
GOOGLE_ADS_CLIENT_ID=your-client-id
GOOGLE_ADS_CLIENT_SECRET=your-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** Set `CRON_SECRET` in Vercel environment variables. Use a strong random string.

---

## Step 5: Testing Cron Jobs Locally

### 5.1 Manual Testing Endpoint

**File: `app/api/cron/test/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Allow manual testing with ?secret=xxx query param
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Call monitor-budgets logic here
  // ...

  return NextResponse.json({ success: true, message: 'Test completed' });
}
```

Test locally:
```bash
curl "http://localhost:3000/api/cron/test?secret=your-secret"
```

### 5.2 Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
2. View cron job execution logs
3. Manually trigger cron jobs for testing

---

## Monitoring & Debugging

### Logs

All cron jobs should log:
- Timestamp
- Number of campaigns checked
- Number of actions taken
- Errors encountered

### Alerts

Set up monitoring for:
- Cron job failures (Vercel sends emails)
- High error rates
- Budget alerts not triggering

---

## Summary

1. **Budget Monitoring**: Runs every 5 minutes, checks spend vs budget, triggers alerts/auto-pause
2. **24h Auto-Pause**: Runs every hour, pauses campaigns created 24+ hours ago
3. **Data Sync**: Runs every 5 minutes, refreshes campaign metrics from Google Ads API

All cron jobs:
- Verify authorization via `CRON_SECRET`
- Use Supabase service role for database access
- Handle errors gracefully
- Log results for debugging

