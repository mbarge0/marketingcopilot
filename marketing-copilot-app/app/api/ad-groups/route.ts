import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Placeholder data - replace with Google Ads API integration
const PLACEHOLDER_AD_GROUPS = [
  {
    id: '1',
    name: 'Ad Group 1 - Search',
    status: 'ENABLED',
    default_bid: 2000000, // $2.00 in micros
    impressions: 12500,
    clicks: 350,
    conversions: 12,
    cost: 7000000, // $7.00
  },
  {
    id: '2',
    name: 'Ad Group 2 - Display',
    status: 'ENABLED',
    default_bid: 1500000, // $1.50
    impressions: 8900,
    clicks: 180,
    conversions: 5,
    cost: 2700000, // $2.70
  },
  {
    id: '3',
    name: 'Ad Group 3 - Remarketing',
    status: 'PAUSED',
    default_bid: 3000000, // $3.00
    impressions: 5600,
    clicks: 240,
    conversions: 18,
    cost: 7200000, // $7.20
  },
  {
    id: '4',
    name: 'Ad Group 4 - Brand',
    status: 'ENABLED',
    default_bid: 2500000, // $2.50
    impressions: 15200,
    clicks: 420,
    conversions: 25,
    cost: 10500000, // $10.50
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

    // TODO: Fetch real ad groups from Google Ads API
    // For now, return placeholder data
    return NextResponse.json({
      adGroups: PLACEHOLDER_AD_GROUPS,
    });
  } catch (error: any) {
    console.error('Error fetching ad groups:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ad groups' },
      { status: 500 }
    );
  }
}

