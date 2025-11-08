'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { DollarSign } from 'lucide-react';

export default function AllocateMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Allocate</h1>
        <p className="text-gray-600 text-sm">Budget allocation across campaigns/channels</p>
      </div>

      <ContentCard
        title="Current Allocation"
        variant="mixed"
        expandable
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Total budget: $15,000/month</p>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">[Pie chart: Budget distribution]</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Recommended Changes"
        variant="table"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">AI recommendations for budget reallocation:</p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Campaign A</span>
                <span className="text-green-600">+$500/day</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">High ROAS, recommend increase</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Impact Forecast"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Projected impact of recommended changes:</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">💡 AI Insight</p>
            <p className="text-sm text-blue-800">Reallocating $500/day to Campaign A could increase revenue by ~$2,400/week</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}


