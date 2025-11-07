# Development Checklist
## Marketing Co-Pilot - 24-Hour MVP Build

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## Pre-Build Checklist

### ✅ 0. Environment Setup (30 minutes)

- [ ] **0.1 Create Next.js Project**
  ```bash
  npx create-next-app@latest marketing-copilot --typescript --tailwind --app
  cd marketing-copilot
  ```

- [ ] **0.2 Install Dependencies**
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  npm install google-ads-api openai
  npm install -D @types/node
  ```

- [ ] **0.3 Set Up Supabase**
  - [ ] Create Supabase project at https://supabase.com
  - [ ] Copy project URL and anon key
  - [ ] Run schema.sql in Supabase SQL Editor
  - [ ] Verify all tables created
  - [ ] Verify RLS policies enabled

- [ ] **0.4 Set Up Google Cloud Console**
  - [ ] Create project
  - [ ] Enable Google Ads API
  - [ ] Create OAuth 2.0 credentials
  - [ ] Add redirect URI: `http://localhost:3000/api/auth/google/callback`
  - [ ] Get developer token (apply if needed)

- [ ] **0.5 Set Up OpenAI**
  - [ ] Create account at https://platform.openai.com
  - [ ] Generate API key
  - [ ] Add billing (required for GPT-4)

- [ ] **0.6 Create `.env.local`**
  ```bash
  cp .env.example .env.local
  # Fill in all values
  ```

- [ ] **0.7 Verify Environment**
  ```bash
  npm run dev
  # Should start on http://localhost:3000
  ```

---

## 1. Foundation & Authentication

### 1.1 Project Setup

- [ ] **1.1.1 Initialize Project Structure**
  ```bash
  mkdir -p app/api/auth/google/{initiate,callback}
  mkdir -p app/api/campaigns
  mkdir -p app/api/insights
  mkdir -p app/api/cron/{monitor-budgets,auto-pause-24h,sync-campaigns}
  mkdir -p lib/{supabase,google-ads,openai,errors}
  mkdir -p components/{ui,dashboard,campaigns}
  ```

- [ ] **1.1.2 Set Up Supabase Clients**
  - [ ] Create `lib/supabase/client.ts` (browser client)
  - [ ] Create `lib/supabase/server.ts` (server client)
  - [ ] Test connection

