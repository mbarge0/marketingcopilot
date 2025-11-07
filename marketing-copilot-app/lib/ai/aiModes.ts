import { Search, BarChart3, Calendar, Lightbulb, Sparkles, FileText, LucideIcon } from 'lucide-react';

export type AIModeKey = 'insights' | 'research' | 'analyze' | 'plan' | 'create' | 'report';

export interface AIMode {
  key: AIModeKey;
  label: string;
  icon: LucideIcon;
  verbs: string[];
}

export const AI_MODES: AIMode[] = [
  {
    key: 'insights',
    label: 'Insights',
    icon: Lightbulb,
    verbs: ['Monitor', 'Analyze', 'Ask', 'Diagnose'],
  },
  {
    key: 'research',
    label: 'Research',
    icon: Search,
    verbs: ['Research', 'Learn', 'Benchmark', 'Audit'],
  },
  {
    key: 'analyze',
    label: 'Analyze',
    icon: BarChart3,
    verbs: ['Analyze', 'Compare', 'Benchmark', 'Forecast', 'Investigate'],
  },
  {
    key: 'plan',
    label: 'Plan',
    icon: Calendar,
    verbs: ['Plan', 'Budget', 'Schedule', 'Forecast'],
  },
  {
    key: 'create',
    label: 'Create',
    icon: Sparkles,
    verbs: ['Create', 'Launch', 'Write', 'Generate', 'Duplicate', 'Test'],
  },
  {
    key: 'report',
    label: 'Report',
    icon: FileText,
    verbs: ['Report', 'Export', 'Share', 'Explain', 'Recommend'],
  },
];

export const DEFAULT_MODE: AIModeKey = 'insights';

export const MODE_SUGGESTIONS: Record<AIModeKey, string[]> = {
  insights: ['Why did spend increase?', 'Show my latest insights', 'What needs attention?'],
  research: ['Find keywords for shoes', 'Who are my top competitors?', 'Research audience demographics'],
  analyze: ['Compare top 3 campaigns', 'Forecast next 30 days', 'Why did CPA spike?'],
  plan: ['Create Q2 plan with $20K budget', 'Adjust budget for campaign', 'Plan monthly strategy'],
  create: ['Write new ad copy', 'Duplicate best campaign', 'Create campaign for winter jackets'],
  report: ['Generate weekly summary', 'Explain Q4 ROAS drop', 'Create executive summary'],
};

export const MODE_PLACEHOLDERS: Record<AIModeKey, string> = {
  insights: 'Ask about your insights...',
  research: 'Research keywords, competitors, or audiences...',
  analyze: 'Analyze performance or compare campaigns...',
  plan: 'Plan budgets, timelines, or strategies...',
  create: 'Create campaigns, ads, or content...',
  report: 'Generate reports or explain results...',
};

