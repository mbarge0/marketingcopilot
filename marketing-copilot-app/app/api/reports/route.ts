import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Placeholder data - replace with Google Ads API integration
const PLACEHOLDER_OVERVIEW = {
  spend: 45000000, // $45.00
  impressions: 125000,
  clicks: 3200,
  conversions: 95,
};

const PLACEHOLDER_PERFORMANCE_ROWS = [
  {
    id: '1',
    name: 'Campaign 1 - Search',
    status: 'ENABLED',
    impressions: 12500,
    clicks: 350,
    conversions: 12,
    cost_per_conversion: 583333, // $0.58
    roi: 2.5,
  },
  {
    id: '2',
    name: 'Campaign 2 - Display',
    status: 'ENABLED',
    impressions: 8900,
    clicks: 180,
    conversions: 5,
    cost_per_conversion: 720000, // $0.72
    roi: 1.8,
  },
  {
    id: '3',
    name: 'Campaign 3 - Remarketing',
    status: 'PAUSED',
    impressions: 5600,
    clicks: 240,
    conversions: 18,
    cost_per_conversion: 400000, // $0.40
    roi: 3.2,
  },
  {
    id: '4',
    name: 'Campaign 4 - Brand',
    status: 'ENABLED',
    impressions: 15200,
    clicks: 420,
    conversions: 25,
    cost_per_conversion: 336000, // $0.34
    roi: 4.1,
  },
  {
    id: '5',
    name: 'Campaign 5 - Performance Max',
    status: 'ENABLED',
    impressions: 18200,
    clicks: 510,
    conversions: 35,
    cost_per_conversion: 285714, // $0.29
    roi: 4.8,
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    // TODO: Fetch real report data from Google Ads API
    // For now, return placeholder data
    if (type === 'overview') {
      return NextResponse.json(PLACEHOLDER_OVERVIEW);
    } else {
      return NextResponse.json({
        rows: PLACEHOLDER_PERFORMANCE_ROWS,
      });
    }
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

