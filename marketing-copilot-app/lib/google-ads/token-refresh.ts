import { OAuth2Client } from 'google-auth-library';
import { createServiceClient } from '@/lib/supabase/service';
import { encryptToken, decryptToken } from '@/lib/auth/encryption';

export async function refreshGoogleAdsToken(accountId: string): Promise<string> {
  const supabase = createServiceClient();
  
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

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token');
  }

  // Update database with new tokens
  const { error: updateError } = await supabase
    .from('google_ads_accounts')
    .update({
      access_token: encryptToken(credentials.access_token),
      refresh_token: credentials.refresh_token 
        ? encryptToken(credentials.refresh_token)
        : account.refresh_token, // Keep existing if not provided
      token_expires_at: credentials.expiry_date
        ? new Date(credentials.expiry_date).toISOString()
        : new Date(Date.now() + 3600000).toISOString(),
    })
    .eq('id', accountId);

  if (updateError) {
    throw new Error(`Failed to update tokens: ${updateError.message}`);
  }

  return credentials.access_token;
}


