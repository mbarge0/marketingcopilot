# Architecture Document
## Marketing Co-Pilot - 24-Hour MVP

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                    (Next.js 14 + React 18)                      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │  Dashboard   │  │   Campaign   │         │
│  │    Page      │  │ (Command     │  │    Studio    │         │
│  │              │  │  Center)     │  │   Builder    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                 │                  │                 │
│         └─────────────────┴──────────────────┘                 │
│                            │                                    │
│                    ┌───────▼────────┐                          │
│                    │  Supabase Auth │                          │
│                    │   (Client SDK) │                          │
│                    └───────┬────────┘                          │
└────────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Serverless)                     │
│                    (Next.js API Routes)                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Auth API   │  │  Campaigns   │  │   Insights   │        │
│  │   Routes     │  │    API       │  │     API      │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│  ┌──────▼──────────────────▼──────────────────▼──────┐       │
│  │         Google Ads API Client Wrapper              │       │
│  │         (lib/google-ads/api.ts)                    │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   OpenAI     │  │   Token     │  │   Error      │        │
│  │   Client     │  │   Refresh   │  │   Handler    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Supabase PostgreSQL                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │    Users     │  │ Google Ads   │  │  Campaigns   │  │  │
│  │  │              │  │  Accounts    │  │    Cache     │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │  Insights    │  │ Campaign     │  │   Budget     │  │  │
│  │  │              │  │    Jobs      │  │   Alerts     │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Google     │  │    OpenAI    │  │   Vercel     │         │
│  │  Ads API     │  │     API      │  │    Cron      │         │
│  │   (v17)      │  │   (GPT-4)    │  │    Jobs      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components

**File Structure:**
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── signup/
│       └── page.tsx           # Signup page
├── dashboard/
│   └── page.tsx               # Command Center dashboard with mode switching
├── campaigns/
│   ├── create/
│   │   └── page.tsx           # Campaign builder (or handled in Create mode)
│   └── [id]/
│       └── page.tsx           # Campaign details
└── api/
    ├── auth/
    │   └── google/
    │       ├── initiate/
    │       │   └── route.ts   # OAuth initiation
    │       └── callback/
    │           └── route.ts   # OAuth callback
    ├── campaigns/
    │   ├── route.ts           # List/create campaigns
    │   └── [id]/
    │       └── route.ts       # Get/update campaign
    ├── insights/
    │   └── route.ts           # Get AI insights
    └── cron/
        ├── monitor-budgets/
        │   └── route.ts       # Budget monitoring
        ├── auto-pause-24h/
        │   └── route.ts       # 24h auto-pause
        └── sync-campaigns/
            └── route.ts       # Data sync
```

**Component Hierarchy:**
```
DashboardPage
├── ModeSelector (tabs: Table, Insights, Analyze, Create, Research, Report)
├── LeftNav (Google Ads style: Campaigns, Ad Groups, Ads, Keywords)
├── MainContentArea
│   ├── TableMode (default) - Campaign table (Google Ads clone)
│   │   ├── CampaignTable
│   │   │   ├── TableHeader (sortable columns)
│   │   │   ├── TableRow[] (expandable)
│   │   │   └── BulkActions
│   │   ├── Filters (status, type, date range)
│   │   └── ColumnSelector
│   ├── InsightsMode - AI insights feed
│   │   ├── InsightCard[]
│   │   └── InsightActions
│   ├── AnalyzeMode - Charts and comparisons (Phase 2)
│   ├── CreateMode - Campaign builder
│   │   ├── CampaignInput (conversational)
│   │   ├── CampaignReview
│   │   └── PublishingStatus
│   ├── ResearchMode - Research tools (Phase 2)
│   └── ReportMode - Report generation (Phase 2)
└── ChatBox (always present at bottom, context-aware)
    ├── ChatInput
    ├── ChatSuggestions (context-aware)
    └── ChatHistory
```

### Backend Services

**API Route Pattern:**
```typescript
// Standard API route structure
export async function GET/POST(request: NextRequest) {
  // 1. Authenticate user (Supabase Auth)
  // 2. Validate request
  // 3. Get user's Google Ads tokens
  // 4. Refresh token if expired
  // 5. Call Google Ads API
  // 6. Cache results in Supabase
  // 7. Return response
}
```

**Service Layer:**
```
lib/
├── supabase/
│   ├── client.ts              # Supabase client (browser)
│   └── server.ts              # Supabase client (server)
├── google-ads/
│   ├── client.ts              # Google Ads API client factory
│   ├── api.ts                 # API wrapper functions
│   └── token-refresh.ts       # Token refresh logic
├── openai/
│   └── client.ts              # OpenAI client
└── errors/
    └── handler.ts             # Error parsing & formatting
