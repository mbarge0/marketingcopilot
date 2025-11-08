# Agentic Animation System

**"Motion as Momentum"** - Makes the AI feel alive, powerful, and helpful.

## Overview

The Agentic Animation System creates the illusion of intelligent momentum, making the agent appear to be thinking, acting, and progressing rapidly on behalf of the marketer.

## Core Principles

1. **Perceived Intelligence** - Show reasoning steps, not just UI transitions
2. **Momentum & Flow** - Keep agent visually in motion
3. **Delight Through Subtlety** - Micro-motion at 150-300ms
4. **Cause and Effect** - Immediate visible reactions
5. **Spatial Continuity** - Elements slide/morph instead of hard cuts

## Components

### `AgentStatus`
Shows what the AI is thinking with animated status subtitles.

```tsx
import { AgentStatus } from '@/components/agentic'

<AgentStatus
  activity="analyzing"
  phase="cognition"
  showIndicator={true}
  size="md"
/>
```

**Props:**
- `activity`: Current activity (`analyzing`, `searching`, `reading`, etc.)
- `phase`: Workflow phase (`idle`, `initiation`, `cognition`, `acting`, `resolving`, `complete`)
- `rotateDescriptions`: Rotate through activity descriptions (default: `true`)
- `showIndicator`: Show animated thinking indicator (default: `true`)
- `size`: `sm` | `md` | `lg`

### `AgentWaveform`
Animated waveform showing active processing/cognition.

```tsx
import { AgentWaveform } from '@/components/agentic'

<AgentWaveform
  bars={5}
  height={24}
  variant="primary"
  intensity="active"
/>
```

**Props:**
- `bars`: Number of bars (default: `5`)
- `height`: Container height in pixels (default: `24`)
- `variant`: `primary` | `accent` | `success`
- `intensity`: `subtle` | `moderate` | `active`

### `AgentProgress`
Shows staged task progression: "Analyzing → Generating → Optimizing"

```tsx
import { AgentProgress } from '@/components/agentic'

<AgentProgress
  activities={['analyzing', 'generating', 'optimizing']}
  currentIndex={1}
  showCheckmarks={true}
/>
```

**Props:**
- `activities`: Array of activity types
- `currentIndex`: Current step (0-based)
- `showCheckmarks`: Show checkmarks for completed steps

### `AgentThinking`
Comprehensive thinking indicator combining all elements.

```tsx
import { AgentThinking } from '@/components/agentic'

<AgentThinking
  phase="cognition"
  activity="analyzing"
  activitySequence={['planning', 'analyzing', 'generating']}
  currentStep={1}
  showWaveform={true}
  showProgress={true}
/>
```

**Props:**
- `phase`: Current workflow phase
- `activity`: Current activity
- `activitySequence`: Sequence for progress tracking
- `currentStep`: Current step index
- `customStatus`: Custom status message override
- `showWaveform`: Show waveform animation
- `showProgress`: Show progress sequence
- `compact`: Compact mode (smaller spacing)

## Agent Workflow Phases

1. **Initiation** - User prompts AI, agent "awakens"
2. **Cognition** - System shows active "thought"
3. **Acting** - AI executes visible operations
4. **Resolving** - Results appear with finality
5. **Complete** - Task finished, return to idle

## Activity Types

- `analyzing` - "Analyzing campaign performance..."
- `searching` - "Searching for relevant data..."
- `reading` - "Reading campaign data..."
- `generating` - "Generating recommendations..."
- `optimizing` - "Optimizing budget allocation..."
- `evaluating` - "Evaluating performance..."
- `planning` - "Planning next moves..."
- `executing` - "Executing changes..."

## Usage Examples

### Chat Bar Integration

The `ChatBar` component automatically shows `AgentThinking` when processing:

```tsx
import ChatBar from '@/components/shared/ChatBar'

<ChatBar 
  context="dashboard-campaigns"
  loading={isLoading}
/>
```

### Custom Agent Workflow

```tsx
import { AgentThinking, AgentPhase, AgentActivity } from '@/components/agentic'
import { useState } from 'react'

function MyComponent() {
  const [phase, setPhase] = useState<AgentPhase>('idle')
  const [activity, setActivity] = useState<AgentActivity>('planning')

  const handleAction = async () => {
    setPhase('initiation')
    setTimeout(() => {
      setPhase('cognition')
      setActivity('analyzing')
    }, 200)
    
    // ... perform work ...
    
    setTimeout(() => {
      setPhase('resolving')
      setActivity('generating')
    }, 2000)
    
    setTimeout(() => {
      setPhase('complete')
    }, 3000)
  }

  return (
    <AgentThinking
      phase={phase}
      activity={activity}
      showWaveform={true}
      showProgress={true}
    />
  )
}
```

## Animation Variants

All variants are available from `@/lib/motion/agentic`:

- `agenticVariants.initiation` - Awakening animation
- `agenticVariants.cognition` - Thinking pulse
- `agenticVariants.thinkingPulse` - Breathing animation
- `agenticVariants.waveform` - Processing bars
- `agenticVariants.action` - Data entry
- `agenticVariants.dataEntry` - Staggered entries
- `agenticVariants.resolution` - Completion
- `agenticVariants.successGlow` - Success pulse
- `agenticVariants.spatialSlide` - Panel transitions
- `agenticVariants.typing` - Text appearance
- `agenticVariants.progressParticles` - Activity particles

## Accessibility

All components respect `prefers-reduced-motion` and provide static fallbacks when motion is disabled.

## Brand Integration

Uses Marketing Co-Pilot brand colors:
- Primary Blue (`#0066FF`) for thinking/processing
- Accent Orange (`#FF7A00`) for active states
- Success Green (`#16A34A`) for completion

## Performance

- Uses Framer Motion for hardware-accelerated animations
- Optimized for 60fps performance
- Respects user motion preferences
- Minimal re-renders with proper React hooks


