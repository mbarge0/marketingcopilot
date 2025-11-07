# Product Requirements Document (PRD)
## Marketing Co-Pilot - 24-Hour MVP

**Version:** 1.0  
**Date:** November 6, 2025  
**Timeline:** 24-hour build  
**Status:** Ready for Development

---

## 1. Objective

### Product Purpose & Mission

Build an AI-powered command center that enables performance marketers to monitor Google Ads campaigns and create new campaigns through conversational AI - all from a single, unified interface. The MVP demonstrates the core value proposition: **10x faster campaign management through AI assistance and unified visibility.**

### Problem Being Solved

Performance marketers currently face:
1. **Google Ads UI Complexity**: Native Google Ads Manager requires 30+ minutes and 47+ form fields to create a campaign
2. **Reactive Management**: Marketers manually check dashboards for issues instead of receiving proactive alerts
3. **No Intelligence Layer**: Google Ads provides data but no strategic recommendations or optimization insights

### Success Definition (Measurable Terms)

**24-Hour MVP Success Criteria:**
- ✅ User can OAuth connect to Google Ads account in <2 minutes
- ✅ Dashboard displays all campaigns with key metrics within 30 seconds of connection
- ✅ AI generates 3+ actionable insights from campaign data within first session
- ✅ User can create and publish a real Google Ads campaign in <5 minutes via conversational interface
- ✅ Published campaign appears live in Google Ads Manager with matching Campaign ID
- ✅ Application deployed and accessible via public URL

**Demo Success Metrics:**
- Time to create campaign: <5 minutes (vs. 30+ minutes in Google Ads)
- Time to first insight: <30 seconds
- Campaign publish success rate: 95%+
- Zero accidental budget overruns (enforced by hard caps)

---

## 2. Core Features

### 2.1 Google Ads Authentication & Connection
**Description:** Secure OAuth 2.0 integration with Google Ads accounts.

**Rationale:** Foundation for all data access and campaign publishing. Must be frictionless (<2 min) to avoid drop-off.

**Functional Requirements:**
- OAuth 2.0 flow using Google Ads API
- Support for multiple ad accounts per user (account selector dropdown)
- Persistent token storage with refresh logic
- Connection status indicator in UI
- "Reconnect" flow for expired tokens

**Acceptance Criteria:**
- User clicks "Connect Google Ads" → OAuth popup → Grant access → Redirected back with active connection
- Connection persists across sessions (refresh token stored securely)
- User can connect multiple accounts and switch between them
- Error handling for denied permissions with clear instructions

---

### 2.2 Command Center Dashboard
**Description:** Hybrid interface combining familiar Google Ads layout with AI-powered enhancements. Default view is a Google Ads-like campaign table with an always-present AI co-pilot chat box.

**Rationale:** Eliminates adoption friction by providing familiar interface (Google Ads clone) while adding AI superpowers through discoverable modes and chat. Users can use it exactly like Google Ads, or leverage AI for faster workflows.

**Design Principle: Progressive Disclosure**
- New users see familiar Google Ads interface (zero learning curve)
- AI features discoverable through chat box and mode tabs
- Advanced features revealed through exploration
- Power users can stay in Table mode if preferred

**Layout Structure:**

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo] [Account Selector ▼]  [Settings] [Profile]          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  MODES: ● Table | Insights | Analyze | Create | Research | Report │
│         ─────                                                 │
│         DEFAULT (Google Ads-like table)                      │
│                                                               │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                     │
│  LEFT   │  MAIN: CAMPAIGN TABLE (Google Ads style)           │
│  NAV    │  ┌───────────────────────────────────────────────┐│
│         │  │ [Filters] [Date: Last 30 days ▼] [Columns ▼] ││
│  Cam-   │  │                                                 ││
│  paigns │  │ Name    |Status|Budget|Clicks|Impr|CTR|...|ROAS││
│  ✓      │  │ ────────────────────────────────────────────││
│         │  │ Winter  | ●   |$500  |432   |15K |2.7%|...|4.2x││
│  Ad     │  │ Holiday | ●   |$300  |287   |8K  |2.3%|...|3.8x││
│  Groups │  │ Spring  | ⏸   |$200  |156   |5K  |3.1%|...|2.9x││
│         │  │ ...                                             ││
│  Ads    │  └───────────────────────────────────────────────┘│
│         │                                                     │
│  Key-   │  ┌─ AI CO-PILOT (Always Present) ───────────────┐ │
│  words  │  │ 💬 Ask your AI Co-Pilot anything...          │ │
│         │  │ [Text input with context-aware suggestions]   │ │
│  Audi-  │  │ • "Why did spend increase last week?"         │ │
│  ences  │  │ • "Create a campaign for winter jackets"     │ │
│         │  │ • "Compare my top 3 campaigns"               │ │
│  ────   │  └──────────────────────────────────────────────┘ │
│         │                                                     │
│  Reports│                                                     │
│         │                                                     │
└─────────┴───────────────────────────────────────────────────┘
```

**Mode-Based Navigation:**

The dashboard supports 6 modes, each optimized for different marketer verbs:

**Mode 1: Table (Default) - Google Ads Clone**
- **Purpose:** Familiar data analysis and monitoring
- **Verbs Supported:** Monitor, Compare, Audit, Modify, Pause, Resume
- **Features:**
  - Campaign table with all standard Google Ads columns
  - Sortable columns (Name, Budget, Spend, Clicks, Impressions, CTR, CPC, Conversions, CPA, ROAS)
  - Filterable by status, campaign type, date range
  - Customizable columns (show/hide)
  - Bulk actions (pause multiple, adjust budgets)
  - Row-level quick actions (Edit, Pause, Duplicate, View Details)
  - Expandable rows (show Ad Groups → Ads → Keywords hierarchy)
  - Export to CSV
  - "View in Google Ads" deep links
- **Acceptance Criteria:**
  - Looks 95% identical to Google Ads Manager table
  - All campaigns render within 30 seconds
  - All standard columns available
  - Sorting and filtering work identically to Google Ads
  - Bulk actions execute successfully
  - Responsive on desktop (1920x1080 and 1366x768)

**Mode 2: Insights - AI Recommendations**
- **Purpose:** Proactive alerts and optimization suggestions
- **Verbs Supported:** Monitor, Diagnose, Optimize
- **Features:**
  - AI-generated insights displayed as cards
  - Insight types: Budget alerts, Performance anomalies, Optimization recommendations
  - Priority indicators: 🔴 Critical, 🟡 Opportunity, 🟢 FYI
  - Each insight includes: Description, Suggested action buttons
  - Dismissible insights (don't reappear)
  - Auto-refresh every 5 minutes
- **Access Methods:**
  - Click "Insights" mode tab
  - Type "Show me insights" in chat box
  - Chat box can surface insights contextually
- **Acceptance Criteria:**
  - At least 3 insights generated per user session
  - Budget overspend alerts appear within 5 minutes
  - Performance anomalies detected for CPA, CTR, ROAS changes >2σ
  - User can dismiss insights
  - Insights refresh every 5 minutes

**Mode 3: Analyze - Deep Dive Analysis (Phase 2)**
- **Purpose:** Comparative analysis and trend investigation
- **Verbs Supported:** Analyze, Compare, Benchmark, Forecast, Investigate
- **Features:** (Deferred to Phase 2)
  - Campaign comparison charts
  - Trend analysis over time
  - Root cause diagnosis
  - Performance forecasting
  - Industry benchmarking

**Mode 4: Create - Campaign Builder**
- **Purpose:** Fast campaign creation via conversation
- **Verbs Supported:** Create, Launch, Write, Generate, Duplicate, Test
- **Features:** See Section 2.4 for complete specification
- **Access Methods:**
  - Click "Create" mode tab
  - Type "Create a campaign for..." in chat box (auto-switches to Create mode)
- **Acceptance Criteria:**
  - User can create campaign in <5 minutes
  - Campaign publishes successfully to Google Ads
  - Chat box can trigger campaign creation

**Mode 5: Research - Market Intelligence (Phase 2)**
- **Purpose:** Keyword, audience, and competitor research
- **Verbs Supported:** Research, Learn, Benchmark, Audit
- **Features:** (Deferred to Phase 2)
  - Keyword research
  - Audience insights
  - Competitor analysis
  - Industry benchmarks

**Mode 6: Report - Stakeholder Communication (Phase 2)**
- **Purpose:** Generate and share performance reports
- **Verbs Supported:** Report, Export, Share, Explain, Recommend
- **Features:** (Deferred to Phase 2)
  - Auto-generated reports (PDF, PPTX)
  - Executive summaries
  - Shareable report links

**Left Sidebar Navigation (Google Ads Style):**

- **Campaigns** (default, active)
  - Shows campaign count
  - Filter by status: All, Active, Paused, Removed
- **Ad Groups**
  - Shows ad groups for selected campaign
  - Filter by campaign
- **Ads & Assets**
  - Shows ads for selected ad group
  - Filter by ad group
- **Keywords**
  - Shows keywords for selected ad group
  - Filter by match type, status
- **Audiences**
  - Shows audience lists
  - Filter by type
- **Reports**
  - Quick access to saved reports
- **Account Selector** (top-right)
  - Dropdown to switch between connected accounts
  - Shows account name and status

**AI Co-Pilot Chat Box (Always Present):**

- **Location:** Fixed at bottom of screen, visible in all modes
- **Features:**
  - Context-aware suggestions (change based on current mode and selected items)
  - Natural language command execution
  - Mode switching via conversation ("Create a campaign" → switches to Create mode)
  - Action execution ("Pause Campaign X" → executes pause)
  - Question answering ("Why did CPA increase?")
  - Conversation history (expandable)
- **Context Awareness:**
  - In Table mode: Suggests analysis, creation, insights
  - When campaign selected: Suggests analysis, duplication, modification
  - In Create mode: Suggests campaign creation help
  - In Insights mode: Suggests deeper analysis
- **Acceptance Criteria:**
  - Chat box always visible and accessible
  - Suggestions update based on context
  - Commands execute successfully
  - Mode switching works via chat
  - Response time <2 seconds

**Data Refresh:**
- 5-minute polling interval for metrics (via cron job)
- Manual refresh button (top-right of table)
- Last updated timestamp displayed
- Real-time updates on user actions (pause, edit, etc.)

**Acceptance Criteria:**
- Default view (Table mode) looks and feels like Google Ads Manager
- All campaigns from connected account render in table within 30 seconds
- All standard Google Ads columns available and sortable
- Chat box accessible from all modes
- Mode switching is smooth and preserves context
- User can pause/resume campaigns from table row actions
- Dashboard updates every 5 minutes automatically
- Responsive layout works on desktop (1920x1080 and 1366x768)
- Power users can use it exactly like Google Ads (no learning curve)
- New users discover AI features through chat box and modes

---

### 2.3 AI Insights Engine
**Description:** Intelligent analysis of campaign data to surface actionable recommendations.

**Rationale:** Core differentiator - proactive intelligence vs. reactive reporting. Makes users feel like they have an expert advisor.

**Insight Types (P0 - Must Have):**

**Budget Overspend Detection (Rule-Based):**
- Trigger: Campaign spend > daily budget
- Alert: 🔴 "Campaign X has spent $843 of $500 daily budget (68% over)"
- Actions: [Pause Campaign] [Increase Budget] [Investigate]

**Performance Anomaly Detection (ML-Lite):**
- Trigger: Metric deviates >2 standard deviations from 7-day average
- Examples: "CPA dropped 23% (from $58 to $45)", "CTR increased 41%"
- Alert: 🟡 "Campaign Y is performing unusually well - consider increasing budget"
- Actions: [Increase Budget] [View Details]

**Optimization Recommendations (AI-Generated):**
- Input: Campaign metrics + historical performance
- Process: GPT-4 analyzes data and generates strategic recommendations
- Output: Natural language suggestions with projected impact
- Example: "Your 'Holiday Sale' campaign has ROAS of 4.2x, above your average of 3.8x. Recommend increasing budget by 20% ($100/day → $120/day). Projected additional revenue: $1,200/week."
- Actions: [Apply Recommendation] [Tell me more] [Ignore]

**Technical Implementation:**

> **⚠️ NOTE:** This is conceptual pseudocode. For actual implementation, see `/docs/implementation/google-ads-api-examples.ts` for real API calls and `/docs/implementation/schema.sql` for database queries.

```javascript
// Insight Generation Flow (Conceptual)
// See /docs/implementation/google-ads-api-examples.ts for real implementation

