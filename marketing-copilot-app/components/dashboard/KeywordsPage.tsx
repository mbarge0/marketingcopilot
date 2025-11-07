'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FilterBar from '@/components/ui/filters/FilterBar';
import BulkActionsToolbar from '@/components/ui/bulk-actions/BulkActionsToolbar';
import DateRangeSelector from '@/components/ui/date-range/DateRangeSelector';
import DetailPanel from '@/components/ui/detail-panel/DetailPanel';
import { Input } from '@/components/ui/input';

interface Keyword {
  id: string;
  keyword: string;
  match_type: string;
  status: string;
  quality_score: number;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  cost_per_conversion: number;
  ctr: number;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [matchTypeFilter, setMatchTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [qualityScoreFilter, setQualityScoreFilter] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keywords');
      const data = await response.json();
      setKeywords(data.keywords || []);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredKeywords = keywords.filter((kw) => {
    const matchesSearch = kw.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMatchType = !matchTypeFilter || kw.match_type === matchTypeFilter;
    const matchesStatus = !statusFilter || kw.status === statusFilter;
    const matchesQualityScore =
      !qualityScoreFilter || kw.quality_score >= parseInt(qualityScoreFilter);
    return matchesSearch && matchesMatchType && matchesStatus && matchesQualityScore;
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

  const handleRowClick = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
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
          <h1 className="text-2xl font-semibold">Keywords</h1>
          <div className="flex items-center gap-4">
            <DateRangeSelector />
            <Button>+ Add Keyword</Button>
          </div>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search keywords..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Match Type',
            options: [
              { value: 'EXACT', label: 'Exact' },
              { value: 'PHRASE', label: 'Phrase' },
              { value: 'BROAD', label: 'Broad' },
            ],
            value: matchTypeFilter,
            onChange: setMatchTypeFilter,
          },
          {
            label: 'Status',
            options: [
              { value: 'ELIGIBLE', label: 'Eligible' },
              { value: 'PAUSED', label: 'Paused' },
              { value: 'REMOVED', label: 'Removed' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            label: 'Quality Score',
            options: [
              { value: '7', label: '≥ 7' },
              { value: '5', label: '≥ 5' },
              { value: '3', label: '≥ 3' },
            ],
            value: qualityScoreFilter,
            onChange: setQualityScoreFilter,
          },
        ]}
      />

      <BulkActionsToolbar
        selectedCount={selectedIds.size}
        actions={[
          { label: 'Pause', onClick: () => {}, variant: 'outline' },
          { label: 'Remove', onClick: () => {}, variant: 'destructive' },
          { label: 'Change match type', onClick: () => {} },
        ]}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading keywords...</div>
            ) : filteredKeywords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No keywords found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 w-12">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left p-2 font-semibold">Keyword</th>
                      <th className="text-left p-2 font-semibold">Match Type</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                      <th className="text-right p-2 font-semibold">Quality Score</th>
                      <th className="text-right p-2 font-semibold">Impressions</th>
                      <th className="text-right p-2 font-semibold">Clicks</th>
                      <th className="text-right p-2 font-semibold">Cost</th>
                      <th className="text-right p-2 font-semibold">Conversions</th>
                      <th className="text-right p-2 font-semibold">Cost/Conv</th>
                      <th className="text-right p-2 font-semibold">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((keyword) => (
                      <tr
                        key={keyword.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(keyword)}
                      >
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(keyword.id)}
                            onChange={() => toggleSelection(keyword.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{keyword.keyword}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {keyword.match_type}
                          </span>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              keyword.status === 'ELIGIBLE'
                                ? 'bg-green-100 text-green-800'
                                : keyword.status === 'PAUSED'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {keyword.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">{keyword.quality_score}/10</td>
                        <td className="p-2 text-right">
                          {keyword.impressions.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">{keyword.clicks.toLocaleString()}</td>
                        <td className="p-2 text-right">{formatCurrency(keyword.cost)}</td>
                        <td className="p-2 text-right">{keyword.conversions}</td>
                        <td className="p-2 text-right">
                          {formatCurrency(keyword.cost_per_conversion)}
                        </td>
                        <td className="p-2 text-right">{formatPercent(keyword.ctr)}</td>
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
          setSelectedKeyword(null);
        }}
        title={selectedKeyword ? `Edit: ${selectedKeyword.keyword}` : 'Keyword Details'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDetailPanelOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => console.log('Save')}>Save</Button>
          </>
        }
      >
        {selectedKeyword && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bid</label>
              <Input
                type="number"
                defaultValue={selectedKeyword.cost / selectedKeyword.clicks / 1000000}
                placeholder="Enter bid"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                defaultValue={selectedKeyword.status}
                className="w-full h-9 rounded-md border border-gray-300 px-3"
              >
                <option value="ELIGIBLE">Eligible</option>
                <option value="PAUSED">Paused</option>
                <option value="REMOVED">Removed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Match Type</label>
              <select
                defaultValue={selectedKeyword.match_type}
                className="w-full h-9 rounded-md border border-gray-300 px-3"
              >
                <option value="EXACT">Exact</option>
                <option value="PHRASE">Phrase</option>
                <option value="BROAD">Broad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Negative Keywords</label>
              <Input type="text" placeholder="Add negative keywords (comma-separated)" />
              <p className="text-xs text-gray-500 mt-1">
                TODO: Keyword suggestions and import list features
              </p>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}