- [ ] **1.1.3 Set Up Tailwind + shadcn/ui**
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input
  ```

### 1.2 Authentication (Supabase)

- [ ] **1.2.1 Create Auth Pages**
  - [ ] `app/(auth)/login/page.tsx` - Copy from auth-flow.md
  - [ ] `app/(auth)/signup/page.tsx` - Copy from auth-flow.md
  - [ ] Test signup/login flow

- [ ] **1.2.2 Create Middleware**
  - [ ] `middleware.ts` - Copy from auth-flow.md
  - [ ] Test route protection

- [ ] **1.2.3 Create Encryption Helper**
  - [ ] `lib/auth/encryption.ts` - Copy from auth-flow.md
  - [ ] Test encrypt/decrypt

### 1.3 Google Ads OAuth

- [ ] **1.3.1 Create OAuth Initiation Endpoint**
  - [ ] `app/api/auth/google/initiate/route.ts` - Copy from auth-flow.md
  - [ ] Test OAuth URL generation

- [ ] **1.3.2 Create OAuth Callback Handler**
  - [ ] `app/api/auth/google/callback/route.ts` - Copy from auth-flow.md
  - [ ] **CRITICAL:** Implement customer_id fetching (see auth-flow.md Section 2.6)
  - [ ] Test full OAuth flow

- [ ] **1.3.3 Create Token Refresh**
  - [ ] `lib/google-ads/token-refresh.ts` - Copy from auth-flow.md
  - [ ] Test token refresh

### 1.4 Dashboard Foundation

- [ ] **1.4.1 Create Dashboard Layout**
  - [ ] `app/dashboard/page.tsx` - Main dashboard page
  - [ ] Mode selector component (tabs: Table, Insights, Create, etc.)
  - [ ] Left navigation component (Google Ads style)
  - [ ] Main content area (mode-based rendering)
  - [ ] Chat box component (always-present at bottom)

- [ ] **1.4.2 Build Table Mode (Default)**
  - [ ] Campaign table component (Google Ads-like)
  - [ ] Table columns (Name, Status, Budget, Spend, Clicks, etc.)
  - [ ] Sortable columns
  - [ ] Filterable by status, type, date range
  - [ ] Bulk actions (pause multiple, adjust budgets)
  - [ ] Row-level actions (Edit, Pause, Duplicate)
  - [ ] Expandable rows (Ad Groups → Ads → Keywords)
  - [ ] Export to CSV
  - [ ] "View in Google Ads" deep links

- [ ] **1.4.3 Build Chat Box Component**
  - [ ] Fixed position at bottom
  - [ ] Context-aware suggestions
  - [ ] Basic chat functionality
  - [ ] Mode switching via chat ("Create a campaign" → switches to Create mode)

- [ ] **1.4.4 Add Connect Google Ads Button**
  - [ ] Implement connect flow
  - [ ] Show connection status
  - [ ] Test connection persistence

**✅ Checkpoint:** User can sign up, log in, connect Google Ads, and see campaigns in familiar table view

---

## 2. Data Layer & Dashboard

### 2.1 Google Ads API Client

- [ ] **2.1.1 Create API Client Wrapper**
  - [ ] `lib/google-ads/client.ts` - Copy from google-ads-api-examples.ts
  - [ ] Test client creation

- [ ] **2.1.2 Create API Functions**
  - [ ] `lib/google-ads/api.ts` - Copy functions from google-ads-api-examples.ts:
    - [ ] `fetchCampaigns()`
    - [ ] `fetchHistoricalMetrics()`
    - [ ] `pauseCampaign()`
    - [ ] `resumeCampaign()`
  - [ ] Test each function with real account

### 2.2 Campaign Data Fetching

- [ ] **2.2.1 Create Campaigns API Route**
  - [ ] `app/api/campaigns/route.ts`
  - [ ] GET: Fetch campaigns from cache or API
  - [ ] Test with real Google Ads account

- [ ] **2.2.2 Update Table Mode**
  - [ ] Fetch campaigns on load
  - [ ] Display in table format
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Test with real data

### 2.3 Table Mode Features

- [ ] **2.3.1 Add Table Functionality**
  - [ ] Column sorting
  - [ ] Column filtering
  - [ ] Date range picker
  - [ ] Column customization (show/hide)
  - [ ] Bulk selection
  - [ ] Bulk actions (pause, resume, adjust budget)

- [ ] **2.3.2 Add Row Actions**
  - [ ] Expandable rows (show Ad Groups)
  - [ ] Quick actions per row (Edit, Pause, Duplicate)
  - [ ] "View in Google Ads" links

### 2.4 Left Navigation

- [ ] **2.4.1 Build Left Nav Component**
  - [ ] Campaigns list (default)
  - [ ] Ad Groups (when campaign selected)
  - [ ] Ads & Assets (when ad group selected)
  - [ ] Keywords (when ad group selected)
  - [ ] Audiences
  - [ ] Reports
  - [ ] Account selector (top-right)

- [ ] **2.4.2 Connect Navigation to Table**
  - [ ] Selecting campaign filters table
  - [ ] Navigation updates based on selection
  - [ ] Test navigation flow

**✅ Checkpoint:** Dashboard shows real campaigns in Google Ads-like table, can pause/resume, navigation works

---

## 3. AI Insights Engine

### 3.1 Rule-Based Insights

- [ ] **3.1.1 Create Budget Overspend Detection**
  - [ ] `lib/insights/budget-detection.ts`
  - [ ] Check spend vs budget
  - [ ] Create insight records
  - [ ] Test with overspent campaign

- [ ] **3.1.2 Create Insights API Route**
  - [ ] `app/api/insights/route.ts`
  - [ ] GET: Fetch insights for user
  - [ ] Test insight generation

### 3.2 Anomaly Detection

- [ ] **3.2.1 Create Historical Metrics Query**
  - [ ] Use `fetchHistoricalMetrics()` from api.ts
  - [ ] Calculate 7-day averages
  - [ ] Implement z-score calculation
  - [ ] Test anomaly detection

- [ ] **3.2.2 Create Anomaly Insights**
  - [ ] Detect CPA/CTR/ROAS anomalies
  - [ ] Generate insight messages
  - [ ] Test with varied data

### 3.3 AI Recommendations

- [ ] **3.3.1 Set Up OpenAI Client**
  - [ ] `lib/openai/client.ts`
  - [ ] Test GPT-4 connection

- [ ] **3.3.2 Create AI Insight Generator**
  - [ ] `lib/insights/ai-recommendations.ts`
  - [ ] Prompt engineering (see PRD Section 2.3)
  - [ ] Generate optimization recommendations
  - [ ] Test with sample campaign data

### 3.4 Insights Mode UI

- [ ] **3.4.1 Create Insights Mode Component**
  - [ ] `components/dashboard/InsightsMode.tsx`
  - [ ] Display insights as cards
  - [ ] Priority indicators (🔴🟡🟢)
  - [ ] Action buttons per insight
  - [ ] Dismiss functionality

- [ ] **3.4.2 Connect Insights to Chat Box**
  - [ ] Chat can trigger insights ("Show me insights")
  - [ ] Chat can surface insights contextually
  - [ ] Test chat → insights flow

- [ ] **3.4.3 Update Dashboard**
  - [ ] Add Insights mode tab
  - [ ] Connect Insights mode to main content area
  - [ ] Auto-refresh insights every 5 minutes
  - [ ] Test mode switching (Table ↔ Insights)

**✅ Checkpoint:** Insights mode displays AI-generated insights, accessible via tab or chat

---

## 4. Campaign Builder

### 4.1 Campaign Creation UI

- [ ] **4.1.1 Create Create Mode Component**
  - [ ] `components/dashboard/CreateMode.tsx`
  - [ ] Text input for natural language
  - [ ] "Build Campaign" button
  - [ ] Loading state

- [ ] **4.1.2 Connect Create Mode to Chat**
  - [ ] Chat can trigger campaign creation
  - [ ] Auto-switch to Create mode when user types "Create a campaign..."
  - [ ] Pre-fill chat input in Create mode
  - [ ] Test chat → Create mode flow

### 4.2 AI Campaign Extraction

- [ ] **4.2.1 Create Campaign Extraction**
  - [ ] `lib/campaigns/extract.ts`
  - [ ] Use OpenAI GPT-4 with JSON mode
  - [ ] Extract: name, budget, type, targeting, headlines, descriptions
  - [ ] Validate extracted data
  - [ ] Test with various inputs

### 4.3 Campaign Review Screen

- [ ] **4.3.1 Create Review Component**
  - [ ] `components/campaigns/CampaignReview.tsx`
  - [ ] Display extracted fields
  - [ ] Allow editing
  - [ ] Show AI-generated headlines/descriptions
  - [ ] Add regenerate buttons

- [ ] **4.3.2 Add Budget Validation**
  - [ ] Enforce $50/day max
  - [ ] Show warnings
  - [ ] Prevent publishing if invalid

### 4.4 Campaign Publishing

- [ ] **4.4.1 Create Publishing API**
  - [ ] `app/api/campaigns/create/route.ts`
  - [ ] Use `createPerformanceMaxCampaign()` from api.ts
  - [ ] Handle errors (see error-codes.md)
  - [ ] Store job in database
  - [ ] Test publishing flow

- [ ] **4.4.2 Add Publishing UI**
  - [ ] Progress modal
  - [ ] Success confirmation
  - [ ] Error display
  - [ ] Link to Google Ads Manager
  - [ ] Redirect to Table mode after success

**✅ Checkpoint:** User can create and publish campaigns via Create mode or chat box

---

## 5. Real Publishing & Safety

### 5.1 Complete Publishing Flow

- [ ] **5.1.1 Test Full Flow**
  - [ ] Create campaign via conversation
  - [ ] Review and edit
  - [ ] Publish to Google Ads
  - [ ] Verify in Google Ads Manager
  - [ ] Fix any API issues

- [ ] **5.1.2 Add Error Handling**
  - [ ] Parse Google Ads API errors (see error-codes.md)
  - [ ] Show user-friendly messages
  - [ ] Add retry logic
  - [ ] Test error scenarios

### 5.2 Budget Safety

- [ ] **5.2.1 Add Budget Cap Enforcement**
  - [ ] Server-side validation
  - [ ] Double-check before API call
  - [ ] Log all budget actions
  - [ ] Test cap enforcement

- [ ] **5.2.2 Create Budget Alert System**
  - [ ] Database triggers (optional)
  - [ ] Alert creation logic
  - [ ] Test alert generation

### 5.3 Cron Jobs Setup

- [ ] **5.3.1 Set Up Vercel Cron Jobs**
  - [ ] Create `vercel.json` - Copy from cron-jobs.md
  - [ ] Create `app/api/cron/monitor-budgets/route.ts` - Copy from cron-jobs.md
  - [ ] Create `app/api/cron/auto-pause-24h/route.ts` - Copy from cron-jobs.md
  - [ ] Create `app/api/cron/sync-campaigns/route.ts` - Copy from cron-jobs.md
  - [ ] Add `CRON_SECRET` to environment variables
  - [ ] Test cron jobs locally (use test endpoint)

### 5.4 Auto-Pause Logic

- [ ] **5.4.1 Implement 24-Hour Auto-Pause**
  - [ ] Query campaigns created 24+ hours ago
  - [ ] Pause via Google Ads API
  - [ ] Create alerts
  - [ ] Test auto-pause (use test account)

- [ ] **5.4.2 Implement Budget Auto-Pause**
  - [ ] Check spend vs budget
  - [ ] Auto-pause at 100%
  - [ ] Create alerts
  - [ ] Test with overspent campaign

**✅ Checkpoint:** All safety features active, cron jobs running

---

## 6. Demo Mode & Polish

### 6.1 Demo Mode

- [ ] **6.1.1 Create Demo Data Handler**
  - [ ] Check `user.is_demo_mode` flag
  - [ ] Return demo campaigns if demo mode
  - [ ] Hide "Connect Google Ads" in demo mode
  - [ ] Add "Upgrade to Real Account" CTA

- [ ] **6.1.2 Create Landing Page**
  - [ ] `app/page.tsx`
  - [ ] "Try Demo Mode" button
  - [ ] "Connect Google Ads" button
  - [ ] Value proposition

### 6.2 UI Polish

- [ ] **6.2.1 Add Loading States**
  - [ ] Skeleton loaders
  - [ ] Spinner components
  - [ ] Progress indicators

- [ ] **6.2.2 Add Error States**
  - [ ] Error messages
  - [ ] Retry buttons
  - [ ] Empty states

- [ ] **6.2.3 Responsive Design**
  - [ ] Mobile-friendly dashboard
  - [ ] Responsive campaign list
  - [ ] Mobile alerts view

### 6.3 Testing & Bug Fixes

- [ ] **6.3.1 Manual Testing Checklist**
  - [ ] Sign up → Login → Connect Google Ads
  - [ ] View campaigns in dashboard
  - [ ] See AI insights
  - [ ] Create campaign via conversation
  - [ ] Publish campaign
  - [ ] Pause/resume campaign
  - [ ] Test demo mode
  - [ ] Test error scenarios

- [ ] **6.3.2 Fix Critical Bugs**
  - [ ] Fix any blocking issues
  - [ ] Improve error messages
  - [ ] Add missing validations

### 6.4 Deployment

- [ ] **6.4.1 Deploy to Vercel**
  ```bash
  npm install -g vercel
  vercel login
  vercel --prod
  ```

- [ ] **6.4.2 Configure Environment Variables**
  - [ ] Add all env vars in Vercel dashboard
  - [ ] Set `CRON_SECRET`
  - [ ] Update OAuth redirect URI to production URL
  - [ ] Verify cron jobs configured

- [ ] **6.4.3 Final Smoke Test**
  - [ ] Test production URL
  - [ ] Test OAuth flow
  - [ ] Test campaign creation
  - [ ] Verify cron jobs running

- [ ] **6.4.4 Record Demo Video**
  - [ ] 3-minute walkthrough
  - [ ] Show key features
  - [ ] Highlight "10x faster" value prop

**✅ Checkpoint:** Application deployed and working in production

---

## Post-Build Checklist

### 7. Documentation

- [ ] **7.1 Update README.md with:**
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Environment variables
  - [ ] Deployment link

- [ ] **7.2 Document any deviations from PRD**
- [ ] **7.3 Note any known issues**

### 8. Testing

- [ ] **8.1 Test with 3+ different Google Ads accounts**
- [ ] **8.2 Test with accounts having 0, 1, 10+ campaigns**
- [ ] **8.3 Test error scenarios (expired tokens, API errors)**
- [ ] **8.4 Test budget cap enforcement**

### 9. Performance

- [ ] **9.1 Check Lighthouse score (>80)**
- [ ] **9.2 Verify API response times (<2s p95)**
- [ ] **9.3 Check database query performance**
- [ ] **9.4 Monitor cron job execution**

---

## Troubleshooting Guide

### 10. Common Issues

**10.1 Issue: OAuth callback fails**
- **Check:** Redirect URI matches exactly in Google Cloud Console
- **Check:** `GOOGLE_ADS_CLIENT_ID` and `CLIENT_SECRET` are correct
- **Fix:** Update redirect URI in Google Cloud Console

**10.2 Issue: Can't fetch customer_id**
- **Check:** User has access to at least one Google Ads account
- **Check:** OAuth scopes include `https://www.googleapis.com/auth/adwords`
- **Fix:** Ensure user grants all requested permissions

