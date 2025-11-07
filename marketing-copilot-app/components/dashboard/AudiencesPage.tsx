'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FilterBar from '@/components/ui/filters/FilterBar';
import BulkActionsToolbar from '@/components/ui/bulk-actions/BulkActionsToolbar';
import DateRangeSelector from '@/components/ui/date-range/DateRangeSelector';
import DetailPanel from '@/components/ui/detail-panel/DetailPanel';

interface Audience {
  id: string;
  name: string;
  type: string;
  status: string;
  size: number;
  associated_ad_groups: string[];
  associated_campaigns: string[];
  impressions: number;
  clicks: number;
  conversions: number;
}

export default function AudiencesPage() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  useEffect(() => {
    fetchAudiences();
  }, []);

  const fetchAudiences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/audiences');
      const data = await response.json();
      setAudiences(data.audiences || []);
    } catch (error) {
      console.error('Failed to fetch audiences:', error);
      setAudiences([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAudiences = audiences.filter((audience) => {
    const matchesSearch = audience.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || audience.type === typeFilter;
    const matchesStatus = !statusFilter || audience.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
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

  const handleRowClick = (audience: Audience) => {
    setSelectedAudience(audience);
    setDetailPanelOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Audiences</h1>
          <div className="flex items-center gap-4">
            <DateRangeSelector />
            <Button>+ Add Audience</Button>
          </div>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search audiences..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Type',
            options: [
              { value: 'CUSTOM_LIST', label: 'Custom list' },
              { value: 'AFFINITY', label: 'Affinity' },
              { value: 'IN_MARKET', label: 'In-market' },
              { value: 'REMARKETING', label: 'Remarketing' },
            ],
            value: typeFilter,
            onChange: setTypeFilter,
          },
          {
            label: 'Status',
            options: [
              { value: 'ACTIVE', label: 'Active' },
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
          { label: 'Remove', onClick: () => {}, variant: 'destructive' },
          { label: 'Edit associations', onClick: () => {} },
          { label: 'Pause', onClick: () => {}, variant: 'outline' },
        ]}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Audiences</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading audiences...</div>
            ) : filteredAudiences.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No audiences found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 w-12">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left p-2 font-semibold">Audience Name</th>
                      <th className="text-left p-2 font-semibold">Type</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                      <th className="text-right p-2 font-semibold">Size</th>
                      <th className="text-left p-2 font-semibold">Associated</th>
                      <th className="text-right p-2 font-semibold">Impressions</th>
                      <th className="text-right p-2 font-semibold">Clicks</th>
                      <th className="text-right p-2 font-semibold">Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudiences.map((audience) => (
                      <tr
                        key={audience.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(audience)}
                      >
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(audience.id)}
                            onChange={() => toggleSelection(audience.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{audience.name}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {audience.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              audience.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : audience.status === 'PAUSED'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {audience.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {audience.size.toLocaleString()}
                        </td>
                        <td className="p-2 text-sm text-gray-600">
                          {audience.associated_ad_groups.length > 0
                            ? `${audience.associated_ad_groups.length} ad groups`
                            : audience.associated_campaigns.length > 0
                            ? `${audience.associated_campaigns.length} campaigns`
                            : '-'}
                        </td>
                        <td className="p-2 text-right">
                          {audience.impressions.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          {audience.clicks.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">{audience.conversions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DetailPanel
        isOpen={detailPanelOpen}
        onClose={() => {
          setDetailPanelOpen(false);
          setSelectedAudience(null);
        }}
        title={selectedAudience ? selectedAudience.name : 'Audience Details'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDetailPanelOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => console.log('Save')}>Save</Button>
          </>
        }
      >
        {selectedAudience && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Segment Logic</h3>
              <p className="text-sm text-gray-600">
                {selectedAudience.type.replace('_', ' ')} audience targeting
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Targeting Settings</h3>
              <p className="text-sm text-gray-600">
                Status: {selectedAudience.status}
              </p>
              <p className="text-sm text-gray-600">
                Size: {selectedAudience.size.toLocaleString()} members
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Associations</h3>
              <div className="space-y-2">
                {selectedAudience.associated_ad_groups.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Ad Groups:</p>
                    <p className="text-sm text-gray-600">
                      {selectedAudience.associated_ad_groups.join(', ')}
                    </p>
                  </div>
                )}
                {selectedAudience.associated_campaigns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Campaigns:</p>
                    <p className="text-sm text-gray-600">
                      {selectedAudience.associated_campaigns.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Impressions</p>
                  <p className="text-lg font-semibold">
                    {selectedAudience.impressions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clicks</p>
                  <p className="text-lg font-semibold">
                    {selectedAudience.clicks.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversions</p>
                  <p className="text-lg font-semibold">{selectedAudience.conversions}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}

