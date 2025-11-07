# Quick Start Guide
## Marketing Co-Pilot - Get Started in 30 Minutes

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google account (for Google Ads API)
- OpenAI account with API key
- Supabase account (free tier works)

---

## Step 1: Clone & Install (5 minutes)

```bash
# Clone repository (or create new Next.js project)
npx create-next-app@latest marketing-copilot --typescript --tailwind --app
cd marketing-copilot

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install google-ads-api openai
npm install -D @types/node

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea
```

---

## Step 2: Set Up Supabase (10 minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Name: `marketing-copilot`
   - Database password: (save this!)
   - Region: Choose closest

2. **Run Database Schema**
   - In Supabase dashboard → SQL Editor
   - Copy entire contents of `/docs/implementation/schema.sql`
   - Paste and click "Run"
   - Verify all tables created (should see 7 tables)

3. **Get Supabase Credentials**
   - Go to Settings → API
   - Copy:
     - Project URL
     - `anon` `public` key
     - `service_role` `secret` key (keep secret!)

---

## Step 3: Set Up Google Ads API (10 minutes)

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Create new project: `marketing-copilot`
   - Enable "Google Ads API"

2. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://your-app.vercel.app/api/auth/google/callback` (for production)
   - Copy Client ID and Client Secret

3. **Get Developer Token**
   - Go to https://ads.google.com/aw/apicenter
   - Apply for developer token (or use test token)
   - Copy developer token

---

## Step 4: Set Up OpenAI (2 minutes)

1. **Get API Key**
   - Go to https://platform.openai.com
   - Sign up/login
   - Go to API Keys
   - Create new secret key
   - Copy key (starts with `sk-`)
   - **Important:** Add billing to use GPT-4

---

## Step 5: Configure Environment Variables (3 minutes)

1. **Create `.env.local`**
   ```bash
   # Copy template
   cp .env.example .env.local
   ```

2. **Fill in Values**
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Google Ads API
   GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
   GOOGLE_ADS_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET=your-client-secret

   # OpenAI
   OPENAI_API_KEY=sk-...

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ENCRYPTION_KEY=your-32-character-random-string-here

   # Cron Jobs (for production)
   CRON_SECRET=your-random-secret-key
   ```

3. **Generate Encryption Key**
   ```bash
   # Generate 32-character key
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

---

## Step 6: Copy Implementation Files (5 minutes)

Copy code from implementation docs to your project:

1. **Supabase Clients**
   - Copy from `auth-flow.md` Section 1.2
   - Create `lib/supabase/client.ts`
   - Create `lib/supabase/server.ts`

2. **Google Ads API**
   - Copy from `google-ads-api-examples.ts`
   - Create `lib/google-ads/client.ts`
   - Create `lib/google-ads/api.ts`

3. **Auth Flow**
   - Copy from `auth-flow.md`
   - Create auth pages and API routes

4. **Encryption**
   - Copy from `auth-flow.md` Section 2.7
   - Create `lib/auth/encryption.ts`

---

## Step 7: Test Setup (5 minutes)

```bash
# Start development server
npm run dev

# Should start on http://localhost:3000
```

**Test Checklist:**
- [ ] App loads without errors
- [ ] Can navigate to `/auth/signup`
- [ ] Can create account
- [ ] Can log in
- [ ] Dashboard loads (even if empty)

---

## Step 8: First Real Connection

1. **Connect Google Ads Account**
   - Go to dashboard
   - Click "Connect Google Ads"
   - Complete OAuth flow
   - Should redirect back with connection

2. **Verify Connection**
   - Check Supabase `google_ads_accounts` table
   - Should see your account with `customer_id` populated
   - Status should be `active`

3. **Test Campaign Fetching**
   - Dashboard should show your campaigns
   - Metrics should display
   - If empty, check Google Ads account has campaigns

---

## Common Setup Issues

### Issue: "Module not found"
**Fix:** Run `npm install` again, check package.json

### Issue: "Supabase connection failed"
**Fix:** Check `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY` are correct

### Issue: "OAuth redirect mismatch"
**Fix:** Ensure redirect URI in Google Cloud Console matches exactly (including http://)

### Issue: "Customer ID not found"
**Fix:** Ensure user has access to at least one Google Ads account (not just MCC)

### Issue: "OpenAI API error"
**Fix:** Check API key is correct, billing is enabled, account has credits

---

## Next Steps

1. **Follow Development Checklist**
   - See `/docs/foundation/dev_checklist.md`
   - Hour-by-hour breakdown

2. **Read Architecture Document**
   - See `/docs/foundation/architecture.md`
   - Understand system design

3. **Reference Implementation Docs**
   - `/docs/implementation/schema.sql` - Database
   - `/docs/implementation/google-ads-api-examples.ts` - API code
   - `/docs/implementation/auth-flow.md` - Authentication
   - `/docs/implementation/cron-jobs.md` - Scheduled jobs
   - `/docs/implementation/error-codes.md` - Error handling

---

## Production Deployment

When ready to deploy:

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Add all `.env.local` vars to Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` to production URL
   - Update OAuth redirect URI in Google Cloud Console

3. **Set Up Cron Jobs**
   - Vercel automatically reads `vercel.json`
   - Verify cron jobs in Vercel dashboard → Settings → Cron Jobs

4. **Test Production**
   - Test OAuth flow
   - Test campaign creation
   - Verify cron jobs running

---

## Support

- **PRD:** `/docs/foundation/prd.md` - Complete requirements
- **Architecture:** `/docs/foundation/architecture.md` - System design
- **Dev Checklist:** `/docs/foundation/dev_checklist.md` - Build guide

For issues, check:
1. Environment variables are set correctly
2. Database schema is applied
3. OAuth redirect URIs match exactly
4. API keys are valid and have permissions

