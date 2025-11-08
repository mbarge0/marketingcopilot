'use client';

/**
 * Right AI Chat Panel
 * Persistent sidebar on the right side (similar to LeftNavigation pattern)
 * Displays AI assistant chat interface with message history and agent status
 * Supports multiple chat tabs for parallel conversations
 */

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send, X, Minimize2, Maximize2, Sparkles, Plus, Clock } from 'lucide-react';
import { getChatContext, getChatSuggestions } from '@/lib/ai/chatSuggestions';
import { AgentThinking } from '@/components/agentic';
import { AgentPhase, AgentActivity } from '@/lib/motion/agentic';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatTab {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
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
}

export default function RightAIChatPanel({
  context,
  mode,
}: RightAIChatPanelProps) {
  const pathname = usePathname();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentPhase, setAgentPhase] = useState<AgentPhase>('idle');
  const [agentActivity, setAgentActivity] = useState<AgentActivity>('planning');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Multi-tab state
  const [tabs, setTabs] = useState<ChatTab[]>([
    {
      id: '1',
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  // Get active tab
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const messages = activeTab.messages;

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

  // Tab management functions
  const createNewTab = () => {
    const newTab: ChatTab = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // Keep at least one tab
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTabMessages = (tabId: string, newMessages: Message[]) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              messages: newMessages,
              title:
                tab.title === 'New Chat' && newMessages.length > 0
                  ? newMessages[0].content.slice(0, 30) + '...'
                  : tab.title,
            }
          : tab
      )
    );
  };

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
    const updatedMessages = [...messages, userMessageObj];
    updateTabMessages(activeTabId, updatedMessages);
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

      updateTabMessages(activeTabId, [...updatedMessages, assistantMessageObj]);
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessageObj: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      updateTabMessages(activeTabId, [...updatedMessages, errorMessageObj]);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Tabs - Only show when expanded */}
      <AnimatePresence mode="wait">
        {!isMinimized && tabs.length > 0 && (
          <motion.div
            key="tabs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-200 bg-gray-50 overflow-x-auto"
          >
            <div className="flex items-center gap-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium
                    transition-colors group relative
                    ${
                      activeTabId === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="truncate max-w-[120px]">{tab.title}</span>
                  {tabs.length > 1 && (
                    <X
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    />
                  )}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewTab}
                className="h-7 w-7 p-0 ml-1"
                title="New chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Minimized State - Persistent Ribbon */}
      <AnimatePresence mode="wait">
        {isMinimized && (
          <motion.div
            key="minimized-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex-1 flex flex-col items-center gap-4 py-8"
          >
            {/* Expand Button - Sparkles Icon */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="flex flex-col items-center gap-2 h-auto py-3 px-2 hover:bg-blue-50 rounded-lg"
                title="Expand AI Co-Pilot"
              >
                <Sparkles className="w-6 h-6 text-blue-600" />
                <div className="flex flex-col gap-0.5">
                  {['A', 'I'].map((letter, idx) => (
                    <span key={idx} className="text-xs font-semibold text-gray-600">
                      {letter}
                    </span>
                  ))}
                </div>
              </Button>
              
              {/* Message count indicator */}
              {messages.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-white">
                    {messages.length > 9 ? '9+' : messages.length}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Divider */}
            <div className="w-8 h-px bg-gray-200" />

            {/* New Chat Button - Plus Icon */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewTab}
                className="h-10 w-10 p-0 hover:bg-green-50 rounded-lg"
                title="New chat (run in background)"
              >
                <Plus className="w-5 h-5 text-green-600" />
              </Button>
            </motion.div>

            {/* History Button - Clock Icon (Disabled for now) */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="h-10 w-10 p-0 rounded-lg opacity-40 cursor-not-allowed"
                title="Chat history (coming soon)"
              >
                <Clock className="w-5 h-5 text-gray-400" />
              </Button>
            </motion.div>

            {/* Tab Indicators - Show dots for multiple tabs */}
            {tabs.length > 1 && (
              <>
                <div className="w-8 h-px bg-gray-200 mt-2" />
                <div className="flex flex-col gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTabId(tab.id);
                        setIsMinimized(false);
                      }}
                      className={`
                        w-2 h-2 rounded-full transition-colors
                        ${activeTabId === tab.id ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}
                      `}
                      title={tab.title}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}

