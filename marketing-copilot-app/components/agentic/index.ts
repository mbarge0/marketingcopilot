/**
 * Agentic Animation Components
 * Export all agentic animation components
 * 
 * "Motion as Momentum" - Makes the AI feel alive, powerful, and helpful
 */

export { default as AgentStatus } from './AgentStatus'
export { default as AgentWaveform } from './AgentWaveform'
export { default as AgentProgress } from './AgentProgress'
export { default as AgentThinking } from './AgentThinking'

// Re-export types and utilities
export type {
  AgentPhase,
  AgentActivity,
} from '@/lib/motion/agentic'

export {
  agenticVariants,
  agenticConfig,
  getActivityDescription,
  getNextActivity,
  ACTIVITY_DESCRIPTIONS,
} from '@/lib/motion/agentic'

