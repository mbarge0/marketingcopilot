'use client'

/**
 * Agent Thinking Component
 * Comprehensive thinking indicator with status, waveform, and progress
 * Combines all agentic animation elements
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AgentPhase, AgentActivity } from '@/lib/motion/agentic'
import { agenticVariants } from '@/lib/motion/agentic'
import AgentStatus from './AgentStatus'
import AgentWaveform from './AgentWaveform'
import AgentProgress from './AgentProgress'

interface AgentThinkingProps {
  /**
   * Current phase of agent workflow
   */
  phase: AgentPhase
  /**
   * Current activity
   */
  activity?: AgentActivity
  /**
   * Sequence of activities for progress tracking
   */
  activitySequence?: AgentActivity[]
  /**
   * Current step in activity sequence
   */
  currentStep?: number
  /**
   * Custom status message
   */
  customStatus?: string
  /**
   * Show waveform animation
   */
  showWaveform?: boolean
  /**
   * Show progress sequence
   */
  showProgress?: boolean
  /**
   * Compact mode (smaller, less spacing)
   */
  compact?: boolean
}

export default function AgentThinking({
  phase,
  activity = 'planning',
  activitySequence,
  currentStep,
  customStatus,
  showWaveform = true,
  showProgress = false,
  compact = false,
}: AgentThinkingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isActive = phase === 'cognition' || phase === 'acting' || phase === 'resolving'
  const showAnimations = isActive

  return (
    <motion.div
      className={`
        flex flex-col gap-3
        ${compact ? 'p-3' : 'p-4'}
        bg-white rounded-lg border border-gray-200
      `}
      variants={agenticVariants.initiation}
      initial="initial"
      animate="animate"
    >
      {/* Status Row */}
      <div className="flex items-center justify-between">
        <AgentStatus
          activity={activity}
          phase={phase}
          customDescription={customStatus}
          showIndicator={showAnimations}
          size={compact ? 'sm' : 'md'}
        />

        {/* Waveform Indicator */}
        {showWaveform && showAnimations && (
          <AgentWaveform
            bars={5}
            height={compact ? 20 : 24}
            variant="primary"
            intensity={phase === 'cognition' ? 'active' : 'moderate'}
          />
        )}
      </div>

      {/* Progress Sequence */}
      {showProgress && activitySequence && currentStep !== undefined && (
        <AgentProgress
          activities={activitySequence}
          currentIndex={currentStep}
        />
      )}

      {/* Phase-specific visual feedback */}
      {phase === 'resolving' && (
        <motion.div
          className="h-1 bg-gray-100 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-copilot-primary to-copilot-accent-orange"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

