'use client'

/**
 * Agent Status Component
 * Shows what the AI is thinking, considering, and evaluating
 * Displays animated status subtitles with activity descriptions
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AgentActivity, 
  getActivityDescription, 
  getNextActivity,
  agenticVariants 
} from '@/lib/motion/agentic'
import { useReducedMotion } from '@/lib/motion/hooks'

interface AgentStatusProps {
  /**
   * Current activity the agent is performing
   */
  activity: AgentActivity
  /**
   * Current phase of agent workflow
   */
  phase?: 'idle' | 'initiation' | 'cognition' | 'acting' | 'resolving' | 'complete'
  /**
   * Whether to rotate through activity descriptions
   */
  rotateDescriptions?: boolean
  /**
   * Custom description override
   */
  customDescription?: string
  /**
   * Show animated thinking indicator
   */
  showIndicator?: boolean
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
}

export default function AgentStatus({
  activity,
  phase = 'cognition',
  rotateDescriptions = true,
  customDescription,
  showIndicator = true,
  size = 'md',
}: AgentStatusProps) {
  const [currentDescription, setCurrentDescription] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const descriptions = customDescription 
    ? [customDescription]
    : [
        getActivityDescription(activity, 0),
        getActivityDescription(activity, 1),
        getActivityDescription(activity, 2),
      ]

  // Rotate descriptions if enabled
  useEffect(() => {
    if (!rotateDescriptions || customDescription) return

    const interval = setInterval(() => {
      setCurrentDescription((prev) => (prev + 1) % descriptions.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [rotateDescriptions, customDescription, descriptions.length])

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size]

  const indicatorSize = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  }[size]

  if (prefersReducedMotion) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${textSize}`}>
        {showIndicator && (
          <div className={`${indicatorSize} rounded-full bg-copilot-primary`} />
        )}
        <span>{descriptions[currentDescription]}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Animated Thinking Indicator */}
      {showIndicator && phase === 'cognition' && (
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${indicatorSize} rounded-full bg-copilot-primary`}
              variants={agenticVariants.thinkingPulse}
              initial="initial"
              animate="animate"
              transition={{
                delay: i * 0.15,
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Static indicator for other phases */}
      {showIndicator && phase !== 'cognition' && (
        <div className={`${indicatorSize} rounded-full bg-copilot-primary opacity-60`} />
      )}

      {/* Status Text with Typing Animation */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentDescription}
          className={`text-gray-500 ${textSize} font-medium`}
          variants={agenticVariants.typing}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          {descriptions[currentDescription]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}


