/**
 * Content Parser
 * Parses agent responses and extracts structured data for content cards
 */

import { ContentCardData } from '@/components/ai/workspace/ContentCard';

export function parseAgentResponse(
  response: string,
  userQuery: string
): ContentCardData[] {
  const cards: ContentCardData[] = [];
  const id = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Try to parse JSON from response (agent might return structured data)
  let parsedData: any = null;
  try {
    // Look for JSON in code blocks or plain JSON
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) ||
                     response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      parsedData = JSON.parse(jsonStr);
    }
  } catch (e) {
    // Not JSON, continue with text parsing
  }

  // Also check if response contains tool output patterns
  // Agent tools return JSON strings, so check for common patterns
  if (!parsedData) {
    try {
      // Look for patterns like: {"google": {...}, "meta": {...}}
      // Also check for escaped JSON strings
      const toolOutputMatch = response.match(/\{\s*"(google|meta)"\s*:\s*\{[\s\S]*\}\s*\}/) ||
                              response.match(/\\"google\\"|\\"meta\\"/);
      if (toolOutputMatch && !toolOutputMatch[0].includes('\\"')) {
        parsedData = JSON.parse(toolOutputMatch[0]);
      }
      
      // Try to find JSON-like structure in the response text
      if (!parsedData) {
        const jsonLikeMatch = response.match(/\{[^{}]*"(google|meta)"[^{}]*\{[^{}]*spend[^{}]*\d+[^{}]*\}[^{}]*\}/);
        if (jsonLikeMatch) {
          try {
            parsedData = JSON.parse(jsonLikeMatch[0]);
          } catch (e) {
            // Try to manually construct from text patterns
            const googleMatch = response.match(/google[:\s]*\{[^}]*spend[:\s]*(\d+)[^}]*\}/i);
            const metaMatch = response.match(/meta[:\s]*\{[^}]*spend[:\s]*(\d+)[^}]*\}/i);
            if (googleMatch || metaMatch) {
              parsedData = {};
              if (googleMatch) parsedData.google = { spend: parseFloat(googleMatch[1]) };
              if (metaMatch) parsedData.meta = { spend: parseFloat(metaMatch[1]) };
            }
          }
        }
      }
    } catch (e) {
      // Continue with text parsing
    }
  }

  // Check if response contains analysis keywords
  const isAnalysis = /analysis|analyze|findings|root cause|recommendations|insights/i.test(response) ||
                    /why did|what caused|explain/i.test(userQuery);

  // Check if response contains report/metrics keywords
  const isReport = /report|metrics|spend|roas|cpa|cpc|conversions|impressions|clicks/i.test(response) ||
                   /show me|get|report/i.test(userQuery);

  // Check if response contains table-like data
  const hasTable = /channel|google|meta|spend|impressions|clicks|conversions|roas|cpa|cpc/i.test(response) &&
                   /\d+/.test(response);

  // Check if response contains create/form keywords
  const isForm = /create|build|set up|configure|form/i.test(userQuery);

  if (parsedData) {
    // Handle structured data from tools
    // Check if this is an anomaly analysis (has anomaly detection)
    if (parsedData.anomaly && parsedData.anomaly.detected) {
      cards.push({
        id: `${id}-anomaly`,
        type: 'anomaly',
        title: parsedData.title || 'Anomaly Analysis',
        timestamp: new Date(),
        data: {
          summary: parsedData.summary,
          findings: parsedData.findings || [],
          rootCause: parsedData.rootCause,
          recommendations: parsedData.recommendations || [],
          anomaly: parsedData.anomaly,
          timeSeries: parsedData.timeSeries,
        },
      });
    } else if (parsedData.analysis || parsedData.findings) {
      cards.push({
        id: `${id}-analysis`,
        type: 'analysis',
        title: parsedData.title || 'Performance Analysis',
        timestamp: new Date(),
        data: {
          summary: parsedData.summary,
          findings: parsedData.findings || parsedData.analysis?.findings,
          rootCause: parsedData.rootCause || parsedData.analysis?.rootCause,
          recommendations: parsedData.recommendations || parsedData.analysis?.recommendations,
        },
      });
    }

    if (parsedData.google || parsedData.meta || parsedData.channels) {
      // Campaign report data - create rich visualizations
      const channels = parsedData.google || parsedData.meta ? 
        [parsedData.google && 'google', parsedData.meta && 'meta'].filter(Boolean) :
        Object.keys(parsedData.channels || {});

      const enrichedData = channels.map((channel: string) => {
        const data = parsedData[channel] || parsedData.channels?.[channel];
        if (!data) return null;
        
        const spend = data.spend || 0;
        const impressions = data.impressions || 0;
        const clicks = data.clicks || 0;
        const conversions = data.conversions || 0;
        const roas = data.roas || 0;
        const cpa = data.cpa || 0;
        const cpc = data.cpc || 0;
        
        // Calculate derived metrics
        const ctr = clicks > 0 && impressions > 0 ? (clicks / impressions) * 100 : 0;
        const conversionRate = clicks > 0 && conversions > 0 ? (conversions / clicks) * 100 : 0;
        const revenue = roas > 0 ? spend * roas : 0;
        
        return {
          channel: channel.charAt(0).toUpperCase() + channel.slice(1),
          spend,
          impressions,
          clicks,
          conversions,
          roas,
          cpa,
          cpc,
          ctr,
          conversionRate,
          revenue,
          dailyData: data.dailyData || null, // Include daily data if available
        };
      }).filter(Boolean);

      if (enrichedData.length > 0) {
        // Check if we have daily data for trend visualization
        const hasDailyData = enrichedData.some((d: any) => d.dailyData && d.dailyData.length > 0);
        
        // Create KPI Dashboard Card
        const kpis = enrichedData.flatMap((data: any) => [
          {
            label: `${data.channel} Spend`,
            value: data.spend,
            format: 'currency' as const,
            icon: 'dollar' as const,
            status: data.spend > 1000 ? 'good' as const : undefined,
          },
          {
            label: `${data.channel} Revenue`,
            value: data.revenue,
            format: 'currency' as const,
            icon: 'target' as const,
            status: data.revenue > data.spend * 2 ? 'good' as const : undefined,
          },
          {
            label: `${data.channel} ROAS`,
            value: data.roas,
            format: 'number' as const,
            icon: 'chart' as const,
            status: data.roas >= 3 ? 'good' as const : data.roas < 2 ? 'critical' as const : 'warning' as const,
          },
          {
            label: `${data.channel} Conversions`,
            value: data.conversions,
            format: 'number' as const,
            icon: 'zap' as const,
          },
        ]);

        if (kpis.length > 0) {
          cards.push({
            id: `${id}-kpi`,
            type: 'kpi',
            title: 'Key Performance Indicators',
            timestamp: new Date(),
            data: { kpis: kpis.slice(0, 8) }, // Limit to 8 KPIs
          });
        }

        // Create trend chart if daily data is available
        if (hasDailyData) {
          enrichedData.forEach((channelData: any) => {
            if (channelData.dailyData && channelData.dailyData.length > 0) {
              const dailyData = channelData.dailyData;
              const labels = dailyData.map((d: any) => {
                const date = new Date(d.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              });
              
              cards.push({
                id: `${id}-trend-${channelData.channel.toLowerCase()}`,
                type: 'trend',
                title: `${channelData.channel} Performance Trend - Last 7 Days`,
                timestamp: new Date(),
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'ROAS',
                      data: dailyData.map((d: any) => d.roas),
                      color: '#ef4444',
                    },
                    {
                      label: 'CPC',
                      data: dailyData.map((d: any) => d.cpc * 5), // Scale for visibility
                      color: '#f59e0b',
                    },
                  ],
                  format: 'number',
                  showTrend: true,
                },
              });
            }
          });
        }

        // Create comprehensive table with all metrics
        const headers = ['Channel', 'Spend', 'Impressions', 'Clicks', 'CTR', 'Conversions', 'Conv. Rate', 'ROAS', 'Revenue', 'CPA', 'CPC'];
        const rows: (string | number)[][] = enrichedData.map((data: any) => [
          data.channel,
          data.spend,
          data.impressions,
          data.clicks,
          data.ctr,
          data.conversions,
          data.conversionRate,
          data.roas,
          data.revenue,
          data.cpa,
          data.cpc,
        ]);

        cards.push({
          id: `${id}-table`,
          type: 'table',
          title: 'Campaign Performance Report',
          timestamp: new Date(),
          data: { headers, rows, sortable: true },
        });

        // Create comparison bar chart if multiple channels
        if (enrichedData.length > 1) {
          cards.push({
            id: `${id}-comparison`,
            type: 'chart',
            title: 'Channel Comparison',
            timestamp: new Date(),
            data: {
              type: 'bar',
              labels: enrichedData.map((d: any) => d.channel),
              datasets: [
                {
                  label: 'Spend',
                  data: enrichedData.map((d: any) => d.spend),
                  color: '#3b82f6',
                },
                {
                  label: 'Revenue',
                  data: enrichedData.map((d: any) => d.revenue),
                  color: '#10b981',
                },
              ],
            },
          });
        }

        // Create alerts for critical issues
        const alerts: any[] = [];
        enrichedData.forEach((data: any) => {
          if (data.roas < 2) {
            alerts.push({
              type: 'critical' as const,
              title: `Low ROAS Alert: ${data.channel}`,
              message: `ROAS of ${data.roas.toFixed(2)}x is below optimal threshold. Consider optimizing targeting or pausing underperforming ads.`,
              metric: {
                label: 'Current ROAS',
                value: data.roas,
                format: 'number' as const,
              },
              action: 'Optimize Campaign',
            });
          }
          if (data.cpa > 50) {
            alerts.push({
              type: 'warning' as const,
              title: `High CPA Alert: ${data.channel}`,
              message: `CPA of $${data.cpa.toFixed(2)} exceeds target. Review bid strategy and ad relevance.`,
              metric: {
                label: 'Current CPA',
                value: data.cpa,
                format: 'currency' as const,
              },
            });
          }
          if (data.ctr < 1) {
            alerts.push({
              type: 'warning' as const,
              title: `Low CTR Alert: ${data.channel}`,
              message: `CTR of ${data.ctr.toFixed(2)}% is below average. Consider improving ad copy and targeting.`,
              metric: {
                label: 'Current CTR',
                value: data.ctr,
                format: 'percentage' as const,
              },
            });
          }
        });

        if (alerts.length > 0) {
          cards.push({
            id: `${id}-alert`,
            type: 'alert',
            title: 'Performance Alerts',
            timestamp: new Date(),
            data: { alerts },
          });
        }
      }
    }
  } else if (isAnalysis) {
    // Parse analysis from text
    const findings: any[] = [];
    const recommendations: string[] = [];
    let rootCause = '';

    // Extract findings
    const findingsMatch = response.match(/findings?:?\s*([\s\S]*?)(?:root cause|recommendations|$)/i);
    if (findingsMatch) {
      const findingsText = findingsMatch[1];
      const findingLines = findingsText.split(/\n/).filter(line => 
        /metric|change|impact|explanation/i.test(line) || 
        /\+?\d+%|increase|decrease|stable/i.test(line)
      );
      // Simple extraction - can be enhanced
    }

    // Extract root cause
    const rootCauseMatch = response.match(/root cause:?\s*([^\n]+)/i);
    if (rootCauseMatch) {
      rootCause = rootCauseMatch[1].trim();
    }

    // Extract recommendations
    const recMatch = response.match(/recommendations?:?\s*([\s\S]*?)(?:$|summary|conclusion)/i);
    if (recMatch) {
      const recText = recMatch[1];
      recommendations.push(...recText.split(/\n/).filter(line => 
        line.trim().length > 0 && !line.match(/^\s*[-*]\s*$/)
      ).map(line => line.replace(/^\s*[-*•]\s*/, '').trim()));
    }

    cards.push({
      id: `${id}-analysis`,
      type: 'analysis',
      title: 'Performance Analysis',
      timestamp: new Date(),
      data: {
        summary: response.split('\n')[0],
        findings: findings.length > 0 ? findings : undefined,
        rootCause: rootCause || undefined,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
      },
    });
  } else if (hasTable && isReport) {
    // Try to extract table data from text and create richer visualizations
    const lines = response.split('\n').filter(line => line.trim());
    const metrics: Record<string, number> = {};
    
    const metricPatterns = [
      { key: 'spend', pattern: /spend[:\s]*\$?([\d,]+\.?\d*)/i },
      { key: 'impressions', pattern: /impressions?[:\s]*([\d,]+)/i },
      { key: 'clicks', pattern: /clicks?[:\s]*([\d,]+)/i },
      { key: 'conversions', pattern: /conversions?[:\s]*([\d,]+)/i },
      { key: 'roas', pattern: /(?:roas|return on ad spend)[:\s]*([\d.]+)/i },
      { key: 'cpa', pattern: /(?:cpa|cost per acquisition)[:\s]*\$?([\d.]+)/i },
      { key: 'cpc', pattern: /(?:cpc|cost per click)[:\s]*\$?([\d.]+)/i },
    ];

    lines.forEach(line => {
      metricPatterns.forEach(({ key, pattern }) => {
        const match = line.match(pattern);
        if (match) {
          metrics[key] = parseFloat(match[1].replace(/,/g, ''));
        }
      });
    });

    if (Object.keys(metrics).length > 0) {
      // Calculate derived metrics
      const ctr = metrics.clicks && metrics.impressions ? (metrics.clicks / metrics.impressions) * 100 : 0;
      const conversionRate = metrics.clicks && metrics.conversions ? (metrics.conversions / metrics.clicks) * 100 : 0;
      const revenue = metrics.spend && metrics.roas ? metrics.spend * metrics.roas : 0;

      // Create KPI Dashboard
      const kpis = [
        { label: 'Spend', value: metrics.spend, format: 'currency' as const, icon: 'dollar' as const },
        { label: 'Revenue', value: revenue, format: 'currency' as const, icon: 'target' as const },
        { label: 'ROAS', value: metrics.roas, format: 'number' as const, icon: 'chart' as const, status: metrics.roas >= 3 ? 'good' as const : metrics.roas < 2 ? 'critical' as const : undefined },
        { label: 'Conversions', value: metrics.conversions, format: 'number' as const, icon: 'zap' as const },
      ].filter(kpi => kpi.value !== undefined && kpi.value > 0);

      if (kpis.length > 0) {
        cards.push({
          id: `${id}-kpi`,
          type: 'kpi',
          title: 'Key Performance Indicators',
          timestamp: new Date(),
          data: { kpis },
        });
      }

      // Create comprehensive table
      const headers = ['Metric', 'Value'];
      const rows: (string | number)[][] = [];
      if (metrics.spend) rows.push(['Spend', metrics.spend]);
      if (metrics.impressions) rows.push(['Impressions', metrics.impressions]);
      if (metrics.clicks) rows.push(['Clicks', metrics.clicks]);
      if (ctr > 0) rows.push(['CTR', ctr]);
      if (metrics.conversions) rows.push(['Conversions', metrics.conversions]);
      if (conversionRate > 0) rows.push(['Conversion Rate', conversionRate]);
      if (metrics.roas) rows.push(['ROAS', metrics.roas]);
      if (revenue > 0) rows.push(['Revenue', revenue]);
      if (metrics.cpa) rows.push(['CPA', metrics.cpa]);
      if (metrics.cpc) rows.push(['CPC', metrics.cpc]);

      if (rows.length > 0) {
        cards.push({
          id: `${id}-table`,
          type: 'table',
          title: 'Campaign Performance Metrics',
          timestamp: new Date(),
          data: { headers, rows, sortable: true },
        });
      }

      // Create alerts for critical issues
      const alerts: any[] = [];
      if (metrics.roas && metrics.roas < 2) {
        alerts.push({
          type: 'critical' as const,
          title: 'Low ROAS Alert',
          message: `ROAS of ${metrics.roas.toFixed(2)}x is below optimal threshold. Consider optimizing targeting or pausing underperforming ads.`,
          metric: { label: 'Current ROAS', value: metrics.roas, format: 'number' as const },
          action: 'Optimize Campaign',
        });
      }
      if (metrics.cpa && metrics.cpa > 50) {
        alerts.push({
          type: 'warning' as const,
          title: 'High CPA Alert',
          message: `CPA of $${metrics.cpa.toFixed(2)} exceeds target. Review bid strategy and ad relevance.`,
          metric: { label: 'Current CPA', value: metrics.cpa, format: 'currency' as const },
        });
      }
      if (ctr > 0 && ctr < 1) {
        alerts.push({
          type: 'warning' as const,
          title: 'Low CTR Alert',
          message: `CTR of ${ctr.toFixed(2)}% is below average. Consider improving ad copy and targeting.`,
          metric: { label: 'Current CTR', value: ctr, format: 'percentage' as const },
        });
      }

      if (alerts.length > 0) {
        cards.push({
          id: `${id}-alert`,
          type: 'alert',
          title: 'Performance Alerts',
          timestamp: new Date(),
          data: { alerts },
        });
      }
    }
  }

  // Always add a text card with the full response
  if (cards.length === 0 || response.length > 200) {
    cards.push({
      id: `${id}-text`,
      type: 'text',
      title: 'Response',
      timestamp: new Date(),
      data: {
        content: response,
        format: 'plain',
      },
    });
  }

  return cards;
}

