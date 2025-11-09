'use client';

import { BarChart3, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  data: {
    type: 'bar' | 'line' | 'pie' | 'metric';
    title?: string;
    labels?: string[];
    datasets?: Array<{
      label: string;
      data: number[];
      color?: string;
    }>;
    metrics?: Array<{
      label: string;
      value: number | string;
      change?: number;
      format?: 'currency' | 'number' | 'percentage';
    }>;
  };
}

export function ChartCard({ data }: ChartCardProps) {
  const { type, title, labels, datasets, metrics } = data;

  if (type === 'metric' && metrics) {
    return (
      <div className="space-y-6">
        {title && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          </motion.div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, idx) => {
            const formatValue = (value: number | string, format?: string) => {
              if (typeof value === 'string') return value;
              if (format === 'currency') return `$${value.toLocaleString()}`;
              if (format === 'percentage') return `${value}%`;
              return value.toLocaleString();
            };

            const isPositive = metric.change !== undefined && metric.change >= 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isPositive ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 
                  metric.change !== undefined ? 'bg-gradient-to-br from-red-50 to-rose-50' : 
                  'bg-gradient-to-br from-blue-50 to-indigo-50'
                }`} />
                
                <div className="relative z-10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {metric.label}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                      className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    >
                      {formatValue(metric.value, metric.format)}
                    </motion.div>
                    {metric.change !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
                          isPositive 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-red-700 bg-red-100'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(metric.change)}%</span>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Animated pulse effect for positive metrics */}
                  {isPositive && (
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'bar' && labels && datasets) {
    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    
    return (
      <div className="space-y-6">
        {title && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          </motion.div>
        )}
        <div className="space-y-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-lg">
          {labels.map((label, labelIdx) => {
            const dataset = datasets[0];
            const value = dataset.data[labelIdx] || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const color = dataset.color || '#3b82f6';
            
            return (
              <motion.div
                key={labelIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: labelIdx * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                  <span className="text-lg font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </span>
                </div>
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  transition={{ delay: labelIdx * 0.1 + 0.2, duration: 0.8 }}
                  className="h-8 rounded-lg shadow-md relative overflow-hidden group"
                  style={{ backgroundColor: color }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'line' && labels && datasets) {
    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    const minValue = Math.min(...datasets.flatMap(d => d.data));
    const range = maxValue - minValue || 1;
    
    return (
      <div className="space-y-6">
        {title && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          </motion.div>
        )}
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-lg">
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox={`0 0 ${labels.length * 100} 100`} preserveAspectRatio="none">
              {datasets.map((dataset, datasetIdx) => {
                const color = dataset.color || `hsl(${(datasetIdx * 60) % 360}, 70%, 50%)`;
                return (
                  <motion.polyline
                    key={datasetIdx}
                    points={dataset.data.map((value, idx) => {
                      const x = (idx / (labels.length - 1)) * 100;
                      const y = 100 - ((value - minValue) / range) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {labels.map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500 py-8">
      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
      <p>Chart visualization coming soon</p>
    </div>
  );
}

