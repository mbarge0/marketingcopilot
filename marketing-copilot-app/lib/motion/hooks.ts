'use client'

/**
 * Marketing Co-Pilot Motion Hooks
 * Visual Identity Guide v1.0 Implementation
 */

import { motion, useAnimationControls, useMotionValue, useSpring, useTransform, type Transition } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { copilotMotion, type CopilotVariant } from './motion.config'

/**
 * Hook for accessing Marketing Co-Pilot motion system
 */
export function useCopilotMotion(options: {
  variant?: CopilotVariant
  transition?: Partial<Transition>
} = {}) {
  const controls = useAnimationControls()
  const variant = options.variant || 'insightReveal'
  
  const baseTransition: Transition = {
    duration: (copilotMotion.timing.insightReveal.duration / 1000),
    ease: copilotMotion.timing.insightReveal.easing,
    ...options.transition,
  }

  const variants = useMemo(() => {
    return copilotMotion.variants[variant] || copilotMotion.variants.insightReveal
  }, [variant])

  return {
    motion,
    controls,
    variants,
    transition: baseTransition,
  }
}

/**
 * Hook for animating number counters (metrics, campaign IDs)
 */
export function useCounterAnimation(
  targetValue: number,
  options: {
    duration?: number
    format?: (value: number) => string
  } = {}
) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
  })
  
  const formatted = useTransform(spring, (value) => {
    const num = Math.round(value)
    return options.format ? options.format(num) : num.toString()
  })

  useEffect(() => {
    motionValue.set(targetValue)
  }, [targetValue, motionValue])

  return formatted
}

/**
 * Hook for AI typing indicator animation
 * Random intervals (100-300ms) between dots
 */
export function useTypingIndicator() {
  const controls = useAnimationControls()
  
  useEffect(() => {
    const animateDot = async (index: number) => {
      const delay = Math.random() * 200 + 100 // 100-300ms random
      await new Promise(resolve => setTimeout(resolve, delay))
      
      await controls.start({
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        },
      })
    }
    
    // Animate all three dots with random delays
    animateDot(0)
    animateDot(1)
    animateDot(2)
  }, [controls])

  return controls
}

/**
 * Hook for AI thinking pulse (header banner gradient)
 */
export function useAIPulse() {
  const controls = useAnimationControls()
  
  useEffect(() => {
    controls.start({
      backgroundPosition: ['0%', '100%', '0%'],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
      },
    })
  }, [controls])

  return controls
}

/**
 * Hook for chart bar/line growth animation
 * 400ms ease-out
 */
export function useChartGrowth() {
  const controls = useAnimationControls()
  
  useEffect(() => {
    controls.start({
      scaleY: 1,
      transition: copilotMotion.timing.chartAnimation,
    })
  }, [controls])

  return controls
}

/**
 * Hook for shake animation (errors)
 */
export function useShakeAnimation(trigger: boolean) {
  const controls = useAnimationControls()
  
  useEffect(() => {
    if (trigger) {
      controls.start({
        rotate: [-2, 2, -2, 2, 0],
        transition: {
          duration: copilotMotion.timing.buttonPress.duration / 1000,
          ease: copilotMotion.timing.buttonPress.easing,
        },
      })
    }
  }, [trigger, controls])

  return controls
}

/**
 * Hook for respecting reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Utility to get animation props based on reduced motion preference
 */
export function getAnimationProps(
  animationProps: any,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return {
      ...animationProps,
      transition: {
        duration: 0,
      },
      initial: { opacity: animationProps.initial?.opacity || 0 },
      animate: { opacity: animationProps.animate?.opacity || 1 },
    }
  }
  return animationProps
}
