'use client'

/**
 * Mode Transition Component
 * Smooth transitions between dashboard modes
 */

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks'
import { copilotMotion } from '../motion.config'

interface ModeTransitionProps {
  children: React.ReactNode
  mode: string
  className?: string
}

export function ModeTransition({ children, mode, className = '' }: ModeTransitionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        className={className}
        initial={prefersReducedMotion ? undefined : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, x: -40 }}
        transition={copilotMotion.timing.dataRefresh}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Shake Animation Component
 * For error states
 */
interface ShakeProps {
  children: React.ReactNode
  trigger: boolean
  className?: string
}

export function Shake({ children, trigger, className = '' }: ShakeProps) {
  const prefersReducedMotion = useReducedMotion()
  const variants = copilotMotion.variants.buttonPress

  return (
    <motion.div
      className={className}
      animate={trigger && !prefersReducedMotion ? { rotate: [-2, 2, -2, 2, 0] } : {}}
      transition={variants.transition}
    >
      {children}
    </motion.div>
  )
}

/**
 * Progress Bar Component
 * Shimmer progress bar instead of spinners
 */
interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={`relative h-2 bg-[#E2E8F0] rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0066FF] to-[#FF7A00] rounded-full"
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: progress / 100,
        }}
        transition={copilotMotion.timing.chartAnimation}
        style={{ transformOrigin: 'left' }}
      />
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}

/**
 * Toast Component
 * Slide-up + blur fade, 2.5s lifespan
 */
interface ToastProps {
  children: React.ReactNode
  isVisible: boolean
  onClose?: () => void
  className?: string
}

export function Toast({ children, isVisible, onClose, className = '' }: ToastProps) {
  const prefersReducedMotion = useReducedMotion()
  const variants = copilotMotion.variants.toastSlide
  
  // Convert readonly variants to mutable for framer-motion compatibility
  const mutableVariants = variants ? JSON.parse(JSON.stringify(variants)) : undefined

  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={prefersReducedMotion ? undefined : mutableVariants?.initial}
          animate={mutableVariants?.animate}
          exit={prefersReducedMotion ? undefined : mutableVariants?.exit}
          transition={mutableVariants?.transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
