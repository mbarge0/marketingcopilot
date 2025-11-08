import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getGoogleAdsClientForAccount } from '@/lib/google-ads/client';
import { pauseCampaign } from '@/lib/google-ads/api';

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

    const supabase = createServiceClient();
    const results = {
      checked: 0,
      campaigns_paused: 0,
      errors: [] as string[],
    };

    // Find campaigns created 24+ hours ago that are still active
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const { data: jobs } = await supabase
      .from('campaign_jobs')
      .select('id, account_id, user_id, google_campaign_id, created_at')
      .eq('status', 'completed')
      .not('google_campaign_id', 'is', null)
      .lte('created_at', twentyFourHoursAgo.toISOString());

    if (!jobs) {
      return NextResponse.json(results);
    }

    for (const job of jobs) {
      if (!job.google_campaign_id) continue;

      results.checked++;

      // Check if campaign is still active
      const { data: campaign } = await supabase
        .from('campaigns_cache')
        .select('status, name')
        .eq('account_id', job.account_id)
        .eq('campaign_id', job.google_campaign_id)
        .eq('status', 'ACTIVE')
        .single();

      if (!campaign) {
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

      try {
        // Pause campaign via Google Ads API
        const { customer } = await getGoogleAdsClientForAccount(job.account_id);
        await pauseCampaign(customer, job.google_campaign_id);

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