async function generateInsights(campaignData) {
  const insights = [];
  
  // 1. Rule-based checks (immediate)
  if (campaignData.actualSpend > campaignData.dailyBudget) {
    insights.push({
      type: 'budget_overspend',
      priority: 'critical',
      message: `Campaign spent $${campaignData.actualSpend} of $${campaignData.dailyBudget} daily budget`,
      actions: ['pause', 'increase_budget', 'investigate']
    });
  }
  
  // 2. Statistical anomaly detection (z-score)
  // Historical data fetched via Google Ads API query
  // Example query (see /docs/implementation/google-ads-api-examples.ts for full implementation):
  // 
  // const query = `
  //   SELECT
  //     campaign.id,
  //     segments.date,
  //     metrics.cost_per_conversion,
  //     metrics.ctr,
  //     metrics.value_per_conversion
  //   FROM campaign
  //   WHERE campaign.id = ${campaignId}
  //     AND segments.date BETWEEN '${startDate}' AND '${endDate}'
  //   ORDER BY segments.date DESC
  // `;
  //
  // Then calculate 7-day average and z-score:
  const historicalMetrics = await fetchHistoricalMetrics(customer, campaignId, 7);
  const historicalCPA = historicalMetrics.reduce((sum, m) => sum + (m.metrics.cpa_micros || 0), 0) / historicalMetrics.length;
  const cpaZScore = calculateZScore(campaignData.cpa, historicalCPA);
  if (Math.abs(cpaZScore) > 2) {
    insights.push({
      type: 'performance_anomaly',
      priority: 'opportunity',
      message: `CPA ${cpaZScore > 0 ? 'increased' : 'dropped'} significantly`,
      actions: ['view_details']
    });
  }
  
  // 3. AI recommendations (GPT-4)
  const aiRecommendation = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "You are a performance marketing expert. Analyze campaign data and provide actionable optimization recommendations."
    }, {
      role: "user",
      content: `Campaign: ${JSON.stringify(campaignData)}\nProvide 1-2 optimization recommendations.`
    }]
  });
  
  insights.push({
    type: 'optimization',
    priority: 'opportunity',
    message: aiRecommendation.choices[0].message.content,
    actions: ['apply', 'tell_me_more']
  });
  
  return insights;
}
```

**Acceptance Criteria:**
- At least 3 insights generated per user session
- Budget overspend alerts appear within 5 minutes of occurrence
- Performance anomalies detected for CPA, CTR, ROAS changes >2σ
- AI recommendations are actionable and include projected impact
- User can dismiss insights (they don't reappear)
- Insights refresh every 5 minutes with new data
- Insights accessible via Insights mode tab
- Insights also accessible via chat box ("Show me insights")
- Insights can be triggered from Table mode via chat

---

### 2.4 Conversational Campaign Builder
**Description:** AI-powered chat interface that creates Google Ads campaigns through natural language conversation.

**Rationale:** 10x time savings vs. Google Ads native UI. Dramatically lowers barrier to campaign creation.

**User Flow:**

**Step 1: Initiate Creation**
- User can create campaigns via two methods:
  1. **Via Create Mode:** Click "Create" mode tab → Opens Create mode interface
  2. **Via Chat Box:** Type "Create a campaign for..." → Auto-switches to Create mode
- Create mode presents two options:
  - 🤖 "Describe your campaign to AI" (default, recommended)
  - 📝 "Build manually" (Phase 2 - not in MVP)

**Step 2: Conversational Input**
```
┌─ CREATE CAMPAIGN WITH AI ────────────────────────┐
│                                                   │
│ 💬 Tell me about your campaign:                  │
│                                                   │
│ [Text input area - large, ~200 chars visible]    │
│ Example: "I want to promote our winter jacket    │
│ collection to women in cold climates. Budget     │
│ is $50/day. We want sales, not just traffic."    │
│                                                   │
│                              [Build Campaign →]  │
└───────────────────────────────────────────────────┘
```

**Step 3: AI Processing & Structured Output**
- AI extracts structured fields from natural language
- Shows user the structured campaign plan
- User can edit any field before publishing

```
┌─ REVIEW YOUR CAMPAIGN ────────────────────────────┐
│                                                    │
│ ✓ Campaign Name: Winter Jacket Collection         │
│   [Edit]                                           │
│                                                    │
│ ✓ Campaign Type: Performance Max                  │
│   (Recommended for your goals)                     │
│                                                    │
│ ✓ Daily Budget: $50                               │
│   [Edit] ⚠️ Max: $50/day for demo accounts       │
│                                                    │
│ ✓ Goal: Conversions (Sales)                       │
│                                                    │
│ ✓ Targeting:                                       │
│   • Women, 25-54 years old                        │
│   • Cold climate states (AK, MN, WI, MT, ND, etc)│
│   • Interests: Outdoor activities, winter sports  │
│   [Edit targeting]                                 │
│                                                    │
│ ✓ Creative Assets:                                │
│   [Upload images] [Upload videos]                 │
│   AI-Generated Headlines (3):                     │
│   • "Stay Warm This Winter"                       │
│   • "Premium Winter Jackets On Sale"              │
│   • "Cold Weather, Warm Style"                    │
│   [Regenerate headlines]                           │
│                                                    │
│   AI-Generated Descriptions (2):                  │
│   • "Shop our winter collection..."               │
│   • "Premium quality jackets..."                  │
│   [Regenerate descriptions]                        │
│                                                    │
│ Estimated Performance (AI Prediction):            │
│ • Daily impressions: ~15,000                      │
│ • Expected CPC: $1.80                             │
│ • Expected conversions/day: ~2-3                  │
│                                                    │
│ [← Back] [Save Draft] [Publish to Google Ads →] │
└────────────────────────────────────────────────────┘
```

**Step 4: Publishing**
- User clicks [Publish to Google Ads]
- System shows pre-flight validation
- Real-time status updates during creation
- Success confirmation with Google Ads Campaign ID

```
┌─ PUBLISHING CAMPAIGN ─────────────────────────────┐
│                                                    │
│ ⏳ Running pre-flight checks...                   │
│ ✓ Budget within limits ($50/day ≤ $50/day max)   │
│ ✓ Creative assets valid                           │
│ ✓ Targeting parameters valid                      │
│ ⏳ Creating campaign in Google Ads...             │
│ ⏳ Creating ad groups...                           │
│ ⏳ Creating ads...                                 │
│ ⏳ Enabling campaign...                            │
│                                                    │
│ [Progress: ████████░░ 80%]                       │
│                                                    │
│ Estimated time: 15-30 seconds                     │
└────────────────────────────────────────────────────┘
```

**Step 5: Success Confirmation**
```
┌─ CAMPAIGN PUBLISHED! ─────────────────────────────┐
│                                                    │
│ 🎉 Winter Jacket Collection is now live!         │
│                                                    │
│ Google Ads Campaign ID: 12094856234               │
│ Status: ✓ Active - Delivering                     │
│ First impressions: ~15 minutes                    │
│                                                    │
│ CAMPAIGN DETAILS:                                 │
│ • Daily Budget: $50                               │
│ • Campaign Type: Performance Max                  │
│ • Targeting: Women 25-54, Cold climates           │
│                                                    │
│ SAFETY FEATURES ENABLED:                          │
│ • Hard budget cap: $50/day                        │
│ • Auto-pause: After 24 hours (demo safety)        │
│ • Alerts: If spend >$45/day                       │
│                                                    │
│ [View in Google Ads Manager →]                    │
│ [Go to Command Center] [Create Another]          │
└────────────────────────────────────────────────────┘
```

**AI Conversation Engine Technical Spec:**

> **⚠️ NOTE:** For actual implementation, see `/docs/implementation/google-ads-api-examples.ts` for real Google Ads API v17 code.

```javascript
// Campaign Builder AI Flow (Conceptual)
// See /docs/implementation/google-ads-api-examples.ts for real implementation

