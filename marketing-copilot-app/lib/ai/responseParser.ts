/**
 * Response Parser Utility
 * Extracts structured JSON data from agent responses for visualization
 */

export interface ParsedResponse {
  text: string;
  data: any | null;
  type: 'report' | 'analyze' | 'create' | 'refresh' | 'text';
}

/**
 * Detects the type of response based on content
 */
function detectResponseType(data: any, text: string): ParsedResponse['type'] {
  if (!data) return 'text';
  
  // Check for analyze response (has findings, rootCause, recommendations)
  if (data.findings && data.rootCause && data.recommendations) {
    return 'analyze';
  }
  
  // Check for analyze structure (in case it's nested)
  if (data.summary && data.findings && data.anomaly) {
    return 'analyze';
  }
  
  // Check for report response (has channel data with metrics)
  if ((data.google || data.meta) && (data.google?.spend !== undefined || data.meta?.spend !== undefined)) {
    return 'report';
  }
  
  // Check for create response
  if (data.success && data.entity && data.entityId) {
    return 'create';
  }
  
  // Check for refresh response
  if (data.success && data.updated) {
    return 'refresh';
  }
  
  return 'text';
}

/**
 * Extract JSON from text (handles code blocks and inline JSON)
 */
function extractJSON(text: string): any | null {
  if (!text) return null;
  
  // Try to find JSON in code blocks first
  const codeBlockPattern = /```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/g;
  const codeBlockMatches = text.matchAll(codeBlockPattern);
  
  for (const match of codeBlockMatches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (e) {
      // Continue to next match
    }
  }
  
  // Try to find JSON without code blocks
  const jsonPattern = /(\{[\s\S]*?\}|\[[\s\S]*?\])/g;
  const matches = text.matchAll(jsonPattern);
  
  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1]);
      // Validate that it's a meaningful object (not just empty or single prop)
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    } catch (e) {
      // Continue to next match
    }
  }
  
  return null;
}

/**
 * Clean text by removing JSON blocks and extra whitespace
 */
function cleanText(text: string, jsonData: any | null): string {
  if (!jsonData) return text.trim();
  
  let cleaned = text;
  
  // Remove code blocks with JSON
  cleaned = cleaned.replace(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/g, '');
  
  // If we found the exact JSON string in the text, remove it
  try {
    const jsonString = JSON.stringify(jsonData, null, 2);
    cleaned = cleaned.replace(jsonString, '');
  } catch (e) {
    // Ignore
  }
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
}

/**
 * Parse agent response to extract structured data and clean text
 */
export function parseAgentResponse(responseText: string): ParsedResponse {
  const jsonData = extractJSON(responseText);
  const cleanedText = cleanText(responseText, jsonData);
  const type = detectResponseType(jsonData, responseText);
  
  return {
    text: cleanedText,
    data: jsonData,
    type,
  };
}

/**
 * Format report data for visualization
 */
export function formatReportData(data: any) {
  if (!data) return null;
  
  const { google, meta } = data;
  
  // Build KPI metrics for dashboard
  const kpis = [];
  
  if (google) {
    kpis.push(
      {
        label: 'Google Ads - Total Spend',
        value: google.spend,
        format: 'currency' as const,
        icon: 'dollar' as const,
      },
      {
        label: 'Google Ads - ROAS',
        value: google.roas,
        format: 'number' as const,
        icon: 'target' as const,
        change: google.dailyData && google.dailyData.length >= 2 
          ? ((google.roas - google.dailyData[0].roas) / google.dailyData[0].roas) * 100
          : undefined,
      },
      {
        label: 'Google Ads - Conversions',
        value: google.conversions,
        format: 'number' as const,
        icon: 'zap' as const,
      }
    );
  }
  
  if (meta) {
    kpis.push(
      {
        label: 'Meta Ads - Total Spend',
        value: meta.spend,
        format: 'currency' as const,
        icon: 'dollar' as const,
      },
      {
        label: 'Meta Ads - ROAS',
        value: meta.roas,
        format: 'number' as const,
        icon: 'target' as const,
        change: meta.dailyData && meta.dailyData.length >= 2 
          ? ((meta.roas - meta.dailyData[0].roas) / meta.dailyData[0].roas) * 100
          : undefined,
      },
      {
        label: 'Meta Ads - Conversions',
        value: meta.conversions,
        format: 'number' as const,
        icon: 'zap' as const,
      }
    );
  }
  
  // Build time series data for charts (if daily data exists)
  let timeSeriesData = null;
  if (google?.dailyData || meta?.dailyData) {
    const googleDaily = google?.dailyData || [];
    const metaDaily = meta?.dailyData || [];
    const allLabels = [...new Set([
      ...googleDaily.map((d: any) => d.date),
      ...metaDaily.map((d: any) => d.date)
    ])].sort();
    
    timeSeriesData = {
      labels: allLabels.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [
        ...(google?.dailyData ? [{
          label: 'Google ROAS',
          data: google.dailyData.map((d: any) => d.roas),
          color: '#4285F4',
        }] : []),
        ...(meta?.dailyData ? [{
          label: 'Meta ROAS',
          data: meta.dailyData.map((d: any) => d.roas),
          color: '#1877F2',
        }] : []),
      ],
    };
  }
  
  return {
    kpis,
    timeSeriesData,
    channels: { google, meta },
  };
}

/**
 * Format analyze data for visualization
 */
export function formatAnalyzeData(data: any) {
  if (!data) return null;
  
  // The data should already be in the correct format from the tool
  // but we'll ensure it has all required fields
  return {
    title: 'Performance Analysis',
    summary: data.summary || 'Analysis complete',
    findings: data.findings || [],
    rootCause: data.rootCause || '',
    recommendations: data.recommendations || [],
    anomaly: data.anomaly,
    timeSeries: data.timeSeries || null,
  };
}

