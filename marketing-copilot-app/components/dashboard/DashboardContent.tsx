'use client';

import { useState } from 'react';
import CampaignTable from '@/components/dashboard/CampaignTable';
import InsightsMode from '@/components/dashboard/InsightsMode';
import CreateMode from '@/components/dashboard/CreateMode';
import LeftNavigation from '@/components/dashboard/LeftNavigation';
import ChatBox from '@/components/dashboard/ChatBox';
import { Button } from '@/components/ui/button';

type DashboardMode = 'table' | 'insights' | 'create';

export default function DashboardContent() {
  const [mode, setMode] = useState<DashboardMode>('table');
  const [connected, setConnected] = useState(false);

  const handleConnectGoogleAds = async () => {
    try {
      const response = await fetch('/api/auth/google/initiate');
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate Google Ads connection');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect Google Ads account');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNavigation />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMode('table')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setMode('insights')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'insights'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => setMode('create')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'create'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Create
                </button>
              </div>
              {!connected && (
                <Button onClick={handleConnectGoogleAds}>
                  Connect Google Ads
                </Button>
              )}
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto pb-24">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {mode === 'table' && <CampaignTable />}
            {mode === 'insights' && <InsightsMode />}
            {mode === 'create' && <CreateMode />}
          </div>
        </main>
        <ChatBox />
      </div>
    </div>
  );
}

