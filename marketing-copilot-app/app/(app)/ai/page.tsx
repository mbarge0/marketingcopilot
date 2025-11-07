'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AI_MODES, MORE_MODES, DEFAULT_MODE, AIModeKey } from '@/lib/ai/aiModes';
import { AIContextProvider } from '@/lib/ai/context';
import ModeTabs from '@/components/ai/ModeTabs';
import ModeCanvas from '@/components/ai/ModeCanvas';
import ChatBar from '@/components/ai/shared/ChatBar';

export default function AIWorkspacePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get('mode') as AIModeKey | null;
  
  // Check if mode is valid (either in AI_MODES or MORE_MODES)
  const isValidMode = modeParam && (
    AI_MODES.find((m) => m.key === modeParam) || 
    MORE_MODES.find((m) => m.key === modeParam)
  );
  
  const currentMode = isValidMode ? modeParam : DEFAULT_MODE;

  // Update URL if mode doesn't match
  useEffect(() => {
    if (!modeParam || modeParam !== currentMode) {
      router.replace(`/ai?mode=${currentMode}`, { scroll: false });
    }
  }, [modeParam, currentMode, router]);

  return (
    <AIContextProvider>
      <div className="flex flex-col h-full bg-gray-50 relative">
        {/* Top Tabs */}
        <ModeTabs currentMode={currentMode} />

        {/* Main Canvas Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-32">
          <ModeCanvas mode={currentMode} />
        </div>

        {/* Bottom Chat Bar - Fixed */}
        <div className="fixed bottom-0 left-[320px] right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
          <ChatBar mode={currentMode} />
        </div>
      </div>
    </AIContextProvider>
  );
}
