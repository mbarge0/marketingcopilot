import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Placeholder data - replace with Google Ads API integration
const PLACEHOLDER_KEYWORDS = [
  {
    id: '1',
    keyword: 'marketing automation',
    match_type: 'EXACT',
    status: 'ELIGIBLE',
    quality_score: 8,
    impressions: 12500,
    clicks: 350,
    cost: 7000000, // $7.00
    conversions: 12,
    cost_per_conversion: 583333, // $0.58
    ctr: 0.028,
  },
  {
    id: '2',
    keyword: 'digital marketing tools',
    match_type: 'PHRASE',
    status: 'ELIGIBLE',
    quality_score: 7,
    impressions: 8900,
    clicks: 180,
    cost: 3600000, // $3.60
    conversions: 5,
    cost_per_conversion: 720000, // $0.72
    ctr: 0.0202,
  },
  {
    id: '3',
    keyword: 'advertising software',
    match_type: 'BROAD',
    status: 'PAUSED',
    quality_score: 5,
    impressions: 5600,
    clicks: 95,
    cost: 1900000, // $1.90
    conversions: 2,
    cost_per_conversion: 950000, // $0.95
    ctr: 0.017,
  },
  {
    id: '4',
    keyword: 'campaign management',
    match_type: 'EXACT',
    status: 'ELIGIBLE',
    quality_score: 9,
    impressions: 15200,
    clicks: 420,
    cost: 8400000, // $8.40
    conversions: 25,
    cost_per_conversion: 336000, // $0.34
    ctr: 0.0276,
  },
  {
    id: '5',
    keyword: 'ppc optimization',
    match_type: 'PHRASE',
    status: 'ELIGIBLE',
    quality_score: 6,
    impressions: 7200,
    clicks: 145,
    cost: 2900000, // $2.90
    conversions: 4,
    cost_per_conversion: 725000, // $0.73
    ctr: 0.0201,
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

    // TODO: Fetch real keywords from Google Ads API
    // For now, return placeholder data
    return NextResponse.json({
      keywords: PLACEHOLDER_KEYWORDS,
    });
  } catch (error: any) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

