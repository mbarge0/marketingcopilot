'use client'

/**
 * Agent Waveform Component
 * Animated waveform showing active processing/cognition
 * Visual representation of "thinking"
 */

import React from 'react'
import { motion } from 'framer-motion'
import { agenticVariants } from '@/lib/motion/agentic'
import { useReducedMotion } from '@/lib/motion/hooks'

interface AgentWaveformProps {
  /**
   * Number of bars in the waveform
   */
  bars?: number
  /**
   * Height of waveform container
   */
  height?: number
  /**
   * Color variant
   */
  variant?: 'primary' | 'accent' | 'success'
  /**
   * Animation intensity
   */
  intensity?: 'subtle' | 'moderate' | 'active'
}

const colorMap = {
  primary: 'bg-copilot-primary',
  accent: 'bg-copilot-accent-orange',
  success: 'bg-copilot-success',
}

const intensityMap = {
  subtle: { min: 0.2, max: 0.6 },
  moderate: { min: 0.3, max: 0.8 },
  active: { min: 0.4, max: 1.0 },
}

export default function AgentWaveform({
  bars = 5,
  height = 24,
  variant = 'primary',
  intensity = 'moderate',
}: AgentWaveformProps) {
  const prefersReducedMotion = useReducedMotion()
  const { min, max } = intensityMap[intensity]
  const colorClass = colorMap[variant]

  if (prefersReducedMotion) {
    return (
      <div className="flex items-center gap-1" style={{ height }}>
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`${colorClass} rounded-full opacity-60`}
            style={{
              width: 3,
              height: height * 0.6,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.1
        const duration = 1.2 + (i % 2) * 0.2 // Vary duration slightly
        
        return (
          <motion.div
            key={i}
            className={`${colorClass} rounded-full`}
            style={{
              width: 3,
              height: height * max,
            }}
            variants={agenticVariants.waveform}
            initial="initial"
            animate="animate"
            transition={{
              delay,
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}

