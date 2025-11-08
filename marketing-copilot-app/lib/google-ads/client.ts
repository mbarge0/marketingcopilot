import { GoogleAdsApi, Customer } from 'google-ads-api';
import { refreshGoogleAdsToken } from './token-refresh';
import { createServiceClient } from '@/lib/supabase/service';
import { decryptToken } from '@/lib/auth/encryption';

/**
 * Initialize Google Ads API client
 * Call this once per request with user's OAuth tokens
 */
export function createGoogleAdsClient(
  accessToken: string,
  refreshToken: string,
  developerToken: string,
  customerId: string // Format: "123-456-7890" (with dashes)
): Customer {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: developerToken,
  });

  // Create customer instance with OAuth tokens
  const customer = client.Customer({
    customer_id: customerId.replace(/-/g, ''), // Remove dashes for API
    refresh_token: refreshToken,
  });

  return customer;
}

/**
 * Get Google Ads client for a user's account
 * Handles token refresh automatically
 */
export async function getGoogleAdsClientForAccount(
  accountId: string
): Promise<{ customer: Customer; customerId: string }> {
  const supabase = createServiceClient();
  
  // Get account from database
  const { data: account, error } = await supabase
    .from('google_ads_accounts')
    .select('customer_id, access_token, refresh_token, token_expires_at')
    .eq('id', accountId)
    .single();

  if (error || !account) {
    throw new Error('Google Ads account not found');
  }

  // Check if token needs refresh
  const expiresAt = new Date(account.token_expires_at);
  const now = new Date();
  const buffer = 5 * 60 * 1000; // 5 minutes

  let accessToken = decryptToken(account.access_token);
  
  if (expiresAt.getTime() <= now.getTime() + buffer) {
    // Token expired or expiring soon, refresh it
    accessToken = await refreshGoogleAdsToken(accountId);
  }

  const refreshToken = decryptToken(account.refresh_token);
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;

  const customer = createGoogleAdsClient(
    accessToken,
    refreshToken,
    developerToken,
    account.customer_id
  );

  return {
    customer,
    customerId: account.customer_id,
  };
}


