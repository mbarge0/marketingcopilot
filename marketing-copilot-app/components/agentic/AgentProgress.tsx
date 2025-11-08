'use client'

/**
 * Agent Progress Component
 * Shows staged task progression with animated indicators
 * "Analyzing → Generating → Optimizing"
 */

import React from 'react'
import { motion } from 'framer-motion'
import { AgentActivity, ACTIVITY_DESCRIPTIONS } from '@/lib/motion/agentic'
import { useReducedMotion } from '@/lib/motion/hooks'
import { Check } from 'lucide-react'

interface AgentProgressProps {
  /**
   * Sequence of activities to show progress through
   */
  activities: AgentActivity[]
  /**
   * Current activity index (0-based)
   */
  currentIndex: number
  /**
   * Show checkmarks for completed steps
   */
  showCheckmarks?: boolean
}

export default function AgentProgress({
  activities,
  currentIndex,
  showCheckmarks = true,
}: AgentProgressProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {activities.map((activity, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Step Indicator */}
            <motion.div
              className={`
                flex items-center justify-center rounded-full
                ${status === 'completed' 
                  ? 'bg-copilot-success text-white' 
                  : status === 'current'
                  ? 'bg-copilot-primary text-white'
                  : 'bg-gray-200 text-gray-400'
                }
                ${prefersReducedMotion ? 'w-6 h-6' : 'w-7 h-7'}
              `}
              initial={prefersReducedMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              {isCompleted && showCheckmarks ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </motion.div>

            {/* Activity Label */}
            <motion.span
              className={`
                text-sm font-medium
                ${status === 'completed' 
                  ? 'text-gray-500 line-through' 
                  : status === 'current'
                  ? 'text-copilot-primary'
                  : 'text-gray-400'
                }
              `}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1 + 0.1,
                duration: 0.3,
              }}
            >
              {ACTIVITY_DESCRIPTIONS[activity][0]}
            </motion.span>

            {/* Arrow Separator */}
            {index < activities.length - 1 && (
              <motion.div
                className="text-gray-300"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * 0.1 + 0.2,
                }}
              >
                →
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}


