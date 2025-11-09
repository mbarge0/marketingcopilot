'use client';

import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisCardProps {
  data: {
    title?: string;
    summary?: string;
    findings?: Array<{
      metric: string;
      change: string;
      impact: 'high' | 'medium' | 'low' | 'neutral';
      explanation: string;
    }>;
    rootCause?: string;
    recommendations?: string[];
  };
}

export function AnalysisCard({ data }: AnalysisCardProps) {
  const { title, summary, findings, rootCause, recommendations } = data;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border-red-300 shadow-sm';
      case 'medium':
        return 'text-yellow-700 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-sm';
      case 'low':
        return 'text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm';
      case 'neutral':
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-sm';
      default:
        return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-sm';
    }
  };

  return (
    <div className="space-y-6">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-green-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h3>
          <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
        </motion.div>
      )}

      {summary && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-md"
        >
          <p className="text-gray-700 font-medium leading-relaxed">{summary}</p>
        </motion.div>
      )}

      {findings && findings.length > 0 && (
        <div className="space-y-4">
          <motion.h4
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-gray-900 flex items-center gap-2 text-lg"
          >
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            Key Findings
          </motion.h4>
          <div className="space-y-3">
            {findings.map((finding, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`p-4 rounded-xl border-2 ${getImpactColor(finding.impact)} transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-base">{finding.metric}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1, type: 'spring' }}
                    className="text-sm font-bold px-3 py-1 bg-white/70 rounded-full"
                  >
                    {finding.change}
                  </motion.span>
                </div>
                <p className="text-sm mt-2 leading-relaxed">{finding.explanation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {rootCause && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl shadow-md"
        >
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Root Cause
          </h4>
          <p className="text-gray-700 leading-relaxed">{rootCause}</p>
        </motion.div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-3">
          <motion.h4
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="font-bold text-gray-900 flex items-center gap-2 text-lg"
          >
            <div className="p-1.5 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            Recommendations
          </motion.h4>
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, type: 'spring' }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 group"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1, type: 'spring' }}
                  className="mt-0.5 flex-shrink-0"
                >
                  <ArrowRight className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
                </motion.div>
                <span className="text-gray-700 font-medium flex-1 leading-relaxed">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

