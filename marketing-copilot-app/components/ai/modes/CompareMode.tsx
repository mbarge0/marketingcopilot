'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { GitCompare } from 'lucide-react';

export default function CompareMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare</h1>
        <p className="text-gray-600 text-sm">Campaigns vs each other, periods vs periods, actual vs target</p>
      </div>

      <ContentCard
        title="Comparison Selector"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Select items to compare:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <p className="font-medium text-sm">Campaign A</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <p className="font-medium text-sm">Campaign B</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Side-by-Side Metrics"
        variant="table"
        expandable
      >
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">Metric</th>
                  <th className="text-left py-2 px-3">Campaign A</th>
                  <th className="text-left py-2 px-3">Campaign B</th>
                  <th className="text-left py-2 px-3">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3">ROAS</td>
                  <td className="py-2 px-3">4.2x</td>
                  <td className="py-2 px-3">3.8x</td>
                  <td className="py-2 px-3 text-green-600">+10.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Trend Analysis"
        variant="chart"
        expandable
      >
        <div className="space-y-3">
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">[Comparison chart]</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}

