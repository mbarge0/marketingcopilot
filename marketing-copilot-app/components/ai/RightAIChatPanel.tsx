'use client';

/**
 * Right AI Chat Panel
 * Persistent sidebar on the right side (similar to LeftNavigation pattern)
 * Displays AI assistant chat interface with message history and agent status
 */

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { getChatContext, getChatSuggestions } from '@/lib/ai/chatSuggestions';
import { AgentThinking } from '@/components/agentic';
import { AgentPhase, AgentActivity } from '@/lib/motion/agentic';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RightAIChatPanelProps {
  /**
   * Optional context override (for AI Workspace modes)
   */
  context?: string;
  /**
   * Optional mode for AI Workspace
   */
  mode?: string;
  /**
   * Whether to show the panel (for responsive behavior)
   */
  isOpen?: boolean;
  /**
   * Callback to close panel (for mobile)
   */
  onClose?: () => void;
}

export default function RightAIChatPanel({
  context,
  mode,
  isOpen = true,
  onClose,
}: RightAIChatPanelProps) {
  const pathname = usePathname();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentPhase, setAgentPhase] = useState<AgentPhase>('idle');
  const [agentActivity, setAgentActivity] = useState<AgentActivity>('planning');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine context
  const chatContext = context || getChatContext(pathname, mode);
  const { suggestions, placeholder } = getChatSuggestions(chatContext);

  const loading = isSubmitting;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update agent phase based on loading state
  useEffect(() => {
    if (loading && agentPhase === 'idle') {
      setAgentPhase('initiation');
      setTimeout(() => setAgentPhase('cognition'), 200);
      setTimeout(() => setAgentActivity('analyzing'), 500);
    } else if (!loading && agentPhase !== 'idle') {
      setAgentPhase('resolving');
      setTimeout(() => setAgentPhase('complete'), 800);
      setTimeout(() => setAgentPhase('idle'), 1200);
    }
  }, [loading, agentPhase]);

  // Notify parent about minimize state changes (for main content margin adjustment)
  useEffect(() => {
    const event = new CustomEvent('sidebar-resize', {
      detail: { isMinimized },
    });
    window.dispatchEvent(event);
  }, [isMinimized]);

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    const userMessageObj: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessage('');
    setMessages((prev) => [...prev, userMessageObj]);
    setIsSubmitting(true);

    try {
      setAgentActivity('analyzing');

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

      const assistantMessageObj: Message = {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessageObj]);
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessageObj: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Backdrop */}
      {isMobile && !isMinimized && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMinimized(true)}
        />
      )}

      {/* Chat Panel */}
      <motion.div
        className={`
          fixed right-0 top-0 bottom-0 
          bg-white border-l border-gray-200 shadow-lg
          flex flex-col z-30
        `}
        initial={false}
        animate={{
          width: isMinimized ? '64px' : isMobile ? '100%' : '384px',
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1], // Custom easing for smooth collapse
        }}
      >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
        layout
      >
        <AnimatePresence mode="wait">
          {!isMinimized ? (
            <motion.div
              key="expanded-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">AI Co-Pilot</h2>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0 hover:bg-white/50"
                  title="Collapse sidebar"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                {onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-white/50"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="minimized-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center justify-center w-full"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="h-8 w-8 p-0 hover:bg-white/50"
                title="Expand sidebar"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            key="chat-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Welcome to AI Co-Pilot
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  I can help you analyze campaigns, create content, and optimize performance.
                </p>
                <div className="text-xs text-gray-400">
                  Try a suggestion below or ask me anything!
                </div>
              </div>
            )}

            {/* Message List */}
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-lg px-4 py-2.5 text-sm
                      ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Agent Thinking Indicator */}
            {loading && agentPhase !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%]">
                  <AgentThinking
                    phase={agentPhase}
                    activity={agentActivity}
                    showWaveform={true}
                    compact={true}
                  />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !loading && messages.length === 0 && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full text-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder}
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !message.trim()}
                    size="sm"
                    className="px-4"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Press Enter to send • / to focus
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence mode="wait">
        {isMinimized && (
          <motion.div
            key="minimized-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 py-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="flex flex-col items-center gap-3 h-auto py-4 px-2 hover:bg-blue-50 rounded-lg"
                title="Expand sidebar"
              >
                <Sparkles className="w-6 h-6 text-blue-600" />
                <div className="flex flex-col gap-1">
                  {['A', 'I'].map((letter, idx) => (
                    <span key={idx} className="text-xs font-semibold text-gray-600">
                      {letter}
                    </span>
                  ))}
                </div>
              </Button>
            </motion.div>
            
            {/* Message count indicator (if there are messages) */}
            {messages.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-20 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <span className="text-xs font-semibold text-white">
                  {messages.length > 9 ? '9+' : messages.length}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}

