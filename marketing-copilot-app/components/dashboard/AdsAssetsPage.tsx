'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FilterBar from '@/components/ui/filters/FilterBar';
import BulkActionsToolbar from '@/components/ui/bulk-actions/BulkActionsToolbar';
import DateRangeSelector from '@/components/ui/date-range/DateRangeSelector';
import DetailPanel from '@/components/ui/detail-panel/DetailPanel';

interface Ad {
  id: string;
  name: string;
  type: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cost: number;
}

interface Asset {
  id: string;
  type: string;
  status: string;
  associated_ad_groups: string[];
  impressions: number;
  clicks: number;
}

export default function AdsAssetsPage() {
  const [activeTab, setActiveTab] = useState<'ads' | 'assets'>('ads');
  const [ads, setAds] = useState<Ad[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<Ad | Asset | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'ads') {
        const response = await fetch('/api/ads');
        const data = await response.json();
        setAds(data.ads || []);
      } else {
        const response = await fetch('/api/assets');
        const data = await response.json();
        setAssets(data.assets || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || ad.type === typeFilter;
    const matchesStatus = !statusFilter || ad.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || asset.type === typeFilter;
    const matchesStatus = !statusFilter || asset.status === statusFilter;
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

  const handleRowClick = (item: Ad | Asset) => {
    setSelectedItem(item);
    setDetailPanelOpen(true);
  };

  const formatCurrency = (micros: number) => {
    return `$${(micros / 1000000).toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Ads & Assets</h1>
          <div className="flex items-center gap-4">
            <DateRangeSelector />
            <Button>
              + {activeTab === 'ads' ? 'Create Ad' : 'Create Asset'}
            </Button>
          </div>
        </div>
        <div className="flex gap-2 border-b">
          <button
            onClick={() => {
              setActiveTab('ads');
              setSelectedIds(new Set());
            }}
            className={`px-4 py-2 font-medium ${
              activeTab === 'ads'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Ads
          </button>
          <button
            onClick={() => {
              setActiveTab('assets');
              setSelectedIds(new Set());
            }}
            className={`px-4 py-2 font-medium ${
              activeTab === 'assets'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Assets
          </button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder={`Search ${activeTab}...`}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Type',
            options:
              activeTab === 'ads'
                ? [
                    { value: 'SEARCH', label: 'Search' },
                    { value: 'DISPLAY', label: 'Display' },
                  ]
                : [
                    { value: 'SITELINK', label: 'Sitelink' },
                    { value: 'CALLOUT', label: 'Callout' },
                    { value: 'IMAGE', label: 'Image' },
                    { value: 'VIDEO', label: 'Video' },
                  ],
            value: typeFilter,
            onChange: setTypeFilter,
          },
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
        actions={
          activeTab === 'ads'
            ? [
                { label: 'Pause', onClick: () => {}, variant: 'outline' },
                { label: 'Enable', onClick: () => {} },
                { label: 'Remove', onClick: () => {}, variant: 'destructive' },
              ]
            : [
                { label: 'Remove', onClick: () => {}, variant: 'destructive' },
                { label: 'Edit associations', onClick: () => {} },
              ]
        }
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>{activeTab === 'ads' ? 'Ads' : 'Assets'}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : activeTab === 'ads' ? (
              filteredAds.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No ads found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 w-12">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-2 font-semibold">Ad Name</th>
                        <th className="text-left p-2 font-semibold">Type</th>
                        <th className="text-left p-2 font-semibold">Status</th>
                        <th className="text-right p-2 font-semibold">Impressions</th>
                        <th className="text-right p-2 font-semibold">Clicks</th>
                        <th className="text-right p-2 font-semibold">CTR</th>
                        <th className="text-right p-2 font-semibold">Cost</th>
                        <th className="text-left p-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAds.map((ad) => (
                        <tr
                          key={ad.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(ad)}
                        >
                          <td className="p-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(ad.id)}
                              onChange={() => toggleSelection(ad.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="p-2 font-medium">{ad.name}</td>
                          <td className="p-2">{ad.type}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                ad.status === 'ENABLED'
                                  ? 'bg-green-100 text-green-800'
                                  : ad.status === 'PAUSED'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {ad.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            {ad.impressions.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">{ad.clicks.toLocaleString()}</td>
                          <td className="p-2 text-right">{formatPercent(ad.ctr)}</td>
                          <td className="p-2 text-right">{formatCurrency(ad.cost)}</td>
                          <td className="p-2" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No assets found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 w-12">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left p-2 font-semibold">Type</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                      <th className="text-left p-2 font-semibold">Associated Ad Groups</th>
                      <th className="text-right p-2 font-semibold">Impressions</th>
                      <th className="text-right p-2 font-semibold">Clicks</th>
                      <th className="text-left p-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(asset)}
                      >
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(asset.id)}
                            onChange={() => toggleSelection(asset.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{asset.type}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              asset.status === 'ENABLED'
                                ? 'bg-green-100 text-green-800'
                                : asset.status === 'PAUSED'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-2">
                          {asset.associated_ad_groups.join(', ') || '-'}
                        </td>
                        <td className="p-2 text-right">
                          {asset.impressions.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">{asset.clicks.toLocaleString()}</td>
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
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

      <DetailPanel
        isOpen={detailPanelOpen}
        onClose={() => {
          setDetailPanelOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? (activeTab === 'ads' ? (selectedItem as Ad).name : (selectedItem as Asset).type) : 'Details'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDetailPanelOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => console.log('Save')}>Save</Button>
          </>
        }
      >
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
            <p className="text-sm text-gray-600">
              Edit form will be implemented here.
            </p>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}

