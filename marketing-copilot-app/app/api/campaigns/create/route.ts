import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getGoogleAdsClientForAccount } from '@/lib/google-ads/client';
import { createPerformanceMaxCampaign } from '@/lib/google-ads/api';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaign } = await request.json();

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign data is required' },
        { status: 400 }
      );
    }

    // Validate budget cap
    const maxDailyBudget = parseInt(process.env.MAX_DAILY_BUDGET || '50');
    if (campaign.daily_budget > maxDailyBudget) {
      return NextResponse.json(
        {
          error: `Daily budget exceeds maximum of $${maxDailyBudget}`,
          message: `Budget capped at $${maxDailyBudget}/day for demo accounts`,
        },
        { status: 400 }
      );
    }

    // Get user's Google Ads account
    const serviceSupabase = createServiceClient();
    const { data: accounts } = await serviceSupabase
      .from('google_ads_accounts')
      .select('id, customer_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);

    if (!accounts || accounts.length === 0) {
      return NextResponse.json(
        { error: 'No Google Ads account connected' },
        { status: 400 }
      );
    }

    const account = accounts[0];

    // Get Google Ads client
    const { customer } = await getGoogleAdsClientForAccount(account.id);

    // Create campaign
    const result = await createPerformanceMaxCampaign(customer, {
      name: campaign.campaign_name,
      dailyBudgetMicros: campaign.daily_budget * 1000000, // Convert to micros
      targetCpaMicros: 50000000, // $50 default
      landingPageUrl: campaign.landing_page_url,
      headlines: campaign.headlines || [],
      descriptions: campaign.descriptions || [],
    });

    // Store campaign creation job
    await serviceSupabase.from('campaign_jobs').insert({
      user_id: user.id,
      account_id: account.id,
      status: 'completed',
      input_data: { description: campaign },
      structured_data: campaign,
      google_campaign_id: result.campaign_id,
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      campaign_id: result.campaign_id,
      message: 'Campaign created successfully',
    });
  } catch (error: any) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create campaign',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