**10.3 Issue: Campaign creation fails**
- **Check:** Budget is within limits ($50/day max)
- **Check:** Landing page URL is valid and accessible
- **Check:** Headlines/descriptions meet Google Ads requirements
- **Fix:** Review error message from Google Ads API

**10.4 Issue: Cron jobs not running**
- **Check:** `vercel.json` is in root directory
- **Check:** `CRON_SECRET` is set in Vercel environment variables
- **Check:** Cron jobs are enabled in Vercel dashboard
- **Fix:** Verify cron job configuration in Vercel

**10.5 Issue: Database RLS blocking queries**
- **Check:** Using service role key for server-side operations
- **Check:** RLS policies are correct
- **Fix:** Ensure API routes use Supabase service role client

---

## Success Criteria

### 11. Must Have (P0)

- ✅ User can sign up and log in
- ✅ User can connect Google Ads account
- ✅ Dashboard shows real campaigns
- ✅ AI insights generate and display
- ✅ User can create campaign via conversation
- ✅ Campaign publishes to Google Ads
- ✅ Budget caps enforced ($50/day)
- ✅ Auto-pause after 24 hours works
- ✅ Application deployed to production

### 12. Should Have (P1)

- ✅ Demo mode works
- ✅ Pause/resume campaigns
- ✅ Error messages are clear
- ✅ UI is responsive
- ✅ Cron jobs running

