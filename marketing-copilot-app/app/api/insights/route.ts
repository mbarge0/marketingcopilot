import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import {
  detectBudgetOverspend,
  detectPerformanceAnomalies,
  generateAIRecommendations,
  storeInsights,
} from '@/lib/insights/budget-detection';
import { getGoogleAdsClientForAccount } from '@/lib/google-ads/client';
import { fetchHistoricalMetrics } from '@/lib/google-ads/api';

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

    const serviceSupabase = createServiceClient();

    // Get user's Google Ads accounts
    const { data: accounts } = await serviceSupabase
      .from('google_ads_accounts')
      .select('id, customer_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);

    if (!accounts || accounts.length === 0) {
      // Return empty insights for demo mode or no account
      return NextResponse.json({ insights: [] });
    }

    const account = accounts[0];

    // Get cached campaigns
    const { data: campaigns } = await serviceSupabase
      .from('campaigns_cache')
      .select('*')
      .eq('account_id', account.id)
      .order('name');

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    const allInsights: any[] = [];

    // Generate insights for each campaign
    for (const campaign of campaigns) {
      // Budget overspend detection
      const budgetInsight = await detectBudgetOverspend(
        account.id,
        campaign.campaign_id,
        campaign.cost_micros,
        campaign.daily_budget_micros
      );

      if (budgetInsight) {
        budgetInsight.user_id = user.id;
        allInsights.push(budgetInsight);
      }

      // Performance anomaly detection
      try {
        const { customer } = await getGoogleAdsClientForAccount(account.id);
        const historical = await fetchHistoricalMetrics(
          customer,
          campaign.campaign_id,
          7
        );

        if (historical.length > 0) {
          const anomalyInsights = await detectPerformanceAnomalies(
            account.id,
            campaign.campaign_id,
            {
              cpa_micros: campaign.cpa_micros,
              ctr: campaign.ctr,
              roas: campaign.roas,
            },
            historical
          );

          anomalyInsights.forEach((insight) => {
            insight.user_id = user.id;
            allInsights.push(insight);
          });
        }
      } catch (error) {
        console.error(
          `Failed to detect anomalies for campaign ${campaign.campaign_id}:`,
          error
        );
      }

      // AI recommendations (for top campaigns)
      if (campaign.impressions > 1000) {
        try {
          const aiInsights = await generateAIRecommendations({
            account_id: account.id,
            campaign_id: campaign.campaign_id,
            ...campaign,
          });

          aiInsights.forEach((insight) => {
            insight.user_id = user.id;
            allInsights.push(insight);
          });
        } catch (error) {
          console.error(
            `Failed to generate AI recommendations for campaign ${campaign.campaign_id}:`,
            error
          );
        }
      }
    }

    // Store insights in database
    if (allInsights.length > 0) {
      await storeInsights(allInsights);
    }

    // Get stored insights (including dismissed status)
    const { data: storedInsights } = await serviceSupabase
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      insights: storedInsights || allInsights,
    });
  } catch (error: any) {
    console.error('Insights API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}


