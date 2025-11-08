'use client';

import CampaignTable from '@/components/dashboard/CampaignTable';

export default function DashboardContent() {

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CampaignTable />
        </div>
      </main>
    </div>
  );
}

