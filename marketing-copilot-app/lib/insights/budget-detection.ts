import { createServiceClient } from '@/lib/supabase/service';

export interface Insight {
  id?: string;
  user_id: string;
  account_id?: string;
  campaign_id?: string;
  type: 'budget_overspend' | 'performance_anomaly' | 'optimization' | 'alert';
  priority: 'critical' | 'opportunity' | 'info';
  title: string;
  message: string;
  suggested_actions: string[];
  created_at?: string;
  dismissed?: boolean;
}

/**
 * Detect budget overspend
 */
export async function detectBudgetOverspend(
  accountId: string,
  campaignId: string,
  spendMicros: number,
  budgetMicros: number
): Promise<Insight | null> {
  const spendPercent = (spendMicros / budgetMicros) * 100;

  if (spendPercent > 100) {
    return {
      user_id: '', // Will be set by caller
      account_id: accountId,
      campaign_id: campaignId,
      type: 'budget_overspend',
      priority: 'critical',
      title: 'Budget Overspend Detected',
      message: `Campaign has spent $${(spendMicros / 1000000).toFixed(2)} of $${(budgetMicros / 1000000).toFixed(2)} daily budget (${spendPercent.toFixed(1)}% over)`,
      suggested_actions: ['pause_campaign', 'increase_budget', 'investigate'],
    };
  }

  if (spendPercent > 90) {
    return {
      user_id: '',
      account_id: accountId,
      campaign_id: campaignId,
      type: 'budget_overspend',
      priority: 'critical',
      title: 'Budget Warning',
      message: `Campaign has spent $${(spendMicros / 1000000).toFixed(2)} of $${(budgetMicros / 1000000).toFixed(2)} daily budget (${spendPercent.toFixed(1)}%)`,
      suggested_actions: ['monitor', 'increase_budget'],
    };
  }

  return null;
}

/**
 * Calculate z-score for anomaly detection
 */
function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

/**
 * Detect performance anomalies using z-score
 */
export async function detectPerformanceAnomalies(
  accountId: string,
  campaignId: string,
  currentMetrics: {
    cpa_micros: number | null;
    ctr: number | null;
    roas: number | null;
  },
  historicalMetrics: Array<{
    metrics: {
      cpa_micros: number | null;
      ctr: number | null;
      roas: number | null;
    };
  }>
): Promise<Insight[]> {
  const insights: Insight[] = [];

  if (historicalMetrics.length < 3) {
    return insights; // Need at least 3 data points
  }

  // Calculate averages and standard deviations
  const cpaValues = historicalMetrics
    .map((m) => m.metrics.cpa_micros)
    .filter((v): v is number => v !== null);
  const ctrValues = historicalMetrics
    .map((m) => m.metrics.ctr)
    .filter((v): v is number => v !== null);
  const roasValues = historicalMetrics
    .map((m) => m.metrics.roas)
    .filter((v): v is number => v !== null);

  // CPA anomaly detection
  if (currentMetrics.cpa_micros !== null && cpaValues.length > 0) {
    const meanCPA = cpaValues.reduce((a, b) => a + b, 0) / cpaValues.length;
    const varianceCPA =
      cpaValues.reduce((sum, val) => sum + Math.pow(val - meanCPA, 2), 0) /
      cpaValues.length;
    const stdDevCPA = Math.sqrt(varianceCPA);
    const zScoreCPA = calculateZScore(
      currentMetrics.cpa_micros,
      meanCPA,
      stdDevCPA
    );

    if (Math.abs(zScoreCPA) > 2) {
      insights.push({
        user_id: '',
        account_id: accountId,
        campaign_id: campaignId,
        type: 'performance_anomaly',
        priority: zScoreCPA < -2 ? 'opportunity' : 'critical',
        title: 'CPA Anomaly Detected',
        message: `CPA ${zScoreCPA < 0 ? 'dropped' : 'increased'} significantly (z-score: ${zScoreCPA.toFixed(2)})`,
        suggested_actions: ['view_details', 'adjust_budget'],
      });
    }
  }

  // CTR anomaly detection
  if (currentMetrics.ctr !== null && ctrValues.length > 0) {
    const meanCTR = ctrValues.reduce((a, b) => a + b, 0) / ctrValues.length;
    const varianceCTR =
      ctrValues.reduce((sum, val) => sum + Math.pow(val - meanCTR, 2), 0) /
      ctrValues.length;
    const stdDevCTR = Math.sqrt(varianceCTR);
    const zScoreCTR = calculateZScore(currentMetrics.ctr, meanCTR, stdDevCTR);

    if (Math.abs(zScoreCTR) > 2) {
      insights.push({
        user_id: '',
        account_id: accountId,
        campaign_id: campaignId,
        type: 'performance_anomaly',
        priority: zScoreCTR > 2 ? 'opportunity' : 'info',
        title: 'CTR Anomaly Detected',
        message: `CTR ${zScoreCTR > 0 ? 'increased' : 'decreased'} significantly (z-score: ${zScoreCTR.toFixed(2)})`,
        suggested_actions: ['view_details'],
      });
    }
  }

  // ROAS anomaly detection
  if (currentMetrics.roas !== null && roasValues.length > 0) {
    const meanROAS = roasValues.reduce((a, b) => a + b, 0) / roasValues.length;
    const varianceROAS =
      roasValues.reduce((sum, val) => sum + Math.pow(val - meanROAS, 2), 0) /
      roasValues.length;
    const stdDevROAS = Math.sqrt(varianceROAS);
    const zScoreROAS = calculateZScore(
      currentMetrics.roas,
      meanROAS,
      stdDevROAS
    );

    if (Math.abs(zScoreROAS) > 2) {
      insights.push({
        user_id: '',
        account_id: accountId,
        campaign_id: campaignId,
        type: 'performance_anomaly',
        priority: zScoreROAS > 2 ? 'opportunity' : 'critical',
        title: 'ROAS Anomaly Detected',
        message: `ROAS ${zScoreROAS > 0 ? 'increased' : 'decreased'} significantly (z-score: ${zScoreROAS.toFixed(2)})`,
        suggested_actions: ['view_details', 'adjust_budget'],
      });
    }
  }

  return insights;
}

/**
 * Generate AI recommendations using OpenAI
 */
export async function generateAIRecommendations(
  campaignData: any
): Promise<Insight[]> {
  try {
    const { generateCampaignInsights } = await import('@/lib/openai/client');
    const result = await generateCampaignInsights(campaignData);

    return (
      result.recommendations?.map((rec: any) => ({
        user_id: '',
        account_id: campaignData.account_id,
        campaign_id: campaignData.campaign_id,
        type: 'optimization' as const,
        priority: rec.priority || 'info',
        title: rec.title || 'Optimization Recommendation',
        message: rec.message || '',
        suggested_actions: rec.suggestedActions || [],
      })) || []
    );
  } catch (error) {
    console.error('Failed to generate AI recommendations:', error);
    return [];
  }
}

/**
 * Store insights in database
 */
export async function storeInsights(insights: Insight[]) {
  const supabase = createServiceClient();

  for (const insight of insights) {
    if (!insight.user_id) continue;

    await supabase.from('insights').upsert(
      {
        user_id: insight.user_id,
        account_id: insight.account_id,
        campaign_id: insight.campaign_id,
        type: insight.type,
        priority: insight.priority,
        title: insight.title,
        message: insight.message,
        suggested_actions: insight.suggested_actions,
        dismissed: false,
      },
      {
        onConflict: 'user_id,account_id,campaign_id,type',
      }
    );
  }
}

