// Mock data for testing tool functionality
// This file contains all mock data used by tools before real API integration

// Campaign Report Mock Data
export const campaignReportData = {
  google: {
    spend: 1250,
    impressions: 45000,
    clicks: 3200,
    conversions: 45,
    roas: 3.2,
    cpa: 27.78,
    cpc: 0.39
  },
  meta: {
    spend: 1800,
    impressions: 38000,
    clicks: 2100,
    conversions: 62,
    roas: 2.8,
    cpa: 29.03,
    cpc: 0.86
  }
};

// Create Entity Mock Data
export const createEntityData = {
  campaign: {
    success: true,
    entity: "campaign",
    entityId: "campaign_12345",
    status: "created"
  },
  adset: {
    success: true,
    entity: "adset",
    entityId: "adset_67890",
    status: "created"
  },
  ad: {
    success: true,
    entity: "ad",
    entityId: "ad_11111",
    status: "created"
  },
  budget: {
    success: true,
    entity: "budget",
    entityId: "budget_22222",
    status: "created"
  }
};

// Refresh Data Mock Data
export const refreshData = {
  success: true,
  updated: {
    campaigns: 15,
    adsets: 42,
    ads: 128
  },
  newEntities: {
    campaigns: 2,
    adsets: 5,
    ads: 12
  },
  metrics: {
    google: { spend: 1250, conversions: 45 },
    meta: { spend: 1800, conversions: 62 }
  }
};

// Analyze Performance Mock Data
export const analyzeData = {
  findings: [
    {
      metric: "cpc",
      channel: "meta",
      change: "+20%",
      impact: "high",
      explanation: "CPC increased from $0.75 to $0.90 on Meta campaigns"
    },
    {
      metric: "conversion_rate",
      channel: "meta",
      change: "0%",
      impact: "neutral",
      explanation: "Conversion rate remained stable at 2.8%"
    }
  ],
  rootCause: "ROAS drop mainly due to higher CPC on Meta campaigns (+20%). Conversion rate remained stable.",
  recommendations: [
    "Review keyword bids on Meta campaigns",
    "Consider pausing underperforming adsets",
    "Monitor conversion rate for any changes"
  ]
};

