'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AIPanel from '@/components/ui/ai-panel/AIPanel';
import DashboardChatBar from '@/components/shared/DashboardChatBar';

export default function AILayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAIMode = pathname?.startsWith('/ai');
  const isDashboardMode = pathname?.startsWith('/dashboard') || pathname === '/dashboard';
  const [fullScreen, setFullScreen] = useState(false);

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <AIPanel fullScreen={true} onToggleFullScreen={() => setFullScreen(false)} />
      </div>
    );
  }

  if (isAIMode) {
    // Remove right panel - use full width for AI workspace
    return (
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    );
  }

  // Dashboard mode - add chat bar at bottom
  if (isDashboardMode) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-32">
          {children}
        </main>
        {/* Fixed chat bar at bottom */}
        <div className="fixed bottom-0 left-[320px] right-0 z-20">
          <DashboardChatBar />
        </div>
      </div>
    );
  }

  return <main className="flex-1 overflow-y-auto">{children}</main>;
}

