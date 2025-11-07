'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Stethoscope } from 'lucide-react';

export default function DiagnoseMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Diagnose</h1>
        <p className="text-gray-600 text-sm">Find root cause of performance issues</p>
      </div>

      <ContentCard
        title="Issue Detection"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Detected issues:</p>
          <div className="space-y-2">
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-900">CPA Spike</span>
                <span className="text-red-600 text-sm">Campaign A</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">CPA increased 34% in last 7 days</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Root Cause Analysis"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Analysis:</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">💡 AI Diagnosis</p>
            <p className="text-sm text-blue-800">CPA spike likely caused by increased competition on primary keywords. Recommend bid adjustment or keyword expansion.</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Fix Recommendations"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Recommended actions:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Reduce bids on high-competition keywords</li>
            <li className="text-sm text-gray-700">• Add negative keywords to filter irrelevant traffic</li>
            <li className="text-sm text-gray-700">• Expand keyword list to capture lower-competition terms</li>
          </ul>
        </div>
      </ContentCard>
    </div>
  );
}