### 13. Nice to Have (P2)

- ⏳ Multi-account support
- ⏳ Campaign editing
- ⏳ Advanced insights
- ⏳ Performance charts

---

## 14. Time Estimates

| Task | Estimated Time | Actual Time |
|------|---------------|-------------|
| Environment Setup | 30 min | ___ |
| Authentication | 4 hours | ___ |
| Dashboard | 4 hours | ___ |
| AI Insights | 4 hours | ___ |
| Campaign Builder | 4 hours | ___ |
| Publishing & Safety | 4 hours | ___ |
| Demo Mode & Polish | 4 hours | ___ |
| **Total** | **24 hours** | **___** |

---

## 15. Notes

- **If Behind Schedule:** Prioritize P0 features, defer P1/P2
- **If Ahead of Schedule:** Add polish, improve error handling
- **Blockers:** Document immediately, don't spend >1 hour debugging
- **API Limits:** Monitor Google Ads API usage, cache aggressively

---

## 16. Meta Menu + AI Layout Redesign

### 16.1 Meta Menu Implementation

- [ ] **16.1.1 Create Meta Menu Component**
  - [ ] `components/ui/meta-menu/MetaMenu.tsx`
  - [ ] Three persistent items: Dashboard, AI, Settings
  - [ ] Icon-based with labels on hover/expand
  - [ ] Compact vertical layout (far left column)
  - [ ] Active state highlighting
  - [ ] Smooth transitions between modes
  - [ ] Icons: 📊 Dashboard, 🧠 AI, ⚙️ Settings

