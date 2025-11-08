'use client'

/**
 * Mode Tabs Component with "More" Dropdown
 * Primary tabs: Table, Insights, Analyze, Create
 * More dropdown: Research, Plan, Report
 */

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Table2, 
  Lightbulb, 
  BarChart3, 
  Sparkles, 
  Search, 
  Calendar, 
  FileText,
  ChevronDown 
} from 'lucide-react'

export type ModeTab = 'table' | 'insights' | 'analyze' | 'create' | 'research' | 'plan' | 'report'

interface ModeTabsProps {
  currentMode: ModeTab
  onModeChange?: (mode: ModeTab) => void
  /**
   * Whether this is for Dashboard (entity views) or AI Workspace (verb views)
   */
  variant?: 'dashboard' | 'ai-workspace'
}

const PRIMARY_TABS: Array<{ key: ModeTab; label: string; icon: React.ReactNode }> = [
  { key: 'table', label: 'Table', icon: <Table2 className="w-4 h-4" /> },
  { key: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
  { key: 'analyze', label: 'Analyze', icon: <BarChart3 className="w-4 h-4" /> },
  { key: 'create', label: 'Create', icon: <Sparkles className="w-4 h-4" /> },
]

const MORE_TABS: Array<{ key: ModeTab; label: string; icon: React.ReactNode; description: string }> = [
  { 
    key: 'research', 
    label: 'Research', 
    icon: <Search className="w-4 h-4" />,
    description: 'Keyword & competitor intelligence'
  },
  { 
    key: 'plan', 
    label: 'Plan', 
    icon: <Calendar className="w-4 h-4" />,
    description: 'Budget planning & timelines'
  },
  { 
    key: 'report', 
    label: 'Report', 
    icon: <FileText className="w-4 h-4" />,
    description: 'Generate performance reports'
  },
]

export default function ModeTabs({ currentMode, onModeChange, variant = 'dashboard' }: ModeTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false)
      }
    }

    if (showMore) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMore])

  const handleModeClick = (mode: ModeTab) => {
    setShowMore(false)
    
    if (onModeChange) {
      onModeChange(mode)
    } else {
      // Default behavior: navigate based on variant
      if (variant === 'ai-workspace') {
        router.push(`/ai?mode=${mode}`)
      } else {
        // Dashboard mode switching (update URL or state)
        router.push(`/dashboard?mode=${mode}`)
      }
    }
  }

  const isMoreTabActive = MORE_TABS.some(tab => tab.key === currentMode)

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-1">
          {/* Primary Tabs */}
          {PRIMARY_TABS.map((tab) => {
            const isActive = currentMode === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => handleModeClick(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setShowMore(!showMore)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isMoreTabActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              More
              <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showMore && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {MORE_TABS.map((tab) => {
                  const isActive = currentMode === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleModeClick(tab.key)}
                      className={`
                        w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors
                        ${isActive ? 'bg-blue-50' : ''}
                      `}
                    >
                      <div className={`mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {tab.icon}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                          {tab.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Indicator Line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: 'calc(100% / 4)', // Approximate width for primary tabs
                transform: `translateX(${PRIMARY_TABS.findIndex(t => t.key === currentMode) * 100}%)`,
                display: isMoreTabActive ? 'none' : 'block',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


