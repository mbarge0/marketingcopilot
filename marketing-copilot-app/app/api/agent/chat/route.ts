import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { invokeAgent } from '@/lib/agent';
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

    // Invoke agent (context will be added to tools when needed)
    const response = await invokeAgent(messages);

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