async function processCampaignRequest(userMessage) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: `You are a Google Ads campaign builder assistant. 
Extract structured campaign parameters from user descriptions.
Respond ONLY with valid JSON in this format:
{
  "campaign_name": "string",
  "daily_budget": number (max 50),
  "campaign_type": "PERFORMANCE_MAX" | "SEARCH" | "DISPLAY",
  "goal": "CONVERSIONS" | "TRAFFIC" | "AWARENESS",
  "landing_page_url": "string (required)",
  "targeting": {
    "genders": ["MALE", "FEMALE", "ALL"],
    "age_ranges": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    "geo_locations": ["US-AK", "US-MN", ...],
    "interests": ["outdoor activities", ...]
  },
  "headlines": ["headline1", "headline2", "headline3"],
  "descriptions": ["desc1", "desc2"]
}`
    }, {
      role: "user",
      content: userMessage
    }],
    response_format: { type: "json_object" }
  });
  
  const campaignData = JSON.parse(completion.choices[0].message.content);
  
  // Enforce safety limits
  if (campaignData.daily_budget > 50) {
    campaignData.daily_budget = 50;
    campaignData.budget_capped = true;
  }
  
  return campaignData;
}
```

**Google Ads API Publishing Flow:**

> **⚠️ CRITICAL:** The pseudocode below does NOT match the real Google Ads API. See `/docs/implementation/google-ads-api-examples.ts` for the actual implementation using `google-ads-api` npm package v17.

**Real Implementation:** Use `createPerformanceMaxCampaign()` function from `/docs/implementation/google-ads-api-examples.ts` which:
- Uses `GoogleAdsApi` client with `mutate()` operations
- Creates Campaign Budget first, then Campaign, then Asset Group
- Links text assets (headlines/descriptions) to Asset Group
- Handles errors with proper error parsing (see `/docs/implementation/error-codes.md`)

**Auto-Pause:** Implemented via Vercel Cron Jobs (see `/docs/implementation/cron-jobs.md`), not `setTimeout()`.

**Acceptance Criteria:**
- User can describe campaign in natural language (50-500 characters)
- AI extracts all required fields with 90%+ accuracy
- User can edit any AI-generated field before publishing
- Campaign publishes to Google Ads within 30 seconds
- Published campaign appears in Google Ads Manager with matching ID
- Campaign starts delivering impressions within 15-30 minutes
- Budget caps enforced (max $50/day, max $500 total)
- Auto-pause triggers after 24 hours
- Error messages are clear and actionable
- User can regenerate AI headlines/descriptions
- Success rate: 95%+ campaigns publish without errors

---

### 2.5 Safety & Budget Controls
**Description:** Guardrails to prevent accidental overspending or policy violations during demos.

**Rationale:** Critical for MVP using real ad accounts with real budgets. Must prevent any scenario where demo causes financial damage.

**Hard Limits:**
- Maximum daily budget: $50/day per campaign
- Maximum total budget: $500 per campaign
- Maximum campaigns per demo session: 5
- All campaigns tagged with "[DEMO]" prefix
- Auto-pause after 24 hours

**Budget Alert System:**

> **⚠️ CRITICAL:** `setInterval()` does NOT work in Vercel serverless functions. Use Vercel Cron Jobs instead. See `/docs/implementation/cron-jobs.md` for the actual implementation.

**Real Implementation:** Budget monitoring is implemented via Vercel Cron Jobs:
- Endpoint: `/api/cron/monitor-budgets`
- Schedule: Every 5 minutes (`*/5 * * * *`)
- Queries database for active demo campaigns
- Checks spend vs budget from cached campaign data
- Triggers alerts and auto-pause via Google Ads API
- See `/docs/implementation/cron-jobs.md` for complete code

**Kill Switch:**
```javascript
// Emergency pause all demo campaigns
async function emergencyPauseAll() {
  const demoCampaigns = await googleAds.campaigns.list({
    filter: 'campaign.name LIKE "[DEMO]%"'
  });
  
  const results = await Promise.all(
    demoCampaigns.map(campaign => 
      googleAds.campaigns.update({
        campaign_id: campaign.id,
        status: "PAUSED"
      })
    )
  );
  
  return {
    paused: results.length,
    timestamp: new Date().toISOString()
  };
}

// Exposed via admin UI and API endpoint
app.post('/api/admin/emergency-pause', authenticateAdmin, async (req, res) => {
  const result = await emergencyPauseAll();
  res.json(result);
});
```

**Acceptance Criteria:**
- No campaign can exceed $50/day budget
- No campaign can exceed $500 total budget
- Budget alerts sent at 90% threshold
- Auto-pause triggers at 100% budget
- Auto-pause triggers after 24 hours
- All demo campaigns have "[DEMO]" prefix
- Kill switch can pause all campaigns in <10 seconds
- Admin dashboard shows total demo spend in real-time

---

### 2.6 Onboarding & Demo Mode
**Description:** Frictionless first-time user experience with option to explore without connecting real accounts.

**Rationale:** Reduces barrier to trial. Users can see value immediately before granting OAuth access.

**Onboarding Flow:**

**Landing Screen:**
```
┌─ WELCOME TO MARKETING CO-PILOT ───────────────────┐
│                                                    │
│ Manage your Google Ads campaigns 10x faster       │
│ with AI-powered insights and automation           │
│                                                    │
│ [Connect Google Ads Account]                      │
│                                                    │
│           - OR -                                   │
│                                                    │
│ [Try Demo Mode First]                             │
│ (Explore with sample data)                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Demo Mode Features:**
- Pre-populated with 5 synthetic campaigns
- Realistic metrics (impressions, clicks, spend, conversions)
- AI insights generated from synthetic data
- Full UI functionality (except real publishing)
- "Upgrade to Real Account" prompt in header
- Demo badge: "🎭 Demo Mode - Using Sample Data"

