'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FilterBar from '@/components/ui/filters/FilterBar';
import BulkActionsToolbar from '@/components/ui/bulk-actions/BulkActionsToolbar';
import DateRangeSelector from '@/components/ui/date-range/DateRangeSelector';

interface AdGroup {
  id: string;
  name: string;
  status: string;
  default_bid: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export default function AdGroupsPage() {
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAdGroups();
  }, []);

  const fetchAdGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ad-groups');
      const data = await response.json();
      setAdGroups(data.adGroups || []);
    } catch (error) {
      console.error('Failed to fetch ad groups:', error);
      setAdGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdGroups = adGroups.filter((ag) => {
    const matchesSearch = ag.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || ag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredAdGroups.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAdGroups.map((ag) => ag.id)));
    }
  };

  const formatCurrency = (micros: number) => {
    return `$${(micros / 1000000).toFixed(2)}`;
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for:`, Array.from(selectedIds));
    // TODO: Implement bulk actions
    setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Ad Groups</h1>
          <div className="flex items-center gap-4">
            <DateRangeSelector />
            <Button>+ Create Ad Group</Button>
          </div>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search ad groups..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Status',
            options: [
              { value: 'ENABLED', label: 'Enabled' },
              { value: 'PAUSED', label: 'Paused' },
              { value: 'REMOVED', label: 'Removed' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
      />

      <BulkActionsToolbar
        selectedCount={selectedIds.size}
        actions={[
          { label: 'Pause', onClick: () => handleBulkAction('pause'), variant: 'outline' },
          { label: 'Enable', onClick: () => handleBulkAction('enable') },
          { label: 'Remove', onClick: () => handleBulkAction('remove'), variant: 'destructive' },
        ]}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Ad Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading ad groups...</div>
            ) : filteredAdGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No ad groups found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 w-12">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === filteredAdGroups.length && filteredAdGroups.length > 0}
                          onChange={toggleAll}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left p-2 font-semibold">Ad Group</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                      <th className="text-right p-2 font-semibold">Default Bid</th>
                      <th className="text-right p-2 font-semibold">Impressions</th>
                      <th className="text-right p-2 font-semibold">Clicks</th>
                      <th className="text-right p-2 font-semibold">Conversions</th>
                      <th className="text-right p-2 font-semibold">Cost</th>
                      <th className="text-left p-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdGroups.map((adGroup) => (
                      <tr key={adGroup.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(adGroup.id)}
                            onChange={() => toggleSelection(adGroup.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{adGroup.name}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              adGroup.status === 'ENABLED'
                                ? 'bg-green-100 text-green-800'
                                : adGroup.status === 'PAUSED'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {adGroup.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {formatCurrency(adGroup.default_bid)}
                        </td>
                        <td className="p-2 text-right">
                          {adGroup.impressions.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          {adGroup.clicks.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">{adGroup.conversions}</td>
                        <td className="p-2 text-right">
                          {formatCurrency(adGroup.cost)}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              Duplicate
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

