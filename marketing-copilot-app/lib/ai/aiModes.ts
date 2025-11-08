import { 
  Search, BarChart3, Calendar, Lightbulb, Sparkles, FileText, 
  DollarSign, TrendingUp, Palette, RefreshCw, Monitor, GitCompare,
  Stethoscope, ShieldCheck, Target, TrendingDown, Brain, BookOpen,
  HelpCircle, LucideIcon
} from 'lucide-react';

export type AIModeKey = 
  | 'insights' | 'research' | 'analyze' | 'plan' | 'create' | 'report'
  | 'allocate' | 'optimize' | 'design' | 'refresh' | 'monitor' | 'compare'
  | 'diagnose' | 'audit' | 'benchmark' | 'forecast' | 'strategize' | 'explain' | 'learn';

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

// Additional modes for "More" dropdown
export const MORE_MODES: AIMode[] = [
  {
    key: 'allocate',
    label: 'Allocate',
    icon: DollarSign,
    verbs: ['Allocate', 'Budget', 'Distribute'],
  },
  {
    key: 'optimize',
    label: 'Optimize',
    icon: TrendingUp,
    verbs: ['Optimize', 'Improve', 'Enhance'],
  },
  {
    key: 'design',
    label: 'Design',
    icon: Palette,
    verbs: ['Design', 'Create', 'Build'],
  },
  {
    key: 'refresh',
    label: 'Refresh',
    icon: RefreshCw,
    verbs: ['Refresh', 'Update', 'Renew'],
  },
  {
    key: 'monitor',
    label: 'Monitor',
    icon: Monitor,
    verbs: ['Monitor', 'Watch', 'Track'],
  },
  {
    key: 'compare',
    label: 'Compare',
    icon: GitCompare,
    verbs: ['Compare', 'Contrast', 'Evaluate'],
  },
  {
    key: 'diagnose',
    label: 'Diagnose',
    icon: Stethoscope,
    verbs: ['Diagnose', 'Investigate', 'Identify'],
  },
  {
    key: 'audit',
    label: 'Audit',
    icon: ShieldCheck,
    verbs: ['Audit', 'Review', 'Check'],
  },
  {
    key: 'benchmark',
    label: 'Benchmark',
    icon: Target,
    verbs: ['Benchmark', 'Compare', 'Measure'],
  },
  {
    key: 'forecast',
    label: 'Forecast',
    icon: TrendingDown,
    verbs: ['Forecast', 'Predict', 'Project'],
  },
  {
    key: 'strategize',
    label: 'Strategize',
    icon: Brain,
    verbs: ['Strategize', 'Plan', 'Design'],
  },
  {
    key: 'explain',
    label: 'Explain',
    icon: HelpCircle,
    verbs: ['Explain', 'Clarify', 'Describe'],
  },
  {
    key: 'learn',
    label: 'Learn',
    icon: BookOpen,
    verbs: ['Learn', 'Understand', 'Study'],
  },
];

export const MODE_PLACEHOLDERS: Record<AIModeKey, string> = {
  insights: 'Ask about your insights...',
  research: 'Research keywords, competitors, or audiences...',
  analyze: 'Analyze performance or compare campaigns...',
  plan: 'Plan budgets, timelines, or strategies...',
  create: 'Create campaigns, ads, or content...',
  report: 'Generate reports or explain results...',
  allocate: 'Allocate budget across campaigns...',
  optimize: 'Optimize bids, budgets, or targeting...',
  design: 'Design ad creative or landing pages...',
  refresh: 'Refresh stale creative or content...',
  monitor: 'Monitor campaign status and performance...',
  compare: 'Compare campaigns, periods, or metrics...',
  diagnose: 'Diagnose performance issues...',
  audit: 'Audit account health and compliance...',
  benchmark: 'Benchmark against industry standards...',
  forecast: 'Forecast future performance...',
  strategize: 'Strategize long-term optimization...',
  explain: 'Explain results in plain language...',
  learn: 'Learn about features and best practices...',
};

export const MODE_SUGGESTIONS: Record<AIModeKey, string[]> = {
  insights: ['Why did spend increase?', 'Show my latest insights', 'What needs attention?'],
  research: ['Find keywords for shoes', 'Who are my top competitors?', 'Research audience demographics'],
  analyze: ['Compare top 3 campaigns', 'Forecast next 30 days', 'Why did CPA spike?'],
  plan: ['Create Q2 plan with $20K budget', 'Adjust budget for campaign', 'Plan monthly strategy'],
  create: ['Write new ad copy', 'Duplicate best campaign', 'Create campaign for winter jackets'],
  report: ['Generate weekly summary', 'Explain Q4 ROAS drop', 'Create executive summary'],
  allocate: ['Allocate $10K across campaigns', 'Reallocate budget', 'Distribute budget by performance'],
  optimize: ['Optimize campaign X', 'Improve bids for keywords', 'Enhance targeting'],
  design: ['Design ad for product X', 'Create landing page', 'Build creative assets'],
  refresh: ['Refresh stale ads', 'Update creative for campaign X', 'Renew outdated content'],
  monitor: ['Monitor campaign X', 'Show me current spend', 'Track performance metrics'],
  compare: ['Compare campaign A vs B', 'Compare this week vs last week', 'Compare actual vs target'],
  diagnose: ['Why did CPA spike?', 'Diagnose campaign X performance', 'Find root cause'],
  audit: ['Audit my account', 'Check policy compliance', 'Review account settings'],
  benchmark: ['Benchmark my campaigns', 'Compare to industry average', 'Measure against competitors'],
  forecast: ['Forecast next month\'s performance', 'Predict budget needs', 'Project future trends'],
  strategize: ['Create Q2 strategy', 'Strategize for product launch', 'Plan long-term approach'],
  explain: ['Explain ROAS to my boss', 'What does this mean?', 'Clarify this metric'],
  learn: ['How do I use Performance Max?', 'Teach me about bidding', 'Learn best practices'],
};

