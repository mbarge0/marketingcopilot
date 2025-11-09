'use client';

import { FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextCardProps {
  data: {
    content: string;
    format?: 'markdown' | 'plain';
  };
}

export function TextCard({ data }: TextCardProps) {
  const { content, format = 'plain' } = data;

  if (format === 'markdown') {
    // Simple markdown rendering (can be enhanced with a markdown library)
    const lines = content.split('\n');
    return (
      <div className="prose prose-sm max-w-none">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <motion.h1
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                {line.slice(2)}
              </motion.h1>
            );
          } else if (line.startsWith('## ')) {
            return (
              <motion.h2
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="text-xl font-semibold mb-2"
              >
                {line.slice(3)}
              </motion.h2>
            );
          } else if (line.startsWith('### ')) {
            return (
              <motion.h3
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="text-lg font-semibold mb-1"
              >
                {line.slice(4)}
              </motion.h3>
            );
          } else if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="ml-4 mb-1"
              >
                {line.slice(2)}
              </motion.li>
            );
          } else if (line.trim() === '') {
            return <br key={idx} />;
          } else {
            return (
              <motion.p
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="mb-2"
              >
                {line}
              </motion.p>
            );
          }
        })}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="p-2 bg-blue-100 rounded-lg"
        >
          <FileText className="w-5 h-5 text-blue-600" />
        </motion.div>
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 whitespace-pre-wrap leading-relaxed"
          >
            {content.split('\n').map((line, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.02 }}
                className="block mb-2"
              >
                {line}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

