'use client';

import ContentCard from '@/components/ai/shared/ContentCard';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanMode() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan</h1>
        <p className="text-gray-600">Marketing plans, budgets, and timelines</p>
      </div>

      {/* Active Plans */}
      <ContentCard
        title="Active Plans"
        variant="mixed"
        expandable
      >
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">Q1 2025 Campaign Strategy</h3>
                <p className="text-sm text-gray-600">Budget: $15K | Timeline: Jan 1 - Mar 31</p>
              </div>
              <span className="text-sm font-medium text-blue-600">On track</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-900 font-medium">67% complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Budget Allocation */}
      <ContentCard
        title="Budget Allocation"
        variant="chart"
        expandable
      >
        <div className="space-y-4">
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Pie chart: 40% Search, 30% Shopping, 30% Display (placeholder)</p>
          </div>
          <p className="text-sm text-gray-600">Click slice to adjust allocation</p>
        </div>
      </ContentCard>

      {/* Upcoming Milestones */}
      <ContentCard
        title="Upcoming Milestones"
        variant="list"
        expandable
      >
        <ul className="space-y-3">
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium text-gray-900">Launch spring campaign</p>
              <p className="text-xs text-gray-500">Mar 1, 2025</p>
            </div>
            <Button variant="ghost" size="sm">Mark complete</Button>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium text-gray-900">Refresh creative assets</p>
              <p className="text-xs text-gray-500">Feb 15, 2025</p>
            </div>
            <Button variant="ghost" size="sm">Mark complete</Button>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium text-gray-900">Review Q1 performance</p>
              <p className="text-xs text-gray-500">Mar 31, 2025</p>
            </div>
            <Button variant="ghost" size="sm">Mark complete</Button>
          </li>
        </ul>
      </ContentCard>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>TODO:</strong> Create plans table in Supabase, add plan creation form, implement budget allocation editor, add milestone management
        </p>
      </div>
    </div>
  );
}

