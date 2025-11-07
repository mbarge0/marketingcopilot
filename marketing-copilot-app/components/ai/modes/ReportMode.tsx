'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

export default function ReportMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report</h1>
        <p className="text-gray-600">Summarize and communicate results</p>
      </div>

      {/* Report Templates */}
      <ContentCard
        title="Report Templates"
        variant="mixed"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Weekly Summary', 'Monthly Executive', 'Campaign ROI', 'Client Report', 'Custom Report'].map((template) => (
            <button
              key={template}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center text-sm"
            >
              {template}
            </button>
          ))}
        </div>
      </ContentCard>

      {/* Your Reports */}
      <ContentCard
        title="Your Reports"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">November Performance Summary</p>
                <p className="text-sm text-gray-500">Generated: 2 days ago | Format: PDF</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Quick Stats */}
      <ContentCard
        title="Quick Stats - This Month at a Glance"
        variant="mixed"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Spend</p>
            <p className="text-2xl font-bold text-gray-900">$12,483</p>
            <p className="text-xs text-green-600 mt-1">↑8% vs last month</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ROAS</p>
            <p className="text-2xl font-bold text-gray-900">4.27x</p>
            <p className="text-xs text-green-600 mt-1">↑3%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Top Campaign</p>
            <p className="text-lg font-bold text-gray-900">Winter Sale</p>
            <p className="text-xs text-gray-600 mt-1">4.8x ROAS</p>
          </div>
        </div>
      </ContentCard>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>TODO:</strong> Connect to PDF/PPTX generation tools, add report preview, implement export functionality, add share link generation
        </p>
      </div>
    </div>
  );
}

