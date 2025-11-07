import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getGoogleAdsClientForAccount } from '@/lib/google-ads/client';
import { pauseCampaign } from '@/lib/google-ads/api';

/**
 * Vercel Cron Job: Monitor campaign budgets
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
      checked: 0,
      alerts_triggered: 0,
      campaigns_paused: 0,
      errors: [] as string[],
    };

    // Get all active accounts
    const { data: accounts } = await supabase
      .from('google_ads_accounts')
      .select('id, user_id, customer_id, status')
      .eq('status', 'active');

    if (!accounts) {
      return NextResponse.json(results);
    }

    // For each account, check campaigns
    for (const account of accounts) {
      try {
        // Get campaigns from cache
        const { data: campaigns } = await supabase
          .from('campaigns_cache')
          .select('*')
          .eq('account_id', account.id)
          .eq('status', 'ACTIVE')
          .like('name', '[DEMO]%') // Only monitor demo campaigns
          .gte('cached_at', new Date(Date.now() - 10 * 60 * 1000).toISOString());

        if (!campaigns) continue;

        // For each campaign, check budget
        for (const campaign of campaigns) {
          results.checked++;

          const dailyBudgetDollars = campaign.daily_budget_micros / 1_000_000;
          const currentSpendDollars = campaign.cost_micros / 1_000_000;
          const spendPercentage = (currentSpendDollars / dailyBudgetDollars) * 100;

          // Check for budget warning (90% threshold)
          if (spendPercentage >= 90 && spendPercentage < 100) {
            const { data: existingAlert } = await supabase
              .from('budget_alerts')
              .select('id')
              .eq('account_id', account.id)
              .eq('campaign_id', campaign.campaign_id)
              .eq('alert_type', 'budget_warning')
              .gte('created_at', new Date().toISOString().split('T')[0])
              .single();

            if (!existingAlert) {
              await supabase.from('budget_alerts').insert({
                account_id: account.id,
                campaign_id: campaign.campaign_id,
                alert_type: 'budget_warning',
                threshold_percentage: 90,
                current_spend_micros: campaign.cost_micros,
                budget_limit_micros: campaign.daily_budget_micros,
                action_taken: 'alerted',
              });

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

          // Check for budget exceeded (100% threshold) - auto-pause
          if (spendPercentage >= 100) {
            const { data: existingAlert } = await supabase
              .from('budget_alerts')
              .select('id, auto_paused')
              .eq('account_id', account.id)
              .eq('campaign_id', campaign.campaign_id)
              .eq('alert_type', 'budget_exceeded')
              .gte('created_at', new Date().toISOString().split('T')[0])
              .single();

            if (!existingAlert || !existingAlert.auto_paused) {
              try {
                // Pause campaign via Google Ads API
                const { customer } = await getGoogleAdsClientForAccount(account.id);
                await pauseCampaign(customer, campaign.campaign_id);

                await supabase.from('budget_alerts').insert({
                  account_id: account.id,
                  campaign_id: campaign.campaign_id,
                  alert_type: 'budget_exceeded',
                  threshold_percentage: 100,
                  current_spend_micros: campaign.cost_micros,
                  budget_limit_micros: campaign.daily_budget_micros,
                  action_taken: 'auto_paused',
                  auto_paused: true,
                });

                await supabase.from('insights').insert({
                  user_id: account.user_id,
                  account_id: account.id,
                  campaign_id: campaign.campaign_id,
                  type: 'budget_overspend',
                  priority: 'critical',
                  title: 'Campaign Auto-Paused',
                  message: `Campaign "${campaign.name}" was automatically paused after exceeding daily budget`,
                  suggested_actions: ['review_budget', 'resume_campaign'],
                });

                results.campaigns_paused++;
              } catch (error: any) {
                results.errors.push(
                  `Failed to pause campaign ${campaign.campaign_id}: ${error.message}`
                );
              }
            }
          }
        }
      } catch (error: any) {
        results.errors.push(`Account ${account.id}: ${error.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Budget monitoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

