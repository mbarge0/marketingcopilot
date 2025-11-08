'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectOption } from '@/components/ui/select';
import { Tabs, TabsList, Tab } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Campaign {
  id: string;
  campaign_id: string;
  name: string;
  status: string;
  campaign_type: string;
  daily_budget_micros: number;
  impressions: number;
  clicks: number;
  cost_micros: number;
  conversions: number;
  ctr: number;
  cpc_micros: number;
  cpa_micros: number | null;
  roas: number | null;
}

export default function CampaignTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all-types');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [dateRange, setDateRange] = useState('last30days');
  const [connected, setConnected] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (connected) {
      fetchCampaigns();
    } else {
      // Use sample data when not connected
      setCampaigns(getSampleCampaigns());
      setLoading(false);
    }
  }, [connected]);

  const getSampleCampaigns = (): Campaign[] => {
    return [
      {
        id: '1',
        campaign_id: '1234567890',
        name: 'Brand Awareness Q4',
        status: 'ACTIVE',
        campaign_type: 'PERFORMANCE_MAX',
        daily_budget_micros: 5000000000,
        impressions: 245800,
        clicks: 8400,
        cost_micros: 4200000000,
        conversions: 125,
        ctr: 0.0342,
        cpc_micros: 500000,
        cpa_micros: 33600000,
        roas: 2.5,
      },
      {
        id: '2',
        campaign_id: '1234567891',
        name: 'Summer Sale - Shoes',
        status: 'ACTIVE',
        campaign_type: 'SEARCH',
        daily_budget_micros: 3500000000,
        impressions: 189200,
        clicks: 6300,
        cost_micros: 3150000000,
        conversions: 98,
        ctr: 0.0333,
        cpc_micros: 500000,
        cpa_micros: 32142857,
        roas: 2.8,
      },
      {
        id: '3',
        campaign_id: '1234567892',
        name: 'Holiday Campaign 2025',
        status: 'PAUSED',
        campaign_type: 'VIDEO',
        daily_budget_micros: 8000000000,
        impressions: 512300,
        clicks: 12800,
        cost_micros: 6400000000,
        conversions: 210,
        ctr: 0.025,
        cpc_micros: 500000,
        cpa_micros: 30476190,
        roas: 3.2,
      },
      {
        id: '4',
        campaign_id: '1234567893',
        name: 'Product Launch - Running Gear',
        status: 'ACTIVE',
        campaign_type: 'SEARCH',
        daily_budget_micros: 4200000000,
        impressions: 156700,
        clicks: 5100,
        cost_micros: 2550000000,
        conversions: 78,
        ctr: 0.0325,
        cpc_micros: 500000,
        cpa_micros: 32692308,
        roas: 2.6,
      },
      {
        id: '5',
        campaign_id: '1234567894',
        name: 'Retargeting - Abandoned Cart',
        status: 'LIMITED',
        campaign_type: 'DISPLAY',
        daily_budget_micros: 2800000000,
        impressions: 98500,
        clicks: 3200,
        cost_micros: 1600000000,
        conversions: 45,
        ctr: 0.0325,
        cpc_micros: 500000,
        cpa_micros: 35555556,
        roas: 2.1,
      },
      {
        id: '6',
        campaign_id: '1234567895',
        name: 'Winter Accessories',
        status: 'ACTIVE',
        campaign_type: 'PERFORMANCE_MAX',
        daily_budget_micros: 6000000000,
        impressions: 312400,
        clicks: 9800,
        cost_micros: 4900000000,
        conversions: 156,
        ctr: 0.0314,
        cpc_micros: 500000,
        cpa_micros: 31410256,
        roas: 2.7,
      },
      {
        id: '7',
        campaign_id: '1234567896',
        name: 'Local Store Promotion',
        status: 'PAUSED',
        campaign_type: 'SEARCH',
        daily_budget_micros: 1500000000,
        impressions: 67800,
        clicks: 2100,
        cost_micros: 1050000000,
        conversions: 32,
        ctr: 0.031,
        cpc_micros: 500000,
        cpa_micros: 32812500,
        roas: 2.3,
      },
      {
        id: '8',
        campaign_id: '1234567897',
        name: 'Mobile App Install Campaign',
        status: 'ACTIVE',
        campaign_type: 'APP',
        daily_budget_micros: 7500000000,
        impressions: 428900,
        clicks: 14200,
        cost_micros: 7100000000,
        conversions: 285,
        ctr: 0.0331,
        cpc_micros: 500000,
        cpa_micros: 24912281,
        roas: 3.1,
      },
    ];
  };

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: accounts } = await supabase
          .from('google_ads_accounts')
          .select('id, account_name')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);
        
        if (accounts && accounts.length > 0) {
          setConnected(true);
          setAccountName(accounts[0].account_name || null);
          setAccountFilter(accounts[0].id);
        } else {
          setConnected(false);
          setAccountName(null);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnected(false);
    } finally {
      setCheckingConnection(false);
    }
  };

  const handleConnectGoogleAds = async () => {
    try {
      const response = await fetch('/api/auth/google/initiate');
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate Google Ads connection');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect Google Ads account');
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns');
      const data = await response.json();

      if (!response.ok) {
        // Check if it's a configuration error
        if (data.error === 'Configuration error' || data.message?.includes('required')) {
          throw new Error(
            data.details || 
            'Missing environment variables. Please check your .env.local file and ensure SUPABASE_SERVICE_ROLE_KEY is set.'
          );
        }
        throw new Error(data.message || data.error || 'Failed to fetch campaigns');
      }

      setCampaigns(data.campaigns || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaigns');
      setCampaigns([]);
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

  const filteredCampaigns = campaigns.filter((campaign) => {
    // Status filter
    if (statusFilter === 'enabled' && campaign.status !== 'ACTIVE') {
      return false;
    }
    if (statusFilter === 'paused' && campaign.status !== 'PAUSED') {
      return false;
    }
    // Note: 'LIMITED' status shows in 'all' filter but not in 'enabled' or 'paused'

    // Type filter
    if (typeFilter !== 'all-types') {
      const typeMap: Record<string, string> = {
        search: 'SEARCH',
        display: 'DISPLAY',
        video: 'VIDEO',
        shopping: 'SHOPPING',
        'performance-max': 'PERFORMANCE_MAX',
        app: 'APP',
      };
      if (campaign.campaign_type !== typeMap[typeFilter]) {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !campaign.name.toLowerCase().includes(query) &&
        !campaign.campaign_id.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  if (checkingConnection || (loading && connected)) {
    return (
      <div className="space-y-6">
        {/* Filters Header */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-white border-b border-gray-200">
          {connected && accountName ? (
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectOption value={accountFilter}>Account: {accountName}</SelectOption>
            </Select>
          ) : (
            <Select value="" disabled>
              <SelectOption value="">Account: </SelectOption>
            </Select>
          )}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectOption value="today">Today</SelectOption>
            <SelectOption value="last7days">Last 7 days</SelectOption>
            <SelectOption value="last30days">Last 30 days</SelectOption>
            <SelectOption value="last90days">Last 90 days</SelectOption>
            <SelectOption value="custom">Custom</SelectOption>
          </Select>
          {connected && (
            <Button variant="ghost" size="icon" onClick={fetchCampaigns}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="px-6">
          <Breadcrumb>
            <BreadcrumbItem>Overview</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Campaigns</BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Loading State */}
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading campaigns...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && connected) {
    return (
      <div className="space-y-6">
        {/* Filters Header */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-white border-b border-gray-200">
          {connected && accountName ? (
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectOption value={accountFilter}>Account: {accountName}</SelectOption>
            </Select>
          ) : (
            <Select value="" disabled>
              <SelectOption value="">Account: </SelectOption>
            </Select>
          )}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectOption value="today">Today</SelectOption>
            <SelectOption value="last7days">Last 7 days</SelectOption>
            <SelectOption value="last30days">Last 30 days</SelectOption>
            <SelectOption value="last90days">Last 90 days</SelectOption>
            <SelectOption value="custom">Custom</SelectOption>
          </Select>
          {connected && (
            <Button variant="ghost" size="icon" onClick={fetchCampaigns}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="px-6">
          <Breadcrumb>
            <BreadcrumbItem>Overview</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Campaigns</BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Error State */}
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <p className="font-semibold mb-2">{error}</p>
                {error.includes('environment variables') && (
                  <div className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    <p>To fix this:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 text-left">
                      <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in the <code className="bg-gray-100 px-1 rounded">marketing-copilot-app</code> directory</li>
                      <li>Add <code className="bg-gray-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY=your_key_here</code></li>
                      <li>Restart your development server</li>
                    </ol>
                  </div>
                )}
              </div>
              <Button onClick={fetchCampaigns} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Filters Header */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-b border-gray-200">
        {!connected && !checkingConnection && (
          <Button onClick={handleConnectGoogleAds}>
            Connect Google Ads Account
          </Button>
        )}
        {connected && accountName ? (
          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectOption value={accountFilter}>Account: {accountName}</SelectOption>
          </Select>
        ) : (
          <Select value="" disabled>
            <SelectOption value="">Account: </SelectOption>
          </Select>
        )}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectOption value="today">Today</SelectOption>
          <SelectOption value="last7days">Last 7 days</SelectOption>
          <SelectOption value="last30days">Last 30 days</SelectOption>
          <SelectOption value="last90days">Last 90 days</SelectOption>
          <SelectOption value="custom">Custom</SelectOption>
        </Select>
        {connected && (
          <Button variant="ghost" size="icon" onClick={fetchCampaigns}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbItem>Overview</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Campaigns</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Page Title */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search campaigns, keywords, or ads"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4 px-6 pb-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <Tab value="all">All</Tab>
            <Tab value="enabled">Enabled</Tab>
            <Tab value="paused">Paused</Tab>
          </TabsList>
        </Tabs>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectOption value="all-types">Type: All types</SelectOption>
          <SelectOption value="search">Search</SelectOption>
          <SelectOption value="display">Display</SelectOption>
          <SelectOption value="video">Video</SelectOption>
          <SelectOption value="shopping">Shopping</SelectOption>
          <SelectOption value="performance-max">Performance Max</SelectOption>
        </Select>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left p-3 font-semibold text-sm">Campaign name</th>
                  <th className="text-left p-3 font-semibold text-sm">Status</th>
                  <th className="text-left p-3 font-semibold text-sm">Type</th>
                  <th className="text-right p-3 font-semibold text-sm">Budget</th>
                  <th className="text-right p-3 font-semibold text-sm">Impressions</th>
                  <th className="text-right p-3 font-semibold text-sm">Clicks</th>
                  <th className="text-right p-3 font-semibold text-sm">CTR</th>
                  <th className="text-right p-3 font-semibold text-sm">CPC</th>
                  <th className="text-right p-3 font-semibold text-sm">Conversions</th>
                  <th className="text-right p-3 font-semibold text-sm">CPA</th>
                  <th className="text-right p-3 font-semibold text-sm">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-8 text-center text-gray-500">
                      No campaigns found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="p-3">
                        <a href={`/dashboard/campaigns/${campaign.id}`} className="text-blue-600 hover:underline">
                          {campaign.name}
                        </a>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'PAUSED'
                              ? 'bg-gray-100 text-gray-800'
                              : campaign.status === 'LIMITED'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {campaign.status === 'ACTIVE' ? 'Enabled' : campaign.status === 'PAUSED' ? 'Paused' : campaign.status === 'LIMITED' ? 'Limited' : campaign.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {campaign.campaign_type === 'PERFORMANCE_MAX' ? 'Performance Max' : 
                         campaign.campaign_type === 'SEARCH' ? 'Search' :
                         campaign.campaign_type === 'VIDEO' ? 'Video' :
                         campaign.campaign_type === 'DISPLAY' ? 'Display' :
                         campaign.campaign_type === 'APP' ? 'App' :
                         campaign.campaign_type.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {formatCurrency(campaign.daily_budget_micros)}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {campaign.impressions.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {campaign.clicks.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {formatPercent(campaign.ctr)}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {formatCurrency(campaign.cpc_micros)}
                      </td>
                      <td className="p-3 text-right text-sm">{campaign.conversions}</td>
                      <td className="p-3 text-right text-sm">
                        {campaign.cpa_micros
                          ? formatCurrency(campaign.cpa_micros)
                          : '-'}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {campaign.roas ? `${campaign.roas.toFixed(2)}x` : '-'}
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

