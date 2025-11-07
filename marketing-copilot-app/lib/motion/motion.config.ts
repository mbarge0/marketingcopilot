/**
 * Marketing Co-Pilot Motion System Configuration
 * Visual Identity Guide v1.0 - Light Mode System
 * 
 * Brand Essence: "Where insight meets motion."
 */

/**
 * Motion Timing Specifications
 * From Visual Identity Guide - exact durations and easing
 */
export const copilotMotionTiming = {
  // Button Press: Scale 0.97 → 1.0, 120ms, ease-out
  buttonPress: {
    duration: 120,
    easing: [0, 0, 0.2, 1] as [number, number, number, number], // ease-out
  },
  
  // Data Refresh: Fade + slide (10px up), 250ms, ease-in-out
  dataRefresh: {
    duration: 250,
    easing: [0.4, 0, 0.2, 1] as [number, number, number, number], // ease-in-out
  },
  
  // Insight Reveal: Fade-in + glow expand, 700ms, cubic-bezier(0.16, 1, 0.3, 1)
  insightReveal: {
    duration: 700,
    easing: [0.16, 1, 0.3, 1] as [number, number, number, number], // smart-out
  },
  
  // Chat Submit: Input pulse + bubble rise, 400ms, ease-out-back
  chatSubmit: {
    duration: 400,
    easing: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // ease-out-back
  },
  
  // Success Event: Confetti + color sweep, 1.2s, ease-in-out
  successEvent: {
    duration: 1200,
    easing: [0.4, 0, 0.2, 1] as [number, number, number, number], // ease-in-out
  },
  
  // Hover State: Shadow lift + color accent, 200ms, ease-in
  hoverState: {
    duration: 200,
    easing: [0.4, 0, 1, 1] as [number, number, number, number], // ease-in
  },
  
  // Tooltip fade-in: 150ms
  tooltipFade: {
    duration: 150,
    easing: [0, 0, 0.2, 1] as [number, number, number, number],
  },
  
  // Chart animation: 400ms ease-out
  chartAnimation: {
    duration: 400,
    easing: [0, 0, 0.2, 1] as [number, number, number, number],
  },
} as const

/**
 * Animation Variants
 * Framer Motion variants matching Visual Identity Guide specs
 */
export const copilotVariants = {
  // Button Press: Scale 0.97 → 1.0
  buttonPress: {
    initial: { scale: 1 },
    tap: { scale: 0.97 },
    transition: copilotMotionTiming.buttonPress,
  },
  
  // Data Refresh: Fade + slide (10px up)
  dataRefresh: {
    initial: { opacity: 0.4, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0.4, y: -10 },
    transition: copilotMotionTiming.dataRefresh,
  },
  
  // Insight Reveal: Fade-in + glow expand
  insightReveal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
    },
    transition: copilotMotionTiming.insightReveal,
  },
  
  // Chat Submit: Input pulse + bubble rise
  chatSubmit: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 0.98, 1],
      opacity: [1, 0.9, 1],
    },
    transition: copilotMotionTiming.chatSubmit,
  },
  
  // Chat Bubble Rise
  chatBubbleRise: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    transition: copilotMotionTiming.chatSubmit,
  },
  
  // Success Event: Confetti + color sweep
  successEvent: {
    initial: { scale: 0.95 },
    animate: {
      scale: [0.95, 1.02, 1],
    },
    transition: copilotMotionTiming.successEvent,
  },
  
  // Hover State: Shadow lift + color accent
  hoverState: {
    hover: {
      scale: 1.02,
      transition: copilotMotionTiming.hoverState,
    },
  },
  
  // Tooltip fade-in
  tooltipFade: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: copilotMotionTiming.tooltipFade,
  },
  
  // Toast slide-up + blur fade
  toastSlide: {
    initial: { opacity: 0, y: -20, filter: 'blur(4px)' },
    animate: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      scale: [0.95, 1.02, 1],
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      filter: 'blur(4px)' 
    },
    transition: {
      duration: 400,
      ease: [0.34, 1.56, 0.64, 1], // ease-out-back
    },
  },
  
  // AI Thinking: Animated wave gradient + typing dots
  aiThinking: {
    animate: {
      backgroundPosition: ['0%', '100%', '0%'],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  
  // AI Responding: Text fades in line by line, each line slides 2px up
  aiResponding: {
    initial: { opacity: 0, y: 2 },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: 300,
      staggerChildren: 0.03, // 30ms stagger per line
    },
  },
  
  // Chart bar/line growth
  chartGrowth: {
    initial: { scaleY: 0 },
    animate: {
      scaleY: 1,
    },
    transition: copilotMotionTiming.chartAnimation,
  },
  
  // Data point glow + tooltip fade-in
  dataPointGlow: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
    },
    transition: copilotMotionTiming.tooltipFade,
  },
} as const

/**
 * Agent Thinking Gradient Animation
 * linear-gradient(90deg, #0066FF 0%, #FF7A00 100%) → animated shimmer (4s loop)
 */
export const agentThinkingGradient = {
  background: 'linear-gradient(90deg, #0066FF 0%, #FF7A00 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 4s infinite',
}

/**
 * Insight Reveal Radial Gradient
 * radial-gradient(circle at top left, rgba(0,102,255,0.1), transparent 70%)
 */
export const insightRevealGradient = {
  background: 'radial-gradient(circle at top left, rgba(0,102,255,0.1), transparent 70%)',
}

/**
 * Motion Configuration Export
 */
export const copilotMotion = {
  timing: copilotMotionTiming,
  variants: copilotVariants,
  gradients: {
    agentThinking: agentThinkingGradient,
    insightReveal: insightRevealGradient,
  },
} as const

export type CopilotVariant = keyof typeof copilotVariants
