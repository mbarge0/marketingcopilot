'use client';

import { AIModeKey } from '@/lib/ai/aiModes';
import InsightsMode from './modes/InsightsMode';
import ResearchMode from './modes/ResearchMode';
import AnalyzeMode from './modes/AnalyzeMode';
import PlanMode from './modes/PlanMode';
import CreateMode from './modes/CreateMode';
import ReportMode from './modes/ReportMode';
import AllocateMode from './modes/AllocateMode';
import OptimizeMode from './modes/OptimizeMode';
import DesignMode from './modes/DesignMode';
import RefreshMode from './modes/RefreshMode';
import MonitorMode from './modes/MonitorMode';
import CompareMode from './modes/CompareMode';
import DiagnoseMode from './modes/DiagnoseMode';
import AuditMode from './modes/AuditMode';
import BenchmarkMode from './modes/BenchmarkMode';
import ForecastMode from './modes/ForecastMode';
import StrategizeMode from './modes/StrategizeMode';
import ExplainMode from './modes/ExplainMode';
import LearnMode from './modes/LearnMode';
import { motion } from 'framer-motion';

interface ModeCanvasProps {
  mode: AIModeKey;
}

const modeComponents: Record<AIModeKey, React.ComponentType> = {
  insights: InsightsMode,
  research: ResearchMode,
  analyze: AnalyzeMode,
  plan: PlanMode,
  create: CreateMode,
  report: ReportMode,
  allocate: AllocateMode,
  optimize: OptimizeMode,
  design: DesignMode,
  refresh: RefreshMode,
  monitor: MonitorMode,
  compare: CompareMode,
  diagnose: DiagnoseMode,
  audit: AuditMode,
  benchmark: BenchmarkMode,
  forecast: ForecastMode,
  strategize: StrategizeMode,
  explain: ExplainMode,
  learn: LearnMode,
};

export default function ModeCanvas({ mode }: ModeCanvasProps) {
  const ModeComponent = modeComponents[mode];

  if (!ModeComponent) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mode not found</h1>
          <p className="text-gray-600">The mode "{mode}" is not yet implemented.</p>
        </div>
      </div>
    );
  }

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