- [ ] **16.1.2 Update Layout Structure**
  - [ ] Three-column layout: Meta Menu (far left) + Existing LeftNavigation (middle) + Main Content (right)
  - [ ] Update `app/dashboard/layout.tsx` or create new layout wrapper
  - [ ] Ensure meta-menu remains visible at all times
  - [ ] Keep existing LeftNavigation component unchanged (Campaigns, Ad Groups, etc.)
  - [ ] Responsive behavior (collapse meta-menu on mobile, keep LeftNavigation)

### 16.2 AI Mode

- [ ] **16.2.1 Create AI Workspace View**
  - [ ] `app/ai/page.tsx` - New AI mode page
  - [ ] Move AI panel to right side (drawer/split-pane)
  - [ ] Keep central workspace visible (no overlay)
  - [ ] Add Full-Screen Mode toggle
  - [ ] Contextual AI modes: Analyze, Research, Generate
  - [ ] Show "getting started" guidance when no mode selected

- [ ] **16.2.2 AI Panel Component**
  - [ ] `components/ui/ai-panel/AIPanel.tsx`
  - [ ] Right-side drawer or split-pane layout
  - [ ] Expandable/collapsible
  - [ ] Full-screen mode support (hides main content, shows only AI)
  - [ ] Contextual suggestions when no mode selected
  - [ ] Chat interface (enhanced version of existing ChatBox)

