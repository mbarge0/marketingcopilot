'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch campaigns');
      }

      setCampaigns(data.campaigns || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading campaigns...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            {error}
            <Button onClick={fetchCampaigns} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No campaigns found. Connect your Google Ads account to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Campaigns</CardTitle>
          <Button onClick={fetchCampaigns} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Campaign</th>
                <th className="text-left p-2 font-semibold">Status</th>
                <th className="text-right p-2 font-semibold">Budget</th>
                <th className="text-right p-2 font-semibold">Spend</th>
                <th className="text-right p-2 font-semibold">Impressions</th>
                <th className="text-right p-2 font-semibold">Clicks</th>
                <th className="text-right p-2 font-semibold">CTR</th>
                <th className="text-right p-2 font-semibold">CPC</th>
                <th className="text-right p-2 font-semibold">Conversions</th>
                <th className="text-right p-2 font-semibold">CPA</th>
                <th className="text-right p-2 font-semibold">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{campaign.name}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'PAUSED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(campaign.daily_budget_micros)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(campaign.cost_micros)}
                  </td>
                  <td className="p-2 text-right">
                    {campaign.impressions.toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    {campaign.clicks.toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    {formatPercent(campaign.ctr)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(campaign.cpc_micros)}
                  </td>
                  <td className="p-2 text-right">{campaign.conversions}</td>
                  <td className="p-2 text-right">
                    {campaign.cpa_micros
                      ? formatCurrency(campaign.cpa_micros)
                      : '-'}
                  </td>
                  <td className="p-2 text-right">
                    {campaign.roas ? `${campaign.roas.toFixed(2)}x` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

