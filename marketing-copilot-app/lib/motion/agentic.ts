/**
 * Agentic Animation System
 * "Motion as Momentum" - Makes the AI feel alive, powerful, and helpful
 * 
 * Core Principles:
 * - Perceived Intelligence: Show reasoning steps, not just UI transitions
 * - Momentum & Flow: Keep agent visually in motion
 * - Delight Through Subtlety: Micro-motion at 150-300ms
 * - Cause and Effect: Immediate visible reactions
 * - Spatial Continuity: Elements slide/morph instead of hard cuts
 */

import { Variants, Transition } from 'framer-motion'
import { copilotMotion } from './motion.config'

/**
 * Agent Workflow Phases
 */
export type AgentPhase = 'idle' | 'initiation' | 'cognition' | 'acting' | 'resolving' | 'complete'

/**
 * Agent Activity Types
 */
export type AgentActivity = 
  | 'analyzing'
  | 'searching'
  | 'reading'
  | 'generating'
  | 'optimizing'
  | 'evaluating'
  | 'planning'
  | 'executing'

/**
 * Activity descriptions for status subtitles
 */
export const ACTIVITY_DESCRIPTIONS: Record<AgentActivity, string[]> = {
  analyzing: [
    'Analyzing campaign performance...',
    'Reviewing metrics and trends...',
    'Identifying optimization opportunities...',
  ],
  searching: [
    'Searching for relevant data...',
    'Scanning campaign history...',
    'Finding matching patterns...',
  ],
  reading: [
    'Reading campaign data...',
    'Processing insights...',
    'Reviewing configuration...',
  ],
  generating: [
    'Generating recommendations...',
    'Creating ad copy variations...',
    'Building campaign structure...',
  ],
  optimizing: [
    'Optimizing budget allocation...',
    'Adjusting bid strategies...',
    'Refining targeting parameters...',
  ],
  evaluating: [
    'Evaluating performance...',
    'Assessing impact...',
    'Comparing options...',
  ],
  planning: [
    'Planning next moves...',
    'Strategizing approach...',
    'Mapping out steps...',
  ],
  executing: [
    'Executing changes...',
    'Applying optimizations...',
    'Updating campaigns...',
  ],
}

/**
 * Agentic Animation Variants
 */
export const agenticVariants = {
  /**
   * Phase 1: Initiation
   * User prompts AI - agent "awakens"
   */
  initiation: {
    initial: { opacity: 0, scale: 0.95, y: 4 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: copilotMotion.timing.dataRefresh.duration / 1000,
        ease: copilotMotion.timing.insightReveal.easing,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: {
        duration: copilotMotion.timing.tooltipFade.duration / 1000,
      }
    },
  } as Variants,

  /**
   * Phase 2: Cognition / Processing
   * System shows active "thought"
   */
  cognition: {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    },
  } as Variants,

  /**
   * Thinking pulse - subtle breathing animation
   */
  thinkingPulse: {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    },
  } as Variants,

  /**
   * Waveform animation for processing
   */
  waveform: {
    initial: { scaleY: 0.3 },
    animate: {
      scaleY: [0.3, 1, 0.3, 0.8, 0.3],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    },
  } as Variants,

  /**
   * Phase 3: Action
   * AI executes visible operations
   */
  action: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: copilotMotion.timing.insightReveal.duration / 1000,
        ease: copilotMotion.timing.insightReveal.easing,
        staggerChildren: 0.05,
      }
    },
  } as Variants,

  /**
   * Staggered entry for data appearing
   */
  dataEntry: {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: copilotMotion.timing.dataRefresh.duration / 1000,
        ease: copilotMotion.timing.dataRefresh.easing,
      }
    }),
  } as Variants,

  /**
   * Phase 4: Resolution
   * Deliver results with finality
   */
  resolution: {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: copilotMotion.timing.insightReveal.duration / 1000,
        ease: copilotMotion.timing.chatSubmit.easing,
      }
    },
  } as Variants,

  /**
   * Success glow - brief pulse on completion
   */
  successGlow: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 1],
      transition: {
        duration: copilotMotion.timing.insightReveal.duration / 1000,
        ease: copilotMotion.timing.dataRefresh.easing,
      }
    },
  } as Variants,

  /**
   * Spatial continuity - slide between panels
   */
  spatialSlide: {
    initial: (direction: 'left' | 'right' = 'right') => ({
      x: direction === 'right' ? 20 : -20,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: copilotMotion.timing.insightReveal.duration / 1000,
        ease: copilotMotion.timing.dataRefresh.easing,
      }
    },
    exit: (direction: 'left' | 'right' = 'right') => ({
      x: direction === 'right' ? -20 : 20,
      opacity: 0,
      transition: {
        duration: copilotMotion.timing.dataRefresh.duration / 1000,
      }
    }),
  } as Variants,

  /**
   * Typing animation for text appearing
   */
  typing: {
    initial: { opacity: 0, width: 0 },
    animate: {
      opacity: 1,
      width: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      }
    },
  } as Variants,

  /**
   * Progress particles - animated dots showing activity
   */
  progressParticles: {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [0, -20, -40],
      transition: {
        delay: i * 0.1,
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      }
    }),
  } as Variants,
} as const

/**
 * Animation Manager Configuration
 */
export const agenticConfig = {
  durations: {
    instant: copilotMotion.timing.tooltipFade.duration,
    fast: copilotMotion.timing.dataRefresh.duration,
    base: copilotMotion.timing.insightReveal.duration,
    slow: copilotMotion.timing.successEvent.duration,
  },
  easing: {
    smartOut: copilotMotion.timing.insightReveal.easing,
    smooth: copilotMotion.timing.dataRefresh.easing,
    elastic: copilotMotion.timing.chatSubmit.easing,
  },
  stagger: {
    small: 0.05,
    medium: 0.1,
    large: 0.2,
  },
  phases: {
    idle: {
      duration: 0,
      animation: 'breathing',
    },
    initiation: {
      duration: copilotMotion.timing.dataRefresh.duration,
      animation: 'awaken',
    },
    cognition: {
      duration: copilotMotion.timing.successEvent.duration,
      animation: 'thinking',
    },
    acting: {
      duration: copilotMotion.timing.insightReveal.duration,
      animation: 'executing',
    },
    resolving: {
      duration: copilotMotion.timing.insightReveal.duration,
      animation: 'completing',
    },
    complete: {
      duration: copilotMotion.timing.tooltipFade.duration,
      animation: 'settle',
    },
  },
} as const

/**
 * Get activity description with rotation
 */
export function getActivityDescription(
  activity: AgentActivity,
  index?: number
): string {
  const descriptions = ACTIVITY_DESCRIPTIONS[activity]
  if (index !== undefined && index < descriptions.length) {
    return descriptions[index]
  }
  // Rotate through descriptions for variety
  const randomIndex = Math.floor(Math.random() * descriptions.length)
  return descriptions[randomIndex]
}

/**
 * Get next activity in sequence
 */
export function getNextActivity(current: AgentActivity): AgentActivity {
  const sequence: AgentActivity[] = [
    'planning',
    'analyzing',
    'searching',
    'reading',
    'evaluating',
    'generating',
    'optimizing',
    'executing',
  ]
  const currentIndex = sequence.indexOf(current)
  return sequence[(currentIndex + 1) % sequence.length]
}

