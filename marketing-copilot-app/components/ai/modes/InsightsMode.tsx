'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InsightsMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your AI-Detected Insights</h1>
        <div className="flex items-center gap-2">
          <p className="text-gray-600 text-sm">Updated 2 minutes ago</p>
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-gray-500">Live data</span>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">CRITICAL (2)</h2>
        </div>
        <ContentCard
          title="🔴 Campaign 'Winter Sale' overspent by $843"
          variant="mixed"
          expandable
          actions={[
            { label: 'Pause Now', onClick: () => {} },
            { label: 'Adjust Budget', onClick: () => {} },
            { label: 'Investigate →', onClick: () => {} },
          ]}
        >
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                $1,343 / $500 daily budget <span className="text-red-600">(268% over)</span>
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-red-600" style={{ width: '100%' }}></div>
              </div>
              {/* Mini chart placeholder */}
              <div className="h-16 bg-gray-100 rounded mt-2 flex items-center justify-center">
                <p className="text-xs text-gray-500">[Mini area chart: spend ramping up]</p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">💡 AI Recommendation</p>
              <p className="text-sm text-blue-800">
                Pause immediately to prevent further overspend, or increase budget to $1,500/day.
              </p>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* Opportunities */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">OPPORTUNITIES (5)</h2>
        </div>
        <ContentCard
          title="🟡 Campaign 'Holiday' CPA dropped 23%"
          variant="mixed"
          expandable
          actions={[
            { label: 'Apply', onClick: () => {} },
            { label: 'Analyze deeper', onClick: () => {} },
            { label: 'Dismiss', onClick: () => {} },
          ]}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">7-day avg: $58 → Today: $45</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">$58</span>
                  <span className="text-gray-400">━━━━━━━━━━━━━━━━</span>
                  <span className="text-lg font-semibold text-green-600">$45</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">z-score: -2.3 (significant drop)</p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">💡 AI Recommendation</p>
              <p className="text-sm text-blue-800 mb-2">
                Increase budget by $100/day. Projected revenue: +$1,200/week
              </p>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* Wins */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">WINS (3)</h2>
        </div>
        <ContentCard
          title="🟢 Campaign 'Spring Sale' ROAS up 47%"
          variant="mixed"
          expandable
        >
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">From 3.2x → 4.7x in last 7 days</p>
              <div className="h-12 bg-gray-100 rounded mt-2 flex items-center justify-center">
                <p className="text-xs text-gray-500">[Mini sparkline chart ↗️]</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600 mb-1">Ad Group 'Mobile Users'</p>
                <p className="text-sm font-medium text-green-600">CPA ↓ 18%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Keyword 'winter jackets'</p>
                <p className="text-sm font-medium text-green-600">Conversion ↑ 32%</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
              Show 2 more wins ↓
            </button>
          </div>
        </ContentCard>
      </div>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>TODO:</strong> Connect to Supabase insights table, add real-time updates, implement action buttons
        </p>
      </div>
    </div>
  );
}

