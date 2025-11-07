'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { RefreshCw } from 'lucide-react';

export default function RefreshMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Refresh</h1>
        <p className="text-gray-600 text-sm">Update stale creative</p>
      </div>

      <ContentCard
        title="Stale Creative Detection"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Ads that need refreshing:</p>
          <div className="space-y-2">
            <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Campaign A - Ad 1</span>
                <span className="text-yellow-600 text-sm">45 days old</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">CTR declining, recommend refresh</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Refresh Recommendations"
        variant="table"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Recommended actions:</p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium">Update headlines</p>
              <p className="text-xs text-gray-500 mt-1">Current headlines are underperforming</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Update Queue"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Pending updates:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Campaign A - Ad 1 (scheduled)</li>
            <li className="text-sm text-gray-700">• Campaign B - Ad 2 (pending review)</li>
          </ul>
        </div>
      </ContentCard>
    </div>
  );
}