```

---

## Data Flow

### 1. User Authentication Flow

```
User → Login Page → Supabase Auth → Dashboard (Table Mode)
                                      │
                                      ▼
                              Check Google Ads Connection
                                      │
                                      ▼
                              ┌───────┴───────┐
                              │               │
                         Connected?      Not Connected?
                              │               │
                              ▼               ▼
                        Show Campaigns    Show Demo Mode
                        in Table Mode    in Table Mode
                        + Chat Box       + Chat Box
```

### 2. Campaign Creation Flow

```
User Input (Natural Language)
    │
    ├─→ Via Create Mode Tab
    └─→ Via Chat Box ("Create a campaign...")
         │
         ▼
    Auto-switch to Create Mode
         │
         ▼
AI Extraction (OpenAI GPT-4)
    │
    ▼
Structured Campaign Data
    │
    ▼
User Review & Edit (in Create Mode)
    │
    ▼
Pre-flight Validation
    │
    ▼
Google Ads API (Create Campaign)
    │
    ▼
Store Job in Database
    │
    ▼
Poll for Completion
    │
    ▼
Success → Dashboard (Table Mode)
```

### 3. Data Sync Flow

```
Vercel Cron Job (every 5 min)
    │
    ▼
Get Active Accounts from DB
    │
    ▼
For Each Account:
    │
    ├─→ Refresh Token
    ├─→ Create Google Ads Client
    ├─→ Fetch Campaigns (API)
    └─→ Update campaigns_cache table
```

### 4. Mode Switching Flow

```
User Action → Mode Switch
    │
    ├─→ Click mode tab
    │   │
    │   └─→ Update URL (?mode=insights)
    │       └─→ Load InsightsMode component
    │           └─→ Preserve selected campaigns/context
    │
    ├─→ Type in chat box ("Create a campaign...")
    │   │
    │   └─→ AI detects intent
    │       └─→ Auto-switch to Create mode
    │           └─→ Pre-fill chat input in Create mode
    │
    └─→ Direct URL navigation (/dashboard?mode=create)
        └─→ Load appropriate mode component
            └─→ Restore state from localStorage (if available)
```

**Mode State Management:**
- Current mode stored in URL query param (`?mode=table`)
- Selected campaigns/items persist across mode switches
- Chat history preserved per mode
- User preferences (default mode) stored in database

### 5. Budget Monitoring Flow

```
Vercel Cron Job (every 5 min)
    │
    ▼
Query campaigns_cache
    │
    ▼
For Each Active Demo Campaign:
    │
    ├─→ Check spend vs budget
    │   │
    │   ├─→ >= 90% → Create Alert
    │   └─→ >= 100% → Auto-pause via API
    │
    └─→ Update budget_alerts table
```

---

## Security Architecture

### Authentication Layers

1. **Supabase Auth** (User Identity)
   - Email/password or Google OAuth
   - JWT tokens stored in httpOnly cookies
   - Session management handled by Supabase

2. **Google Ads OAuth** (API Access)
   - Separate OAuth flow for Google Ads
   - Tokens encrypted at rest in database
   - Refresh tokens for long-term access

3. **Row Level Security (RLS)**
   - Database-level security policies
   - Users can only access their own data
   - Service role bypasses RLS (for cron jobs)

### Token Management

```
Access Token (Google Ads)
    │
    ├─→ Expires: 1 hour
    ├─→ Stored: Encrypted in database
    └─→ Refresh: Automatic before expiry

Refresh Token (Google Ads)
    │
    ├─→ Expires: Never (until revoked)
    ├─→ Stored: Encrypted in database
    └─→ Used: To get new access tokens
```

---

## Caching Strategy

### Multi-Layer Cache

1. **Database Cache** (`campaigns_cache` table)
   - TTL: 5 minutes
   - Updated by cron job
   - Query before hitting Google Ads API

2. **In-Memory Cache** (Optional)
   - For frequently accessed data
   - Cleared on serverless function restart
   - Not used in MVP (database cache sufficient)

### Cache Invalidation

- **Automatic:** Cron job refreshes every 5 minutes
- **Manual:** User actions (pause, edit) trigger immediate refresh
- **On Error:** Fallback to cached data with warning

---

## Error Handling Architecture

### Error Flow

```
API Call
    │
    ├─→ Success → Return Data
    │
    └─→ Error
        │
        ├─→ Parse Error Code
        │   │
        │   ├─→ POLICY_VIOLATION → User-friendly message
        │   ├─→ QUOTA_EXCEEDED → Retry with backoff
        │   ├─→ PERMISSION_DENIED → Reconnect flow
        │   └─→ Unknown → Log & Generic message
        │
        └─→ Return Error Response
