'use client';

import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Select, SelectOption } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, TrendingUp, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

export default function AdFraudPage() {
  const [scope, setScope] = useState('all-campaigns');
  const [dateRange, setDateRange] = useState('last30days');

  return (
    <div className="space-y-6 bg-gray-50">
      {/* Filters Header */}
      <div className="flex justify-end gap-3 px-6 py-4 bg-white border-b border-gray-200">
        <Select value={scope} onValueChange={setScope}>
          <SelectOption value="all-campaigns">Scope: All campaigns</SelectOption>
          <SelectOption value="brand-awareness-q4">Scope: Brand Awareness Q4</SelectOption>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectOption value="today">Today</SelectOption>
          <SelectOption value="last7days">Last 7 days</SelectOption>
          <SelectOption value="last30days">Last 30 days</SelectOption>
        </Select>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbItem>AI</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Anti-fraud</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Page Title */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900">Anti-fraud</h1>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8 space-y-6">
        <FraudOverviewCard />
        <div className="grid grid-cols-2 gap-6">
          <ClicksChartCard />
          <FraudOriginHeatmapCard />
        </div>
        <AIRecommendationsCard />
        <SuspiciousSourcesTable />
      </div>
    </div>
  );
}

function FraudOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud overview</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Based on selected scope & date range.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-red-600">24%</span>
              <span className="text-sm text-gray-600">Invalid click rate</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-red-600">
              <TrendingUp className="h-4 w-4" />
              <span>Higher than usual (+9 pts vs previous period)</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Estimated wasted spend</div>
            <div className="text-xl font-bold text-gray-900">$4,300</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Flagged sessions</div>
            <div className="text-xl font-bold text-gray-900">12.4K</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClicksChartCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Clicks vs invalid clicks</CardTitle>
          <Select defaultValue="rate">
            <SelectOption value="rate">Metric: Rate</SelectOption>
            <SelectOption value="count">Metric: Count</SelectOption>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chart visualization</p>
            <p className="text-xs mt-1">Oct 15 - Oct 28</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Total clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Invalid clicks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FraudOriginHeatmapCard() {
  const countries = [
    { code: 'BR', name: 'Brazil', percentage: 39, level: 'critical' },
    { code: 'IN', name: 'India', percentage: 28, level: 'high' },
    { code: 'CN', name: 'China', percentage: 31, level: 'critical' },
    { code: 'PK', name: 'Pakistan', percentage: 22, level: 'medium' },
    { code: 'US', name: 'United States', percentage: 8, level: 'low' },
    { code: 'UK', name: 'United Kingdom', percentage: 6, level: 'low' },
  ];

  const getColorClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fraud origin heatmap</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Where suspicious clicks originate</p>
          </div>
          <Select defaultValue="country">
            <SelectOption value="country">Segment by: Country</SelectOption>
            <SelectOption value="region">Segment by: Region</SelectOption>
            <SelectOption value="city">Segment by: City</SelectOption>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {countries.map((country) => (
            <div
              key={country.code}
              className={`${getColorClass(country.level)} p-4 rounded-lg text-center`}
            >
              <div className="text-lg font-bold">{country.code}</div>
              <div className="text-xs mt-1">{country.percentage}%</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-green-500"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-orange-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-red-500"></div>
            <span>Critical</span>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Top hotspot: Brazil - 39% invalid clicks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AIRecommendationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">
                Block traffic from ad-network-123.com on mobile in Brazil (39% invalid).
              </p>
              <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                High Impact
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">
                Reduce bids or tighten frequency caps for &quot;Brand Awareness Q4&quot; in high-fraud regions.
              </p>
              <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Medium impact
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">
                Add IP range 203.45.*.* to exclusion list (82% invalid click rate detected).
              </p>
              <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                High Impact
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Apply 2 changes
          </Button>
          <Button variant="outline">Send to AI chat</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SuspiciousSourcesTable() {
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sources = [
    {
      id: 1,
      source: 'randomapp-network.com',
      geo: 'BR - São Paulo',
      device: 'Mobile',
      invalidClicks: 3240,
      invalidRate: 39,
      wastedSpend: 1820,
      lastSeen: '2 hours ago',
      status: 'Monitoring',
      selected: true,
    },
    {
      id: 2,
      source: 'ad-network-123.com',
      geo: 'IN - Mumbai',
      device: 'Mobile',
      invalidClicks: 2890,
      invalidRate: 42,
      wastedSpend: 1620,
      lastSeen: '5 hours ago',
      status: 'Blocked',
      selected: false,
    },
    {
      id: 3,
      source: 'click-farm-proxy.net',
      geo: 'CN - Guangdong',
      device: 'Desktop',
      invalidClicks: 2150,
      invalidRate: 58,
      wastedSpend: 980,
      lastSeen: '1 day ago',
      status: 'Monitoring',
      selected: false,
    },
    {
      id: 4,
      source: 'legitimate-publisher.com',
      geo: 'US - California',
      device: 'Desktop',
      invalidClicks: 120,
      invalidRate: 3,
      wastedSpend: 45,
      lastSeen: '3 days ago',
      status: 'Allowed',
      selected: false,
    },
    {
      id: 5,
      source: 'suspicious-placement-87.info',
      geo: 'PK - Karachi',
      device: 'Mobile',
      invalidClicks: 1890,
      invalidRate: 35,
      wastedSpend: 750,
      lastSeen: '6 hours ago',
      status: 'Monitoring',
      selected: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Blocked':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            Blocked
          </span>
        );
      case 'Monitoring':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            Monitoring
          </span>
        );
      case 'Allowed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            Allowed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Suspicious sources</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Block source</Button>
            <Button variant="outline" size="sm">Add to exclusion list</Button>
            <Button variant="outline" size="sm">Export selection</Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Select value={deviceFilter} onValueChange={setDeviceFilter}>
            <SelectOption value="all">Device: All</SelectOption>
            <SelectOption value="mobile">Mobile</SelectOption>
            <SelectOption value="desktop">Desktop</SelectOption>
          </Select>
          <Select value={networkFilter} onValueChange={setNetworkFilter}>
            <SelectOption value="all">Network: All</SelectOption>
            <SelectOption value="display">Display</SelectOption>
            <SelectOption value="search">Search</SelectOption>
          </Select>
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Filter by IP, placement, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-semibold text-sm">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left p-3 font-semibold text-sm">Status</th>
                <th className="text-left p-3 font-semibold text-sm">Source</th>
                <th className="text-left p-3 font-semibold text-sm">Geo</th>
                <th className="text-left p-3 font-semibold text-sm">Device</th>
                <th className="text-right p-3 font-semibold text-sm">Invalid clicks</th>
                <th className="text-right p-3 font-semibold text-sm">Invalid rate</th>
                <th className="text-right p-3 font-semibold text-sm">Wasted spend</th>
                <th className="text-left p-3 font-semibold text-sm">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={source.selected}
                      className="rounded border-gray-300"
                      readOnly
                    />
                  </td>
                  <td className="p-3">{getStatusBadge(source.status)}</td>
                  <td className="p-3 text-sm font-medium">{source.source}</td>
                  <td className="p-3 text-sm text-gray-700">{source.geo}</td>
                  <td className="p-3 text-sm text-gray-700">{source.device}</td>
                  <td className="p-3 text-right text-sm">{source.invalidClicks.toLocaleString()}</td>
                  <td className="p-3 text-right text-sm font-medium text-red-600">
                    {source.invalidRate}%
                  </td>
                  <td className="p-3 text-right text-sm font-medium">
                    ${source.wastedSpend.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{source.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Selected sources are available in the AI assistant on the right for deeper analysis.
        </p>
      </CardContent>
    </Card>
  );
}

