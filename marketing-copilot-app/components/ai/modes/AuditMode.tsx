'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { ShieldCheck } from 'lucide-react';

export default function AuditMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit</h1>
        <p className="text-gray-600 text-sm">Review account health, policy compliance, settings</p>
      </div>

      <ContentCard
        title="Account Health Score"
        variant="mixed"
        expandable
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-green-600">87</div>
            <div>
              <p className="text-sm font-medium">Good</p>
              <p className="text-xs text-gray-500">Last updated: 2 hours ago</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600" style={{ width: '87%' }}></div>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Policy Violations"
        variant="table"
        expandable
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Compliance status:</p>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">✓ No policy violations detected</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard
        title="Settings Review"
        variant="list"
        expandable
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Settings checklist:</p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-green-600">✓</span> Conversion tracking enabled
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-green-600">✓</span> Auto-tagging enabled
            </li>
            <li className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-yellow-600">⚠</span> Some campaigns missing ad extensions
            </li>
          </ul>
        </div>
      </ContentCard>
    </div>
  );
}


