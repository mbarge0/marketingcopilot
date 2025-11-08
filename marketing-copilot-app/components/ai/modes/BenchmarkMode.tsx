'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Target } from 'lucide-react';

export default function BenchmarkMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Benchmark</h1>
        <p className="text-gray-600 text-sm">Compare against industry standards, competitors</p>
      </div>

      <ContentCard
        title="Industry Benchmarks"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Your performance vs industry:</p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">ROAS</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">4.2x</span>
                  <span className="text-green-600 text-xs">vs 3.5x avg</span>
                </div>
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">CTR</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">2.8%</span>
                  <span className="text-green-600 text-xs">vs 2.1% avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Competitor Comparison"
        variant="chart"
        expandable
      >
        <div className="space-y-3">
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">[Competitor comparison chart]</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Performance Gaps"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Areas for improvement:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• CPC is 15% above industry average</li>
            <li className="text-sm text-gray-700">• Conversion rate matches industry standard</li>
          </ul>
        </div>
      </ContentCard>
    </div>
  );
}


