'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create</h1>
        <p className="text-gray-600">Build campaigns, ads, or assets</p>
      </div>

      {/* Creation Type Selector */}
      <ContentCard
        title="What do you want to create?"
        variant="mixed"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Campaign', 'Ad Copy', 'Audience', 'Landing Page'].map((type) => (
            <button
              key={type}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <p className="font-medium text-gray-900">{type}</p>
            </button>
          ))}
        </div>
      </ContentCard>

      {/* Recent Creations */}
      <ContentCard
        title="Recent Creations"
        variant="list"
        expandable
      >
        <ul className="space-y-3">
          <li className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Draft: "Spring Sale Campaign"</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
            <Button variant="outline" size="sm">Continue editing</Button>
          </li>
          <li className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Published: "Winter Promo"</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </li>
        </ul>
      </ContentCard>

      {/* AI Suggestions */}
      <ContentCard
        title="AI Suggestions"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Based on your top performer "Winter Sale":
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Create a similar campaign for spring</li>
                  <li>• Duplicate and test new creative</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-3">
                  Start from template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>TODO:</strong> Connect to Google Ads API for campaign creation, add OpenAI integration for creative generation, implement review & launch flow, add budget validation ($50/day cap)
        </p>
      </div>
    </div>
  );
}


