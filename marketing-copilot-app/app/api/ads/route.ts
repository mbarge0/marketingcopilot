import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Placeholder data - replace with Google Ads API integration
const PLACEHOLDER_ADS = [
  {
    id: '1',
    name: 'Ad 1 - Headline Test',
    type: 'SEARCH',
    status: 'ENABLED',
    impressions: 8500,
    clicks: 210,
    ctr: 0.0247,
    cost: 4200000, // $4.20
  },
  {
    id: '2',
    name: 'Ad 2 - Call to Action',
    type: 'SEARCH',
    status: 'ENABLED',
    impressions: 7200,
    clicks: 195,
    ctr: 0.0271,
    cost: 3900000, // $3.90
  },
  {
    id: '3',
    name: 'Ad 3 - Display Banner',
    type: 'DISPLAY',
    status: 'PAUSED',
    impressions: 3400,
    clicks: 45,
    ctr: 0.0132,
    cost: 900000, // $0.90
  },
  {
    id: '4',
    name: 'Ad 4 - Responsive Search',
    type: 'SEARCH',
    status: 'ENABLED',
    impressions: 11200,
    clicks: 320,
    ctr: 0.0286,
    cost: 6400000, // $6.40
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

    // TODO: Fetch real ads from Google Ads API
    // For now, return placeholder data
    return NextResponse.json({
      ads: PLACEHOLDER_ADS,
    });
  } catch (error: any) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}