**Synthetic Data Generation:**
```javascript
// Demo campaign data
const demoCampaigns = [
  {
    id: "demo_001",
    name: "Summer Sale 2025",
    status: "ACTIVE",
    daily_budget: 100,
    metrics: {
      impressions: 15847,
      clicks: 432,
      spend: 87.43,
      conversions: 12,
      ctr: 2.73,
      cpc: 0.20,
      cpa: 7.29,
      roas: 4.2
    },
    insights: [
      {
        type: "performance_anomaly",
        message: "ROAS increased 23% vs. last week",
        priority: "opportunity"
      }
    ]
  },
  {
    id: "demo_002",
    name: "Holiday Collection",
    status: "ACTIVE",
    daily_budget: 50,
    metrics: {
      impressions: 8234,
      clicks: 187,
      spend: 52.30,
      conversions: 4,
      ctr: 2.27,
      cpc: 0.28,
      cpa: 13.08,
      roas: 2.8
    },
    insights: [
      {
        type: "budget_overspend",
        message: "Spent $52.30 of $50 daily budget",
        priority: "critical"
      }
    ]
  },
  // ... 3 more campaigns
];
```

**Guided Tour (Optional - First Login):**
```
Step 1: "👋 Welcome! This is your Command Center. 
        Your campaigns appear in this table - just like Google Ads."
        [Highlights campaign table]

Step 2: "💬 Try the chat box at the bottom - ask it anything!
        'Why did my CPA increase?' or 'Create a campaign for...'"
        [Highlights chat box]

Step 3: "📑 Switch modes using these tabs for different tasks.
        Table (default), Insights, Create, and more."
        [Highlights mode tabs]

Step 4: "✨ Ready to create a campaign? 
        Click Create mode or just ask in the chat box!"
        [Highlights Create mode tab]

[Skip Tour] [Next →]
```

**Acceptance Criteria:**
- User can access demo mode without OAuth
- Demo mode has 5 realistic campaigns with metrics
- AI insights generate from demo data
- User can explore full UI in demo mode
- Clear visual indicator that user is in demo mode
- "Connect Real Account" CTA visible in demo mode
- Smooth transition from demo → real account connection
- Guided tour can be skipped or replayed

---

### 2.7 Data Sync & Caching
**Description:** Efficient data fetching from Google Ads API with local caching to avoid rate limits.

**Rationale:** Google Ads API has rate limits (10K requests/day for standard access). Caching prevents hitting limits during demos and improves performance.

**Caching Strategy:**

> **⚠️ NOTE:** See `/docs/implementation/schema.sql` for the actual database schema. Background refresh uses Vercel Cron Jobs (see `/docs/implementation/cron-jobs.md`).

**Database Cache:** Campaign data is cached in `campaigns_cache` table (see `/docs/implementation/schema.sql`):
- Stores campaign metrics with 5-minute TTL
- Refreshed via cron job `/api/cron/sync-campaigns` (runs every 5 minutes)
- Query cache before hitting Google Ads API
- Cache invalidated on user actions (pause, edit, etc.)

**Background Sync:** Implemented via Vercel Cron Job (not `setInterval()`):
- Endpoint: `/api/cron/sync-campaigns`
- Fetches fresh data from Google Ads API
- Updates `campaigns_cache` table
- See `/docs/implementation/cron-jobs.md` for complete implementation

**API Rate Limit Management:**
- Track daily quota usage in database
- Implement retry logic with exponential backoff (see `/docs/implementation/error-codes.md`)
- Use batch queries where possible
- Cache aggressively to minimize API calls

**Acceptance Criteria:**
- Campaign data cached for 5 minutes
- No duplicate API calls within 5-minute window
- API rate limit never exceeded (tracked and enforced)
- Cache invalidated on user-initiated actions (pause, edit, etc.)
- Background refresh keeps cache warm for active campaigns
- Graceful degradation if API unavailable (show cached data with warning)

---

## 3. User Stories

### Priority Levels
- **P0**: Must have for 24-hour MVP (blocking demo)
- **P1**: Should have for strong demo (deferred if time-constrained)
- **P2**: Nice to have (Phase 2)

### P0 User Stories (Must Have)

**US-001: Connect Google Ads Account**
- **As a** performance marketer
- **I want to** connect my Google Ads account via OAuth
- **So that** I can see all my campaigns in one place
- **Acceptance Criteria:**
  - OAuth flow completes in <2 minutes
  - Account connection persists across sessions
  - Clear error message if connection fails
  - User can disconnect and reconnect

**US-002: View All Campaigns**
- **As a** performance marketer
- **I want to** see all my Google Ads campaigns in a unified dashboard
- **So that** I don't need to open Google Ads Manager
- **Acceptance Criteria:**
  - All campaigns from connected account visible within 30 seconds
  - Key metrics displayed: Status, Spend, Impressions, Clicks, Conversions
  - Campaigns grouped by status (Active, Paused)
  - Real-time status indicators (🟢🟡🔴)

**US-003: Receive AI Insights**
- **As a** performance marketer
- **I want to** receive AI-generated insights about my campaigns
- **So that** I can identify optimization opportunities without manual analysis
- **Acceptance Criteria:**
  - At least 3 insights generated within first session
  - Insights include: Budget alerts, Performance anomalies, Optimization recommendations
  - Each insight has suggested actions
  - Insights refresh every 5 minutes

**US-004: Create Campaign via Conversation**
- **As a** performance marketer
- **I want to** create a Google Ads campaign by describing it in natural language
- **So that** I can launch campaigns 10x faster than Google's native UI
- **Acceptance Criteria:**
  - User describes campaign in 50-500 characters
  - AI extracts all required fields (name, budget, targeting, creative)
  - User can review and edit before publishing
  - Campaign publishes to Google Ads within 30 seconds
  - Success confirmation shows Google Ads Campaign ID

**US-005: Publish Real Campaign**
- **As a** performance marketer
- **I want to** actually publish campaigns to Google Ads (not just mock)
- **So that** I can manage my real advertising from this interface
- **Acceptance Criteria:**
  - Campaign appears in Google Ads Manager with matching ID
  - Campaign status is "Active - Delivering"
  - First impressions appear within 15-30 minutes
  - Published campaigns sync back to Command Center dashboard

**US-006: Pause/Resume Campaign**
- **As a** performance marketer
- **I want to** quickly pause or resume campaigns
- **So that** I can react to issues without opening Google Ads Manager
- **Acceptance Criteria:**
  - Pause/Resume buttons visible in campaign list
  - Action completes within 5 seconds
  - Status updates in UI and in Google Ads Manager
  - Confirmation message displayed

**US-007: Budget Safety Limits**
- **As a** demo user
- **I want** hard budget caps enforced automatically
- **So that** I don't accidentally overspend during demos
- **Acceptance Criteria:**
  - Daily budget capped at $50/day
  - Total budget capped at $500
  - Budget exceeded = auto-pause
  - Alert at 90% of budget
  - Auto-pause after 24 hours

### P1 User Stories (Should Have)

**US-008: Try Demo Mode**
- **As a** prospective user
- **I want to** explore the interface with sample data before connecting my account
- **So that** I can evaluate the product without granting OAuth access
- **Acceptance Criteria:**
  - Demo mode accessible without login
  - 5 realistic sample campaigns with metrics
  - All UI features work (except real publishing)
  - Clear indicator that user is in demo mode
  - Easy upgrade to real account

**US-009: AI Text Generation**
- **As a** performance marketer
- **I want** AI to generate headlines and descriptions for my campaigns
- **So that** I don't need to write ad copy manually
- **Acceptance Criteria:**
  - AI generates 3 headline variations
  - AI generates 2 description variations
  - User can regenerate if not satisfied
  - Follows Google Ads character limits (headlines: 30 chars, descriptions: 90 chars)

**US-010: Multi-Account Switching**
- **As an** agency account manager
- **I want to** connect multiple Google Ads accounts and switch between them
- **So that** I can manage multiple clients from one interface
- **Acceptance Criteria:**
  - User can connect up to 10 accounts
  - Account selector dropdown in top nav
  - Dashboard data updates when switching accounts
  - Account connection status visible for each

**US-011: Mobile Alerts View**
- **As a** performance marketer on the go
- **I want to** see critical alerts on mobile
- **So that** I can respond to issues even when away from desktop
- **Acceptance Criteria:**
  - Alerts page responsive on mobile (375px width)
  - Can pause campaigns from mobile
  - Can adjust budgets from mobile
  - Full Command Center not required on mobile (desktop-optimized)

