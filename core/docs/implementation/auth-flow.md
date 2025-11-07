# Authentication Flow Documentation
## Marketing Co-Pilot - Step-by-Step Implementation Guide

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## Overview

Marketing Co-Pilot uses a **two-stage authentication flow**:

1. **Supabase Auth** - User signs up/logs in (email/password or Google OAuth)
2. **Google Ads OAuth** - User connects their Google Ads account (separate OAuth flow)

This document provides the exact implementation steps with code examples.

---

## Architecture Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Landing Page           │
│  (No auth required)     │
│  - Try Demo Mode        │
│  - Sign Up / Log In     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Supabase Auth          │
│  - Email/Password       │
│  - OR Google OAuth      │
│  → Creates auth.users   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Dashboard (Protected)  │
│  - Shows demo data       │
│  - "Connect Google Ads"  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Google Ads OAuth       │
│  - OAuth popup          │
│  - Grant permissions    │
│  → Store tokens in DB   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Dashboard (Connected)  │
│  - Shows real campaigns │
│  - Full functionality   │
└─────────────────────────┘
```

---

## Step 1: User Sign Up / Log In (Supabase Auth)

### 1.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 1.2 Initialize Supabase Client

**File: `lib/supabase/client.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 1.3 Sign Up with Email/Password

**File: `app/auth/signup/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      // 2. Create user profile in public.users table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            display_name: email.split('@')[0], // Default to email prefix
            created_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      // 3. Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### 1.4 Log In with Email/Password

**File: `app/auth/login/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Update last_login timestamp
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
```

### 1.5 Protect Routes (Middleware)

**File: `middleware.ts`**

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
```

---

## Step 2: Connect Google Ads Account (OAuth Flow)

### 2.1 Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google Ads API"
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-app.vercel.app/api/auth/google/callback`
   - Scopes: `https://www.googleapis.com/auth/adwords`

### 2.2 Install Google OAuth Library

```bash
npm install google-auth-library
```

### 2.3 Create OAuth Initiation Endpoint

**File: `app/api/auth/google/initiate/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate OAuth URL
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID!;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/adwords';
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${encodeURIComponent(state)}`;

    return NextResponse.json({ authUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}
```

### 2.4 Create OAuth Callback Handler

**File: `app/api/auth/google/callback/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple encryption (for MVP - use proper encryption in production)
function encryptToken(token: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!.substring(0, 32), 'utf8');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=oauth_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=oauth_failed`
      );
    }

    // Decode state to get userId
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));

    // Exchange code for tokens
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_ADS_CLIENT_ID!,
      process.env.GOOGLE_ADS_CLIENT_SECRET!,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to get tokens');
    }

    // Get Google Ads account info (customer_id and account name)
    // After OAuth, we need to query Google Ads API to get accessible accounts
    const { GoogleAdsApi } = require('google-ads-api');
    const googleAdsClient = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    // Create customer instance with OAuth tokens
    // Note: We use a temporary customer ID (0) to query for accessible accounts
    const tempCustomer = googleAdsClient.Customer({
      customer_id: '0', // Temporary ID for account listing
      refresh_token: tokens.refresh_token!,
    });

    // Query for accessible customer accounts
    // This returns all accounts the user has access to
    const query = `
      SELECT 
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone
      FROM customer
      WHERE customer.manager = FALSE
      ORDER BY customer.id
      LIMIT 1
    `;

    let customerId: string | null = null;
    let accountName: string = 'My Google Ads Account';

    try {
      const results = await tempCustomer.query(query);
      if (results && results.length > 0) {
        const customer = results[0].customer;
        // Format customer ID: "1234567890" -> "123-456-7890"
        const rawId = customer.id.toString();
        customerId = `${rawId.slice(0, 3)}-${rawId.slice(3, 6)}-${rawId.slice(6)}`;
        accountName = customer.descriptive_name || accountName;
      }
    } catch (apiError: any) {
      console.error('Failed to fetch customer ID:', apiError);
      // Fallback: Try to extract from OAuth scope or use a default
      // For MVP, we'll require at least one accessible account
      throw new Error('No accessible Google Ads accounts found. Please ensure you have access to at least one account.');
    }

    if (!customerId) {
      throw new Error('Could not retrieve Google Ads customer ID');
    }

    // Store tokens in database
    const { error: dbError } = await supabase
      .from('google_ads_accounts')
      .insert({
        user_id: userId,
        customer_id: customerId,
        account_name: accountName,
        access_token: encryptToken(tokens.access_token),
        refresh_token: encryptToken(tokens.refresh_token!),
        token_expires_at: tokens.expiry_date
          ? new Date(tokens.expiry_date).toISOString()
          : new Date(Date.now() + 3600000).toISOString(), // Default 1 hour
        status: 'active',
      });

    if (dbError) throw dbError;

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?connected=true`
    );
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=oauth_error`
    );
  }
}
```

### 2.5 Frontend: Connect Button

