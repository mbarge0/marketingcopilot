import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGoogleAdsClientForAccount } from '@/lib/google-ads/client';
import { fetchCampaigns } from '@/lib/google-ads/api';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is in demo mode
    const { data: userProfile } = await supabase
      .from('users')
      .select('is_demo_mode')
      .eq('id', user.id)
      .single();

    if (userProfile?.is_demo_mode) {
      // Return demo campaigns
      return NextResponse.json({
        campaigns: getDemoCampaigns(),
        source: 'demo',
      });
    }

    // Get user's Google Ads accounts
    const serviceSupabase = createServiceClient();
    const { data: accounts, error: accountsError } = await serviceSupabase
      .from('google_ads_accounts')
      .select('id, customer_id, account_name, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);

    if (accountsError || !accounts || accounts.length === 0) {
      return NextResponse.json({
        campaigns: [],
        source: 'none',
        message: 'No Google Ads account connected',
      });
    }

    const account = accounts[0];

    // Check cache first
    const { data: cachedCampaigns } = await serviceSupabase
      .from('campaigns_cache')
      .select('*')
      .eq('account_id', account.id)
      .gte('cached_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 minutes
      .order('name');

    if (cachedCampaigns && cachedCampaigns.length > 0) {
      return NextResponse.json({
        campaigns: cachedCampaigns,
        source: 'cache',
      });
    }

    // Fetch from Google Ads API
    try {
      const { customer } = await getGoogleAdsClientForAccount(account.id);
      const campaigns = await fetchCampaigns(customer);

      // Cache the results
      const campaignsToCache = campaigns.map((campaign) => ({
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
        cached_at: new Date().toISOString(),
        metrics_date: new Date().toISOString(),
      }));

      // Upsert campaigns cache
      for (const campaign of campaignsToCache) {
        await serviceSupabase
          .from('campaigns_cache')
          .upsert(campaign, {
            onConflict: 'account_id,campaign_id',
          });
      }

      return NextResponse.json({
        campaigns: campaignsToCache,
        source: 'api',
      });
    } catch (apiError: any) {
      console.error('Google Ads API error:', apiError);
      return NextResponse.json(
        {
          error: 'Failed to fetch campaigns',
          message: apiError.message,
          campaigns: cachedCampaigns || [],
          source: 'error',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Campaigns API error:', error);
    
    // Check for missing environment variables
    if (error.message?.includes('required')) {
      return NextResponse.json(
        { 
          error: 'Configuration error', 
          message: error.message,
          details: 'Please check your environment variables. Ensure SUPABASE_SERVICE_ROLE_KEY is set in your .env.local file.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

function getDemoCampaigns() {
  return [
    {
      id: 'demo_001',
      campaign_id: 'demo_001',
      name: 'Summer Sale 2025',
      status: 'ACTIVE',
      campaign_type: 'PERFORMANCE_MAX',
      daily_budget_micros: 100000000, // $100
      impressions: 15847,
      clicks: 432,
      cost_micros: 87430000, // $87.43
      conversions: 12,
      ctr: 0.0273,
      cpc_micros: 202000, // $0.20
      cpa_micros: 7290000, // $7.29
      roas: 4.2,
    },
    {
      id: 'demo_002',
      campaign_id: 'demo_002',
      name: 'Holiday Collection',
      status: 'ACTIVE',
      campaign_type: 'PERFORMANCE_MAX',
      daily_budget_micros: 50000000, // $50
      impressions: 8234,
      clicks: 187,
      cost_micros: 52300000, // $52.30
      conversions: 4,
      ctr: 0.0227,
      cpc_micros: 280000, // $0.28
      cpa_micros: 13080000, // $13.08
      roas: 2.8,
    },
    {
      id: 'demo_003',
      campaign_id: 'demo_003',
      name: 'Winter Jackets',
      status: 'PAUSED',
      campaign_type: 'SEARCH',
      daily_budget_micros: 75000000, // $75
      impressions: 12456,
      clicks: 298,
      cost_micros: 89450000, // $89.45
      conversions: 8,
      ctr: 0.0239,
      cpc_micros: 300000, // $0.30
      cpa_micros: 11180000, // $11.18
      roas: 3.5,
    },
  ];
}

