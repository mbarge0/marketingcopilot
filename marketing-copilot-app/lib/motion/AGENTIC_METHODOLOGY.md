# Agentic Animation Methodology
## "Motion as Momentum"

**Objective:** Create the illusion of intelligent momentum — the agent appears to be thinking, acting, and progressing rapidly on behalf of the marketer.

---

## Core Principles

### 🧠 Perceived Intelligence
- Use motion to show reasoning steps, not just UI transitions
- Example: When analyzing data, show animated nodes expanding, connections lighting up, or text "typing" itself out
- The user should feel the system is **thinking**, not waiting

### ⚙️ Momentum & Flow
- Keep the agent visually in motion — subtle pulses, data movement, or shimmering indicators
- Progress bars are not enough — use micro-pulses or staged task indicators ("Analyzing → Generating → Optimizing")
- Never go static during processing — even idle states should have light breathing animations

### 🪄 Delight Through Subtlety
- Use micro-motion (hover effects, button shifts, panel slides) to reinforce fluidity
- Keep transitions at 150–300ms for perceived responsiveness
- Avoid gratuitous effects — movement should imply intentional action, not decoration

### 📈 Cause and Effect
- Every user action should produce a visible, immediate system reaction
- Clicking "Generate" should:
  - Animate a quick "thinking" pulse or loading wave
  - Transition to a result that snaps into place with a small bounce or glow — signaling completion

### 🌐 Spatial Continuity
- The user should always see where the agent came from and where it's going
- For multi-panel flows, animate elements sliding or morphing instead of hard cuts — the AI's "thought" moves spatially across panels

---

## Animation Typologies

| Animation Type | Purpose | Example Use |
|---------------|---------|-------------|
| **Micro-interaction** | Reinforce interactivity | Hover, click, toggle, progress icons |
| **State transition** | Indicate flow from one mode to another | AI panel entering fullscreen, switching between Analyze → Plan → Create |
| **System feedback** | Show agent work or processing | Animated "typing", gradient waves, spinning icons with data points |
| **Attention guiding** | Direct focus | Brief highlight glow or slide-in on new content |
| **Personality cue** | Give agent character | Subtle bounce when responding, "wave" motion when waiting for input |

---

## Stage Design for Agent Workflows

### Phase 1: Initiation
**Triggered when:** The marketer prompts the AI

**Visual cues:**
- Cursor pulse or agent avatar "awakens"
- Text field contracts slightly (like focus is shifting inward)
- Background lightens or gradients subtly shift toward the agent color palette

**Implementation:**
```tsx
<AgentThinking phase="initiation" />
```

### Phase 2: Cognition / Processing
**Triggered when:** System shows active "thought"

**Visuals:**
- Progress particles or waveform animations in the right panel
- Key words or tags animate sequentially ("analyzing data… extracting insights…")
- Elements slightly oscillate to simulate real-time reasoning

**Implementation:**
```tsx
<AgentThinking 
  phase="cognition" 
  activity="analyzing"
  showWaveform={true}
/>
```

### Phase 3: Action
**Triggered when:** AI executes visible operations — populating a table, generating ad copy, optimizing budgets

**Transitions:**
- Animate new data sliding upward or assembling from fragments
- Use timing (100–200ms staggered entries) to simulate decision flow

**Implementation:**
```tsx
<AgentThinking 
  phase="acting" 
  activity="generating"
  activitySequence={['analyzing', 'generating', 'optimizing']}
  currentStep={1}
  showProgress={true}
/>
```

### Phase 4: Resolution
**Triggered when:** Deliver results with finality and confidence

**Visuals:**
- Smooth fade-in of results, with completion tone (e.g. blue accent or glow)
- Brief confetti pulse for major wins (e.g., "Campaign optimized — +23% CTR")

**Implementation:**
```tsx
<AgentThinking phase="resolving" />
```

---

## Application Contexts

| Context | Animation Focus | Goal |
|---------|----------------|------|
| **Dashboard** | Subtle refresh animations, card fade-ins | Make data feel live |
| **AI Workspace** | Agent presence, typing, reasoning | Show autonomy and intelligence |
| **Campaign Builder** | Guided step transitions | Reinforce progress and flow |
| **Ad Asset Preview** | Carousel-like motion | Evoke creativity and polish |
| **Reporting Mode** | Smooth chart updates | Make analytics feel dynamic |

---

## Implementation Architecture

### File Structure
```
lib/motion/
├── agentic.ts              # Core agentic animation system
├── motion.config.ts        # Base motion configuration
└── hooks.ts                # React hooks for motion

components/agentic/
├── AgentStatus.tsx         # Status subtitles ("Planning next moves...")
├── AgentWaveform.tsx       # Processing waveform animation
├── AgentProgress.tsx       # Staged progress ("Analyzing → Generating")
├── AgentThinking.tsx       # Comprehensive thinking indicator
└── index.ts                # Exports
```

### Usage Pattern

```tsx
import { AgentThinking, AgentPhase, AgentActivity } from '@/components/agentic'

function MyComponent() {
  const [phase, setPhase] = useState<AgentPhase>('idle')
  const [activity, setActivity] = useState<AgentActivity>('planning')

  const handleUserAction = async () => {
    // Phase 1: Initiation
    setPhase('initiation')
    
    // Phase 2: Cognition
    setTimeout(() => {
      setPhase('cognition')
      setActivity('analyzing')
    }, 200)
    
    // Perform work...
    await performWork()
    
    // Phase 3: Action
    setPhase('acting')
    setActivity('generating')
    
    // Phase 4: Resolution
    setTimeout(() => {
      setPhase('resolving')
    }, 500)
    
    // Complete
    setTimeout(() => {
      setPhase('complete')
      setTimeout(() => setPhase('idle'), 500)
    }, 1000)
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

---

## Status Subtitles & Annotations

The system provides contextual status messages that tell users what the AI is thinking:

- **"Planning next moves..."** - When strategizing
- **"Analyzing campaign performance..."** - When reviewing data
- **"Searching for relevant data..."** - When querying
- **"Generating recommendations..."** - When creating content
- **"Evaluating performance..."** - When assessing results

These rotate automatically to show variety and keep the agent feeling alive.

---

## Brand Integration

All animations use Marketing Co-Pilot brand colors:
- **Primary Blue** (`#0066FF`) - Thinking, processing, intelligence
- **Accent Orange** (`#FF7A00`) - Active states, optimization
- **Success Green** (`#16A34A`) - Completion, positive outcomes

Timing follows Visual Identity Guide specifications:
- Fast transitions: 150ms
- Base transitions: 250ms
- Slow transitions: 400ms
- Celebrations: 1200ms

---

## Accessibility

- All components respect `prefers-reduced-motion`
- Static fallbacks provided when motion is disabled
- Status text always visible regardless of animation state
- Keyboard navigation supported

---

## Performance

- Hardware-accelerated animations via Framer Motion
- Optimized for 60fps performance
- Minimal re-renders with proper React hooks
- Lazy loading of animation variants

