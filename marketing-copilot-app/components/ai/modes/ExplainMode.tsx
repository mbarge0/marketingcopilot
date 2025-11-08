'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { HelpCircle } from 'lucide-react';

export default function ExplainMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Explain</h1>
        <p className="text-gray-600 text-sm">Interpret results for non-technical stakeholders</p>
      </div>

      <ContentCard
        title="Plain Language Explanations"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Recent explanations:</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">ROAS Explained</p>
            <p className="text-sm text-blue-800">ROAS (Return on Ad Spend) shows how much revenue you earn for every dollar spent on ads. A ROAS of 4.2x means you're earning $4.20 for every $1 spent.</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Visual Summaries"
        variant="chart"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Visual explanations:</p>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">[Visual summary chart]</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Key Takeaways"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Summary points:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Campaign performance is strong this month</li>
            <li className="text-sm text-gray-700">• Budget allocation is optimal</li>
            <li className="text-sm text-gray-700">• Opportunity to scale top performers</li>
          </ul>
        </div>
      </ContentCard>
    </div>
  );
}


