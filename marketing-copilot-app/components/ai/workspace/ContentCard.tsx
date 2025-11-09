'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextCard } from './cards/TextCard';
import { TableCard } from './cards/TableCard';
import { ChartCard } from './cards/ChartCard';
import { AnalysisCard } from './cards/AnalysisCard';
import { FormCard } from './cards/FormCard';
import { KPIDashboardCard } from './cards/KPIDashboardCard';
import { TrendChartCard } from './cards/TrendChartCard';
import { ComparisonCard } from './cards/ComparisonCard';
import { AlertCard } from './cards/AlertCard';
import { AnomalyAnalysisCard } from './cards/AnomalyAnalysisCard';
import { motion } from 'framer-motion';

export interface ContentCardData {
  id: string;
  type: 'text' | 'table' | 'chart' | 'analysis' | 'form' | 'kpi' | 'trend' | 'comparison' | 'alert' | 'anomaly';
  title?: string;
  timestamp: Date;
  data: any;
}

interface ContentCardProps {
  card: ContentCardData;
  onUpdate?: (id: string, data: any) => void;
  index?: number;
}

export function ContentCard({ card, onUpdate, index = 0 }: ContentCardProps) {
  const renderCard = () => {
    switch (card.type) {
      case 'text':
        return <TextCard data={card.data} />;
      case 'table':
        return <TableCard data={card.data} />;
      case 'chart':
        return <ChartCard data={card.data} />;
      case 'analysis':
        return <AnalysisCard data={card.data} />;
      case 'form':
        return <FormCard data={card.data} onUpdate={onUpdate ? (data) => onUpdate(card.id, data) : undefined} />;
      case 'kpi':
        return <KPIDashboardCard data={card.data} />;
      case 'trend':
        return <TrendChartCard data={card.data} />;
      case 'comparison':
        return <ComparisonCard data={card.data} />;
      case 'alert':
        return <AlertCard data={card.data} />;
      case 'anomaly':
        return <AnomalyAnalysisCard data={card.data} />;
      default:
        return <TextCard data={card.data} />;
    }
  };

  const getCardGradient = () => {
    switch (card.type) {
      case 'table':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'chart':
        return 'from-purple-50 to-pink-50 border-purple-200';
      case 'analysis':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'form':
        return 'from-orange-50 to-amber-50 border-orange-200';
      case 'kpi':
        return 'from-indigo-50 to-blue-50 border-indigo-200';
      case 'trend':
        return 'from-purple-50 to-pink-50 border-purple-200';
      case 'comparison':
        return 'from-orange-50 to-red-50 border-orange-200';
      case 'alert':
        return 'from-red-50 to-orange-50 border-red-200';
      case 'anomaly':
        return 'from-red-50 to-orange-50 border-red-300';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      whileHover={{ y: -2 }}
      className="w-full"
    >
      <Card className={`w-full bg-gradient-to-br ${getCardGradient()} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
        {card.title && (
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {card.title}
              </CardTitle>
            </motion.div>
          </CardHeader>
        )}
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {renderCard()}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

