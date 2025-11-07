import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Placeholder data - replace with Google Ads API integration
const PLACEHOLDER_AUDIENCES = [
  {
    id: '1',
    name: 'Website Visitors - Last 30 Days',
    type: 'REMARKETING',
    status: 'ACTIVE',
    size: 12500,
    associated_ad_groups: ['Ad Group 1', 'Ad Group 2'],
    associated_campaigns: ['Campaign 1'],
    impressions: 15200,
    clicks: 450,
    conversions: 18,
  },
  {
    id: '2',
    name: 'Technology Enthusiasts',
    type: 'AFFINITY',
    status: 'ACTIVE',
    size: 2500000,
    associated_ad_groups: ['Ad Group 3'],
    associated_campaigns: ['Campaign 2'],
    impressions: 12800,
    clicks: 320,
    conversions: 12,
  },
  {
    id: '3',
    name: 'Marketing Software Buyers',
    type: 'IN_MARKET',
    status: 'ACTIVE',
    size: 180000,
    associated_ad_groups: ['Ad Group 1', 'Ad Group 4'],
    associated_campaigns: ['Campaign 1'],
    impressions: 8900,
    clicks: 280,
    conversions: 15,
  },
  {
    id: '4',
    name: 'Email List - Customers',
    type: 'CUSTOM_LIST',
    status: 'PAUSED',
    size: 8500,
    associated_ad_groups: ['Ad Group 2'],
    associated_campaigns: [],
    impressions: 5600,
    clicks: 95,
    conversions: 8,
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

    // TODO: Fetch real audiences from Google Ads API
    // For now, return placeholder data
    return NextResponse.json({
      audiences: PLACEHOLDER_AUDIENCES,
    });
  } catch (error: any) {
    console.error('Error fetching audiences:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audiences' },
      { status: 500 }
    );
  }
}

