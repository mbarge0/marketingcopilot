'use client';

import { AIModeKey } from '@/lib/ai/aiModes';
import InsightsMode from './modes/InsightsMode';
import ResearchMode from './modes/ResearchMode';
import AnalyzeMode from './modes/AnalyzeMode';
import PlanMode from './modes/PlanMode';
import CreateMode from './modes/CreateMode';
import ReportMode from './modes/ReportMode';
import { motion } from 'framer-motion';

interface ModeCanvasProps {
  mode: AIModeKey;
}

const modeComponents = {
  insights: InsightsMode,
  research: ResearchMode,
  analyze: AnalyzeMode,
  plan: PlanMode,
  create: CreateMode,
  report: ReportMode,
};

export default function ModeCanvas({ mode }: ModeCanvasProps) {
  const ModeComponent = modeComponents[mode];

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      <ModeComponent />
    </motion.div>
  );
}

