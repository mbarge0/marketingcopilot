import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { invokeAgent, type AgentContext } from '@/lib/agent';
import { HumanMessage } from '@langchain/core/messages';

/**
 * Agent Chat API Route
 * Handles chat messages and invokes the LangGraph agent
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user's Google Ads account for context
    const serviceSupabase = createServiceClient();
    const { data: accounts } = await serviceSupabase
      .from('google_ads_accounts')
      .select('id, customer_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);

    const accountId = accounts && accounts.length > 0 ? accounts[0].id : undefined;
    const customerId = accounts && accounts.length > 0 ? accounts[0].customer_id : undefined;

    // Create agent context
    const context: AgentContext = {
      userId: user.id,
      accountId: accountId,
      customerId: customerId,
    };

    // Convert conversation history to LangChain messages
    const messages: any[] = [];
    
    // Add conversation history
    for (const msg of conversationHistory) {
      if (msg.role === 'user') {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        messages.push({ role: 'assistant', content: msg.content });
      }
    }
    
    // Add current message
    messages.push(new HumanMessage(message));

    // Invoke agent
    const response = await invokeAgent(messages, context);

    return NextResponse.json({
      response,
      success: true,
    });
  } catch (error: any) {
    console.error('Agent chat error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process message',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

