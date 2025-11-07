'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { TrendingDown } from 'lucide-react';

export default function ForecastMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forecast</h1>
        <p className="text-gray-600 text-sm">Predict future performance, budget needs</p>
      </div>

      <ContentCard
        title="Performance Forecast"
        variant="chart"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Next 30 days projection:</p>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">[Forecast chart]</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Budget Projections"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">Projected Spend</p>
              <p className="text-2xl font-bold text-blue-600">$18,500</p>
              <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">Projected Revenue</p>
              <p className="text-2xl font-bold text-green-600">$77,700</p>
              <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Trend Predictions"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Key trends:</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">💡 AI Forecast</p>
            <p className="text-sm text-blue-800">Based on current trends, ROAS is expected to increase 8% over the next month</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}

