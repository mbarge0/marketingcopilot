'use client'

/**
 * Unified ChatBar Component
 * Fixed at bottom, consistent across all views
 * Features: Clickable pill suggestions (inline), context-aware
 */

import React, { useState, FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { getChatContext, getChatSuggestions, type ChatContext } from '@/lib/ai/chatSuggestions'
import { AgentThinking } from '@/components/agentic'
import { AgentPhase, AgentActivity } from '@/lib/motion/agentic'

interface ChatBarProps {
  /**
   * Optional context override (for AI Workspace modes)
   * If not provided, will be inferred from pathname
   */
  context?: ChatContext
  /**
   * Optional mode for AI Workspace (e.g., 'insights', 'research')
   */
  mode?: string
  /**
   * Callback when message is sent
   */
  onSend?: (message: string) => void | Promise<void>
  /**
   * Whether chat is loading
   */
  loading?: boolean
}

export default function ChatBar({ 
  context, 
  mode,
  onSend,
  loading: externalLoading = false 
}: ChatBarProps) {
  const pathname = usePathname()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agentPhase, setAgentPhase] = useState<AgentPhase>('idle')
  const [agentActivity, setAgentActivity] = useState<AgentActivity>('planning')
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  
  // Determine context if not provided
  const chatContext = context || getChatContext(pathname, mode)
  const { suggestions, placeholder } = getChatSuggestions(chatContext)
  
  const loading = externalLoading || isSubmitting

  // Update agent phase based on loading state
  React.useEffect(() => {
    if (loading && agentPhase === 'idle') {
      setAgentPhase('initiation')
      setTimeout(() => setAgentPhase('cognition'), 200)
      setTimeout(() => setAgentActivity('analyzing'), 500)
    } else if (!loading && agentPhase !== 'idle') {
      setAgentPhase('resolving')
      setTimeout(() => setAgentPhase('complete'), 800)
      setTimeout(() => setAgentPhase('idle'), 1200)
    }
  }, [loading, agentPhase])

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    // Auto-focus input after setting message
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      input?.focus()
    }, 0)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessage('')
    setIsSubmitting(true)

    // Add user message to conversation history
    const updatedHistory = [...conversationHistory, { role: 'user' as const, content: userMessage }]
    setConversationHistory(updatedHistory)

    try {
      if (onSend) {
        // Custom handler provided
        await onSend(userMessage)
      } else {
        // Default behavior: Call agent API
        setAgentActivity('analyzing')
        
        const response = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory: updatedHistory.slice(0, -1), // Exclude current message
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to get response from agent')
        }

        const data = await response.json()
        const assistantMessage = data.response || 'I apologize, but I could not generate a response.'

        // Add assistant response to conversation history
        setConversationHistory([...updatedHistory, { role: 'assistant' as const, content: assistantMessage }])
        
        // TODO: Display response in UI (could be a toast, modal, or inline display)
        console.log('Agent response:', assistantMessage)
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Restore message on error
      setMessage(userMessage)
      // Remove failed message from history
      setConversationHistory(conversationHistory)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="px-6 py-4">
        {/* Agent Thinking Indicator - Shows when processing */}
        {loading && agentPhase !== 'idle' && (
          <div className="mb-3">
            <AgentThinking
              phase={agentPhase}
              activity={agentActivity}
              showWaveform={true}
              compact={true}
            />
          </div>
        )}

        {/* Inline Pill Suggestions */}
        {suggestions.length > 0 && !loading && (
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">💬 Try:</span>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              disabled={loading}
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                // Allow '/' to focus chat (but don't insert it)
                if (e.key === '/' && e.target === document.activeElement) {
                  e.preventDefault()
                }
                // Submit on Enter
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="px-6 hover:bg-blue-700 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-1" />
                Send
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

