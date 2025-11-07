'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ContentCardVariant = 'table' | 'chart' | 'list' | 'text' | 'form' | 'mixed';

interface ContentCardProps {
  title: string;
  children: ReactNode;
  variant?: ContentCardVariant;
  expandable?: boolean;
  collapsible?: boolean;
  loading?: boolean;
  error?: string | null;
  actions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  }>;
  onExploreMore?: () => void;
  className?: string;
}

export default function ContentCard({
  title,
  children,
  variant = 'mixed',
  expandable = false,
  collapsible = false,
  loading = false,
  error = null,
  actions = [],
  onExploreMore,
  className = '',
}: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  return (
    <Card className={`mb-4 hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className="h-8"
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="px-5 pb-5">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              {error && (
                <div className="text-red-600 text-sm py-4">{error}</div>
              )}
              {!loading && !error && (
                <>
                  {children}
                  {expandable && onExploreMore && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={onExploreMore}
                        className="w-full hover:bg-blue-50 hover:border-blue-500 transition-colors"
                      >
                        Explore more →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