- [ ] **16.2.3 "More" Dropdown Tab**
  - [ ] Add "More" tab to the right of "Report" tab in ModeTabs
  - [ ] Implement dropdown menu with additional verb-based modes
  - [ ] Current tabs: Insights, Research, Analyze, Plan, Create, Report
  - [ ] Verbs to add to "More" dropdown (14 total):
    - [ ] **Allocate** - Budget allocation across campaigns/channels
    - [ ] **Optimize** - Improve bids, budgets, targeting, creative
    - [ ] **Design** - Ad creative, landing pages
    - [ ] **Refresh** - Update stale creative
    - [ ] **Monitor** - Check campaign status, spend, performance
    - [ ] **Compare** - Campaigns vs each other, periods vs periods, actual vs target
    - [ ] **Diagnose** - Find root cause of performance issues
    - [ ] **Audit** - Review account health, policy compliance, settings
    - [ ] **Benchmark** - Compare against industry standards, competitors
    - [ ] **Forecast** - Predict future performance, budget needs
    - [ ] **Strategize** - Long-term optimization approach
    - [ ] **Plan** - Campaign strategy, budget allocation, timeline
    - [ ] **Explain** - Interpret results for non-technical stakeholders
    - [ ] **Learn** - Understand new features, best practices
  - [ ] Dropdown should show icon + label for each verb
  - [ ] Clicking a verb from dropdown navigates to that mode
  - [ ] URL structure: `/ai?mode=allocate`, `/ai?mode=optimize`, etc.
  - [ ] Active state: If current mode is from "More", highlight "More" tab and show active verb in dropdown
  - [ ] Dropdown should be searchable/filterable for easy access to 14 verbs

