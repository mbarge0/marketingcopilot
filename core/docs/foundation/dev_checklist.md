# Development Checklist
## Marketing Co-Pilot - 24-Hour MVP Build

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## Pre-Build Checklist

### ✅ Environment Setup (30 minutes)

- [ ] **Create Next.js Project**
  ```bash
  npx create-next-app@latest marketing-copilot --typescript --tailwind --app
  cd marketing-copilot
  ```

- [ ] **Install Dependencies**
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  npm install google-ads-api openai
  npm install -D @types/node
  ```

- [ ] **Set Up Supabase**
  - [ ] Create Supabase project at https://supabase.com
  - [ ] Copy project URL and anon key
  - [ ] Run schema.sql in Supabase SQL Editor
  - [ ] Verify all tables created
  - [ ] Verify RLS policies enabled

- [ ] **Set Up Google Cloud Console**
  - [ ] Create project
  - [ ] Enable Google Ads API
  - [ ] Create OAuth 2.0 credentials
  - [ ] Add redirect URI: `http://localhost:3000/api/auth/google/callback`
  - [ ] Get developer token (apply if needed)

- [ ] **Set Up OpenAI**
  - [ ] Create account at https://platform.openai.com
  - [ ] Generate API key
  - [ ] Add billing (required for GPT-4)

- [ ] **Create `.env.local`**
  ```bash
  cp .env.example .env.local
  # Fill in all values
  ```

- [ ] **Verify Environment**
  ```bash
  npm run dev
  # Should start on http://localhost:3000
  ```

---

## Hour 0-4: Foundation & Authentication

### Hour 0-1: Project Setup

- [ ] **Initialize Project Structure**
  ```bash
  mkdir -p app/api/auth/google/{initiate,callback}
  mkdir -p app/api/campaigns
  mkdir -p app/api/insights
  mkdir -p app/api/cron/{monitor-budgets,auto-pause-24h,sync-campaigns}
  mkdir -p lib/{supabase,google-ads,openai,errors}
  mkdir -p components/{ui,dashboard,campaigns}
  ```

- [ ] **Set Up Supabase Clients**
  - [ ] Create `lib/supabase/client.ts` (browser client)
  - [ ] Create `lib/supabase/server.ts` (server client)
  - [ ] Test connection

