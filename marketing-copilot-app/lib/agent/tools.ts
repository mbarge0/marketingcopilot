import { tool } from "@langchain/core/tools";
import {
  campaignReportData,
  createEntityData,
  refreshData,
  analyzeData
} from "./mock-data";

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
      // Return data for requested channels
      const result: Record<string, any> = {};
      const channelList = channels || ["google", "meta"];
      channelList.forEach(channel => {
        if (channel === "google" || channel === "meta") {
          if (campaignReportData[channel]) {
            result[channel] = campaignReportData[channel];
          }
        }
      });
      
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
    console.log("Campaign ID:", campaignId);
    console.log("Adset ID:", adsetId);
    
    try {
      // Get base entity data
      const baseData = (createEntityData as any)[entity] || createEntityData.campaign;
      
      // Build response with provided parameters
      const result: any = {
        success: true,
        entity: entity,
        entityId: baseData.entityId,
        name: name || "Unnamed Entity",
        channel: channel,
        budget: budget || null,
        status: "created",
        message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} '${name || "Unnamed Entity"}' created successfully${budget ? ` with budget $${budget}` : ""}`
      };
      
      // Add parent IDs if provided
      if (campaignId) {
        result.campaignId = campaignId;
      }
      if (adsetId) {
        result.adsetId = adsetId;
      }
      
      const response = JSON.stringify(result);
      console.log("Tool result:", result);
      console.log("--- Tool Execution End ---\n");
      
      return response;
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
      const scopeValue = scope || "all";
      const dateRangeValue = dateRange || "last_30_days";
      const channelList = channels || ["google", "meta"];
      
      // Build response based on refresh data
      const result: any = {
        success: true,
        scope: scopeValue,
        dateRange: dateRangeValue,
        channels: channelList,
        updated: refreshData.updated,
        metrics: {}
      };
      
      // Add metrics for requested channels
      channelList.forEach(channel => {
        if (refreshData.metrics[channel as keyof typeof refreshData.metrics]) {
          result.metrics[channel] = refreshData.metrics[channel as keyof typeof refreshData.metrics];
        }
      });
      
      // Calculate new entities count
      const newEntitiesCount = refreshData.newEntities.campaigns + 
                               refreshData.newEntities.adsets + 
                               refreshData.newEntities.ads;
      
      result.message = `Data refreshed for ${dateRangeValue}. ${refreshData.newEntities.campaigns} new campaigns detected.`;
      
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
      const dateRangeValue = dateRange || "last_7_days";
      const channelList = channels || ["google", "meta"];
      const metricValue = metric || "all";
      
      // Build analysis response
      const result = {
        analysis: {
          query: query || "analyze performance",
          dateRange: dateRangeValue,
          channels: channelList,
          metric: metricValue,
          findings: analyzeData.findings,
          rootCause: analyzeData.rootCause,
          recommendations: analyzeData.recommendations
        },
        summary: analyzeData.rootCause
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
