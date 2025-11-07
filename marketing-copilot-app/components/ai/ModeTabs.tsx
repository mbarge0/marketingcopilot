'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AI_MODES, MORE_MODES, AIModeKey } from '@/lib/ai/aiModes';
import { useAIContext } from '@/lib/ai/context';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModeTabsProps {
  currentMode: AIModeKey;
}

export default function ModeTabs({ currentMode }: ModeTabsProps) {
  const router = useRouter();
  const { setCurrentMode } = useAIContext();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleModeChange = (mode: AIModeKey) => {
    setCurrentMode(mode);
    router.push(`/ai?mode=${mode}`, { scroll: false });
    setMoreOpen(false);
  };

  // Check if current mode is from "More" dropdown
  const isMoreMode = MORE_MODES.some(m => m.key === currentMode);
  const currentMoreMode = MORE_MODES.find(m => m.key === currentMode);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-1 px-4 overflow-x-auto">
        {AI_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.key;

          return (
            <button
              key={mode.key}
              onClick={() => handleModeChange(mode.key)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative
                ${isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-label={`Switch to ${mode.label} mode`}
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
        
        {/* More Dropdown */}
        <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative
                ${isMoreMode 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <span>More</span>
              <ChevronDown className="w-4 h-4" />
              {isMoreMode && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {MORE_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentMode === mode.key;

              return (
                <DropdownMenuItem
                  key={mode.key}
                  onClick={() => handleModeChange(mode.key)}
                  className={`
                    flex items-center gap-2 cursor-pointer
                    ${isActive ? 'bg-blue-50 text-blue-600' : ''}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                  {isActive && <span className="ml-auto text-xs">●</span>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

