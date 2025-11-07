/**
 * Google Ads API v17 Integration Examples
 * Marketing Co-Pilot - Real Implementation Code
 * 
 * IMPORTANT: Google Ads API v16 was sunset on February 5, 2025
 * This document uses Google Ads API v17 (latest version)
 * 
 * Package: google-ads-api (npm)
 * Version: ^17.0.0
 * Documentation: https://developers.google.com/google-ads/api/docs/start
 */

import { GoogleAdsApi, Customer, types } from 'google-ads-api';

// ============================================================================
// CLIENT INITIALIZATION
// ============================================================================

/**
 * Initialize Google Ads API client
 * Call this once per request with user's OAuth tokens
 */
export function createGoogleAdsClient(
  accessToken: string,
  refreshToken: string,
  developerToken: string,
  customerId: string // Format: "123-456-7890" (with dashes)
): Customer {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: developerToken,
  });

  // Create customer instance with OAuth tokens
  const customer = client.Customer({
    customer_id: customerId.replace(/-/g, ''), // Remove dashes for API
    refresh_token: refreshToken,
  });

  return customer;
}

// ============================================================================
// FETCH CAMPAIGNS
// ============================================================================

/**
 * Fetch all campaigns for an account
 * Returns campaign data with metrics
 */
export async function fetchCampaigns(
  customer: Customer,
  dateRange: { startDate: string; endDate: string } = {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  }
) {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      campaign_budget.total_amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_per_conversion,
      metrics.value_per_conversion,
      campaign_budget.amount_micros / 1000000.0 * metrics.conversions / NULLIF(metrics.cost_micros, 0) as roas
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
    ORDER BY campaign.name
  `;

  const results = await customer.query(query);

  return results.map((row: any) => ({
    campaign_id: row.campaign.id.toString(),
    name: row.campaign.name,
    status: row.campaign.status,
    campaign_type: row.campaign.advertising_channel_type,
    daily_budget_micros: row.campaign_budget?.amount_micros || 0,
    total_budget_micros: row.campaign_budget?.total_amount_micros || null,
    metrics: {
      impressions: parseInt(row.metrics?.impressions || 0),
      clicks: parseInt(row.metrics?.clicks || 0),
      cost_micros: parseInt(row.metrics?.cost_micros || 0),
      conversions: parseFloat(row.metrics?.conversions || 0),
      ctr: parseFloat(row.metrics?.ctr || 0),
      cpc_micros: parseInt(row.metrics?.average_cpc || 0),
      cpa_micros: row.metrics?.cost_per_conversion
        ? parseInt(row.metrics.cost_per_conversion)
        : null,
      roas: row.metrics?.value_per_conversion
        ? parseFloat(row.roas || 0)
        : null,
    },
  }));
}

// ============================================================================
// FETCH HISTORICAL METRICS (7-day average for anomaly detection)
// ============================================================================

/**
 * Fetch historical metrics for a campaign (last 7 days)
 * Used for anomaly detection (z-score calculation)
 * 
 * Query Structure:
 * - Uses segments.date to get daily metrics
 * - Filters by campaign ID and date range
 * - Returns metrics needed for z-score: CPA, CTR, ROAS
 * 
 * Example usage for anomaly detection:
 * ```javascript
 * const historical = await fetchHistoricalMetrics(customer, campaignId, 7);
 * const avgCPA = historical.reduce((sum, m) => sum + (m.metrics.cpa_micros || 0), 0) / historical.length;
 * const zScore = (currentCPA - avgCPA) / stdDev(historical.map(m => m.metrics.cpa_micros));
 * ```
 */
export async function fetchHistoricalMetrics(
  customer: Customer,
  campaignId: string,
  days: number = 7
) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const query = `
    SELECT
      campaign.id,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_per_conversion,
      metrics.value_per_conversion
    FROM campaign
    WHERE campaign.id = ${campaignId}
      AND segments.date BETWEEN '${startDate.toISOString().split('T')[0]}' 
        AND '${endDate.toISOString().split('T')[0]}'
    ORDER BY segments.date DESC
  `;

  const results = await customer.query(query);

  return results.map((row: any) => ({
    date: row.segments.date,
    campaign_id: row.campaign.id.toString(),
    metrics: {
      impressions: parseInt(row.metrics?.impressions || 0),
      clicks: parseInt(row.metrics?.clicks || 0),
      cost_micros: parseInt(row.metrics?.cost_micros || 0),
      conversions: parseFloat(row.metrics?.conversions || 0),
      ctr: parseFloat(row.metrics?.ctr || 0),
      cpc_micros: parseInt(row.metrics?.average_cpc || 0),
      cpa_micros: row.metrics?.cost_per_conversion
        ? parseInt(row.metrics.cost_per_conversion)
        : null,
      roas: row.metrics?.value_per_conversion
        ? parseFloat(row.metrics.value_per_conversion)
        : null,
    },
  }));
}

// ============================================================================
// CREATE PERFORMANCE MAX CAMPAIGN
// ============================================================================

/**
 * Create a Performance Max campaign
 * This is the REAL implementation - not pseudocode
 */
export async function createPerformanceMaxCampaign(
  customer: Customer,
  campaignData: {
    name: string;
    dailyBudgetMicros: number;
    targetCpaMicros?: number;
    landingPageUrl: string;
    headlines: string[];
    descriptions: string[];
    finalUrl?: string;
  }
) {
  // Step 1: Create Campaign Budget
  const budgetOperation: types.CampaignBudgetOperation = {
    create: {
      name: `${campaignData.name} Budget`,
      amount_micros: campaignData.dailyBudgetMicros,
      delivery_method: types.BudgetDeliveryMethod.STANDARD,
      explicitly_shared: false,
    },
  };

  const budgetResponse = await customer.campaignBudgets.mutate({
    operations: [budgetOperation],
  });

  const budgetResourceName = budgetResponse.results[0].resource_name;
  const budgetId = budgetResourceName.split('/')[1];

  // Step 2: Create Performance Max Campaign
  const campaignOperation: types.CampaignOperation = {
    create: {
      name: `[DEMO] ${campaignData.name}`,
      advertising_channel_type: types.AdvertisingChannelType.PERFORMANCE_MAX,
      status: types.CampaignStatus.PAUSED, // Start paused, enable after asset group creation
      campaign_budget: budgetResourceName,
      bidding_strategy_type: types.BiddingStrategyType.TARGET_CPA,
      target_cpa: {
        target_cpa_micros: campaignData.targetCpaMicros || 50000000, // $50 default
      },
      // Performance Max specific settings
      performance_max_upgrade: {
        pre_upgrade_campaign: '', // Empty for new campaigns
      },
    },
  };

  const campaignResponse = await customer.campaigns.mutate({
    operations: [campaignOperation],
  });

  const campaignResourceName = campaignResponse.results[0].resource_name;
  const campaignId = campaignResourceName.split('/')[1];

  // Step 3: Create Asset Group
  const assetGroupOperation: types.AssetGroupOperation = {
    create: {
      name: `${campaignData.name} - Asset Group`,
      campaign: campaignResourceName,
      final_urls: [campaignData.landingPageUrl],
      final_mobile_urls: campaignData.finalUrl
        ? [campaignData.finalUrl]
        : undefined,
    },
  };

  const assetGroupResponse = await customer.assetGroups.mutate({
    operations: [assetGroupOperation],
  });

  const assetGroupResourceName = assetGroupResponse.results[0].resource_name;

  // Step 4: Create Text Assets (Headlines and Descriptions)
  const textAssets: types.Asset[] = [];

  // Create headline assets
  for (const headline of campaignData.headlines) {
    const headlineAsset: types.AssetOperation = {
      create: {
        name: `Headline: ${headline.substring(0, 30)}`,
        text_asset: {
          text: headline,
        },
      },
    };

    const headlineResponse = await customer.assets.mutate({
      operations: [headlineAsset],
    });

    textAssets.push({
      resource_name: headlineResponse.results[0].resource_name,
    });
  }

  // Create description assets
  for (const description of campaignData.descriptions) {
    const descAsset: types.AssetOperation = {
      create: {
        name: `Description: ${description.substring(0, 30)}`,
        text_asset: {
          text: description,
        },
      },
    };

    const descResponse = await customer.assets.mutate({
      operations: [descAsset],
    });

    textAssets.push({
      resource_name: descResponse.results[0].resource_name,
    });
  }

  // Step 5: Link Assets to Asset Group
  const assetGroupAssetOperations: types.AssetGroupAssetOperation[] = [];

  // Link headlines (first 3 assets)
  for (let i = 0; i < Math.min(3, campaignData.headlines.length); i++) {
    assetGroupAssetOperations.push({
      create: {
        asset: textAssets[i].resource_name!,
        asset_group: assetGroupResourceName,
        field_type: types.AssetFieldType.HEADLINE,
      },
    });
  }

  // Link descriptions (next 2 assets)
  for (
    let i = campaignData.headlines.length;
    i < campaignData.headlines.length + Math.min(2, campaignData.descriptions.length);
    i++
  ) {
    assetGroupAssetOperations.push({
      create: {
        asset: textAssets[i].resource_name!,
        asset_group: assetGroupResourceName,
        field_type: types.AssetFieldType.DESCRIPTION,
      },
    });
  }

  await customer.assetGroupAssets.mutate({
    operations: assetGroupAssetOperations,
  });

  // Step 6: Enable Campaign
  const enableOperation: types.CampaignOperation = {
    update: {
      resource_name: campaignResourceName,
      status: types.CampaignStatus.ENABLED,
    },
    update_mask: {
      paths: ['status'],
    },
  };

  await customer.campaigns.mutate({
    operations: [enableOperation],
  });

  return {
    success: true,
    campaign_id: campaignId,
    campaign_resource_name: campaignResourceName,
    budget_id: budgetId,
    asset_group_resource_name: assetGroupResourceName,
  };
}

// ============================================================================
// PAUSE/RESUME CAMPAIGN
// ============================================================================

/**
 * Pause a campaign
 */
export async function pauseCampaign(
  customer: Customer,
  campaignId: string
): Promise<void> {
  const campaignResourceName = `customers/${customer.credentials.customer_id}/campaigns/${campaignId}`;

  const operation: types.CampaignOperation = {
    update: {
      resource_name: campaignResourceName,
      status: types.CampaignStatus.PAUSED,
    },
    update_mask: {
      paths: ['status'],
    },
  };

  await customer.campaigns.mutate({
    operations: [operation],
  });
}

/**
 * Resume a campaign
 */
export async function resumeCampaign(
  customer: Customer,
  campaignId: string
): Promise<void> {
  const campaignResourceName = `customers/${customer.credentials.customer_id}/campaigns/${campaignId}`;

  const operation: types.CampaignOperation = {
    update: {
      resource_name: campaignResourceName,
      status: types.CampaignStatus.ENABLED,
    },
    update_mask: {
      paths: ['status'],
    },
  };

  await customer.campaigns.mutate({
    operations: [operation],
  });
}

// ============================================================================
// UPDATE CAMPAIGN BUDGET
// ============================================================================

/**
 * Update campaign daily budget
 * Note: Budgets are shared resources, so we need to update the budget resource
 */
export async function updateCampaignBudget(
  customer: Customer,
  budgetResourceName: string,
  newBudgetMicros: number
): Promise<void> {
  const operation: types.CampaignBudgetOperation = {
    update: {
      resource_name: budgetResourceName,
      amount_micros: newBudgetMicros,
    },
    update_mask: {
      paths: ['amount_micros'],
    },
  };

  await customer.campaignBudgets.mutate({
    operations: [operation],
  });
}

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

/**
 * Extract error details from Google Ads API error
 */
export function parseGoogleAdsError(error: any): {
  code: string;
  message: string;
  details?: any;
  fixSuggestions?: string[];
} {
  if (error.code === 'PERMISSION_DENIED') {
    return {
      code: 'permission_denied',
      message: 'You do not have permission to perform this action',
      fixSuggestions: [
        'Verify OAuth scopes include googleads.edit',
        'Check account access permissions in Google Ads',
      ],
    };
  }

  if (error.code === 'QUOTA_EXCEEDED') {
    return {
      code: 'quota_exceeded',
      message: 'Google Ads API quota exceeded',
      fixSuggestions: [
        'Wait before retrying (rate limit: 10,000 requests/day)',
        'Check cache to avoid duplicate requests',
      ],
    };
  }

  if (error.code === 'POLICY_VIOLATION') {
    return {
      code: 'policy_violation',
      message: error.message || 'Campaign violates Google Ads policies',
      details: error.details,
      fixSuggestions: [
        'Review ad copy for policy violations',
        'Check landing page URL is accessible',
        'Verify targeting settings comply with policies',
      ],
    };
  }

  if (error.code === 'BUDGET_EXCEEDED') {
    return {
      code: 'budget_exceeded',
      message: 'Account budget limit reached',
      fixSuggestions: [
        'Increase account budget in Google Ads Manager',
        'Reduce campaign budgets',
      ],
    };
  }

  return {
    code: 'unknown_error',
    message: error.message || 'Unknown error occurred',
    details: error,
  };
}

// ============================================================================
// USAGE EXAMPLE (Next.js API Route)
// ============================================================================

/**
 * Example: Next.js API route using these functions
 */
export async function POST(request: Request) {
  const { campaignData, accountId } = await request.json();

  // Get user's OAuth tokens from database
  // const tokens = await getGoogleAdsTokens(userId, accountId);

  // Create client
  // const customer = createGoogleAdsClient(
  //   tokens.accessToken,
  //   tokens.refreshToken,
  //   process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  //   accountId
  // );

  try {
    // Create campaign
    // const result = await createPerformanceMaxCampaign(customer, campaignData);
    // return Response.json({ success: true, ...result });
  } catch (error: any) {
    const errorDetails = parseGoogleAdsError(error);
    return Response.json(
      { success: false, error: errorDetails },
      { status: 400 }
    );
  }
}

// ============================================================================
// NOTES
// ============================================================================

/**
 * IMPORTANT IMPLEMENTATION NOTES:
 * 
 * 1. Customer ID Format:
 *    - Google Ads API expects customer ID WITHOUT dashes: "1234567890"
 *    - But Google Ads UI shows WITH dashes: "123-456-7890"
 *    - Always remove dashes before API calls
 * 
 * 2. Resource Names:
 *    - Format: "customers/{customer_id}/campaigns/{campaign_id}"
 *    - Extract IDs from resource names: resourceName.split('/')[1]
 * 
 * 3. Micros Conversion:
 *    - Google Ads API uses micros (1,000,000 micros = $1 USD)
 *    - Always convert: dollars * 1_000_000 = micros
 *    - Always convert: micros / 1_000_000 = dollars
 * 
 * 4. Performance Max Requirements:
 *    - Requires Asset Group (not Ad Group)
 *    - Requires at least 3 headlines and 2 descriptions
 *    - Requires final_urls (landing page)
 *    - Can optionally include images/videos (not in MVP)
 * 
 * 5. Error Handling:
 *    - Always wrap API calls in try/catch
 *    - Check for specific error codes (POLICY_VIOLATION, QUOTA_EXCEEDED)
 *    - Provide user-friendly error messages
 * 
 * 6. Rate Limits:
 *    - Standard access: 10,000 requests/day
 *    - Implement caching to avoid hitting limits
 *    - Use batch operations where possible
 * 
 * 7. Token Refresh:
 *    - Access tokens expire after 1 hour
 *    - Use refresh_token to get new access_token
 *    - Store refreshed tokens in database
 */