### P2 User Stories (Nice to Have - Phase 2)

**US-012: Manual Campaign Builder**
- **As a** performance marketer who prefers control
- **I want** a traditional form-based campaign builder
- **So that** I can specify exact settings without conversational AI
- **Deferred to Phase 2**

**US-013: Creative Image Upload**
- **As a** performance marketer
- **I want to** upload images for my campaigns
- **So that** I can use custom creative assets
- **Deferred to Phase 2**

**US-014: Campaign Performance Charts**
- **As a** performance marketer
- **I want to** see time-series charts of campaign performance
- **So that** I can visualize trends over time
- **Deferred to Phase 2**

**US-015: Meta Ads Integration**
- **As a** performance marketer
- **I want to** manage Meta Ads campaigns alongside Google Ads
- **So that** I have true cross-platform visibility
- **Deferred to Phase 2**

---

## 4. Success Criteria

### Quantitative Metrics

**Performance Benchmarks:**
- OAuth connection time: <2 minutes (target: <60 seconds)
- Dashboard initial load: <30 seconds (target: <10 seconds)
- Time to first AI insight: <30 seconds after connection
- Campaign creation time: <5 minutes (target: <3 minutes)
- Campaign publish latency: <30 seconds
- API response time (p95): <2 seconds
- Dashboard refresh rate: Every 5 minutes
- Campaign publish success rate: >95%
- Zero unauthorized budget overruns (100% enforcement of caps)

**User Engagement Metrics:**
- OAuth completion rate: >80% of users who start
- AI insight interaction rate: >50% of users click on at least 1 insight
- Campaign creation completion rate: >70% of users who start
- Demo mode conversion rate: >30% upgrade to real account

**Reliability Metrics:**
- Uptime: >99% during demo periods
- Error rate: <5% of API calls
- Cache hit rate: >80% for campaign data
- Rate limit utilization: <50% of daily quota

### Qualitative Success Criteria

**User Experience:**
- ✅ User reaction: "Wow, this is so much faster than Google Ads"
- ✅ User can complete campaign creation without documentation
- ✅ AI insights feel intelligent and actionable (not generic)
- ✅ Dashboard feels responsive and real-time (not stale)
- ✅ Error messages are clear and helpful (not technical jargon)

**Technical Quality:**
- ✅ Code is modular and maintainable (can add Meta in Phase 2)
- ✅ API integrations are robust (handle errors gracefully)
- ✅ No security vulnerabilities (OAuth tokens stored securely)
- ✅ Performance is acceptable on 3G connections (mobile alerts)

**Demo Readiness:**
- ✅ Can record compelling 3-minute demo video
- ✅ Works reliably during live demos (no "it usually works" moments)
- ✅ Visual design is professional (not prototype-looking)
- ✅ Can deploy to production URL within 24 hours

---

## 5. Technical Constraints

### Required Technologies

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- Tailwind CSS + shadcn/ui component library
- TypeScript (strongly recommended for API types)

**Backend:**
- Next.js API routes (serverless functions)
- Supabase (PostgreSQL database + Auth + Realtime)
- Redis (optional - for caching layer, can use Upstash)

**External APIs:**
- Google Ads API (v17) - Note: v16 was sunset February 5, 2025
- OpenAI API (GPT-4)
- PostHog (optional - for analytics)

**Deployment:**
- Vercel (frontend + API routes)
- Supabase Cloud (database + auth)
- Upstash Redis (optional caching)

### API Limits & Constraints

**Google Ads API:**
- Rate Limit: 10,000 requests/day (standard access)
- OAuth Scopes Required: `https://www.googleapis.com/auth/adwords`
- Campaign creation rate: Max 1,000/day per account
- Batch operations: Max 5,000 operations per request

**OpenAI API:**
- Rate Limit: 10,000 TPM (tokens per minute) for GPT-4
- Context window: 128K tokens (sufficient for campaign context)
- Response time: Typically 2-5 seconds for completions

**Vercel (Hobby Plan Limits):**
- Serverless function timeout: 10 seconds
- Bandwidth: 100 GB/month
- Build time: 45 minutes
- (Upgrade to Pro if limits hit during demos)

### Security Requirements

**OAuth Token Storage:**

> **⚠️ NOTE:** See `/docs/implementation/auth-flow.md` for the complete authentication implementation and `/docs/implementation/schema.sql` for the actual database schema.

**Implementation:**
- Tokens stored in `google_ads_accounts` table (see `/docs/implementation/schema.sql`)
- Encrypted at rest using encryption functions
- Retrieved server-side only via Supabase service role
- Token refresh logic in `/docs/implementation/auth-flow.md`
- RLS policies ensure users can only access their own tokens

**Budget Cap Enforcement:**
- Server-side validation only (never trust client)
- Double-check before API call to Google Ads
- Log all budget-related actions for audit trail

**CORS Configuration:**
- Whitelist only production domain
- No `Access-Control-Allow-Origin: *`

**Environment Variables:**
```bash
# Required secrets (never commit)
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
REDIS_URL= # Optional
POSTHOG_API_KEY= # Optional

# Public variables
NEXT_PUBLIC_APP_URL=https://marketing-copilot.vercel.app
```

### Architectural Constraints

**Stateless API Design:**
- No in-memory session state (must work across serverless functions)
- All state in database or Redis
- Campaign creation jobs tracked in database

**Scalability Considerations:**
- Use database connection pooling (Supabase handles this)
- Cache aggressively to minimize Google Ads API calls
- Queue long-running operations (campaign publishing can take 20-30 seconds)

**Browser Compatibility:**
- Must work in Chrome 90+, Firefox 88+, Safari 14+ (latest 2 years)
- Progressive enhancement for older browsers (basic functionality only)

---

## 6. Testing & Quality Infrastructure

### Unit Testing (P1 - Time Permitting)

**Critical Paths to Test:**
- AI campaign extraction from natural language
- Budget cap enforcement logic
- OAuth token refresh flow
- Cache invalidation logic

```javascript
// Example: Budget cap test
describe('Budget Cap Enforcement', () => {
  it('should reject campaigns with daily budget > $50', async () => {
    const campaign = { daily_budget: 100 };
    const result = await validateCampaign(campaign);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('daily_budget_exceeded');
  });
  
  it('should accept campaigns with daily budget = $50', async () => {
    const campaign = { daily_budget: 50 };
    const result = await validateCampaign(campaign);
    expect(result.valid).toBe(true);
  });
});
```

**Testing Framework:**
- Jest for unit tests
- React Testing Library for component tests

**Minimum Coverage Target:**
- Critical business logic: 80%
- UI components: Not required for MVP (manual QA sufficient)

### Integration Testing (P0 - Manual)

**Critical Flows to Test Manually:**

**Test Case 1: OAuth Connection**
1. Click "Connect Google Ads"
2. Complete OAuth flow in popup
3. Verify redirect back to dashboard
4. Verify campaigns load within 30 seconds
5. Verify connection persists after page refresh

**Test Case 2: AI Insights Generation**
1. Connect account with at least 3 campaigns
2. Wait 30 seconds
3. Verify at least 1 insight appears in center panel
4. Click insight action button
5. Verify action executes (e.g., pause campaign)

**Test Case 3: Campaign Creation & Publishing**
1. Click [+ Create Campaign]
2. Describe campaign: "Promote winter jackets to women in cold states, $40/day budget"
3. Verify AI extracts fields correctly
4. Click [Publish to Google Ads]
5. Verify progress modal shows real-time status
6. Verify success confirmation with Campaign ID
7. Open Google Ads Manager in new tab
8. Verify campaign exists with matching ID and status

**Test Case 4: Budget Cap Enforcement**
1. Attempt to create campaign with $100/day budget
2. Verify error message: "Daily budget capped at $50 for demo accounts"
3. Reduce to $50/day
4. Verify campaign publishes successfully
5. Monitor campaign for 1 hour
6. Verify spend does not exceed $50

**Test Case 5: Auto-Pause After 24 Hours**
1. Create and publish campaign
2. Fast-forward system clock 24 hours (or wait)
3. Verify campaign auto-paused
4. Verify notification sent to user

### End-to-End Testing (P1 - Playwright)

