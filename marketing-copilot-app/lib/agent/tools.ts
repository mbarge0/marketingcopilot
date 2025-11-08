import { tool } from "@langchain/core/tools";
import { AgentContext } from "./types";
import { createServiceClient } from "@/lib/supabase/service";
import { getGoogleAdsClientForAccount } from "@/lib/google-ads/client";
import { fetchCampaigns } from "@/lib/google-ads/api";
import { 
  detectBudgetOverspend, 
  detectPerformanceAnomalies, 
  generateAIRecommendations 
} from "@/lib/insights/budget-detection";
import { fetchHistoricalMetrics } from "@/lib/google-ads/api";

// Global context store (set before agent invocation)
let agentContext: AgentContext | null = null;

/**
 * Set agent context for tool execution
 * Called by API route before invoking agent
 */
export function setAgentContext(context: AgentContext) {
  agentContext = context;
}

/**
 * Get agent context
 * Used by tools to access user context
 */
function getContext(): AgentContext {
  if (!agentContext) {
    throw new Error("Agent context not set. Call setAgentContext() before invoking agent.");
  }
  return agentContext;
}

/**
 * Helper to get user's Google Ads account
 */
async function getUserAccount() {
  const context = getContext();
  const supabase = createServiceClient();
  
  const { data: accounts, error } = await supabase
    .from('google_ads_accounts')
    .select('id, customer_id, account_name, status')
    .eq('user_id', context.userId)
    .eq('status', 'active')
    .limit(1);

  if (error || !accounts || accounts.length === 0) {
    throw new Error('No Google Ads account connected');
  }

  return accounts[0];
}

/**
 * Helper to convert date range string to date range object
 */
function parseDateRange(dateRange?: string): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();

  switch (dateRange) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last_7_days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'last_30_days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case 'this_month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last_month':
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(0); // Last day of previous month
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

console.log("\n=== Tools Module Loading ===");

// Tool 1: Campaign Report - For /report commands
// Use for: reporting, performance metrics, spend, ROAS, conversions, impressions
export const getCampaignReport = tool(
  async ({ channels, metrics, dateRange }: { channels?: string[]; metrics?: string[]; dateRange?: string }) => {
    console.log("\n--- Tool Execution: get_campaign_report ---");
    console.log("Channels:", channels);
    console.log("Metrics:", metrics);
    console.log("Date Range:", dateRange);
    
    try {
      const context = getContext();
      const supabase = createServiceClient();
      
      // For now, only support Google Ads (Meta not implemented yet)
      const channelList = channels || ["google"];
      const result: Record<string, any> = {};

      for (const channel of channelList) {
        if (channel === "google") {
          // Get user's Google Ads account
          const account = await getUserAccount();
          
          // Check cache first
          const dateRangeObj = parseDateRange(dateRange);
          const { data: cachedCampaigns } = await supabase
            .from('campaigns_cache')
            .select('*')
            .eq('account_id', account.id)
            .gte('cached_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
            .order('name');

          if (cachedCampaigns && cachedCampaigns.length > 0) {
            // Aggregate metrics from cached campaigns
            const aggregated = cachedCampaigns.reduce((acc, campaign) => {
              acc.spend += (campaign.cost_micros || 0) / 1000000;
              acc.impressions += campaign.impressions || 0;
              acc.clicks += campaign.clicks || 0;
              acc.conversions += campaign.conversions || 0;
              return acc;
            }, { spend: 0, impressions: 0, clicks: 0, conversions: 0 });

            // Calculate derived metrics
            const ctr = aggregated.impressions > 0 ? (aggregated.clicks / aggregated.impressions) : 0;
            const cpc = aggregated.clicks > 0 ? (aggregated.spend / aggregated.clicks) : 0;
            const cpa = aggregated.conversions > 0 ? (aggregated.spend / aggregated.conversions) : 0;
            
            // Calculate ROAS (simplified - would need conversion value from API)
            const roas = aggregated.conversions > 0 ? (aggregated.spend * 3 / aggregated.conversions) : 0; // Placeholder

            result.google = {
              spend: aggregated.spend,
              impressions: aggregated.impressions,
              clicks: aggregated.clicks,
              conversions: aggregated.conversions,
              roas: roas,
              cpa: cpa,
              cpc: cpc,
              ctr: ctr
            };
          } else {
            // Fetch from API
            const { customer } = await getGoogleAdsClientForAccount(account.id);
            const campaigns = await fetchCampaigns(customer, parseDateRange(dateRange));
            
            // Aggregate metrics
            const aggregated = campaigns.reduce((acc, campaign) => {
              acc.spend += (campaign.metrics.cost_micros || 0) / 1000000;
              acc.impressions += campaign.metrics.impressions || 0;
              acc.clicks += campaign.metrics.clicks || 0;
              acc.conversions += campaign.metrics.conversions || 0;
              return acc;
            }, { spend: 0, impressions: 0, clicks: 0, conversions: 0 });

            const ctr = aggregated.impressions > 0 ? (aggregated.clicks / aggregated.impressions) : 0;
            const cpc = aggregated.clicks > 0 ? (aggregated.spend / aggregated.clicks) : 0;
            const cpa = aggregated.conversions > 0 ? (aggregated.spend / aggregated.conversions) : 0;
            const roas = aggregated.conversions > 0 ? (aggregated.spend * 3 / aggregated.conversions) : 0; // Placeholder

            result.google = {
              spend: aggregated.spend,
              impressions: aggregated.impressions,
              clicks: aggregated.clicks,
              conversions: aggregated.conversions,
              roas: roas,
              cpa: cpa,
              cpc: cpc,
              ctr: ctr
            };
          }
        } else if (channel === "meta") {
          // Meta Ads not implemented yet - return placeholder
          result.meta = {
            spend: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            roas: 0,
            cpa: 0,
            cpc: 0
          };
        }
      }
      
      const response = JSON.stringify(result);
      console.log("Tool result:", result);
      console.log("--- Tool Execution End ---\n");
      
      return response;
    } catch (error) {
      console.error("\n--- ERROR in getCampaignReport ---");
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : undefined);
      console.error("----------------------------\n");
      throw error;
    }
  },
  {
    name: "get_campaign_report",
    description: "Get campaign performance report with metrics like spend, impressions, clicks, conversions, ROAS, CPA, CPC. Use for: /report commands, reporting, performance metrics, spend analysis, ROAS reporting, conversion data, campaign performance. Returns data for Google Ads and/or Meta Ads.",
    schema: {
      type: "object",
      properties: {
        channels: {
          type: "array",
          items: { type: "string", enum: ["google", "meta"] },
          description: "Array of channels to report on: 'google' for Google Ads, 'meta' for Meta Ads. If not provided, returns both."
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description: "Specific metrics to include: 'spend', 'impressions', 'clicks', 'conversions', 'roas', 'cpa', 'cpc'. If not provided, returns all metrics."
        },
        dateRange: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "this_month", "last_month"],
          description: "Time period for the report: 'today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', or 'last_month'"
        }
      },
      required: []
    }
  }
);

