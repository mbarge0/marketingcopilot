# Design System Implementation Guide
## Marketing Co-Pilot - Quick Reference

**Last Updated:** November 6, 2025

---

## 🎨 Color Usage

### Primary Actions
```tsx
// Primary CTA Button
<button className="bg-copilot-primary hover:bg-copilot-primary-hover text-white">
  Connect Account
</button>

// Secondary Action
<button className="border border-copilot-border hover:bg-copilot-hover">
  Cancel
</button>
```

### Semantic States
```tsx
// Success / Growth
<div className="bg-copilot-success-light text-copilot-success">
  ROAS +12% WoW
</div>

// Error / Critical
<div className="bg-copilot-error-light text-copilot-error">
  Budget exceeded
</div>

// Warning / Opportunity
<div className="bg-copilot-warning-light text-copilot-warning">
  Performance opportunity
</div>
```

### Insight Cards
```tsx
// Critical Insight
<div className="copilot-insight-critical p-4 rounded-lg">
  <h3>Budget Alert</h3>
</div>

// Opportunity Insight
<div className="copilot-insight-opportunity p-4 rounded-lg">
  <h3>Optimization Suggestion</h3>
</div>
```

---

## 📝 Typography

### Headings
```tsx
<h1 className="font-heading text-2xl font-semibold text-copilot-text">
  Campaign Dashboard
</h1>

<h2 className="font-heading text-xl font-semibold text-copilot-text">
  Performance Metrics
</h2>
```

### Metrics / Numbers
```tsx
<span className="font-mono text-2xl font-medium text-copilot-text">
  4.2x
</span>

// Or use utility class
<span className="copilot-text-metric text-2xl">
  $1,234.56
</span>
```

### Chat / AI Messages
```tsx
<p className="font-chat text-sm font-light italic text-copilot-text-muted">
  I've analyzed your campaigns and found 3 optimization opportunities...
</p>

// Or use utility class
<p className="copilot-text-chat text-sm">
  AI response text
</p>
```

---

## 🎯 Component Patterns

### Card Component
```tsx
<div className="copilot-card">
  <h3 className="font-heading text-lg font-semibold mb-2">Campaign Overview</h3>
  <p className="text-sm text-copilot-text-muted">Content here</p>
</div>
```

### Table Row
```tsx
<tr className="copilot-table-row">
  <td className="p-3">Campaign Name</td>
  <td className="p-3">
    <span className="copilot-text-metric">4.2x</span>
  </td>
</tr>

// Selected row
<tr className="copilot-table-row-selected">
  {/* content */}
</tr>
```

### Badge / Tag
```tsx
<span className="copilot-badge copilot-badge-success">
  Active
</span>

<span className="copilot-badge copilot-badge-warning">
  Paused
</span>
```

### Input Field
```tsx
<input 
  type="text"
  className="copilot-input w-full"
  placeholder="Enter campaign name"
/>

// Error state
<input 
  type="text"
  className="copilot-input copilot-input-error w-full"
/>
```

---

## 🎨 Gradients

```tsx
// Primary gradient (Blue → Purple)
<div className="bg-gradient-primary text-white p-4 rounded-lg">
  Premium Feature
</div>

// Success gradient
<div className="bg-gradient-success text-white p-4 rounded-lg">
  Campaign Published!
</div>

// Energy gradient (Orange)
<div className="bg-gradient-energy text-white p-4 rounded-lg">
  Performance Alert
</div>

// Subtle background
<div className="bg-gradient-subtle p-4 rounded-lg">
  Content area
</div>
```

---

## 📐 Layout Patterns

### Dashboard Layout
```tsx
<div className="flex h-screen bg-copilot-background">
  {/* Left Sidebar */}
  <aside className="w-copilot-sidebar bg-copilot-surface border-r border-copilot-border">
    {/* Navigation */}
  </aside>
  
  {/* Main Content */}
  <main className="flex-1 max-w-copilot-content mx-auto p-copilot-xl">
    {/* Campaign Table */}
    <div className="copilot-card mb-copilot-lg">
      {/* Table content */}
    </div>
    
    {/* AI Chat */}
    <div className="fixed bottom-0 left-copilot-sidebar right-0 p-copilot-lg">
      {/* Chat component */}
    </div>
  </main>
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-copilot-lg">
  {insights.map(insight => (
    <div key={insight.id} className="copilot-card">
      {/* Insight content */}
    </div>
  ))}
</div>
```

---

## ✨ Motion Integration

Combine design tokens with motion system:

```tsx
import { InsightReveal } from '@/lib/motion'

<div className="grid gap-copilot-lg">
  {insights.map(insight => (
    <InsightReveal 
      key={insight.id}
      priority={insight.priority}
      isVisible={true}
    >
      <div className={`copilot-insight-${insight.priority} copilot-card`}>
        <h3 className="font-heading text-lg font-semibold">
          {insight.title}
        </h3>
        <p className="text-sm text-copilot-text-muted mt-2">
          {insight.message}
        </p>
      </div>
    </InsightReveal>
  ))}
</div>
```

---

## 🎯 Spacing Scale

```tsx
// Use Tailwind spacing with copilot prefix
<div className="p-copilot-md">        // 16px
<div className="p-copilot-lg">        // 24px
<div className="p-copilot-xl">        // 32px
<div className="gap-copilot-lg">      // 24px gap
<div className="mb-copilot-xl">       // 32px margin-bottom
```

---

## 🔤 Font Weights

```tsx
// Light (Chat messages)
<span className="font-light">Text</span>

// Regular (Body)
<span className="font-normal">Text</span>

// Medium (Emphasis)
<span className="font-medium">Text</span>

// Semibold (Headings)
<span className="font-semibold">Text</span>
```

---

## 🎨 Shadow Elevation

```tsx
// Subtle (Cards)
<div className="shadow-md">Content</div>

// Hover elevation
<div className="shadow-md hover:shadow-lg transition-shadow">
  Content
</div>

// Modal elevation
<div className="shadow-xl">Modal</div>
```

---

## 📱 Responsive Patterns

```tsx
// Mobile-first approach
<div className="
  p-copilot-md 
  md:p-copilot-lg 
  lg:p-copilot-xl
">
  Content
</div>

// Grid responsiveness
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-copilot-lg
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## 🎯 Common Patterns

### Metric Display Card
```tsx
<div className="copilot-card">
  <p className="text-sm text-copilot-text-muted mb-1">ROAS</p>
  <p className="copilot-text-metric text-3xl">4.2x</p>
  <p className="text-sm text-copilot-success mt-1">+12% WoW</p>
</div>
```

### Status Badge
```tsx
<span className={`
  copilot-badge
  ${status === 'active' ? 'copilot-badge-success' : ''}
  ${status === 'paused' ? 'copilot-badge-warning' : ''}
`}>
  {status}
</span>
```

### Action Button Group
```tsx
<div className="flex gap-copilot-md">
  <button className="copilot-button-primary">
    Primary Action
  </button>
  <button className="copilot-button-secondary">
    Secondary
  </button>
</div>
```

---

## 🚀 Quick Start Checklist

- [ ] Import design tokens CSS in `globals.css`
- [ ] Configure Tailwind with custom colors
- [ ] Set up font loading (Inter, Satoshi, Space Grotesk)
- [ ] Use copilot-* classes for components
- [ ] Integrate with motion system
- [ ] Test accessibility (contrast ratios)
- [ ] Validate responsive behavior

---

**Full Documentation:** See `/core/docs/foundation/design_system.md` for complete specifications.


