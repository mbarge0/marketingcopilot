'use client'

/**
 * Chat Pulse Component
 * Visual Identity Guide: Chat Submit - Input pulse + bubble rise, 400ms, ease-out-back
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useCopilotMotion, useReducedMotion } from '../hooks'
import { copilotMotion } from '../motion.config'

interface ChatPulseProps {
  children: React.ReactNode
  isSubmitting?: boolean
  className?: string
}

export function ChatPulse({ children, isSubmitting = false, className = '' }: ChatPulseProps) {
  const prefersReducedMotion = useReducedMotion()
  const { motion: Motion, variants } = useCopilotMotion({ variant: 'chatSubmit' })

  return (
    <Motion.div
      className={className}
      animate={isSubmitting && !prefersReducedMotion ? 'animate' : 'initial'}
      variants={prefersReducedMotion ? {} : variants}
    >
      {children}
    </Motion.div>
  )
}

/**
 * Chat Input Flash
 * Input field flashes accent blue gradient on submit
 */
export function ChatInputFlash({ isActive }: { isActive: boolean }) {
  const prefersReducedMotion = useReducedMotion()
  
  if (prefersReducedMotion) return null
  
  return (
    <motion.div
      className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#0066FF] via-[#3B82F6] to-[#0066FF] opacity-0 pointer-events-none"
      animate={{
        opacity: isActive ? [0, 0.3, 0] : 0,
        backgroundPosition: isActive ? ['0%', '100%', '0%'] : '0%',
      }}
      transition={{
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1], // ease-out-back
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  )
}

/**
 * Chat Bubble Rise
 * Message bubble animates upward with ease-out-back
 */
export function ChatBubbleRise({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const { motion: Motion, variants } = useCopilotMotion({ variant: 'chatBubbleRise' })

  return (
    <Motion.div
      className={className}
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
      exit={prefersReducedMotion ? false : 'exit'}
      variants={prefersReducedMotion ? {} : variants}
    >
      {children}
    </Motion.div>
  )
}
