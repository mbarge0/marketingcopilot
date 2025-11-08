import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractCampaignFromText } from '@/lib/openai/client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Extract campaign data using OpenAI
    const campaign = await extractCampaignFromText(description);

    return NextResponse.json({ campaign });
  } catch (error: any) {
    console.error('Campaign extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract campaign data', message: error.message },
      { status: 500 }
    );
  }
}


