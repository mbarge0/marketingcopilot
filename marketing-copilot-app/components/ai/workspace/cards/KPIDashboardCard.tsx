'use client';

import { TrendingUp, TrendingDown, DollarSign, Target, Zap, BarChart3, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPIDashboardCardProps {
  data: {
    title?: string;
    kpis: Array<{
      label: string;
      value: number | string;
      change?: number;
      changeLabel?: string;
      format?: 'currency' | 'number' | 'percentage';
      trend?: 'up' | 'down' | 'neutral';
      status?: 'good' | 'warning' | 'critical';
      icon?: 'dollar' | 'target' | 'zap' | 'chart';
    }>;
  };
}

const iconMap = {
  dollar: DollarSign,
  target: Target,
  zap: Zap,
  chart: BarChart3,
};

export function KPIDashboardCard({ data }: KPIDashboardCardProps) {
  const { title, kpis } = data;

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    if (format === 'currency') return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (format === 'percentage') return `${value.toFixed(1)}%`;
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const getStatusColor = (status?: string, change?: number) => {
    if (status === 'critical') return 'from-red-50 to-rose-50 border-red-300';
    if (status === 'warning') return 'from-yellow-50 to-amber-50 border-yellow-300';
    if (change !== undefined) {
      return change >= 0 ? 'from-green-50 to-emerald-50 border-green-300' : 'from-red-50 to-rose-50 border-red-300';
    }
    return 'from-blue-50 to-indigo-50 border-blue-300';
  };

  return (
    <div className="space-y-6">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon ? iconMap[kpi.icon] : BarChart3;
          const isPositive = kpi.change !== undefined && kpi.change >= 0;
          const statusColor = getStatusColor(kpi.status, kpi.change);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative p-6 bg-gradient-to-br ${statusColor} rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)]" />
              </div>

              <div className="relative z-10">
                {/* Icon and Label */}
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/80 rounded-lg backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  {kpi.status === 'critical' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </motion.div>
                  )}
                </div>

                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  {kpi.label}
                </div>

                {/* Value */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {formatValue(kpi.value, kpi.format)}
                </motion.div>

                {/* Change Indicator */}
                {kpi.change !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      isPositive ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(kpi.change)}%</span>
                    {kpi.changeLabel && (
                      <span className="text-gray-500 ml-1">({kpi.changeLabel})</span>
                    )}
                  </motion.div>
                )}

                {/* Status Badge */}
                {kpi.status && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.4 }}
                    className={`mt-3 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      kpi.status === 'good'
                        ? 'bg-green-100 text-green-700'
                        : kpi.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {kpi.status === 'good' ? 'On Track' : kpi.status === 'warning' ? 'Needs Attention' : 'Critical'}
                  </motion.div>
                )}
              </div>

              {/* Animated pulse effect for critical status */}
              {kpi.status === 'critical' && (
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

