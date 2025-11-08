'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Brain } from 'lucide-react';

export default function StrategizeMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Strategize</h1>
        <p className="text-gray-600 text-sm">Long-term optimization approach</p>
      </div>

      <ContentCard
        title="Strategy Builder"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Build your strategy:</p>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium">Q2 2025 Strategy</p>
            <p className="text-xs text-gray-500 mt-1">Focus on scaling winners, testing new audiences</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Long-term Goals"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Strategic objectives:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Increase ROAS by 20% by end of Q2</li>
            <li className="text-sm text-gray-700">• Expand into 3 new markets</li>
            <li className="text-sm text-gray-700">• Reduce CPA by 15% through optimization</li>
          </ul>
        </div>
      </ContentCard>

      <ContentCard
        title="Roadmap Planner"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Strategic roadmap:</p>
          <div className="space-y-2">
            <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
              <p className="text-sm font-medium">Phase 1: Foundation (Weeks 1-4)</p>
              <p className="text-xs text-gray-600 mt-1">Optimize existing campaigns</p>
            </div>
            <div className="p-3 border-l-4 border-gray-300 bg-gray-50 rounded">
              <p className="text-sm font-medium">Phase 2: Expansion (Weeks 5-8)</p>
              <p className="text-xs text-gray-600 mt-1">Launch new campaigns</p>
            </div>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}


