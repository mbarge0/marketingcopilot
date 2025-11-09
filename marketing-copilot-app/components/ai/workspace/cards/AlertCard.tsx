'use client';

import { AlertTriangle, CheckCircle2, Info, XCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertCardProps {
  data: {
    title?: string;
    alerts: Array<{
      type: 'critical' | 'warning' | 'info' | 'success';
      title: string;
      message: string;
      action?: string;
      metric?: {
        label: string;
        value: number | string;
        format?: 'currency' | 'number' | 'percentage';
      };
    }>;
  };
}

const alertConfig = {
  critical: {
    icon: XCircle,
    bg: 'from-red-50 to-rose-50',
    border: 'border-red-300',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-300',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  info: {
    icon: Info,
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-300',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
  success: {
    icon: CheckCircle2,
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-300',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
  },
};

export function AlertCard({ data }: AlertCardProps) {
  const { title, alerts } = data;

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    if (format === 'currency') return `$${value.toLocaleString()}`;
    if (format === 'percentage') return `${value}%`;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
        </motion.div>
      )}
      <div className="space-y-4">
        {alerts.map((alert, idx) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ x: 4 }}
              className={`relative p-5 bg-gradient-to-br ${config.bg} border-2 ${config.border} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  className={`p-3 ${config.iconBg} rounded-lg flex-shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{alert.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                      {alert.type === 'critical' ? 'Critical' : 
                       alert.type === 'warning' ? 'Warning' :
                       alert.type === 'success' ? 'Success' : 'Info'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{alert.message}</p>
                  {alert.metric && (
                    <div className="mb-3 p-3 bg-white/60 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">{alert.metric.label}</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatValue(alert.metric.value, alert.metric.format)}
                      </div>
                    </div>
                  )}
                  {alert.action && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                        alert.type === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                        alert.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        alert.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {alert.action}
                    </motion.button>
                  )}
                </div>
              </div>
              {/* Pulse effect for critical alerts */}
              {alert.type === 'critical' && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
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

