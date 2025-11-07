'use client'

/**
 * Table Refresh Component
 * Visual Identity Guide: Fade + slide (10px up), 250ms, ease-in-out
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion, useCopilotMotion } from '../hooks'
import { copilotMotion } from '../motion.config'

interface TableRefreshProps {
  children: React.ReactNode
  isRefreshing?: boolean
  className?: string
}

export function TableRefresh({ children, isRefreshing = false, className = '' }: TableRefreshProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={isRefreshing ? { opacity: 0.4, y: -10 } : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : copilotMotion.timing.dataRefresh}
    >
      {children}
    </motion.div>
  )
}

/**
 * Table Row Animation
 * Animate on data update (fade + slide)
 */
interface TableRowProps {
  children: React.ReactNode
  isNew?: boolean
  className?: string
}

export function TableRow({ children, isNew = false, className = '' }: TableRowProps) {
  const prefersReducedMotion = useReducedMotion()
  const variants = copilotMotion.variants.dataRefresh
  
  // Convert readonly variants to mutable for framer-motion compatibility
  const mutableVariants = variants ? JSON.parse(JSON.stringify(variants)) : undefined

  return (
    <motion.tr
      className={className}
      initial={prefersReducedMotion ? undefined : mutableVariants?.initial}
      animate={mutableVariants?.animate}
      exit={prefersReducedMotion ? undefined : mutableVariants?.exit}
      transition={mutableVariants?.transition}
      layout
    >
      {children}
    </motion.tr>
  )
}

/**
 * Metric Counter Component
 * Animate number changes smoothly
 */
interface MetricCounterProps {
  value: number
  format?: (value: number) => string
  className?: string
}

export function MetricCounter({ value, format, className = '' }: MetricCounterProps) {
  const { motion: Motion } = useCopilotMotion({ variant: 'hoverState' })
  const prefersReducedMotion = useReducedMotion()

  const displayValue = format ? format(value) : value.toString()

  return (
    <Motion.span
      className={className}
      animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
      transition={prefersReducedMotion ? {} : copilotMotion.timing.buttonPress}
      key={value} // Re-animate on value change
    >
      {displayValue}
    </Motion.span>
  )
}
