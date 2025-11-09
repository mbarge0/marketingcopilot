'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Maximize2, Minimize2, Mic, MicOff, Send } from 'lucide-react';
import { useMicrophone } from '@/lib/hooks/useMicrophone';
import { useAIContext } from '@/lib/ai/context';
import { parseAgentResponse } from '@/lib/ai/contentParser';
import { AgentThinking } from '@/components/agentic';
import { AgentPhase, AgentActivity } from '@/lib/motion/agentic';
import { motion } from 'framer-motion';

interface AIPanelProps {
  fullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export default function AIPanel({ fullScreen = false, onToggleFullScreen }: AIPanelProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [agentPhase, setAgentPhase] = useState<AgentPhase>('idle');
  const [agentActivity, setAgentActivity] = useState<AgentActivity>('planning');
  const { addContentCards, addQuestion } = useAIContext();

  const handleTranscript = (text: string) => {
    setMessage(text);
  };

  const { isListening, isSupported, startListening, stopListening, error } = useMicrophone(handleTranscript);

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  // Update agent phase based on loading state
  useEffect(() => {
    if (loading && agentPhase === 'idle') {
      setAgentPhase('initiation');
      setAgentActivity('planning');
      
      setTimeout(() => {
        setAgentPhase('cognition');
        setAgentActivity('analyzing');
      }, 150);
      
      setTimeout(() => {
        setAgentActivity('reading');
      }, 1200);
      
      setTimeout(() => {
        setAgentActivity('evaluating');
      }, 2000);
      
      setTimeout(() => {
        setAgentActivity('generating');
      }, 2700);
    } else if (!loading && agentPhase !== 'idle') {
      setAgentPhase('resolving');
      setTimeout(() => {
        setAgentPhase('complete');
      }, 400);
      setTimeout(() => {
        setAgentPhase('idle');
      }, 700);
    }
  }, [loading, agentPhase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get response from agent');
      }

      const data = await response.json();
      const assistantMessage =
        data.response || 'I apologize, but I could not generate a response.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantMessage,
        },
      ]);

      // Parse response and create content cards
      try {
        const cards = parseAgentResponse(assistantMessage, userMessage);
        if (cards.length > 0) {
          addContentCards(cards);
        }
      } catch (error) {
        console.error('Failed to parse agent response:', error);
      }

      // Track the question
      addQuestion(userMessage);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error 
            ? `Sorry, I encountered an error: ${error.message}. Please try again.`
            : 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border-l border-gray-200 flex flex-col h-full ${
        fullScreen ? 'fixed inset-0 z-50' : 'w-96'
      }`}
    >
      <CardHeader className="border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Co-Pilot</CardTitle>
          {onToggleFullScreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullScreen}
              className="text-xs p-2"
              title={fullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {fullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Always here to help</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2 min-h-0">
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500 p-8">
              <div>
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold mb-2">Start a conversation</h3>
                <p className="text-sm mb-4">
                  Ask me anything about your campaigns, or use the chat bar below
                </p>
                <div className="text-xs space-y-2 text-left max-w-xs mx-auto">
                  <div>• Analyze campaign performance</div>
                  <div>• Research keywords and competitors</div>
                  <div>• Create campaigns and ad copy</div>
                  <div>• Get optimization recommendations</div>
                </div>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && agentPhase !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-md">
                <AgentThinking
                  phase={agentPhase}
                  activity={agentActivity}
                  showWaveform={true}
                  compact={true}
                />
              </div>
            </motion.div>
          )}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 flex-shrink-0">
          <div className="flex-1 relative">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about insights or recommendations..."
              disabled={loading}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSupported && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={loading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}
            {error && (
              <div className="absolute -top-8 left-0 text-xs text-red-600 bg-red-50 px-2 py-1 rounded shadow-sm z-10 whitespace-nowrap">
                {error}
              </div>
            )}
          </div>
          <Button type="submit" disabled={loading || !message.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-1 text-center">Press Enter to send / to focus</p>
      </CardContent>
    </div>
  );
}


