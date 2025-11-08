'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Monitor } from 'lucide-react';

export default function MonitorMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Monitor</h1>
        <p className="text-gray-600 text-sm">Check campaign status, spend, performance</p>
      </div>

      <ContentCard
        title="Campaign Status Dashboard"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-gray-600">Paused</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">Today's Spend</p>
              <p className="text-2xl font-bold text-blue-600">$1,247</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Real-time Metrics"
        variant="chart"
        expandable
      >
        <div className="space-y-3">
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">[Real-time performance chart]</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Alerts Feed"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Recent alerts:</p>
          <ul className="space-y-2">
            <li className="text-sm text-red-600">• Campaign A overspent budget (2 min ago)</li>
            <li className="text-sm text-yellow-600">• Campaign B CPA increased 15% (10 min ago)</li>
          </ul>
        </div>
      </ContentCard>
    </div>
  );
}