- [ ] **Set Up Tailwind + shadcn/ui**
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input
  ```

### Hour 1-2: Authentication (Supabase)

- [ ] **Create Auth Pages**
  - [ ] `app/(auth)/login/page.tsx` - Copy from auth-flow.md
  - [ ] `app/(auth)/signup/page.tsx` - Copy from auth-flow.md
  - [ ] Test signup/login flow

- [ ] **Create Middleware**
  - [ ] `middleware.ts` - Copy from auth-flow.md
  - [ ] Test route protection

- [ ] **Create Encryption Helper**
  - [ ] `lib/auth/encryption.ts` - Copy from auth-flow.md
  - [ ] Test encrypt/decrypt

### Hour 2-3: Google Ads OAuth

- [ ] **Create OAuth Initiation Endpoint**
  - [ ] `app/api/auth/google/initiate/route.ts` - Copy from auth-flow.md
  - [ ] Test OAuth URL generation

- [ ] **Create OAuth Callback Handler**
  - [ ] `app/api/auth/google/callback/route.ts` - Copy from auth-flow.md
  - [ ] **CRITICAL:** Implement customer_id fetching (see auth-flow.md Section 2.6)
  - [ ] Test full OAuth flow

- [ ] **Create Token Refresh**
  - [ ] `lib/google-ads/token-refresh.ts` - Copy from auth-flow.md
  - [ ] Test token refresh

### Hour 3-4: Dashboard Foundation

- [ ] **Create Dashboard Layout**
  - [ ] `app/dashboard/page.tsx` - Main dashboard page
  - [ ] Mode selector component (tabs: Table, Insights, Create, etc.)
  - [ ] Left navigation component (Google Ads style)
  - [ ] Main content area (mode-based rendering)
  - [ ] Chat box component (always-present at bottom)

- [ ] **Build Table Mode (Default)**
  - [ ] Campaign table component (Google Ads-like)
  - [ ] Table columns (Name, Status, Budget, Spend, Clicks, etc.)
  - [ ] Sortable columns
  - [ ] Filterable by status, type, date range
  - [ ] Bulk actions (pause multiple, adjust budgets)
  - [ ] Row-level actions (Edit, Pause, Duplicate)
  - [ ] Expandable rows (Ad Groups → Ads → Keywords)
  - [ ] Export to CSV
  - [ ] "View in Google Ads" deep links

- [ ] **Build Chat Box Component**
  - [ ] Fixed position at bottom
  - [ ] Context-aware suggestions
  - [ ] Basic chat functionality
  - [ ] Mode switching via chat ("Create a campaign" → switches to Create mode)

- [ ] **Add Connect Google Ads Button**
  - [ ] Implement connect flow
  - [ ] Show connection status
  - [ ] Test connection persistence

**✅ Checkpoint:** User can sign up, log in, connect Google Ads, and see campaigns in familiar table view

---

## Hour 4-8: Data Layer & Dashboard

### Hour 4-5: Google Ads API Client

- [ ] **Create API Client Wrapper**
  - [ ] `lib/google-ads/client.ts` - Copy from google-ads-api-examples.ts
  - [ ] Test client creation

- [ ] **Create API Functions**
  - [ ] `lib/google-ads/api.ts` - Copy functions from google-ads-api-examples.ts:
    - [ ] `fetchCampaigns()`
    - [ ] `fetchHistoricalMetrics()`
    - [ ] `pauseCampaign()`
    - [ ] `resumeCampaign()`
  - [ ] Test each function with real account

### Hour 5-6: Campaign Data Fetching

- [ ] **Create Campaigns API Route**
  - [ ] `app/api/campaigns/route.ts`
  - [ ] GET: Fetch campaigns from cache or API
  - [ ] Test with real Google Ads account

- [ ] **Update Table Mode**
  - [ ] Fetch campaigns on load
  - [ ] Display in table format
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Test with real data

### Hour 6-7: Table Mode Features

- [ ] **Add Table Functionality**
  - [ ] Column sorting
  - [ ] Column filtering
  - [ ] Date range picker
  - [ ] Column customization (show/hide)
  - [ ] Bulk selection
  - [ ] Bulk actions (pause, resume, adjust budget)

- [ ] **Add Row Actions**
  - [ ] Expandable rows (show Ad Groups)
  - [ ] Quick actions per row (Edit, Pause, Duplicate)
  - [ ] "View in Google Ads" links

### Hour 7-8: Left Navigation

- [ ] **Build Left Nav Component**
  - [ ] Campaigns list (default)
  - [ ] Ad Groups (when campaign selected)
  - [ ] Ads & Assets (when ad group selected)
  - [ ] Keywords (when ad group selected)
  - [ ] Audiences
  - [ ] Reports
  - [ ] Account selector (top-right)

- [ ] **Connect Navigation to Table**
  - [ ] Selecting campaign filters table
  - [ ] Navigation updates based on selection
  - [ ] Test navigation flow

**✅ Checkpoint:** Dashboard shows real campaigns in Google Ads-like table, can pause/resume, navigation works

---

## Hour 8-12: AI Insights Engine

### Hour 8-9: Rule-Based Insights

- [ ] **Create Budget Overspend Detection**
  - [ ] `lib/insights/budget-detection.ts`
  - [ ] Check spend vs budget
  - [ ] Create insight records
  - [ ] Test with overspent campaign

- [ ] **Create Insights API Route**
  - [ ] `app/api/insights/route.ts`
  - [ ] GET: Fetch insights for user
  - [ ] Test insight generation

### Hour 9-10: Anomaly Detection

- [ ] **Create Historical Metrics Query**
  - [ ] Use `fetchHistoricalMetrics()` from api.ts
  - [ ] Calculate 7-day averages
  - [ ] Implement z-score calculation
  - [ ] Test anomaly detection

- [ ] **Create Anomaly Insights**
  - [ ] Detect CPA/CTR/ROAS anomalies
  - [ ] Generate insight messages
  - [ ] Test with varied data

### Hour 10-11: AI Recommendations

- [ ] **Set Up OpenAI Client**
  - [ ] `lib/openai/client.ts`
  - [ ] Test GPT-4 connection

- [ ] **Create AI Insight Generator**
  - [ ] `lib/insights/ai-recommendations.ts`
  - [ ] Prompt engineering (see PRD Section 2.3)
  - [ ] Generate optimization recommendations
  - [ ] Test with sample campaign data

### Hour 11-12: Insights Mode UI

- [ ] **Create Insights Mode Component**
  - [ ] `components/dashboard/InsightsMode.tsx`
  - [ ] Display insights as cards
  - [ ] Priority indicators (🔴🟡🟢)
  - [ ] Action buttons per insight
  - [ ] Dismiss functionality

- [ ] **Connect Insights to Chat Box**
  - [ ] Chat can trigger insights ("Show me insights")
  - [ ] Chat can surface insights contextually
  - [ ] Test chat → insights flow

- [ ] **Update Dashboard**
  - [ ] Add Insights mode tab
  - [ ] Connect Insights mode to main content area
  - [ ] Auto-refresh insights every 5 minutes
  - [ ] Test mode switching (Table ↔ Insights)

**✅ Checkpoint:** Insights mode displays AI-generated insights, accessible via tab or chat

---

## Hour 12-16: Campaign Builder

### Hour 12-13: Campaign Creation UI

- [ ] **Create Create Mode Component**
  - [ ] `components/dashboard/CreateMode.tsx`
  - [ ] Text input for natural language
  - [ ] "Build Campaign" button
  - [ ] Loading state

- [ ] **Connect Create Mode to Chat**
  - [ ] Chat can trigger campaign creation
  - [ ] Auto-switch to Create mode when user types "Create a campaign..."
  - [ ] Pre-fill chat input in Create mode
  - [ ] Test chat → Create mode flow

### Hour 13-14: AI Campaign Extraction

- [ ] **Create Campaign Extraction**
  - [ ] `lib/campaigns/extract.ts`
  - [ ] Use OpenAI GPT-4 with JSON mode
  - [ ] Extract: name, budget, type, targeting, headlines, descriptions
  - [ ] Validate extracted data
  - [ ] Test with various inputs

### Hour 14-15: Campaign Review Screen

- [ ] **Create Review Component**
  - [ ] `components/campaigns/CampaignReview.tsx`
  - [ ] Display extracted fields
  - [ ] Allow editing
  - [ ] Show AI-generated headlines/descriptions
  - [ ] Add regenerate buttons

- [ ] **Add Budget Validation**
  - [ ] Enforce $50/day max
  - [ ] Show warnings
  - [ ] Prevent publishing if invalid

### Hour 15-16: Campaign Publishing

- [ ] **Create Publishing API**
  - [ ] `app/api/campaigns/create/route.ts`
  - [ ] Use `createPerformanceMaxCampaign()` from api.ts
  - [ ] Handle errors (see error-codes.md)
  - [ ] Store job in database
  - [ ] Test publishing flow

- [ ] **Add Publishing UI**
  - [ ] Progress modal
  - [ ] Success confirmation
  - [ ] Error display
  - [ ] Link to Google Ads Manager
  - [ ] Redirect to Table mode after success

**✅ Checkpoint:** User can create and publish campaigns via Create mode or chat box

---

## Hour 16-20: Real Publishing & Safety

### Hour 16-17: Complete Publishing Flow

- [ ] **Test Full Flow**
  - [ ] Create campaign via conversation
  - [ ] Review and edit
  - [ ] Publish to Google Ads
  - [ ] Verify in Google Ads Manager
  - [ ] Fix any API issues

- [ ] **Add Error Handling**
  - [ ] Parse Google Ads API errors (see error-codes.md)
  - [ ] Show user-friendly messages
  - [ ] Add retry logic
  - [ ] Test error scenarios

### Hour 17-18: Budget Safety

- [ ] **Add Budget Cap Enforcement**
  - [ ] Server-side validation
  - [ ] Double-check before API call
  - [ ] Log all budget actions
  - [ ] Test cap enforcement

- [ ] **Create Budget Alert System**
  - [ ] Database triggers (optional)
  - [ ] Alert creation logic
  - [ ] Test alert generation

### Hour 18-19: Cron Jobs Setup

- [ ] **Set Up Vercel Cron Jobs**
  - [ ] Create `vercel.json` - Copy from cron-jobs.md
  - [ ] Create `app/api/cron/monitor-budgets/route.ts` - Copy from cron-jobs.md
  - [ ] Create `app/api/cron/auto-pause-24h/route.ts` - Copy from cron-jobs.md
  - [ ] Create `app/api/cron/sync-campaigns/route.ts` - Copy from cron-jobs.md
  - [ ] Add `CRON_SECRET` to environment variables
  - [ ] Test cron jobs locally (use test endpoint)

### Hour 19-20: Auto-Pause Logic

- [ ] **Implement 24-Hour Auto-Pause**
  - [ ] Query campaigns created 24+ hours ago
  - [ ] Pause via Google Ads API
  - [ ] Create alerts
  - [ ] Test auto-pause (use test account)

- [ ] **Implement Budget Auto-Pause**
  - [ ] Check spend vs budget
  - [ ] Auto-pause at 100%
  - [ ] Create alerts
  - [ ] Test with overspent campaign

**✅ Checkpoint:** All safety features active, cron jobs running

---

## Hour 20-24: Demo Mode & Polish

### Hour 20-21: Demo Mode

- [ ] **Create Demo Data Handler**
  - [ ] Check `user.is_demo_mode` flag
  - [ ] Return demo campaigns if demo mode
  - [ ] Hide "Connect Google Ads" in demo mode
  - [ ] Add "Upgrade to Real Account" CTA

- [ ] **Create Landing Page**
  - [ ] `app/page.tsx`
  - [ ] "Try Demo Mode" button
  - [ ] "Connect Google Ads" button
  - [ ] Value proposition

### Hour 21-22: UI Polish

- [ ] **Add Loading States**
  - [ ] Skeleton loaders
  - [ ] Spinner components
  - [ ] Progress indicators

- [ ] **Add Error States**
  - [ ] Error messages
  - [ ] Retry buttons
  - [ ] Empty states

- [ ] **Responsive Design**
  - [ ] Mobile-friendly dashboard
  - [ ] Responsive campaign list
  - [ ] Mobile alerts view

### Hour 22-23: Testing & Bug Fixes

- [ ] **Manual Testing Checklist**
  - [ ] Sign up → Login → Connect Google Ads
  - [ ] View campaigns in dashboard
  - [ ] See AI insights
  - [ ] Create campaign via conversation
  - [ ] Publish campaign
  - [ ] Pause/resume campaign
  - [ ] Test demo mode
  - [ ] Test error scenarios

- [ ] **Fix Critical Bugs**
  - [ ] Fix any blocking issues
  - [ ] Improve error messages
  - [ ] Add missing validations

### Hour 23-24: Deployment

- [ ] **Deploy to Vercel**
  ```bash
  npm install -g vercel
  vercel login
  vercel --prod
  ```

- [ ] **Configure Environment Variables**
  - [ ] Add all env vars in Vercel dashboard
  - [ ] Set `CRON_SECRET`
  - [ ] Update OAuth redirect URI to production URL
  - [ ] Verify cron jobs configured

- [ ] **Final Smoke Test**
  - [ ] Test production URL
  - [ ] Test OAuth flow
  - [ ] Test campaign creation
  - [ ] Verify cron jobs running

- [ ] **Record Demo Video**
  - [ ] 3-minute walkthrough
  - [ ] Show key features
  - [ ] Highlight "10x faster" value prop

**✅ Checkpoint:** Application deployed and working in production

---

## Post-Build Checklist

### Documentation

- [ ] Update README.md with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Environment variables
  - [ ] Deployment link

- [ ] Document any deviations from PRD
- [ ] Note any known issues

### Testing

- [ ] Test with 3+ different Google Ads accounts
- [ ] Test with accounts having 0, 1, 10+ campaigns
- [ ] Test error scenarios (expired tokens, API errors)
- [ ] Test budget cap enforcement

### Performance

- [ ] Check Lighthouse score (>80)
- [ ] Verify API response times (<2s p95)
- [ ] Check database query performance
- [ ] Monitor cron job execution

---

## Troubleshooting Guide

### Common Issues

**Issue:** OAuth callback fails
- **Check:** Redirect URI matches exactly in Google Cloud Console
- **Check:** `GOOGLE_ADS_CLIENT_ID` and `CLIENT_SECRET` are correct
- **Fix:** Update redirect URI in Google Cloud Console

**Issue:** Can't fetch customer_id
- **Check:** User has access to at least one Google Ads account
- **Check:** OAuth scopes include `https://www.googleapis.com/auth/adwords`
- **Fix:** Ensure user grants all requested permissions