- [ ] **16.2.4 Additional Verb Modes Implementation**
  - [ ] **Allocate Mode** (`components/ai/modes/AllocateMode.tsx`)
    - [ ] Purpose: Budget allocation across campaigns/channels
    - [ ] ContentCards: Current Allocation, Recommended Changes, Impact Forecast
    - [ ] Chat integration: "Allocate $10K across campaigns", "Reallocate budget"
    - [ ] Data source: Campaign budgets, performance metrics
  - [ ] **Optimize Mode** (`components/ai/modes/OptimizeMode.tsx`)
    - [ ] Purpose: Improve bids, budgets, targeting, creative
    - [ ] ContentCards: Optimization Opportunities, Bid Recommendations, A/B Test Results
    - [ ] Chat integration: "Optimize campaign X", "Improve bids for keywords"
    - [ ] Data source: Performance metrics, Google Ads optimization score
  - [ ] **Design Mode** (`components/ai/modes/DesignMode.tsx`)
    - [ ] Purpose: Ad creative, landing pages
    - [ ] ContentCards: Creative Library, Design Templates, Asset Generator
    - [ ] Chat integration: "Design ad for product X", "Create landing page"
    - [ ] Data source: Creative assets, templates
  - [ ] **Refresh Mode** (`components/ai/modes/RefreshMode.tsx`)
    - [ ] Purpose: Update stale creative
    - [ ] ContentCards: Stale Creative Detection, Refresh Recommendations, Update Queue
    - [ ] Chat integration: "Refresh stale ads", "Update creative for campaign X"
    - [ ] Data source: Ad performance, creative age, CTR trends
  - [ ] **Monitor Mode** (`components/ai/modes/MonitorMode.tsx`)
    - [ ] Purpose: Check campaign status, spend, performance
    - [ ] ContentCards: Campaign Status Dashboard, Real-time Metrics, Alerts Feed
    - [ ] Chat integration: "Monitor campaign X", "Show me current spend"
    - [ ] Data source: Campaign status, real-time metrics, alerts
  - [ ] **Compare Mode** (`components/ai/modes/CompareMode.tsx`)
    - [ ] Purpose: Campaigns vs each other, periods vs periods, actual vs target
    - [ ] ContentCards: Comparison Selector, Side-by-Side Metrics, Trend Analysis
    - [ ] Chat integration: "Compare campaign A vs B", "Compare this week vs last week"
    - [ ] Data source: Campaign performance, historical data, targets
  - [ ] **Diagnose Mode** (`components/ai/modes/DiagnoseMode.tsx`)
    - [ ] Purpose: Find root cause of performance issues
    - [ ] ContentCards: Issue Detection, Root Cause Analysis, Fix Recommendations
    - [ ] Chat integration: "Why did CPA spike?", "Diagnose campaign X performance"
    - [ ] Data source: Performance anomalies, error logs, campaign history
  - [ ] **Audit Mode** (`components/ai/modes/AuditMode.tsx`)
    - [ ] Purpose: Review account health, policy compliance, settings
    - [ ] ContentCards: Account Health Score, Policy Violations, Settings Review
    - [ ] Chat integration: "Audit my account", "Check policy compliance"
    - [ ] Data source: Account settings, policy status, Google Ads API
  - [ ] **Benchmark Mode** (`components/ai/modes/BenchmarkMode.tsx`)
    - [ ] Purpose: Compare against industry standards, competitors
    - [ ] ContentCards: Industry Benchmarks, Competitor Comparison, Performance Gaps
    - [ ] Chat integration: "Benchmark my campaigns", "Compare to industry average"
    - [ ] Data source: Industry data, competitor intelligence, performance metrics
  - [ ] **Forecast Mode** (`components/ai/modes/ForecastMode.tsx`)
    - [ ] Purpose: Predict future performance, budget needs
    - [ ] ContentCards: Performance Forecast, Budget Projections, Trend Predictions
    - [ ] Chat integration: "Forecast next month's performance", "Predict budget needs"
    - [ ] Data source: Historical performance, trend analysis, ML predictions
  - [ ] **Strategize Mode** (`components/ai/modes/StrategizeMode.tsx`)
    - [ ] Purpose: Long-term optimization approach
    - [ ] ContentCards: Strategy Builder, Long-term Goals, Roadmap Planner
    - [ ] Chat integration: "Create Q2 strategy", "Strategize for product launch"
    - [ ] Data source: Campaign goals, historical performance, market trends
  - [ ] **Plan Mode** (`components/ai/modes/PlanMode.tsx`)
    - [ ] Purpose: Campaign strategy, budget allocation, timeline
    - [ ] ContentCards: Strategy Builder, Budget Planner, Timeline View
    - [ ] Chat integration: "Plan Q2 campaign strategy", "Create budget plan"
    - [ ] Data source: Campaign goals, historical performance, budget data
  - [ ] **Explain Mode** (`components/ai/modes/ExplainMode.tsx`)
    - [ ] Purpose: Interpret results for non-technical stakeholders
    - [ ] ContentCards: Plain Language Explanations, Visual Summaries, Key Takeaways
    - [ ] Chat integration: "Explain ROAS to my boss", "What does this mean?"
    - [ ] Data source: Performance metrics, AI-generated explanations
  - [ ] **Learn Mode** (`components/ai/modes/LearnMode.tsx`)
    - [ ] Purpose: Understand new features, best practices
    - [ ] ContentCards: Feature Guides, Best Practices, Tutorial Library
    - [ ] Chat integration: "How do I use Performance Max?", "Teach me about bidding"
    - [ ] Data source: Documentation, tutorials, best practice guides
  - [ ] Each mode should follow the same ContentCard pattern as existing modes
  - [ ] Each mode should have mode-specific suggestions and placeholders
  - [ ] Each mode should integrate with chat bar for natural language commands

