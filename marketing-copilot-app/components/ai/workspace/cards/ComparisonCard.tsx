'use client';

import { ArrowUpRight, ArrowDownRight, Minus, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComparisonCardProps {
  data: {
    title?: string;
    comparison: {
      label: string;
      current: number;
      previous: number;
      format?: 'currency' | 'number' | 'percentage';
    }[];
    period?: {
      current: string;
      previous: string;
    };
  };
}

export function ComparisonCard({ data }: ComparisonCardProps) {
  const { title, comparison, period } = data;

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') return `$${value.toLocaleString()}`;
    if (format === 'percentage') return `${value}%`;
    return value.toLocaleString();
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
      isPositive: change >= 0,
      absValue: Math.abs(change),
    };
  };

  return (
    <div className="space-y-6">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
        </motion.div>
      )}
      {period && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>{period.current}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span>{period.previous}</span>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {comparison.map((item, idx) => {
          const change = calculateChange(item.current, item.previous);
          const maxValue = Math.max(item.current, item.previous);
          const currentWidth = maxValue > 0 ? (item.current / maxValue) * 100 : 0;
          const previousWidth = maxValue > 0 ? (item.previous / maxValue) * 100 : 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">{item.label}</span>
                {change && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2, type: 'spring' }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
                      change.isPositive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {change.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{change.absValue.toFixed(1)}%</span>
                  </motion.div>
                )}
              </div>

              {/* Comparison bars */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-600 font-medium">Current</div>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentWidth}%` }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-2"
                    >
                      <span className="text-xs font-bold text-white">
                        {formatValue(item.current, item.format)}
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-600 font-medium">Previous</div>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${previousWidth}%` }}
                      transition={{ delay: idx * 0.1 + 0.4, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-end pr-2"
                    >
                      <span className="text-xs font-bold text-white">
                        {formatValue(item.previous, item.format)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

