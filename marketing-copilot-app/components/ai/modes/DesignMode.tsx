'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Palette } from 'lucide-react';

export default function DesignMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Design</h1>
        <p className="text-gray-600 text-sm">Ad creative, landing pages</p>
      </div>

      <ContentCard
        title="Creative Library"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Your creative assets:</p>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-xs text-gray-500">Creative {i}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Design Templates"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Available templates:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <p className="font-medium text-sm">Product Showcase</p>
              <p className="text-xs text-gray-500 mt-1">Best for e-commerce</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <p className="font-medium text-sm">Service Promotion</p>
              <p className="text-xs text-gray-500 mt-1">Best for services</p>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Asset Generator"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">AI-powered creative generation:</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">💡 AI Insight</p>
            <p className="text-sm text-blue-800">Generate new creative variations based on your top performers</p>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}