### 16.3 Settings Mode

- [ ] **16.3.1 Create Settings Page**
  - [ ] `app/settings/page.tsx`
  - [ ] Project-level preferences
  - [ ] Account integrations section:
    - [ ] Google Ads connection status
    - [ ] OpenAI API key management
  - [ ] User profile settings
  - [ ] Simple, clean layout with sections

### 16.4 Layout Structure

- [ ] **16.4.1 Implement Three-Column Layout**
  ```
  [Meta Menu] [LeftNavigation] [Main Content] [AI Panel (AI mode only)]
    64px        256px            flex-1        400px (when visible)
  ```
  - [ ] Meta Menu: Fixed width (~64px), always visible
  - [ ] LeftNavigation: Existing component, unchanged (~256px)
  - [ ] Main Content: Flexible width, updates based on mode
  - [ ] AI Panel: Right side, only visible in AI mode

- [ ] **16.4.2 Route Structure**
  - [ ] `/dashboard` - Dashboard mode (default)
  - [ ] `/ai` - AI mode
  - [ ] `/settings` - Settings mode
  - [ ] Meta menu handles navigation between these routes

### 16.5 Demo Readiness (Nov 8 Shoot)

- [ ] **16.5.1 Navigation Flow**
  - [ ] Dashboard → AI (via meta-menu) works smoothly
  - [ ] AI → Full-Screen Mode toggle works
  - [ ] Return to Dashboard works
  - [ ] Settings accessible from any mode
  - [ ] All transitions are visible and intuitive

- [ ] **16.5.2 Stub Unfinished Views**
  - [ ] Add clear "TODO" sections for incomplete features
  - [ ] Ensure structure is visible even if content is placeholder
  - [ ] Make it clear what's functional vs. stubbed
  - [ ] AI mode should show structure even if features are stubbed

**✅ Checkpoint:** Meta-menu navigation works, Dashboard/AI/Settings modes switch correctly, existing LeftNavigation preserved, AI panel appears in AI mode, demo-ready structure visible

---

## 17. References

- **PRD:** `/docs/foundation/prd.md`
- **Architecture:** `/docs/foundation/architecture.md`
- **Schema:** `/docs/implementation/schema.sql`
- **Google Ads API:** `/docs/implementation/google-ads-api-examples.ts`
- **Auth Flow:** `/docs/implementation/auth-flow.md`
- **Cron Jobs:** `/docs/implementation/cron-jobs.md`
- **Error Handling:** `/docs/implementation/error-codes.md`