```

### Retry Logic

- **Transient Errors:** Exponential backoff (3 attempts)
- **Permanent Errors:** No retry (show error immediately)
- **Rate Limits:** Wait 5 minutes before retry

---

## Deployment Architecture

### Vercel Deployment

```
GitHub Repository
    │
    ▼
Vercel (Auto-deploy on push)
    │
    ├─→ Build Next.js App
    ├─→ Deploy Serverless Functions
    └─→ Configure Environment Variables
```

### Cron Jobs

```
Vercel Cron Jobs
    │
    ├─→ monitor-budgets (every 5 min)
    ├─→ auto-pause-24h (every hour)
    └─→ sync-campaigns (every 5 min)
```

### Environment Variables

- **Public:** `NEXT_PUBLIC_*` (exposed to client)
- **Private:** Server-side only (API keys, secrets)
- **Vercel:** Set in dashboard, encrypted at rest

---

## Scalability Considerations

### Current Limits (MVP)

- **Google Ads API:** 10,000 requests/day
- **Vercel Hobby:** 10s function timeout
- **Supabase Free:** 500MB database

### Scaling Path

1. **Phase 1:** Add Redis cache layer
2. **Phase 2:** Upgrade Vercel to Pro (longer timeouts)
3. **Phase 3:** Add queue system for async jobs
4. **Phase 4:** Horizontal scaling with load balancer

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes (serverless)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth

### External APIs
- **Google Ads:** google-ads-api (v17)
- **OpenAI:** openai (v4)
- **Deployment:** Vercel

---

## File Organization

```
marketing-copilot/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth routes
│   ├── dashboard/              # Dashboard pages
│   ├── campaigns/             # Campaign pages
│   └── api/                   # API routes
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/             # Dashboard components
│   │   ├── ModeSelector.tsx   # Mode tabs
│   │   ├── TableMode.tsx      # Google Ads-like table
│   │   ├── InsightsMode.tsx   # AI insights feed
│   │   ├── CreateMode.tsx     # Campaign builder
│   │   ├── LeftNav.tsx        # Google Ads style nav
│   │   └── ChatBox.tsx        # Always-present chat
│   └── campaigns/             # Campaign components
├── lib/                       # Utility libraries
│   ├── supabase/              # Supabase clients
│   ├── google-ads/            # Google Ads API
│   ├── openai/                # OpenAI client
│   └── errors/                # Error handling
├── docs/                      # Documentation
│   ├── foundation/            # PRD, architecture
│   └── implementation/        # Implementation guides
├── public/                    # Static assets
├── .env.example               # Environment template
├── vercel.json                # Vercel config (cron jobs)
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## Key Design Decisions

### 1. Why Supabase?
- Built-in auth (saves 4+ hours)
- PostgreSQL with RLS (security)
- Real-time subscriptions (future use)
- Free tier sufficient for MVP

### 2. Why Vercel Cron Jobs?
- No `setInterval()` in serverless
- Built-in scheduling
- No additional infrastructure
- Free tier sufficient

### 3. Why Database Caching?
- Reduces API calls (rate limit protection)
- Faster dashboard loads
- Works across serverless instances
- Simpler than Redis for MVP

### 4. Why Performance Max Only?
- Simplest campaign type
- Requires fewest fields
- Google's recommended type
- Sufficient for demo

---

## Future Architecture (Phase 2+)

### Planned Additions

1. **Meta Ads Integration**
   - Separate API client
   - Unified campaign interface
   - Cross-platform insights

2. **Redis Cache Layer**
   - Faster cache lookups
   - Shared across instances
   - Better rate limit handling

3. **Queue System**
   - Async campaign creation
   - Better error handling
   - Retry failed jobs

4. **Webhook Support**
   - Real-time updates from Google Ads
   - Faster data sync
   - Reduced API calls

---

## References

- **PRD:** `/docs/foundation/prd.md`
- **Database Schema:** `/docs/implementation/schema.sql`
- **Google Ads API:** `/docs/implementation/google-ads-api-examples.ts`
- **Auth Flow:** `/docs/implementation/auth-flow.md`
- **Cron Jobs:** `/docs/implementation/cron-jobs.md`