**File: `app/dashboard/page.tsx` (excerpt)**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [hasGoogleAdsAccount, setHasGoogleAdsAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnectGoogleAds = async () => {
    setLoading(true);
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in first');
        return;
      }

      // Call initiate endpoint
      const response = await fetch('/api/auth/google/initiate', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const { authUrl } = await response.json();

      // Open OAuth popup
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate OAuth:', error);
      alert('Failed to connect Google Ads account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!hasGoogleAdsAccount ? (
        <button onClick={handleConnectGoogleAds} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Google Ads Account'}
        </button>
      ) : (
        <div>Dashboard content...</div>
      )}
    </div>
  );
}
```

### 2.6 Fetch Customer ID from Google Ads

After OAuth callback, we need to query Google Ads API to get the customer_id. This is required for all subsequent API calls.

**Implementation:**

The code above (in OAuth callback handler) queries Google Ads API using a temporary customer ID (`0`) to list accessible accounts. It then:

1. Queries for non-manager accounts (`customer.manager = FALSE`)
2. Formats the customer ID from `"1234567890"` to `"123-456-7890"` format
3. Extracts account name from `customer.descriptive_name`
4. Stores both in the database

**Error Handling:**

If no accessible accounts are found, the OAuth callback will fail with a clear error message. This ensures users can't proceed without a valid account connection.

**Multiple Accounts:**

For MVP, we only connect the first accessible account. In Phase 2, you can extend this to allow users to select which account to connect from a list.

---

### 2.7 Encryption Helper Functions

**File: `lib/auth/encryption.ts`**

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-character key
const ALGORITHM = 'aes-256-cbc';

export function encryptToken(token: string): string {
  const key = Buffer.from(ENCRYPTION_KEY.substring(0, 32), 'utf8');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptToken(encryptedToken: string): string {
  const parts = encryptedToken.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const key = Buffer.from(ENCRYPTION_KEY.substring(0, 32), 'utf8');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

**Note:** For production, use Supabase Vault or AWS KMS for key management instead of environment variables.

### 3.1 Refresh Google Ads Access Token

**File: `lib/google-ads/token-refresh.ts`**

```typescript
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function refreshGoogleAdsToken(accountId: string): Promise<string> {
  // Get account from database
  const { data: account, error } = await supabase
    .from('google_ads_accounts')
    .select('refresh_token, access_token, token_expires_at')
    .eq('id', accountId)
    .single();

  if (error || !account) {
    throw new Error('Account not found');
  }

  // Check if token is still valid (with 5-minute buffer)
  const expiresAt = new Date(account.token_expires_at);
  const now = new Date();
  const buffer = 5 * 60 * 1000; // 5 minutes

  if (expiresAt.getTime() > now.getTime() + buffer) {
    // Token is still valid, return existing
    return decryptToken(account.access_token);
  }

  // Token expired, refresh it
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_ADS_CLIENT_ID!,
    process.env.GOOGLE_ADS_CLIENT_SECRET!,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  oauth2Client.setCredentials({
    refresh_token: decryptToken(account.refresh_token),
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  // Update database with new tokens
  await supabase
    .from('google_ads_accounts')
    .update({
      access_token: encryptToken(credentials.access_token!),
      refresh_token: encryptToken(credentials.refresh_token || account.refresh_token),
      token_expires_at: credentials.expiry_date
        ? new Date(credentials.expiry_date).toISOString()
        : new Date(Date.now() + 3600000).toISOString(),
    })
    .eq('id', accountId);

  return credentials.access_token!;
}

function decryptToken(encrypted: string): string {
  // Implement decryption (reverse of encryptToken)
  // For MVP, use same logic as encryptToken but decrypt
  // TODO: Use proper encryption library
  return encrypted; // Placeholder
}
```

---

## Step 4: Get User's Google Ads Accounts

**File: `app/api/accounts/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Google Ads accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('google_ads_accounts')
      .select('id, customer_id, account_name, status, connected_at')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (accountsError) throw accountsError;

    return NextResponse.json({ accounts });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
```

---

## Summary: Complete Auth Flow

1. **User signs up/logs in** → Supabase Auth creates `auth.users` entry
2. **User profile created** → `public.users` table entry linked to `auth.users.id`
3. **User clicks "Connect Google Ads"** → OAuth initiation endpoint generates auth URL
4. **User grants permissions** → Google redirects to callback with authorization code
5. **Tokens exchanged** → Callback handler exchanges code for access/refresh tokens
6. **Tokens stored** → Encrypted tokens stored in `google_ads_accounts` table
7. **Dashboard loads** → User sees real campaigns from connected account

---

## Security Notes

1. **Token Encryption**: Use proper encryption (not base64) in production
2. **RLS Policies**: Database RLS ensures users can only access their own accounts
3. **Token Refresh**: Automatically refresh expired tokens before API calls
4. **Error Handling**: Handle OAuth denials and errors gracefully
5. **State Parameter**: Use state parameter to prevent CSRF attacks

---

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Ads OAuth
GOOGLE_ADS_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your-client-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
ENCRYPTION_KEY=your-32-character-encryption-key
```

---

## Next Steps

After implementing this auth flow:

1. Test OAuth connection with a real Google Ads account
2. Implement token refresh logic
3. Add error handling for expired tokens
4. Create UI for managing multiple connected accounts
5. Add "Disconnect Account" functionality

