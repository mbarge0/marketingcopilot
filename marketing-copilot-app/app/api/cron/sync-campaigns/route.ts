import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getGoogleAdsClientForAccount } from '@/lib/google-ads/client';
import { fetchCampaigns } from '@/lib/google-ads/api';

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

    const supabase = createServiceClient();
    const results = {
      accounts_synced: 0,
      campaigns_updated: 0,
      errors: [] as string[],
    };

    // Get all active accounts
    const { data: accounts } = await supabase
      .from('google_ads_accounts')
      .select('id, customer_id, status')
      .eq('status', 'active');

    if (!accounts) {
      return NextResponse.json(results);
    }

    for (const account of accounts) {
      try {
        // Fetch campaigns from Google Ads API
        const { customer } = await getGoogleAdsClientForAccount(account.id);
        const campaigns = await fetchCampaigns(customer);

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
                cached_at: new Date().toISOString(),
                metrics_date: new Date().toISOString(),
              },
              {
                onConflict: 'account_id,campaign_id',
              }
            );

          if (!upsertError) {
            results.campaigns_updated++;
          }
        }

        // Update last_synced_at
        await supabase
          .from('google_ads_accounts')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', account.id);

        results.accounts_synced++;
      } catch (error: any) {
        results.errors.push(`Account ${account.id}: ${error.message}`);
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


