'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AIPanel from '@/components/ui/ai-panel/AIPanel';

export default function AILayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAIMode = pathname?.startsWith('/ai');
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

  return <main className="flex-1 overflow-y-auto">{children}</main>;
}

