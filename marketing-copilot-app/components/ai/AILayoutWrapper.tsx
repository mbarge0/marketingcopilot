'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import RightAIChatPanel from '@/components/ai/RightAIChatPanel';

export default function AILayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAIMode = pathname?.startsWith('/ai');
  const isDashboardMode = pathname?.startsWith('/dashboard') || pathname === '/dashboard';
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  // Listen for sidebar minimize state changes (via custom event)
  useEffect(() => {
    const handleSidebarResize = (e: CustomEvent) => {
      setIsChatMinimized(e.detail.isMinimized);
    };

    window.addEventListener('sidebar-resize' as any, handleSidebarResize);
    return () => window.removeEventListener('sidebar-resize' as any, handleSidebarResize);
  }, []);

  // Both AI mode and Dashboard mode now use the right sidebar
  if (isAIMode || isDashboardMode) {
    return (
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area - adjust margin for right sidebar (always present) */}
        <main 
          className={`
            flex-1 overflow-y-auto transition-all duration-300 ease-in-out
            ${!isChatMinimized ? 'lg:mr-96 md:mr-80 sm:mr-0' : 'mr-16'}
          `}
        >
          {children}
        </main>
        
        {/* Right AI Chat Panel - Always rendered */}
        <RightAIChatPanel />
      </div>
    );
  }

  return <main className="flex-1 overflow-y-auto">{children}</main>;
}

