# Right Sidebar Customization Guide

Quick reference for customizing the RightAIChatPanel component.

## Common Customizations

### 1. Change Sidebar Width

**Desktop Width:**
```tsx
// In RightAIChatPanel.tsx, line ~174
className={`
  ${isMinimized ? 'w-16' : 'w-96'}  // Change w-96 to w-80 or w-[450px]
`}

// Also update margin in AILayoutWrapper.tsx, line ~21
className={`
  ${isChatOpen ? 'lg:mr-96' : 'mr-0'}  // Match the width
`}
```

**Responsive Widths:**
```tsx
// Line ~180-182
lg:w-96    // Desktop: 384px
md:w-80    // Tablet: 320px
sm:w-full  // Mobile: Full width
```

### 2. Change Brand Colors

**Header Gradient:**
```tsx
// Line ~187
className="bg-gradient-to-r from-blue-50 to-blue-100"
// Options: from-purple-50 to-purple-100, from-indigo-50 to-indigo-100
```

**User Messages:**
```tsx
// Line ~275
msg.role === 'user'
  ? 'bg-blue-600 text-white'  // Change to bg-purple-600, bg-indigo-600, etc.
  : 'bg-gray-100 text-gray-900'
```

### 3. Change Minimize Behavior

**Default State:**
```tsx
// Line ~55
const [isMinimized, setIsMinimized] = useState(false);
// Change to true to start minimized
```

**Auto-minimize on Mobile:**
```tsx
// Add after line ~74
useEffect(() => {
  if (isMobile) {
    setIsMinimized(true);
  }
}, [isMobile]);
```

### 4. Adjust Z-Index

**Panel Position:**
```tsx
// Line ~177
flex flex-col z-30  // Change to z-40 or z-20
```

**Backdrop:**
```tsx
// Line ~165
className="fixed inset-0 bg-black/50 z-20"  // Must be less than panel
```

### 5. Change Animation Speed

**Transition Duration:**
```tsx
// Line ~177
transition-all duration-300  // Change to duration-200 or duration-500
```

**Agent Phase Timing:**
```tsx
// Lines ~89-94
setTimeout(() => setAgentPhase('cognition'), 200)      // Faster: 100, Slower: 400
setTimeout(() => setAgentActivity('analyzing'), 500)   // Faster: 300, Slower: 800
```

### 6. Customize Welcome Message

```tsx
// Lines ~286-296
<h3 className="text-sm font-semibold text-gray-900 mb-2">
  Your Custom Title Here
</h3>
<p className="text-xs text-gray-500 mb-4">
  Your custom welcome message here.
</p>
```

### 7. Add Custom Actions

**Header Actions:**
```tsx
// After line ~210
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleCustomAction()}
  className="h-8 w-8 p-0"
>
  <YourIcon className="w-4 h-4" />
</Button>
```

**Message Actions:**
```tsx
// In message mapping, after line ~284
<div className="flex gap-2 mt-1">
  <button className="text-xs text-gray-500 hover:text-blue-600">
    Copy
  </button>
  <button className="text-xs text-gray-500 hover:text-blue-600">
    Regenerate
  </button>
</div>
```

### 8. Change Mobile Breakpoint

```tsx
// Line ~68
setIsMobile(window.innerWidth < 768);  // Change 768 to 1024 (lg) or 640 (sm)
```

### 9. Add Keyboard Shortcuts

```tsx
// Add new useEffect
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K to toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsMinimized(!isMinimized);
    }
    
    // Escape to minimize
    if (e.key === 'Escape' && !isMinimized) {
      setIsMinimized(true);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isMinimized]);
```

### 10. Persist State in LocalStorage

```tsx
// Add after line ~55
const [isMinimized, setIsMinimized] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aiChatMinimized');
    return saved ? JSON.parse(saved) : false;
  }
  return false;
});

// Add useEffect to save
useEffect(() => {
  localStorage.setItem('aiChatMinimized', JSON.stringify(isMinimized));
}, [isMinimized]);
```

## Quick Style Reference

### Tailwind Classes Used

**Layout:**
- `fixed right-0 top-0 bottom-0` - Fixed positioning
- `w-96` = 384px
- `w-80` = 320px
- `w-16` = 64px

**Colors:**
- `bg-blue-600` - Primary blue
- `bg-blue-50` - Light blue background
- `text-gray-900` - Dark text
- `text-gray-500` - Muted text
- `border-gray-200` - Light borders

**Spacing:**
- `p-4` = 16px padding
- `gap-2` = 8px gap
- `mr-96` = 384px right margin

**Animations:**
- `transition-all duration-300` - Smooth transitions
- `ease-in-out` - Easing function

## Component Props

```tsx
interface RightAIChatPanelProps {
  context?: string;      // Optional context override
  mode?: string;         // Optional AI mode
  isOpen?: boolean;      // Show/hide panel (default: true)
  onClose?: () => void;  // Close callback for mobile
}
```

## Integration Points

### To Add to Another Layout:

```tsx
import RightAIChatPanel from '@/components/ai/RightAIChatPanel';

<div className="flex flex-1 overflow-hidden">
  <main className="flex-1 overflow-y-auto mr-96">
    {children}
  </main>
  <RightAIChatPanel />
</div>
```

### To Disable on Specific Pages:

```tsx
// In AILayoutWrapper.tsx
const isSettingsPage = pathname?.startsWith('/settings');

if (isAIMode || (isDashboardMode && !isSettingsPage)) {
  // Show sidebar
}
```

## Troubleshooting

### Sidebar overlaps content
- Ensure main content has appropriate `mr-96` (or matching width)
- Check z-index values (sidebar should be higher than content)

### Animations laggy
- Reduce transition duration: `duration-200` instead of `duration-300`
- Disable animations on mobile: Add conditional class

### Mobile backdrop not working
- Check z-index: backdrop should be `z-20`, panel `z-30`
- Verify `isMobile` state is updating correctly

### Suggestions not showing
- Check that `chatSuggestions.ts` has context defined
- Verify `getChatContext()` returns valid context
- Ensure suggestions array is not empty

## Performance Tips

1. **Lazy load messages**: Only render visible messages if history is long
2. **Debounce resize**: Debounce the resize listener for better performance
3. **Optimize re-renders**: Use `React.memo()` for message components
4. **Virtual scrolling**: Use `react-window` if message count exceeds 100

## Accessibility

- Panel has proper focus management
- Keyboard navigation works (Tab, Enter)
- Screen reader friendly (add aria-labels)
- Respects `prefers-reduced-motion` (via Framer Motion)

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile Safari: ✅ Full support (with backdrop)
- IE11: ❌ Not supported (uses modern CSS)

