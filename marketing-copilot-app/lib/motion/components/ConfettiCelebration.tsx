'use client'

/**
 * Confetti Celebration Component
 * Visual Identity Guide: Confetti + color sweep, 1.2s, ease-in-out
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion, useCopilotMotion } from '../hooks'
import { copilotMotion } from '../motion.config'

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  velocity: { x: number; y: number }
}

const colors = ['#0066FF', '#3B82F6', '#FF7A00', '#16A34A', '#8B5CF6']

export function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!trigger || prefersReducedMotion) return

    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50, // Start from center
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10 - 5, // Upward bias
      },
    }))

    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 1200)

    return () => clearTimeout(timer)
  }, [trigger, prefersReducedMotion, onComplete])

  if (prefersReducedMotion || !trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{
              opacity: 1,
              scale: 1,
              rotate: particle.rotation,
            }}
            animate={{
              x: particle.velocity.x * 100,
              y: particle.velocity.y * 100,
              rotate: particle.rotation + 360,
              opacity: [1, 1, 0],
              scale: [1, 1.2, 0],
            }}
            exit={{ opacity: 0 }}
            transition={copilotMotion.timing.successEvent}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Success Badge Glow
 * Glow trail behind new data card for 0.6s
 */
interface SuccessBadgeGlowProps {
  children: React.ReactNode
  className?: string
}

export function SuccessBadgeGlow({ children, className = '' }: SuccessBadgeGlowProps) {
  const prefersReducedMotion = useReducedMotion()
  const { motion: Motion, variants } = useCopilotMotion({ variant: 'successEvent' })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  // Convert readonly variants to mutable for framer-motion compatibility
  const mutableVariants = variants ? JSON.parse(JSON.stringify(variants)) : undefined

  return (
    <Motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={mutableVariants}
    >
      {children}
    </Motion.div>
  )
}

/**
 * Checkmark Draw Animation
 * SVG checkmark that draws itself
 */
interface CheckmarkDrawProps {
  className?: string
  size?: number
}

export function CheckmarkDraw({ className = '', size = 24 }: CheckmarkDrawProps) {
  const prefersReducedMotion = useReducedMotion()
  const { motion: Motion } = useCopilotMotion()

  return (
    <Motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: prefersReducedMotion ? 1 : 1, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </Motion.svg>
  )
}
