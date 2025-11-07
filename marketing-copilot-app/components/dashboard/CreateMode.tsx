'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ExtractedCampaign {
  campaign_name: string;
  daily_budget: number;
  campaign_type: string;
  goal: string;
  landing_page_url: string;
  targeting?: any;
  headlines: string[];
  descriptions: string[];
  budget_capped?: boolean;
}

export default function CreateMode() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedCampaign | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!input.trim()) {
      setError('Please describe your campaign');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/campaigns/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to extract campaign data');
      }

      setExtracted(data.campaign);
    } catch (err: any) {
      setError(err.message || 'Failed to extract campaign data');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!extracted) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign: extracted }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create campaign');
      }

      alert(`Campaign created successfully! Campaign ID: ${data.campaign_id}`);
      // Reset form
      setInput('');
      setExtracted(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (extracted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Your Campaign</CardTitle>
          <CardDescription>
            Review and edit the extracted campaign details before publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Name
            </label>
            <Input
              value={extracted.campaign_name}
              onChange={(e) =>
                setExtracted({ ...extracted, campaign_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Daily Budget ($)
            </label>
            <Input
              type="number"
              value={extracted.daily_budget}
              onChange={(e) =>
                setExtracted({
                  ...extracted,
                  daily_budget: Math.min(50, parseFloat(e.target.value) || 0),
                })
              }
              max={50}
            />
            {extracted.budget_capped && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ Budget capped at $50/day for demo accounts
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Landing Page URL
            </label>
            <Input
              type="url"
              value={extracted.landing_page_url}
              onChange={(e) =>
                setExtracted({ ...extracted, landing_page_url: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Headlines</label>
            {extracted.headlines.map((headline, idx) => (
              <Input
                key={idx}
                value={headline}
                onChange={(e) => {
                  const newHeadlines = [...extracted.headlines];
                  newHeadlines[idx] = e.target.value;
                  setExtracted({ ...extracted, headlines: newHeadlines });
                }}
                className="mb-2"
                maxLength={30}
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descriptions
            </label>
            {extracted.descriptions.map((desc, idx) => (
              <Input
                key={idx}
                value={desc}
                onChange={(e) => {
                  const newDescriptions = [...extracted.descriptions];
                  newDescriptions[idx] = e.target.value;
                  setExtracted({ ...extracted, descriptions: newDescriptions });
                }}
                className="mb-2"
                maxLength={90}
              />
            ))}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => setExtracted(null)}
              variant="outline"
              disabled={loading}
            >
              ← Back
            </Button>
            <Button onClick={handlePublish} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish to Google Ads'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign with AI</CardTitle>
        <CardDescription>
          Describe your campaign in natural language and AI will extract all the
          details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Campaign Description
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: I want to promote our winter jacket collection to women in cold climates. Budget is $50/day. We want sales, not just traffic."
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <Button onClick={handleExtract} disabled={loading || !input.trim()}>
          {loading ? 'Extracting...' : 'Build Campaign'}
        </Button>
      </CardContent>
    </Card>
  );
}

