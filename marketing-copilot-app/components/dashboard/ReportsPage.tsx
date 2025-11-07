'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DateRangeSelector from '@/components/ui/date-range/DateRangeSelector';
import FilterBar from '@/components/ui/filters/FilterBar';

interface ReportData {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface PerformanceRow {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost_per_conversion: number;
  roi: number;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'campaign' | 'adgroup' | 'keyword' | 'custom'
  >('overview');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignTypeFilter, setCampaignTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?type=${activeTab}`);
      const data = await response.json();
      if (activeTab === 'overview') {
        setReportData(data);
      } else {
        setPerformanceData(data.rows || []);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-semibold">Reports</h1>
          <div className="flex items-center gap-4">
            <DateRangeSelector />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                Export PDF
              </Button>
              <Button>Create Report</Button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'campaign', label: 'Campaign Performance' },
            { id: 'adgroup', label: 'Ad Group Performance' },
            { id: 'keyword', label: 'Keyword Performance' },
            { id: 'custom', label: 'Custom Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab !== 'overview' && (
        <FilterBar
          filters={[
            {
              label: 'Campaign Type',
              options: [
                { value: 'SEARCH', label: 'Search' },
                { value: 'DISPLAY', label: 'Display' },
                { value: 'PERFORMANCE_MAX', label: 'Performance Max' },
              ],
              value: campaignTypeFilter,
              onChange: setCampaignTypeFilter,
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
            {
              label: 'Device',
              options: [
                { value: 'DESKTOP', label: 'Desktop' },
                { value: 'MOBILE', label: 'Mobile' },
                { value: 'TABLET', label: 'Tablet' },
              ],
              value: deviceFilter,
              onChange: setDeviceFilter,
            },
          ]}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8">Loading report data...</div>
        ) : activeTab === 'overview' ? (
          <div className="space-y-4">
            {reportData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Spend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">
                        {formatCurrency(reportData.spend)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Impressions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">
                        {reportData.impressions.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Clicks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">
                        {reportData.clicks.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Conversions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">
                        {reportData.conversions}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <p>Chart placeholder - Trends over time</p>
                      <p className="text-xs mt-2">
                        TODO: Integrate chart library (recharts/chart.js)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-semibold">Campaign</th>
                            <th className="text-right p-2 font-semibold">Spend</th>
                            <th className="text-right p-2 font-semibold">Impressions</th>
                            <th className="text-right p-2 font-semibold">Clicks</th>
                            <th className="text-right p-2 font-semibold">Conversions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performanceData.slice(0, 5).map((row) => (
                            <tr key={row.id} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-medium">{row.name}</td>
                              <td className="p-2 text-right">
                                {formatCurrency(row.cost_per_conversion * row.conversions)}
                              </td>
                              <td className="p-2 text-right">
                                {row.impressions.toLocaleString()}
                              </td>
                              <td className="p-2 text-right">{row.clicks.toLocaleString()}</td>
                              <td className="p-2 text-right">{row.conversions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        ) : activeTab === 'custom' ? (
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No custom reports saved yet.</p>
                <Button>Create Custom Report</Button>
                <p className="text-xs text-gray-400 mt-4">
                  TODO: Report builder UI (future feature)
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'campaign'
                  ? 'Campaign Performance'
                  : activeTab === 'adgroup'
                  ? 'Ad Group Performance'
                  : 'Keyword Performance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No performance data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">
                          {activeTab === 'campaign'
                            ? 'Campaign'
                            : activeTab === 'adgroup'
                            ? 'Ad Group'
                            : 'Keyword'}
                        </th>
                        <th className="text-left p-2 font-semibold">Status</th>
                        <th className="text-right p-2 font-semibold">Impressions</th>
                        <th className="text-right p-2 font-semibold">Clicks</th>
                        <th className="text-right p-2 font-semibold">Conversions</th>
                        <th className="text-right p-2 font-semibold">Cost/Conv</th>
                        <th className="text-right p-2 font-semibold">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{row.name}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                row.status === 'ENABLED'
                                  ? 'bg-green-100 text-green-800'
                                  : row.status === 'PAUSED'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            {row.impressions.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">{row.clicks.toLocaleString()}</td>
                          <td className="p-2 text-right">{row.conversions}</td>
                          <td className="p-2 text-right">
                            {formatCurrency(row.cost_per_conversion)}
                          </td>
                          <td className="p-2 text-right">
                            {row.roi ? `${row.roi.toFixed(2)}x` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

