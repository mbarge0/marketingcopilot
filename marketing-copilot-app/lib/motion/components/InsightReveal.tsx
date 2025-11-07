'use client'

/**
 * Insight Reveal Component
 * Visual Identity Guide: Fade-in + glow expand, 700ms, cubic-bezier(0.16, 1, 0.3, 1)
 * Radial gradient: circle at top left, rgba(0,102,255,0.1), transparent 70%
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCopilotMotion, useReducedMotion } from '../hooks'
import { copilotMotion } from '../motion.config'

interface InsightRevealProps {
  children: React.ReactNode
  priority?: 'critical' | 'opportunity' | 'info'
  isVisible?: boolean
  className?: string
}

export function InsightReveal({ 
  children, 
  priority = 'info',
  isVisible = true,
  className = '' 
}: InsightRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const { motion: Motion, variants } = useCopilotMotion({ variant: 'insightReveal' })

  // Convert readonly variants to mutable for framer-motion compatibility
  const mutableVariants = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : variants ? JSON.parse(JSON.stringify(variants)) : undefined

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          className={`relative ${className}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={mutableVariants}
        >
          {/* Radial gradient glow at top left */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'radial-gradient(circle at top left, rgba(0,102,255,0.1), transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )}
          {children}
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
