'use client';

import { AlertTriangle, TrendingDown, TrendingUp, Minus, Activity, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { TrendChartCard } from './TrendChartCard';

interface AnomalyAnalysisCardProps {
  data: {
    title?: string;
    summary: string;
    findings: Array<{
      metric: string;
      channel: string;
      change: number;
      changeLabel?: string;
      impact: 'critical' | 'high' | 'medium' | 'low' | 'neutral';
      explanation: string;
      previousValue: number;
      currentValue: number;
      trend: 'up' | 'down' | 'neutral';
    }>;
    rootCause: string;
    recommendations: string[];
    anomaly?: {
      detected: boolean;
      date: string;
      severity: 'high' | 'medium' | 'low';
      affectedChannels: string[];
      affectedMetrics: string[];
    };
    timeSeries?: {
      labels: string[];
      roas: number[];
      cpc: number[];
      spend: number[];
      conversions: number[];
    };
  };
}

const impactColors = {
  critical: 'from-red-50 to-rose-50 border-red-300 text-red-700',
  high: 'from-orange-50 to-amber-50 border-orange-300 text-orange-700',
  medium: 'from-yellow-50 to-yellow-50 border-yellow-300 text-yellow-700',
  low: 'from-blue-50 to-indigo-50 border-blue-300 text-blue-700',
  neutral: 'from-gray-50 to-gray-50 border-gray-300 text-gray-700',
};

export function AnomalyAnalysisCard({ data }: AnomalyAnalysisCardProps) {
  const { title, summary, findings, rootCause, recommendations, anomaly, timeSeries } = data;

  const formatMetricValue = (metric: string, value: number) => {
    if (metric.includes('roas')) return `${value.toFixed(1)}x`;
    if (metric.includes('cpc') || metric.includes('cpa') || metric.includes('spend')) return `$${value.toFixed(2)}`;
    if (metric.includes('rate') || metric.includes('ctr')) return `${value.toFixed(2)}%`;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header with Anomaly Badge */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {title || 'Anomaly Analysis'}
            </h3>
            {anomaly?.detected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex items-center gap-2 mt-1"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span className="text-sm font-semibold text-red-600">
                  Anomaly Detected - {anomaly.severity.toUpperCase()} Severity
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl"
      >
        <p className="text-gray-900 font-semibold">{summary}</p>
      </motion.div>

      {/* Time Series Chart with Anomaly Highlight */}
      {timeSeries && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TrendChartCard
            data={{
              title: 'Performance Trend - Last 7 Days',
              labels: timeSeries.labels,
              datasets: [
                {
                  label: 'ROAS',
                  data: timeSeries.roas,
                  color: '#ef4444',
                },
                {
                  label: 'CPC',
                  data: timeSeries.cpc.map(c => c * 5), // Scale for visibility
                  color: '#f59e0b',
                },
              ],
              format: 'number',
              showTrend: true,
            }}
          />
          {/* Anomaly Indicator on Last Point */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="relative -mt-8 flex justify-end pr-4"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              />
              <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                ANOMALY
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Animated Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {findings.map((finding, idx) => {
          const TrendIcon = finding.trend === 'up' ? TrendingUp : finding.trend === 'down' ? TrendingDown : Minus;
          const isPositive = finding.change >= 0;
          const impactColor = impactColors[finding.impact] || impactColors.neutral;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-4 bg-gradient-to-br ${impactColor} border-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    finding.impact === 'critical' ? 'bg-red-100' :
                    finding.impact === 'high' ? 'bg-orange-100' :
                    'bg-yellow-100'
                  }`}>
                    <TrendIcon className={`w-4 h-4 ${
                      finding.trend === 'down' ? 'text-red-600' :
                      finding.trend === 'up' ? 'text-green-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 capitalize">
                      {finding.metric.replace('_', ' ')} - {finding.channel}
                    </div>
                    <div className="text-xs text-gray-600">{finding.changeLabel || 'Change'}</div>
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1, type: 'spring' }}
                  className={`text-lg font-bold ${
                    isPositive ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {isPositive ? '+' : ''}{finding.change.toFixed(1)}%
                </motion.div>
              </div>
              <div className="text-sm text-gray-700 mb-2">{finding.explanation}</div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Previous: {formatMetricValue(finding.metric, finding.previousValue)}</span>
                <span>→</span>
                <span className="font-semibold">Current: {formatMetricValue(finding.metric, finding.currentValue)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Root Cause */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Root Cause Analysis</h4>
            <p className="text-gray-700">{rootCause}</p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Recommended Actions
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-gray-700 group-hover:text-gray-900">{rec}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