**E2E Test Suite (If Time Permits):**
```javascript
// tests/e2e/campaign-creation.spec.ts
test('complete campaign creation flow', async ({ page }) => {
  // 1. Login / OAuth
  await page.goto('/');
  await page.click('text=Connect Google Ads');
  // ... OAuth flow (use test account)
  
  // 2. Wait for dashboard
  await page.waitForSelector('text=All Active');
  
  // 3. Create campaign
  await page.click('text=Create Campaign');
  await page.fill('textarea', 'Promote winter sale, $30/day');
  await page.click('text=Build Campaign');
  
  // 4. Review and publish
  await page.waitForSelector('text=Review Your Campaign');
  await page.click('text=Publish to Google Ads');
  
  // 5. Verify success
  await expect(page.locator('text=Campaign Published!')).toBeVisible();
  await expect(page.locator('text=Campaign ID:')).toBeVisible();
});
```

**E2E Testing Priority:**
- P0: Campaign creation flow (most critical)
- P1: OAuth connection flow
- P2: Dashboard interactions

### Manual QA Checklist

**Pre-Demo Verification:**
- [ ] OAuth flow works in production
- [ ] Dashboard loads within 30 seconds
- [ ] AI insights generate correctly
- [ ] Campaign creation completes end-to-end
- [ ] Published campaigns appear in Google Ads Manager
- [ ] Budget caps enforced ($50/day, $500 total)
- [ ] Auto-pause triggers after 24 hours
- [ ] Error messages are clear
- [ ] Demo mode works without OAuth
- [ ] Mobile alerts view is responsive
- [ ] No console errors in browser
- [ ] Vercel deployment is stable

**Performance Verification:**
- [ ] Lighthouse score >80 (Performance)
- [ ] Time to First Byte (TTFB) <1 second
- [ ] API response times <2 seconds (p95)
- [ ] Dashboard refresh rate: 5 minutes

### Deployment Validation

**Production Deployment Checklist:**
- [ ] Environment variables configured in Vercel
- [ ] Google Ads OAuth redirect URI whitelisted
- [ ] Supabase database migrations applied
- [ ] Redis cache connected (if using)
- [ ] PostHog analytics initialized (if using)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate valid
- [ ] CORS settings correct
- [ ] Rate limiting configured
- [ ] Error tracking enabled (Sentry optional)

**Post-Deployment Smoke Test:**
- [ ] Visit production URL
- [ ] Connect Google Ads account
- [ ] Create and publish 1 test campaign
- [ ] Verify campaign appears in Google Ads Manager
- [ ] Pause campaign
- [ ] Verify pause syncs to Google Ads
- [ ] Check analytics events (if configured)

---

## 7. Stretch Goals (Phase 2)

### Near-Term Enhancements (Weeks 5-8)

**SG-001: Meta Ads Integration**
- Add OAuth for Meta Business Manager
- Unified dashboard shows Meta + Google campaigns
- Cross-platform attribution reconciliation
- Publish campaigns to Meta Ads API

**SG-002: Advanced Creative Generation**
- AI-generated image variations (Midjourney/DALL-E)
- Video ad creation
- Creative library and management
- A/B testing framework

**SG-003: Performance Predictions**
- ML model trained on historical data
- Predict campaign ROAS before launch
- Budget optimization recommendations
- Seasonal trend analysis

**SG-004: Multi-User Collaboration**
- Agency workspace with multiple users
- Role-based permissions (Admin, Editor, Viewer)
- Approval workflows for campaign publishing
- Activity log and audit trail

### Medium-Term Enhancements (Months 3-6)

**SG-005: Ad Fraud Detection Module**
- Real-time invalid traffic detection
- Bot traffic analysis
- Click fraud prevention
- CTV fraud monitoring (per research: 19% invalid traffic)

**SG-006: Content Refresh Automation**
- Creative fatigue detection
- Automatic A/B testing
- Performance-based creative rotation
- Asset performance analytics

**SG-007: Amazon Ads Integration**
- Amazon Advertising API connection
- Retail media campaign management
- Product catalog sync
- Sponsored Products automation

**SG-008: Advanced Reporting**
- Custom report builder
- Scheduled email reports
- Export to Excel/PDF
- White-label reports for agencies

### Long-Term Vision (6+ Months)

**SG-009: Autonomous Campaign Management**
- Set-and-forget campaign optimization
- Auto-budget allocation across platforms
- Self-healing campaigns (auto-fix issues)
- Strategic recommendations from AI

**SG-010: Marketplace & Integrations**
- Third-party app marketplace
- Zapier integration
- Webhooks for custom workflows
- Public API for developers

---

## 8. Out of Scope (Explicitly Excluded)

### Not in MVP

**❌ Meta Ads Integration**
- Reason: Google-only reduces complexity by 60%, sufficient for demo
- Phase 2: Add Meta after MVP validated

**❌ Manual Campaign Builder (Form-Based)**
- Reason: Conversational AI is differentiator, manual form is commodity
- Phase 2: Add as fallback for users who prefer control

**❌ Creative Image Generation**
- Reason: Text generation (headlines/descriptions) sufficient for MVP
- Phase 2: Add DALL-E/Midjourney integration

**❌ Creative Asset Upload**
- Reason: Performance Max uses Google's asset library
- Phase 2: Add custom upload

**❌ Advanced Analytics & Charts**
- Reason: Basic metrics table sufficient for demo
- Phase 2: Add time-series charts, custom reports

**❌ Multi-User Collaboration**
- Reason: Single user sufficient for pilot validation
- Phase 2: Add agency workspace features

**❌ Mobile App**
- Reason: Web responsive is sufficient, native app not needed
- Phase 2: Consider if user demand exists

**❌ White-Label / Agency Features**
- Reason: Direct marketer focus for MVP
- Phase 2: Add after agency pilots

**❌ Custom Integrations**
- Reason: Standard integrations only (Google Ads, OpenAI, Supabase)
- Phase 2: Add Zapier, webhooks, public API

**❌ Offline Mode**
- Reason: Requires internet for API calls
- Phase 2: Not planned (low value)

**❌ Historical Data Import**
- Reason: Google Ads API provides historical data
- Phase 2: Not needed (API sufficient)

---

## 9. Evaluation & Testing Alignment

### Gauntlet Evaluation Category Mapping

| Category | Requirements | How MVP Satisfies | Pass Criteria |
|---|---|---|---|
| **Performance** | Responsiveness, scalability, API latency | - Dashboard loads <30s<br>- API responses <2s (p95)<br>- 5-min data refresh<br>- Caching layer reduces API load | - Lighthouse >80<br>- TTFB <1s<br>- No timeouts during demo<br>- Supports 10+ concurrent users |
| **Features** | Functional parity + AI enhancement | - Google Ads campaign CRUD<br>- AI insights (3 types)<br>- Conversational creation<br>- Real publishing<br>- Budget safety | - All P0 user stories complete<br>- Campaign creation works end-to-end<br>- AI generates actionable insights<br>- Publishes to real Google Ads |
| **User Flow** | Usability, flow continuity | - OAuth <2 min<br>- Dashboard intuitive<br>- Campaign creation <5 min<br>- Demo mode for exploration<br>- Clear navigation | - No dead ends<br>- All features accessible<br>- User completes flow without help<br>- Error states handled gracefully |
| **Documentation & Deployment** | Code clarity, reproducibility | - README with setup<br>- .env.example<br>- Deployment guide<br>- API documentation<br>- Live URL on Vercel | - Anyone can clone and run locally<br>- One-command deploy<br>- Environment variables documented<br>- Production URL accessible |

### Testing Coverage by Category

**Performance Testing:**
- [ ] Lighthouse audit score >80
- [ ] Load test with 10 concurrent users
- [ ] API response time profiling
- [ ] Database query optimization
- [ ] Cache hit rate monitoring

**Feature Testing:**
- [ ] All P0 user stories validated
- [ ] Campaign creation end-to-end test
- [ ] AI insights accuracy spot-check
- [ ] Budget cap enforcement verification
- [ ] OAuth token refresh handling

**User Flow Testing:**
- [ ] Onboarding flow walkthrough
- [ ] Demo mode exploration
- [ ] Campaign creation without docs
- [ ] Error recovery paths
- [ ] Mobile alerts view

**Documentation Testing:**
- [ ] Fresh clone setup test
- [ ] Deploy to new Vercel project
- [ ] Environment variable validation
- [ ] API endpoint documentation
- [ ] Architecture diagram review

---

## 10. Implementation Reference Documents

**⚠️ CRITICAL: Before starting development, review these implementation documents:**

1. **Database Schema** (`/docs/implementation/schema.sql`)
   - Complete, runnable Supabase schema with all tables, indexes, and RLS policies
   - Copy-paste ready SQL script
   - Includes demo data seed

2. **Google Ads API Examples** (`/docs/implementation/google-ads-api-examples.ts`)
   - Real API implementation using `google-ads-api` npm package (v17)
   - Actual code examples (not pseudocode)
   - Error handling patterns