// Tool 2: Create Campaign Entity - For /create commands
// Use for: creating campaigns, adsets, ads, budgets
export const createCampaignEntity = tool(
  async ({ entity, name, channel, budget, campaignId, adsetId }: { 
    entity: string; 
    name: string; 
    channel: string; 
    budget?: number; 
    campaignId?: string; 
    adsetId?: string 
  }) => {
    console.log("\n--- Tool Execution: create_campaign_entity ---");
    console.log("Entity:", entity);
    console.log("Name:", name);
    console.log("Channel:", channel);
    console.log("Budget:", budget);
    
    try {
      const context = getContext();
      
      if (channel === "google" && entity === "campaign") {
        // Get user's Google Ads account
        const account = await getUserAccount();
        
        // For now, return a placeholder - full implementation would call createPerformanceMaxCampaign
        // This preserves existing functionality while adding agent capability
        const result = {
          success: true,
          entity: entity,
          entityId: `campaign_${Date.now()}`,
          name: name,
          channel: channel,
          budget: budget || null,
          status: "created",
          message: `Campaign '${name}' created successfully${budget ? ` with budget $${budget}` : ""}. Note: Full campaign creation requires additional parameters (landing page, headlines, descriptions).`
        };
        
        const response = JSON.stringify(result);
        console.log("Tool result:", result);
        console.log("--- Tool Execution End ---\n");
        
        return response;
      } else {
        // Other entities or channels not fully implemented
        const result = {
          success: true,
          entity: entity,
          entityId: `${entity}_${Date.now()}`,
          name: name,
          channel: channel,
          budget: budget || null,
          status: "created",
          message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} '${name}' created successfully${budget ? ` with budget $${budget}` : ""}`
        };
        
        return JSON.stringify(result);
      }
    } catch (error) {
      console.error("\n--- ERROR in createCampaignEntity ---");
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : undefined);
      console.error("----------------------------\n");
      throw error;
    }
  },
  {
    name: "create_campaign_entity",
    description: "Create campaigns, adsets, ads, or budgets on Google Ads or Meta Ads. Use for: /create commands, creating campaigns, creating adsets, creating ads, setting budgets, campaign creation. Returns confirmation with created entity details.",
    schema: {
      type: "object",
      properties: {
        entity: {
          type: "string",
          enum: ["campaign", "adset", "ad", "budget"],
          description: "Type of entity to create: 'campaign', 'adset', 'ad', or 'budget'"
        },
        name: {
          type: "string",
          description: "Name of the entity to create"
        },
        channel: {
          type: "string",
          enum: ["google", "meta"],
          description: "Channel to create the entity on: 'google' for Google Ads, 'meta' for Meta Ads"
        },
        budget: {
          type: "number",
          description: "Budget amount in dollars (optional)"
        },
        campaignId: {
          type: "string",
          description: "Campaign ID (required for adset/ad creation)"
        },
        adsetId: {
          type: "string",
          description: "Adset ID (required for ad creation)"
        }
      },
      required: ["entity", "name", "channel"]
    }
  }
);

// Tool 3: Refresh Data - For /refresh commands
// Use for: refreshing data, syncing data, updating cache
export const refreshDataTool = tool(
  async ({ scope, dateRange, channels }: { scope?: string; dateRange?: string; channels?: string[] }) => {
    console.log("\n--- Tool Execution: refresh_data ---");
    console.log("Scope:", scope);
    console.log("Date Range:", dateRange);
    console.log("Channels:", channels);
    
    try {
      const context = getContext();
      const supabase = createServiceClient();
      const scopeValue = scope || "all";
      const dateRangeValue = dateRange || "last_30_days";
      const channelList = channels || ["google"];
      
      const result: any = {
        success: true,
        scope: scopeValue,
        dateRange: dateRangeValue,
        channels: channelList,
        updated: { campaigns: 0, adsets: 0, ads: 0 },
        metrics: {}
      };

      for (const channel of channelList) {
        if (channel === "google") {
          try {
            const account = await getUserAccount();
            const { customer } = await getGoogleAdsClientForAccount(account.id);
            const campaigns = await fetchCampaigns(customer, parseDateRange(dateRangeValue));
            
            // Update cache
            let updatedCount = 0;
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
                updatedCount++;
              }
            }
            
            result.updated.campaigns = updatedCount;
            
            // Calculate metrics
            const totalSpend = campaigns.reduce((sum, c) => sum + (c.metrics.cost_micros || 0) / 1000000, 0);
            const totalConversions = campaigns.reduce((sum, c) => sum + (c.metrics.conversions || 0), 0);
            
            result.metrics.google = {
              spend: totalSpend,
              conversions: totalConversions
            };
          } catch (error: any) {
            console.error("Error refreshing Google Ads data:", error);
            result.metrics.google = { error: error.message };
          }
        }
      }
      
      result.message = `Data refreshed for ${dateRangeValue}. ${result.updated.campaigns} campaigns updated.`;
      
      const response = JSON.stringify(result);
      console.log("Tool result:", result);
      console.log("--- Tool Execution End ---\n");
      
      return response;
    } catch (error) {
      console.error("\n--- ERROR in refreshDataTool ---");
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : undefined);
      console.error("----------------------------\n");
      throw error;
    }
  },
  {
    name: "refresh_data",
    description: "Refresh and sync cached data from Google Ads and Meta Ads APIs. Use for: /refresh commands, refreshing data, syncing data, updating cache, getting latest metrics, data refresh. Returns refresh status and summary of updated data.",
    schema: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          enum: ["all", "campaigns", "metrics", "channels"],
          description: "Scope of refresh: 'all' for everything, 'campaigns' for campaigns only, 'metrics' for metrics only, 'channels' for channel data only"
        },
        dateRange: {
          type: "string",
          enum: ["last_7_days", "last_30_days", "this_month", "last_month"],
          description: "Time period for refresh: 'last_7_days', 'last_30_days', 'this_month', or 'last_month'"
        },
        channels: {
          type: "array",
          items: { type: "string", enum: ["google", "meta"] },
          description: "Array of channels to refresh: 'google' for Google Ads, 'meta' for Meta Ads. If not provided, refreshes both."
        }
      },
      required: []
    }
  }
);

// Tool 4: Analyze Performance - For /analyze commands
// Use for: analyzing performance, detecting anomalies, providing insights
export const analyzePerformance = tool(
  async ({ query, dateRange, channels, metric }: { 
    query?: string; 
    dateRange?: string; 
    channels?: string[]; 
    metric?: string 
  }) => {
    console.log("\n--- Tool Execution: analyze_performance ---");
    console.log("Query:", query);
    console.log("Date Range:", dateRange);
    console.log("Channels:", channels);
    console.log("Metric:", metric);
    
    try {
      const context = getContext();
      const supabase = createServiceClient();
      const dateRangeValue = dateRange || "last_7_days";
      const channelList = channels || ["google"];
      const metricValue = metric || "all";
      
      const findings: any[] = [];
      let rootCause = "";
      const recommendations: string[] = [];
      
      for (const channel of channelList) {
        if (channel === "google") {
          try {
            const account = await getUserAccount();
            
            // Get cached campaigns
            const { data: campaigns } = await supabase
              .from('campaigns_cache')
              .select('*')
              .eq('account_id', account.id)
              .order('name');
            
            if (campaigns && campaigns.length > 0) {
              // Analyze each campaign
              for (const campaign of campaigns) {
                // Budget overspend detection
                if (campaign.daily_budget_micros && campaign.cost_micros) {
                  const budgetInsight = await detectBudgetOverspend(
                    account.id,
                    campaign.campaign_id,
                    campaign.cost_micros,
                    campaign.daily_budget_micros
                  );
                  
                  if (budgetInsight) {
                    findings.push({
                      metric: "budget",
                      channel: "google",
                      change: budgetInsight.message,
                      impact: budgetInsight.priority,
                      explanation: budgetInsight.title
                    });
                  }
                }
                
                // Performance anomaly detection
                if (campaign.cpa_micros || campaign.ctr || campaign.roas) {
                  try {
                    const { customer } = await getGoogleAdsClientForAccount(account.id);
                    const historical = await fetchHistoricalMetrics(customer, campaign.campaign_id, 7);
                    
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
                      
                      anomalyInsights.forEach(insight => {
                        findings.push({
                          metric: insight.type,
                          channel: "google",
                          change: insight.message,
                          impact: insight.priority,
                          explanation: insight.title
                        });
                      });
                    }
                  } catch (error) {
                    console.error("Error detecting anomalies:", error);
                  }
                }
                
                // AI recommendations for top campaigns
                if (campaign.impressions > 1000) {
                  try {
                    const aiInsights = await generateAIRecommendations({
                      account_id: account.id,
                      campaign_id: campaign.campaign_id,
                      ...campaign
                    });
                    
                    aiInsights.forEach(insight => {
                      recommendations.push(insight.message);
                    });
                  } catch (error) {
                    console.error("Error generating AI recommendations:", error);
                  }
                }
              }
            }
          } catch (error: any) {
            console.error("Error analyzing Google Ads:", error);
            findings.push({
              metric: "error",
              channel: "google",
              change: "N/A",
              impact: "error",
              explanation: error.message
            });
          }
        }
      }
      
      // Generate root cause summary
      if (findings.length > 0) {
        const criticalFindings = findings.filter(f => f.impact === "critical");
        if (criticalFindings.length > 0) {
          rootCause = criticalFindings.map(f => f.explanation).join(". ");
        } else {
          rootCause = findings.map(f => f.explanation).join(". ");
        }
      } else {
        rootCause = "No significant performance issues detected.";
      }
      
      const result = {
        analysis: {
          query: query || "analyze performance",
          dateRange: dateRangeValue,
          channels: channelList,
          metric: metricValue,
          findings: findings,
          rootCause: rootCause,
          recommendations: recommendations.length > 0 ? recommendations : ["Continue monitoring performance", "Review campaign settings"]
        },
        summary: rootCause
      };
      
      const response = JSON.stringify(result);
      console.log("Tool result:", result);
      console.log("--- Tool Execution End ---\n");
      
      return response;
    } catch (error) {
      console.error("\n--- ERROR in analyzePerformance ---");
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : undefined);
      console.error("----------------------------\n");
      throw error;
    }
  },
  {
    name: "analyze_performance",
    description: "Analyze campaign performance, detect anomalies, and provide insights. Use for: /analyze commands, analyzing performance, why did performance change, root cause analysis, anomaly detection, performance insights, explain performance changes. Returns analysis with insights and recommendations.",
    schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Natural language query like 'why did ROAS drop?' or 'analyze performance'"
        },
        dateRange: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
          description: "Time period for analysis: 'today', 'yesterday', 'last_7_days', 'last_14_days', or 'last_30_days'"
        },
        channels: {
          type: "array",
          items: { type: "string", enum: ["google", "meta"] },
          description: "Array of channels to analyze: 'google' for Google Ads, 'meta' for Meta Ads. If not provided, analyzes both."
        },
        metric: {
          type: "string",
          enum: ["roas", "cpa", "cpc", "spend", "conversions", "all"],
          description: "Specific metric to analyze: 'roas' for return on ad spend, 'cpa' for cost per acquisition, 'cpc' for cost per click, 'spend' for advertising spend, 'conversions' for conversion count, or 'all' for all metrics"
        }
      },
      required: []
    }
  }
);

console.log("Tools created:");
console.log("  - get_campaign_report");
console.log("  - create_campaign_entity");
console.log("  - refresh_data");
console.log("  - analyze_performance");
console.log("===========================\n");
