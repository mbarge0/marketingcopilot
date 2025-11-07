'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Search } from 'lucide-react';

export default function ResearchMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Research</h1>
        <p className="text-gray-600 text-sm">Keyword opportunities, competitor intelligence, and audience insights</p>
      </div>

      {/* Keyword Opportunities */}
      <ContentCard
        title="🔍 Keyword Opportunities"
        variant="table"
        expandable
        onExploreMore={() => console.log('Explore more keywords')}
        actions={[
          { label: 'Add to campaign', onClick: () => {} },
          { label: 'Export CSV', onClick: () => {} },
        ]}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Top 5 of 152 keywords in your industry:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Keyword</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Vol</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">CPC</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Comp</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                  <td className="py-2 px-3 font-medium">winter jackets</td>
                  <td className="py-2 px-3">45K/mo</td>
                  <td className="py-2 px-3">$2.34</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-green-600">↗️ +12%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                  <td className="py-2 px-3 font-medium">warm coats</td>
                  <td className="py-2 px-3">32K/mo</td>
                  <td className="py-2 px-3">$1.89</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-green-600">↗️ +8%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                  <td className="py-2 px-3 font-medium">thermal jackets</td>
                  <td className="py-2 px-3">28K/mo</td>
                  <td className="py-2 px-3">$2.01</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500">→ 0%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                  <td className="py-2 px-3 font-medium">ski jackets</td>
                  <td className="py-2 px-3">22K/mo</td>
                  <td className="py-2 px-3">$2.89</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-red-600">↘️ -5%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                  <td className="py-2 px-3 font-medium">insulated coats</td>
                  <td className="py-2 px-3">18K/mo</td>
                  <td className="py-2 px-3">$1.67</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-green-600">↗️ +15%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">💡 AI Insight</p>
            <p className="text-sm text-blue-800">
              "thermal jackets" has low competition + rising trend. Consider adding to your campaign.
            </p>
          </div>
          <p className="text-sm text-gray-600 text-center">+ 147 more keywords available</p>
        </div>
      </ContentCard>

      {/* Competitor Intelligence */}
      <ContentCard
        title="Competitor Intelligence"
        variant="chart"
        expandable
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Your top competitors:</p>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
            <p className="text-gray-500 text-sm">[Chart showing spend trends]</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Competitor A</span>
              <span className="text-red-600 font-medium">↑ 23% this month</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Competitor B</span>
              <span className="text-green-600 font-medium">↓ 12% this month</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-700">Your brand</span>
              <span className="text-green-600 font-medium">↑ 8% this month</span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">💡 AI Insight</p>
            <p className="text-sm text-blue-800">
              Competitor A is increasing mobile ad spend significantly. Consider matching their strategy.
            </p>
          </div>
        </div>
      </ContentCard>

      {/* Audience Insights */}
      <ContentCard
        title="Audience Insights"
        variant="list"
        expandable
        onExploreMore={() => console.log('Explore all segments')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Your best-performing audiences:</p>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">Women 25-34</p>
                  <p className="text-xs text-gray-500 mt-0.5">Top interests: Fashion, Travel</p>
                </div>
                <span className="text-lg font-bold text-green-600">4.8x ROAS</span>
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">Men 35-44</p>
                  <p className="text-xs text-gray-500 mt-0.5">Top interests: Tech, Sports</p>
                </div>
                <span className="text-lg font-bold text-green-600">3.2x ROAS</span>
              </div>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>TODO:</strong> Connect to Google Ads Keyword Planner API, add competitor analysis, implement drill-down interactions
        </p>
      </div>
    </div>
  );
}