3. **Authentication Flow** (`/docs/implementation/auth-flow.md`)
   - Step-by-step Supabase Auth → Google Ads OAuth integration
   - Complete code examples for all auth endpoints
   - Token refresh logic

4. **Cron Jobs Setup** (`/docs/implementation/cron-jobs.md`)
   - Vercel cron job configuration for budget monitoring
   - Background data sync implementation
   - 24-hour auto-pause logic

5. **Error Handling** (`/docs/implementation/error-codes.md`)
   - Google Ads API error code mapping
   - Retry logic with exponential backoff
   - User-friendly error messages

**These documents contain the actual implementation code that replaces pseudocode in this PRD.**

---

## 11. References & Dependencies

### Related Documentation

**Foundation Documents:**
- Project Overview: `/docs/foundation/project_overview.md`
- Architecture Document: `/docs/foundation/architecture.md` (to be created)
- Development Checklist: `/docs/foundation/dev_checklist.md` (to be created)

**Implementation Documents:**
- Database Schema: `/docs/implementation/schema.sql`
- Google Ads API Examples: `/docs/implementation/google-ads-api-examples.ts`
- Authentication Flow: `/docs/implementation/auth-flow.md`
- Cron Jobs Setup: `/docs/implementation/cron-jobs.md`
- Error Handling: `/docs/implementation/error-codes.md`

