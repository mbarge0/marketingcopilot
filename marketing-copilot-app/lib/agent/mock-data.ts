// Mock data for testing tool functionality
// This file contains all mock data used by tools before real API integration

// Campaign Report Mock Data - Last 7 days with decreasing ROAS trend
export const campaignReportData = {
  google: {
    spend: 1250,
    impressions: 45000,
    clicks: 3200,
    conversions: 45,
    roas: 3.0,
    cpa: 27.78,
    cpc: 0.39,
    // Time-series data for last 7 days showing decreasing ROAS
    dailyData: [
      { date: '2025-11-01', spend: 180, impressions: 6800, clicks: 480, conversions: 7, roas: 3.5, cpc: 0.38, cpa: 25.71 },
      { date: '2025-11-02', spend: 175, impressions: 6500, clicks: 460, conversions: 7, roas: 3.4, cpc: 0.38, cpa: 25.00 },
      { date: '2025-11-03', spend: 185, impressions: 7000, clicks: 500, conversions: 8, roas: 3.6, cpc: 0.37, cpa: 23.13 },
      { date: '2025-11-04', spend: 170, impressions: 6200, clicks: 440, conversions: 6, roas: 3.3, cpc: 0.39, cpa: 28.33 },
      { date: '2025-11-05', spend: 190, impressions: 7200, clicks: 520, conversions: 7, roas: 3.2, cpc: 0.37, cpa: 27.14 },
      { date: '2025-11-06', spend: 180, impressions: 6800, clicks: 480, conversions: 6, roas: 2.9, cpc: 0.38, cpa: 30.00 }, // ROAS dropping
      { date: '2025-11-07', spend: 176, impressions: 6600, clicks: 320, conversions: 4, roas: 2.6, cpc: 0.55, cpa: 44.00 }, // Big drop!
      { date: '2025-11-08', spend: 178, impressions: 6700, clicks: 350, conversions: 5, roas: 2.7, cpc: 0.51, cpa: 35.60 }, // Today - slight recovery
    ]
  },
  meta: {
    spend: 1800,
    impressions: 38000,
    clicks: 2100,
    conversions: 62,
    roas: 2.8,
    cpa: 29.03,
    cpc: 0.86,
    // Time-series data for last 7 days
    dailyData: [
      { date: '2025-11-01', spend: 260, impressions: 5600, clicks: 310, conversions: 9, roas: 2.9, cpc: 0.84, cpa: 28.89 },
      { date: '2025-11-02', spend: 255, impressions: 5400, clicks: 300, conversions: 9, roas: 2.8, cpc: 0.85, cpa: 28.33 },
      { date: '2025-11-03', spend: 270, impressions: 5800, clicks: 320, conversions: 10, roas: 3.0, cpc: 0.84, cpa: 27.00 },
      { date: '2025-11-04', spend: 250, impressions: 5200, clicks: 290, conversions: 8, roas: 2.7, cpc: 0.86, cpa: 31.25 },
      { date: '2025-11-05', spend: 265, impressions: 5600, clicks: 310, conversions: 9, roas: 2.8, cpc: 0.85, cpa: 29.44 },
      { date: '2025-11-06', spend: 260, impressions: 5500, clicks: 305, conversions: 9, roas: 2.8, cpc: 0.85, cpa: 28.89 },
      { date: '2025-11-07', spend: 240, impressions: 5100, clicks: 265, conversions: 8, roas: 2.7, cpc: 0.91, cpa: 30.00 },
      { date: '2025-11-08', spend: 245, impressions: 5300, clicks: 280, conversions: 8, roas: 2.8, cpc: 0.88, cpa: 30.63 }, // Today
    ]
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

// Analyze Performance Mock Data - For "why did ROAS drop yesterday?"
export const analyzeData = {
  summary: "ROAS dropped 18% yesterday (Nov 7) on Google Ads, primarily due to a CPC spike (+41%) combined with a conversion rate decline (-33%). Meta Ads remained stable.",
  findings: [
    {
      metric: "roas",
      channel: "google",
      change: -18.5,
      changeLabel: "vs previous day",
      impact: "critical",
      explanation: "ROAS dropped from 2.9x to 2.6x yesterday",
      previousValue: 2.9,
      currentValue: 2.6,
      trend: "down"
    },
    {
      metric: "cpc",
      channel: "google",
      change: +41.0,
      changeLabel: "vs previous day",
      impact: "high",
      explanation: "CPC spiked from $0.38 to $0.55 (+$0.17) - significant increase",
      previousValue: 0.38,
      currentValue: 0.55,
      trend: "up"
    },
    {
      metric: "conversion_rate",
      channel: "google",
      change: -33.3,
      changeLabel: "vs previous day",
      impact: "high",
      explanation: "Conversion rate dropped from 1.25% to 0.83% (6 conversions → 4 conversions)",
      previousValue: 1.25,
      currentValue: 0.83,
      trend: "down"
    },
    {
      metric: "spend",
      channel: "google",
      change: -2.2,
      changeLabel: "vs previous day",
      impact: "neutral",
      explanation: "Spend remained relatively stable ($180 → $176)",
      previousValue: 180,
      currentValue: 176,
      trend: "neutral"
    },
    {
      metric: "clicks",
      channel: "google",
      change: -33.3,
      changeLabel: "vs previous day",
      impact: "high",
      explanation: "Clicks dropped significantly from 480 to 320",
      previousValue: 480,
      currentValue: 320,
      trend: "down"
    }
  ],
  rootCause: "The ROAS drop was caused by a perfect storm: CPC increased 41% (likely due to increased competition or bid adjustments) while conversion rate dropped 33% (fewer clicks converting). This suggests potential ad fatigue or audience targeting issues.",
  recommendations: [
    "Review recent bid adjustments - check if automated bidding increased CPC",
    "Investigate ad creative performance - low conversion rate may indicate creative fatigue",
    "Check audience targeting - verify if retargeting audiences are still engaged",
    "Consider pausing underperforming ad sets temporarily to preserve budget"
  ],
  anomaly: {
    detected: true,
    date: "2025-11-07",
    severity: "high",
    affectedChannels: ["google"],
    affectedMetrics: ["roas", "cpc", "conversion_rate"]
  },
  // Time-series comparison data
  timeSeries: {
    labels: ['Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8'],
    roas: [3.5, 3.4, 3.6, 3.3, 3.2, 2.9, 2.6, 2.7],
    cpc: [0.38, 0.38, 0.37, 0.39, 0.37, 0.38, 0.55, 0.51],
    spend: [180, 175, 185, 170, 190, 180, 176, 178],
    conversions: [7, 7, 8, 6, 7, 6, 4, 5]
  }
};

