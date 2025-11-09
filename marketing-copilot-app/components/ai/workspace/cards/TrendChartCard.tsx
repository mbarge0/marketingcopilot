'use client';

import { TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendChartCardProps {
  data: {
    title?: string;
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      color?: string;
    }>;
    format?: 'currency' | 'number' | 'percentage';
    showTrend?: boolean;
  };
}

export function TrendChartCard({ data }: TrendChartCardProps) {
  const { title, labels, datasets, format, showTrend } = data;

  const formatValue = (value: number) => {
    if (format === 'currency') return `$${value.toLocaleString()}`;
    if (format === 'percentage') return `${value}%`;
    return value.toLocaleString();
  };

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return null;
    const first = data[0];
    const last = data[data.length - 1];
    if (first === 0) return null;
    const change = ((last - first) / first) * 100;
    return {
      value: change,
      isPositive: change >= 0,
    };
  };

  const maxValue = Math.max(...datasets.flatMap(d => d.data));
  const minValue = Math.min(...datasets.flatMap(d => d.data));
  const range = maxValue - minValue || 1;
  
  // Detect anomaly on last point (if it's significantly different)
  const lastIndex = labels.length - 1;
  const hasAnomaly = data.showTrend && datasets[0] && lastIndex > 0;
  const anomalyThreshold = 0.15; // 15% change threshold

  return (
    <div className="space-y-6">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          </div>
          {showTrend && datasets[0] && (
            <div className="flex items-center gap-2">
              {(() => {
                const trend = calculateTrend(datasets[0].data);
                if (!trend) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      trend.isPositive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(trend.value).toFixed(1)}%</span>
                  </motion.div>
                );
              })()}
            </div>
          )}
        </motion.div>
      )}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-lg">
        <div className="space-y-6">
          {datasets.map((dataset, datasetIdx) => {
            const color = dataset.color || `hsl(${(datasetIdx * 60) % 360}, 70%, 50%)`;
            const trend = calculateTrend(dataset.data);

            return (
              <div key={datasetIdx} className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-semibold text-gray-700">{dataset.label}</span>
                  </div>
                  {trend && (
                    <span className={`text-xs font-semibold ${
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="relative h-48 bg-gray-50 rounded-lg p-4 overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-gray-200" />
                    ))}
                  </div>
                  {/* Chart line */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ padding: '16px' }}>
                    {(() => {
                      const isAnomaly = datasetIdx === 0 && lastIndex > 0;
                      const prevValue = dataset.data[lastIndex - 1];
                      const lastValue = dataset.data[lastIndex];
                      const changePercent = prevValue > 0 ? Math.abs((lastValue - prevValue) / prevValue) : 0;
                      const showAnomalyIndicator = isAnomaly && changePercent > anomalyThreshold;
                      
                      return (
                        <>
                          <motion.polyline
                            points={dataset.data.map((value, idx) => {
                              const x = (idx / (labels.length - 1)) * 100;
                              const y = 100 - ((value - minValue) / range) * 100;
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke={color}
                            strokeWidth={showAnomalyIndicator ? "3" : "2"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                              pathLength: 1, 
                              opacity: 1,
                            }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                          {/* Data points */}
                          {dataset.data.map((value, idx) => {
                            const x = (idx / (labels.length - 1)) * 100;
                            const y = 100 - ((value - minValue) / range) * 100;
                            const isLastPoint = idx === lastIndex;
                            const isAnomalyPoint = isLastPoint && showAnomalyIndicator;
                            
                            return (
                              <motion.circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r={isAnomalyPoint ? "2" : "1.5"}
                                fill={color}
                                initial={{ scale: 0 }}
                                animate={{ 
                                  scale: isAnomalyPoint ? [0, 1.5, 1] : 1,
                                  r: isAnomalyPoint ? ["1.5", "2.5", "2"] : "1.5"
                                }}
                                transition={{ delay: idx * 0.05, type: 'spring' }}
                              >
                                {isAnomalyPoint && (
                                  <animate
                                    attributeName="r"
                                    values="2;3;2"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                )}
                              </motion.circle>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                  {labels.map((label, idx) => (
                    <span key={idx} className="truncate max-w-[60px] text-center" style={{ marginLeft: idx === 0 ? '0' : '-20px', marginRight: idx === labels.length - 1 ? '0' : '-20px' }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