**External Documentation:**
- [Google Ads API v17 Documentation](https://developers.google.com/google-ads/api/docs/start) (v16 sunset February 5, 2025)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### API Dependencies

**Google Ads API:**
- Version: v17 (v16 was sunset February 5, 2025)
- OAuth Scopes: `https://www.googleapis.com/auth/adwords`
- Rate Limits: 10,000 requests/day
- Documentation: https://developers.google.com/google-ads/api/
- Package: `google-ads-api` (npm) - See `/docs/implementation/google-ads-api-examples.ts` for usage

**OpenAI API:**
- Model: GPT-4 (gpt-4-turbo-preview)
- Rate Limits: 10,000 TPM
- Documentation: https://platform.openai.com/docs

**Supabase:**
- PostgreSQL 15+
- Realtime subscriptions
- Auth helpers for Next.js
- Documentation: https://supabase.com/docs

### Third-Party Services

**Required:**
- Vercel (hosting)
- Supabase (database + auth)
- Google Cloud Console (for OAuth credentials)
- OpenAI Platform (for API key)

**Optional:**
- Upstash Redis (caching)
- PostHog (analytics)
- Sentry (error tracking)

### Repository Structure

```
marketing-copilot/
├── docs/
│   └── foundation/
│       ├── project_overview.md  ✓ Complete
│       ├── prd.md              ✓ This document
│       ├── architecture.md      ⏳ To be created
│       └── dev_checklist.md     ⏳ To be created
├── src/
│   ├── app/                    # Next.js 14 App Router
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   │   ├── google-ads/         # Google Ads API client
│   │   ├── openai/             # OpenAI API client
│   │   └── supabase/           # Supabase client
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── tests/
│   ├── unit/                   # Jest unit tests
│   └── e2e/                    # Playwright E2E tests
├── .env.example                # Environment variables template
├── .eslintrc.js
├── .prettierrc
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

---

## 12. Timeline & Milestones

### 24-Hour Development Plan

**Hour 0-4: Foundation & Authentication**
- Set up Next.js 14 project with TypeScript
- Configure Tailwind CSS + shadcn/ui
- Set up Supabase project and connect
- Implement Google Ads OAuth flow
- Test OAuth with real Google Ads account
- **Deliverable:** User can connect Google Ads account

**Hour 4-8: Data Layer & Dashboard**
- Build Google Ads API client wrapper
- Implement campaign data fetching
- Build caching layer (in-memory + database)
- Create Google Ads-like table component (Table mode)
  - Campaign table with all columns
  - Sortable, filterable columns
  - Bulk actions
  - Row-level actions
- Build left sidebar navigation (Google Ads style)
  - Campaigns, Ad Groups, Ads, Keywords hierarchy
  - Account selector
- Build chat box component (always-present)
  - Context-aware suggestions
  - Basic chat functionality
- Add mode selector tabs (Table default, others disabled)
- **Deliverable:** Dashboard shows real campaign data in familiar Google Ads-like table

**Hour 8-12: AI Insights Engine & Insights Mode**
- Implement budget overspend detection (rule-based)
- Implement anomaly detection (z-score)
- Integrate OpenAI API for recommendations
- Build Insights mode component (separate from table)
- Build insights feed UI component
- Add action buttons to insights
- Connect insights to chat box ("Show me insights")
- **Deliverable:** Insights mode displays AI-generated insights, accessible via tab or chat

**Hour 12-16: Campaign Builder (Create Mode)**
- Build Create mode component
- Implement chat-triggered campaign creation
- Build conversational campaign input interface
- Implement GPT-4 campaign extraction
- Create review screen with editable fields
- Implement AI text generation (headlines/descriptions)
- Add budget cap validation
- Connect Create mode to chat box (auto-switch on intent)
- **Deliverable:** User can create campaign via Create mode or chat box

**Hour 16-20: Real Publishing**
- Implement Google Ads campaign creation API calls
- Build publishing orchestration (Campaign → Ad Group → Ads)
- Add error handling for API failures
- Implement status polling for campaign activation
- Add success confirmation screen
- **Deliverable:** Campaign publishes to real Google Ads

**Hour 20-22: Safety & Polish**
- Implement budget cap enforcement (hard limits)
- Add auto-pause after 24 hours logic
- Build budget alert system
- Implement kill switch for emergency pause
- UI polish: loading states, error messages, responsive layout
- **Deliverable:** All safety features active

**Hour 22-24: Demo Mode & Deployment**
- Create synthetic demo data
- Implement demo mode toggle
- Build onboarding landing screen
- Deploy to Vercel
- Configure production environment variables
- Final QA and smoke testing
- Record demo video
- **Deliverable:** Live production URL ready for demos

---

## 13. Risk Register & Mitigation

### High-Risk Items

**Risk 1: Google Ads API Rate Limits**
- **Probability:** Medium
- **Impact:** High (blocks all functionality)
- **Mitigation:**
  - Aggressive caching (5-min TTL)
  - Batch API calls where possible
  - Monitor daily quota usage
  - Alert at 80% utilization
  - Fallback to cached data if quota exceeded

**Risk 2: OAuth Approval Delays**
- **Probability:** Low (using test mode)
- **Impact:** High (can't connect accounts)
- **Mitigation:**
  - Use "Testing" mode (no approval needed, 100 users)
  - Submit for production review in parallel
  - Document approval timeline for pilots

**Risk 3: Campaign Publishing Failures**
- **Probability:** Medium (policy violations, API errors)
- **Impact:** High (breaks core demo flow)
- **Mitigation:**
  - Pre-flight validation before API call
  - Use approved ad copy templates
  - Clear error messages with fix suggestions
  - Manual fallback: export to Google Ads UI

**Error Handling Example:**
```javascript
// Example error handling pattern (see /docs/implementation/error-codes.md for complete guide)
try {
  const result = await createPerformanceMaxCampaign(customer, campaignData);
  return { success: true, campaign_id: result.campaign_id };
} catch (error) {
  // Parse Google Ads API error
  if (error.code === 'POLICY_VIOLATION') {
    return {
      success: false,
      error: 'policy_violation',
      message: `Campaign rejected: ${error.message}`,
      fixSuggestions: [
        'Review ad copy for policy violations',
        'Check landing page URL is accessible',
        'Verify targeting complies with policies'
      ]
    };
  }
  
  if (error.code === 'QUOTA_EXCEEDED') {
    return {
      success: false,
      error: 'quota_exceeded',
      message: 'API rate limit reached. Please try again in 5 minutes.',
      fixSuggestions: ['Wait before retrying', 'Check cache to avoid duplicate requests']
    };
  }
  
  // Retry with exponential backoff for transient errors
  // See /docs/implementation/error-codes.md for retry logic
  throw error;
}
```

**Risk 4: Budget Overruns**
- **Probability:** Low (enforced server-side)
- **Impact:** Critical (financial loss)
- **Mitigation:**
  - Hard caps enforced in code ($50/day, $500 total)
  - Double validation (client + server)
  - Real-time monitoring every 5 minutes
  - Auto-pause at 100% budget
  - Kill switch for emergency

**Risk 5: AI Hallucinations**
- **Probability:** Medium (GPT-4 can be inconsistent)
- **Impact:** Medium (bad recommendations, wrong field extraction)
- **Mitigation:**
  - Structured output format (JSON mode)
  - Schema validation on AI responses
  - Human-in-the-loop (user reviews before publish)
  - Regeneration option if user unsatisfied

### Medium-Risk Items

**Risk 6: Performance Degradation**
- **Probability:** Medium
- **Impact:** Medium (slow demo experience)
- **Mitigation:**
  - Caching layer
  - Optimize database queries
  - Use Vercel Edge Functions for low latency
  - Load testing before demos

**Risk 7: Demo Mode Data Stale**
- **Probability:** Low
- **Impact:** Low (demo less impressive)
- **Mitigation:**
  - Update synthetic data to current trends
  - Add randomization for freshness
  - Include variety of scenarios

**Risk 8: Mobile Experience Poor**
- **Probability:** Low (alerts only on mobile)
- **Impact:** Low (desktop is primary)
- **Mitigation:**
  - Test on real devices (iPhone, Android)
  - Responsive layout for alerts page
  - Progressive enhancement

---

## 14. Success Metrics & KPIs

### MVP Launch Metrics (Week 1)

**Adoption Metrics:**
- OAuth completion rate: Target >80%
- Demo mode engagement: Target >50% try demo first
- Campaign creation starts: Target >60% of connected users
- Campaign publish completions: Target >70% of starts

**Performance Metrics:**
- Dashboard load time: Target <10s (acceptable: <30s)
- Campaign creation time: Target <3 min (acceptable: <5 min)
- Campaign publish success rate: Target >95%
- API error rate: Target <5%

**User Satisfaction:**
- Demo feedback: Target "10x faster" reaction
- Would recommend: Target >80% yes
- Perceived value: Target "would pay $2K-5K/month"

### Pilot Program Metrics (Weeks 2-6)

**Engagement:**
- Daily active users: Target 3-5 pilots logging in daily
- Campaigns created per user: Target >5/week
- Insights acted upon: Target >30% of insights get action clicks
- Feature adoption: AI creation >70% vs. (future) manual form

**Business Validation:**
- Pilot sign-ups: Target 3-5 paid pilots
- Contract value: Target $50K-150K total commitments
- Churn: Target 0% in first 6 weeks
- Upsell interest: Target >50% interested in Meta integration

**Product Metrics:**
- Time saved vs. Google Ads UI: Target >80% time reduction
- Campaign publish success rate: Target >95%
- Budget compliance: Target 100% (zero overruns)
- Accuracy of AI insights: Target >80% user agreement

---

## 15. Appendix

### A. Technical Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERFACE                      │
│              (Next.js 14 + React + Tailwind)            │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Table      │  │   Insights   │  │    Create    │ │
│  │   Mode       │  │    Mode      │  │     Mode     │ │
│  │  (Default)   │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  AI Co-Pilot Chat Box (Always Present)          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────┐                                      │
│  │  Left Nav    │  (Google Ads Style)                 │
│  │  (Campaigns, │                                      │
│  │  Ad Groups,  │                                      │
│  │  Ads, etc.)  │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  API LAYER (Next.js API Routes)         │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Google    │  │   OpenAI    │  │   Cache     │   │
│  │  Ads API    │  │     API     │  │   Manager   │   │
│  │   Client    │  │   Client    │  │             │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Supabase   │  │    Redis    │  │   Google    │   │
│  │ PostgreSQL  │  │   (Cache)   │  │  Ads API    │   │
│  │  (Primary)  │  │  (Optional) │  │  (External) │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### B. Data Model (Core Entities)

> **⚠️ NOTE:** These are TypeScript interfaces for reference. The actual database schema is in `/docs/implementation/schema.sql` with complete SQL table definitions, indexes, and RLS policies.

```typescript
// User (extends Supabase auth.users)
interface User {
  id: string; // References auth.users(id)
  email: string;
  display_name?: string;
  created_at: Date;
  last_login?: Date;
  is_demo_mode: boolean;
}

// Connected Account
interface GoogleAdsAccount {
  id: string;
  user_id: string; // References users(id)
  customer_id: string; // Google Ads customer ID (format: "123-456-7890")
  account_name: string;
  access_token: string; // Encrypted
  refresh_token: string; // Encrypted
  token_expires_at: Date;
  connected_at: Date;
  last_synced_at?: Date;
  status: 'active' | 'expired' | 'error' | 'disconnected';
  error_message?: string;
}

// Campaign (Cached from Google Ads)
interface Campaign {
  id: string;
  account_id: string; // References google_ads_accounts(id)
  campaign_id: string; // Google Ads campaign ID
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'REMOVED' | 'ENDED';
  campaign_type: 'PERFORMANCE_MAX' | 'SEARCH' | 'DISPLAY' | 'VIDEO' | 'SHOPPING';
  daily_budget_micros: number;
  total_budget_micros?: number;
  impressions: number;
  clicks: number;
  cost_micros: number;
  conversions: number;
  ctr?: number;
  cpc_micros?: number;
  cpa_micros?: number;
  roas?: number;
  cached_at: Date;
  metrics_date: Date;
}

// AI Insight
interface Insight {
  id: string;
  user_id: string; // References users(id)
  account_id?: string; // References google_ads_accounts(id)
  campaign_id?: string;
  type: 'budget_overspend' | 'performance_anomaly' | 'optimization' | 'alert';
  priority: 'critical' | 'opportunity' | 'info';
  title: string;
  message: string;
  suggested_actions: string[];
  created_at: Date;
  dismissed: boolean;
  dismissed_at?: Date;
  action_taken?: string;
  action_taken_at?: Date;
}

// Campaign Creation Job
interface CampaignJob {
  id: string;
  user_id: string; // References users(id)
  account_id: string; // References google_ads_accounts(id)
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input_data: object; // User's natural language input
  structured_data?: object; // AI-extracted fields
  campaign_config?: object; // Final campaign configuration
  google_campaign_id?: string;
  error_code?: string;
  error_message?: string;
  error_details?: object;
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;
}

// Budget Alert
interface BudgetAlert {
  id: string;
  account_id: string; // References google_ads_accounts(id)
  campaign_id: string;
  alert_type: 'budget_warning' | 'budget_exceeded' | 'auto_pause_24h';
  threshold_percentage?: number;
  current_spend_micros: number;
  budget_limit_micros: number;
  action_taken?: string;
  auto_paused: boolean;
  created_at: Date;
  resolved_at?: Date;
}
```

**See `/docs/implementation/schema.sql` for:**
- Complete SQL table definitions
- Indexes for performance
- Row Level Security (RLS) policies
- Database functions
- Demo data seed

### C. Environment Variables Template

```bash
# .env.example

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your_client_secret_here
GOOGLE_ADS_REDIRECT_URI=https://your-app.vercel.app/api/auth/google/callback

# OpenAI API
OPENAI_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redis (Optional - for caching)
REDIS_URL=redis://default:password@host:port

# PostHog (Optional - for analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://marketing-copilot.vercel.app
NODE_ENV=production

# Feature Flags
ENABLE_DEMO_MODE=true
ENABLE_BUDGET_CAPS=true
MAX_DAILY_BUDGET=50
MAX_TOTAL_BUDGET=500
AUTO_PAUSE_HOURS=24
```

### D. Glossary

**Terms:**
- **Campaign**: A Google Ads campaign containing ad groups and ads
- **Ad Group**: A container for ads with shared targeting (within a campaign)
- **Performance Max**: Google's AI-powered campaign type that optimizes across all Google properties
- **CPA**: Cost Per Acquisition (how much you pay per conversion)
- **ROAS**: Return On Ad Spend (revenue ÷ spend)
- **CTR**: Click-Through Rate (clicks ÷ impressions)
- **Micros**: Google Ads API unit (1,000,000 micros = $1)
- **OAuth**: Open Authorization protocol for secure API access
- **MCC**: My Client Center (Google Ads manager account)

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2025  
**Next Review:** After 24-hour build completion  
**Status:** ✅ Ready for Development

---

**Approval:**
- [ ] Technical Lead Review
- [ ] Product Owner Approval
- [ ] Architecture Alignment (pending architecture doc)
- [ ] Development Checklist Generated (pending)

**Next Steps:**
1. ✅ Review Implementation Documents (created):
   - `/docs/implementation/schema.sql` - Database schema
   - `/docs/implementation/google-ads-api-examples.ts` - Real API code
   - `/docs/implementation/auth-flow.md` - Authentication flow
   - `/docs/implementation/cron-jobs.md` - Scheduled jobs
   - `/docs/implementation/error-codes.md` - Error handling
2. Generate Architecture Document (`/docs/foundation/architecture.md`)
3. Generate Development Checklist (`/docs/foundation/dev_checklist.md`)
4. Set up development environment
5. Begin Hour 0-4: Foundation & Authentication