'use client';

/**
 * Agent Response Renderer
 * Intelligently renders agent responses with visualizations based on response type
 * Supports text, report data with charts, and analysis with anomaly detection
 */

import React from 'react';
import { motion } from 'framer-motion';
import { parseAgentResponse, formatReportData, formatAnalyzeData } from '@/lib/ai/responseParser';
import { KPIDashboardCard } from '../workspace/cards/KPIDashboardCard';
import { AnomalyAnalysisCard } from '../workspace/cards/AnomalyAnalysisCard';
import { TrendChartCard } from '../workspace/cards/TrendChartCard';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AgentResponseRendererProps {
  response: string;
  isCompact?: boolean;
}

export function AgentResponseRenderer({ response, isCompact = false }: AgentResponseRendererProps) {
  const parsed = parseAgentResponse(response);
  const { text, data, type } = parsed;

  // For create and refresh responses, show success message
  if (type === 'create' && data) {
    return (
      <div className="space-y-3">
        {text && (
          <div className="text-sm text-gray-900 whitespace-pre-wrap">{text}</div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-green-900 mb-1">
              {data.entity.charAt(0).toUpperCase() + data.entity.slice(1)} Created Successfully
            </p>
            <p className="text-sm text-green-700">
              {data.message || `${data.entity} "${data.name}" has been created on ${data.channel}`}
            </p>
            {data.entityId && (
              <p className="text-xs text-green-600 mt-2 font-mono">ID: {data.entityId}</p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (type === 'refresh' && data) {
    return (
      <div className="space-y-3">
        {text && (
          <div className="text-sm text-gray-900 whitespace-pre-wrap">{text}</div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl"
        >
          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 mb-1">Data Refresh Complete</p>
            <p className="text-sm text-blue-700">
              {data.message || 'Your campaign data has been synced successfully'}
            </p>
            {data.updated && (
              <div className="text-xs text-blue-600 mt-2 space-x-3">
                <span>Campaigns: {data.updated.campaigns}</span>
                <span>Ad Sets: {data.updated.adsets}</span>
                <span>Ads: {data.updated.ads}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // For report type, show KPI dashboard and charts
  if (type === 'report' && data) {
    const reportData = formatReportData(data);
    
    if (!reportData) {
      return <div className="text-sm text-gray-900 whitespace-pre-wrap">{text}</div>;
    }

    return (
      <div className="space-y-6">
        {/* Text summary - only show if it's substantial and not just restating the data */}
        {text && text.length > 50 && !text.toLowerCase().includes('here\'s the performance report') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-900 bg-blue-50/50 border border-blue-100 rounded-lg p-3"
          >
            {text}
          </motion.div>
        )}

        {/* KPI Dashboard */}
        {reportData.kpis && reportData.kpis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <KPIDashboardCard
              data={{
                title: '📊 Performance Summary (Last 7 Days)',
                kpis: reportData.kpis,
              }}
            />
          </motion.div>
        )}

        {/* Time Series Chart */}
        {reportData.timeSeriesData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TrendChartCard
              data={{
                title: '📈 ROAS Trend - Daily Breakdown',
                labels: reportData.timeSeriesData.labels,
                datasets: reportData.timeSeriesData.datasets,
                format: 'number',
                showTrend: true,
              }}
            />
          </motion.div>
        )}

        {/* Channel Comparison */}
        {reportData.channels.google && reportData.channels.meta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
              <h4 className="text-sm font-bold text-blue-900 mb-3">Google Ads</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Spend:</span>
                  <span className="font-semibold text-blue-900">${reportData.channels.google.spend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">ROAS:</span>
                  <span className="font-semibold text-blue-900">{reportData.channels.google.roas.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">CPA:</span>
                  <span className="font-semibold text-blue-900">${reportData.channels.google.cpa.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-xl">
              <h4 className="text-sm font-bold text-indigo-900 mb-3">Meta Ads</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Spend:</span>
                  <span className="font-semibold text-indigo-900">${reportData.channels.meta.spend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">ROAS:</span>
                  <span className="font-semibold text-indigo-900">{reportData.channels.meta.roas.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">CPA:</span>
                  <span className="font-semibold text-indigo-900">${reportData.channels.meta.cpa.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // For analyze type, show anomaly detection and insights
  if (type === 'analyze' && data) {
    const analyzeData = formatAnalyzeData(data);
    
    if (!analyzeData) {
      return <div className="text-sm text-gray-900 whitespace-pre-wrap">{text}</div>;
    }

    return (
      <div className="space-y-6">
        {/* Text summary - only show if it's substantial and different from data summary */}
        {text && text.length > 50 && !text.toLowerCase().includes('i\'ve analyzed') && text !== analyzeData.summary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-900 bg-orange-50/50 border border-orange-100 rounded-lg p-3"
          >
            {text}
          </motion.div>
        )}

        {/* Anomaly Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnomalyAnalysisCard data={analyzeData} />
        </motion.div>
      </div>
    );
  }

  // Default: just render text
  return (
    <div className="text-sm text-gray-900 whitespace-pre-wrap">
      {text || response}
    </div>
  );
}

