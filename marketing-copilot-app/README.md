# Marketing Co-Pilot

AI-powered Google Ads campaign management platform that enables performance marketers to monitor campaigns and create new campaigns through conversational AI.

## Features

- ✅ **Google Ads Integration**: OAuth connection to Google Ads accounts
- ✅ **Campaign Dashboard**: Google Ads-like table view with real-time metrics
- ✅ **AI Insights Engine**: Budget alerts, performance anomaly detection, and optimization recommendations
- ✅ **Conversational Campaign Builder**: Create campaigns via natural language
- ✅ **Budget Safety**: Auto-pause after 24 hours and budget monitoring
- ✅ **Demo Mode**: Explore the platform with sample data

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth)
- **APIs**: Google Ads API v17, OpenAI GPT-4
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Console project with Google Ads API enabled
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd marketing-copilot-app
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the schema SQL from `core/docs/implementation/schema.sql` in the Supabase SQL Editor
   - Copy your Supabase URL and keys

3. **Set up Google Cloud Console:**
   - Create a project
   - Enable Google Ads API
   - Create OAuth 2.0 credentials (Web application)
   - Add redirect URI: `http://localhost:3000/api/auth/google/callback`
   - Get developer token (apply if needed)

4. **Set up OpenAI:**
   - Create account at https://platform.openai.com
   - Generate API key
   - Add billing (required for GPT-4)

5. **Create `.env.local`:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in all environment variables:
   ```env
   # Google Ads API
   GOOGLE_ADS_DEVELOPER_TOKEN=your_token
   GOOGLE_ADS_CLIENT_ID=your_client_id
   GOOGLE_ADS_CLIENT_SECRET=your_secret
   GOOGLE_ADS_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

   # OpenAI API
   OPENAI_API_KEY=sk-...

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key

   # Encryption
   ENCRYPTION_KEY=your_32_character_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development

   # Feature Flags
   ENABLE_DEMO_MODE=true
   MAX_DAILY_BUDGET=50
   MAX_TOTAL_BUDGET=500
   AUTO_PAUSE_HOURS=24

   # Cron Jobs
   CRON_SECRET=your_random_secret
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. **Open http://localhost:3000**

## Project Structure

```
marketing-copilot-app/
├── app/
│   ├── api/
│   │   ├── auth/google/        # Google Ads OAuth endpoints
│   │   ├── campaigns/            # Campaign CRUD endpoints
│   │   ├── insights/            # AI insights endpoint
│   │   └── cron/                # Scheduled jobs (budget monitoring, sync)
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Dashboard page
│   └── page.tsx                 # Landing page
├── components/
│   ├── dashboard/               # Dashboard components
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── supabase/                # Supabase clients
│   ├── google-ads/              # Google Ads API wrapper
│   ├── openai/                  # OpenAI client
│   ├── insights/                # Insight generation logic
│   └── auth/                    # Encryption helpers
└── vercel.json                  # Vercel cron job configuration
```

## Key Features Implementation

### Authentication Flow
1. User signs up/logs in with Supabase Auth
2. User connects Google Ads account via OAuth
3. Tokens are encrypted and stored securely

### Campaign Dashboard
- **Table Mode**: Displays all campaigns with metrics (default)
- **Insights Mode**: Shows AI-generated insights and recommendations
- **Create Mode**: Natural language campaign creation

### AI Insights
- Budget overspend detection (90% and 100% thresholds)
- Performance anomaly detection (z-score based)
- AI-generated optimization recommendations (GPT-4)

### Campaign Creation
1. User describes campaign in natural language
2. AI extracts structured data (name, budget, targeting, creative)
3. User reviews and edits
4. Campaign publishes to Google Ads

### Safety Features
- Budget caps enforced ($50/day max)
- Auto-pause after 24 hours
- Budget monitoring every 5 minutes
- Campaign data sync every 5 minutes

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Add all variables from `.env.local` to Vercel dashboard
   - Update `GOOGLE_ADS_REDIRECT_URI` to production URL
   - Update `NEXT_PUBLIC_APP_URL` to production URL

4. **Configure Cron Jobs:**
   - Cron jobs are automatically configured via `vercel.json`
   - Ensure `CRON_SECRET` is set in Vercel environment variables

## Development Status

### ✅ Completed
- Project setup and structure
- Authentication (Supabase Auth + Google Ads OAuth)
- Dashboard foundation (Table, Insights, Create modes)
- Campaign data fetching and caching
- AI insights engine
- Campaign creation and publishing
- Budget monitoring cron jobs
- Auto-pause safety features

### ⏳ Remaining (Manual Setup Required)
- Supabase database schema setup
- Google Cloud Console OAuth configuration
- OpenAI API key setup
- Environment variables configuration
- Testing with real Google Ads accounts

## Documentation

- **PRD**: `core/docs/foundation/prd.md`
- **Development Checklist**: `core/docs/foundation/dev_checklist.md`
- **Schema**: `core/docs/implementation/schema.sql`
- **Auth Flow**: `core/docs/implementation/auth-flow.md`
- **Cron Jobs**: `core/docs/implementation/cron-jobs.md`
- **Google Ads API Examples**: `core/docs/implementation/google-ads-api-examples.ts`

## License

MIT