**Issue:** Campaign creation fails
- **Check:** Budget is within limits ($50/day max)
- **Check:** Landing page URL is valid and accessible
- **Check:** Headlines/descriptions meet Google Ads requirements
- **Fix:** Review error message from Google Ads API

**Issue:** Cron jobs not running
- **Check:** `vercel.json` is in root directory
- **Check:** `CRON_SECRET` is set in Vercel environment variables
- **Check:** Cron jobs are enabled in Vercel dashboard
- **Fix:** Verify cron job configuration in Vercel

**Issue:** Database RLS blocking queries
- **Check:** Using service role key for server-side operations
- **Check:** RLS policies are correct
- **Fix:** Ensure API routes use Supabase service role client

---

## Success Criteria

### Must Have (P0)

- ✅ User can sign up and log in
- ✅ User can connect Google Ads account
- ✅ Dashboard shows real campaigns
- ✅ AI insights generate and display
- ✅ User can create campaign via conversation
- ✅ Campaign publishes to Google Ads
- ✅ Budget caps enforced ($50/day)
- ✅ Auto-pause after 24 hours works
- ✅ Application deployed to production

### Should Have (P1)

- ✅ Demo mode works
- ✅ Pause/resume campaigns
- ✅ Error messages are clear
- ✅ UI is responsive
- ✅ Cron jobs running

### Nice to Have (P2)

- ⏳ Multi-account support
- ⏳ Campaign editing
- ⏳ Advanced insights
- ⏳ Performance charts

---

## Time Estimates

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

## Notes

- **If Behind Schedule:** Prioritize P0 features, defer P1/P2
- **If Ahead of Schedule:** Add polish, improve error handling
- **Blockers:** Document immediately, don't spend >1 hour debugging
- **API Limits:** Monitor Google Ads API usage, cache aggressively

---

## References

- **PRD:** `/docs/foundation/prd.md`
- **Architecture:** `/docs/foundation/architecture.md`
- **Schema:** `/docs/implementation/schema.sql`
- **Google Ads API:** `/docs/implementation/google-ads-api-examples.ts`
- **Auth Flow:** `/docs/implementation/auth-flow.md`
- **Cron Jobs:** `/docs/implementation/cron-jobs.md`
- **Error Handling:** `/docs/implementation/error-codes.md`

