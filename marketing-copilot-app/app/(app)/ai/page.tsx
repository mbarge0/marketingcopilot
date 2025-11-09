'use client';

import { useState } from 'react';
import { AIContextProvider } from '@/lib/ai/context';
import AIPanel from '@/components/ui/ai-panel/AIPanel';
import AIWorkspace from '@/components/ai/AIWorkspace';

export default function AIWorkspacePage() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (isFullScreen) {
    return (
      <AIContextProvider>
        <div className="fixed inset-0 z-50 bg-white">
          <AIPanel 
            fullScreen={true} 
            onToggleFullScreen={toggleFullScreen}
          />
        </div>
      </AIContextProvider>
    );
  }

  return (
    <AIContextProvider>
      <div className="flex h-screen bg-gray-50 relative">
        {/* Main Workspace Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isPanelOpen ? 'mr-96' : 'mr-0'}`}>
          <div className="flex-1 overflow-y-auto">
            <AIWorkspace />
          </div>
        </div>

        {/* Right Side AI Panel */}
        {isPanelOpen && (
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-gray-200 z-30 shadow-lg">
            <AIPanel 
              fullScreen={false}
              onToggleFullScreen={toggleFullScreen}
            />
          </div>
        )}

        {/* Panel Toggle Button (when closed) */}
        {!isPanelOpen && (
          <button
            onClick={togglePanel}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-30 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors"
            title="Open AI Panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </AIContextProvider>
  );
}
