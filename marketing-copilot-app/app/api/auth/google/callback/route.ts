import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAdsApi } from 'google-ads-api';
import { createServiceClient } from '@/lib/supabase/service';
import { encryptToken } from '@/lib/auth/encryption';

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
    const googleAdsClient = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    // Create customer instance with OAuth tokens
    // Use customer ID "0" to query for accessible accounts
    const tempCustomer = googleAdsClient.Customer({
      customer_id: '0',
      refresh_token: tokens.refresh_token!,
    });

    // Query for accessible customer accounts
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
        if (customer && customer.id) {
          // Format customer ID: "1234567890" -> "123-456-7890"
          const rawId = customer.id.toString();
          customerId = `${rawId.slice(0, 3)}-${rawId.slice(3, 6)}-${rawId.slice(6)}`;
          accountName = customer.descriptive_name || accountName;
        }
      }
    } catch (apiError: any) {
      console.error('Failed to fetch customer ID:', apiError);
      throw new Error('No accessible Google Ads accounts found. Please ensure you have access to at least one account.');
    }

    if (!customerId) {
      throw new Error('Could not retrieve Google Ads customer ID');
    }

    // Store tokens in database using service client
    const supabase = createServiceClient();
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

    if (dbError) {
      // Check if account already exists (unique constraint)
      if (dbError.code === '23505') {
        // Update existing account instead
        const { error: updateError } = await supabase
          .from('google_ads_accounts')
          .update({
            account_name: accountName,
            access_token: encryptToken(tokens.access_token),
            refresh_token: encryptToken(tokens.refresh_token!),
            token_expires_at: tokens.expiry_date
              ? new Date(tokens.expiry_date).toISOString()
              : new Date(Date.now() + 3600000).toISOString(),
            status: 'active',
            error_message: null,
          })
          .eq('user_id', userId)
          .eq('customer_id', customerId);

        if (updateError) throw updateError;
      } else {
        throw dbError;
      }
    }

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?connected=true`
    );
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=oauth_error&message=${encodeURIComponent(error.message)}`
    );
  }
}

