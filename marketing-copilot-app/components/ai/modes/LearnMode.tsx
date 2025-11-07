'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { BookOpen } from 'lucide-react';

export default function LearnMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Learn</h1>
        <p className="text-gray-600 text-sm">Understand new features, best practices</p>
      </div>

      <ContentCard
        title="Feature Guides"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Available guides:</p>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <p className="font-medium text-sm">Performance Max Campaigns</p>
              <p className="text-xs text-gray-500 mt-1">Learn how to set up and optimize Performance Max</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <p className="font-medium text-sm">Smart Bidding Strategies</p>
              <p className="text-xs text-gray-500 mt-1">Understand automated bidding options</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Best Practices"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Recommended practices:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Test multiple ad variations to find winners</li>
            <li className="text-sm text-gray-700">• Use negative keywords to filter irrelevant traffic</li>
            <li className="text-sm text-gray-700">• Monitor search terms regularly for optimization</li>
          </ul>
        </div>
      </ContentCard>

      <ContentCard
        title="Tutorial Library"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Interactive tutorials:</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">💡 AI Learning</p>
            <p className="text-sm text-blue-800">Ask me anything about Google Ads features or best practices!</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}

