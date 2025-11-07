'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Insight {
  id: string;
  type: string;
  priority: 'critical' | 'opportunity' | 'info';
  title: string;
  message: string;
  suggested_actions: string[];
  campaign_id?: string;
}

export default function InsightsMode() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
    // Refresh every 5 minutes
    const interval = setInterval(fetchInsights, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/insights');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch insights');
      }

      setInsights(data.insights || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'opportunity':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'opportunity':
        return '🟡';
      default:
        return '🟢';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading insights...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            {error}
            <Button onClick={fetchInsights} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No insights available. Connect your Google Ads account and wait for insights to generate.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Insights</CardTitle>
            <Button onClick={fetchInsights} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className={`border-l-4 ${getPriorityColor(insight.priority)}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {getPriorityIcon(insight.priority)}
                  </span>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{insight.message}</p>
              {insight.suggested_actions && insight.suggested_actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {insight.suggested_actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement action handlers
                        console.log('Action:', action);
                      }}
                    >
                      {action.replace(/_/g, ' ').replace(/\b\w/g, (l) =>
                        l.toUpperCase()
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

