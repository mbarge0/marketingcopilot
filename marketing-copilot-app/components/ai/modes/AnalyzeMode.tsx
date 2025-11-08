'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { BarChart3 } from 'lucide-react';

export default function AnalyzeMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analyze</h1>
        <p className="text-gray-600">Deep dive into performance metrics and trends</p>
      </div>

      {/* Performance Overview */}
      <ContentCard
        title="Performance Overview - Top 5 Campaigns"
        variant="table"
        expandable
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Campaign</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Spend</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">ROAS</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="py-2 px-3">Winter Sale</td>
                <td className="py-2 px-3">$1,247</td>
                <td className="py-2 px-3">4.2x</td>
                <td className="py-2 px-3 text-green-600">↑ +12%</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="py-2 px-3">Holiday Promo</td>
                <td className="py-2 px-3">$983</td>
                <td className="py-2 px-3">3.8x</td>
                <td className="py-2 px-3 text-red-600">↓ -5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentCard>

      {/* Anomalies Detected */}
      <ContentCard
        title="Anomalies Detected"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-red-900">Campaign "Holiday Promo" CPA spiked 34%</p>
              <p className="text-sm text-red-700 mt-1">Detected 2 hours ago</p>
            </div>
          </div>
          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">Line chart showing spike (placeholder)</p>
          </div>
        </div>
      </ContentCard>

      {/* Quick Comparisons */}
      <ContentCard
        title="Quick Comparisons - This Week vs Last Week"
        variant="chart"
      >
        <div className="space-y-4">
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Side-by-side bar charts (placeholder)</p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-600">Spend: </span>
              <span className="text-green-600 font-medium">↑8%</span>
            </div>
            <div>
              <span className="text-gray-600">ROAS: </span>
              <span className="text-green-600 font-medium">↑3%</span>
            </div>
            <div>
              <span className="text-gray-600">CPA: </span>
              <span className="text-green-600 font-medium">↓2%</span>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>TODO:</strong> Connect to Supabase campaign_performance table, add date range picker, implement campaign selector, add drill-down interactions
        </p>
      </div>
    </div>
  );
}


