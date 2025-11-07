import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Placeholder data - replace with Google Ads API integration
const PLACEHOLDER_ASSETS = [
  {
    id: '1',
    type: 'SITELINK',
    status: 'ENABLED',
    associated_ad_groups: ['Ad Group 1', 'Ad Group 2'],
    impressions: 15200,
    clicks: 450,
  },
  {
    id: '2',
    type: 'CALLOUT',
    status: 'ENABLED',
    associated_ad_groups: ['Ad Group 1', 'Ad Group 4'],
    impressions: 12800,
    clicks: 320,
  },
  {
    id: '3',
    type: 'IMAGE',
    status: 'ENABLED',
    associated_ad_groups: ['Ad Group 2', 'Ad Group 3'],
    impressions: 8900,
    clicks: 180,
  },
  {
    id: '4',
    type: 'VIDEO',
    status: 'PAUSED',
    associated_ad_groups: ['Ad Group 3'],
    impressions: 5600,
    clicks: 95,
  },
];

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch real assets from Google Ads API
    // For now, return placeholder data
    return NextResponse.json({
      assets: PLACEHOLDER_ASSETS,
    });
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

