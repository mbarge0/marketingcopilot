'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { TrendingUp } from 'lucide-react';

export default function OptimizeMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Optimize</h1>
        <p className="text-gray-600 text-sm">Improve bids, budgets, targeting, creative</p>
      </div>

      <ContentCard
        title="Optimization Opportunities"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Top opportunities for improvement:</p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-medium">Bid adjustments</span>
                <span className="text-green-600">+15% potential</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">3 campaigns with suboptimal bids</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Bid Recommendations"
        variant="table"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Recommended bid changes:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">Campaign</th>
                  <th className="text-left py-2 px-3">Current</th>
                  <th className="text-left py-2 px-3">Recommended</th>
                  <th className="text-left py-2 px-3">Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3">Campaign A</td>
                  <td className="py-2 px-3">$2.50</td>
                  <td className="py-2 px-3 text-green-600">$2.75</td>
                  <td className="py-2 px-3">+12% conversions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="A/B Test Results"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Active A/B tests and results:</p>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">No active A/B tests</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}

