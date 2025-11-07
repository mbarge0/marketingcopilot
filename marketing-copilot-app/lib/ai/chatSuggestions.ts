/**
 * Context-Aware Chat Suggestions System
 * Provides mode-specific and view-specific suggestions for the ChatBar component
 */

export type ChatContext = 
  // Dashboard views (entity-based)
  | 'dashboard-campaigns'
  | 'dashboard-adgroups'
  | 'dashboard-ads'
  | 'dashboard-keywords'
  | 'dashboard-audiences'
  | 'dashboard-reports'
  // AI Workspace modes (verb-based)
  | 'ai-insights'
  | 'ai-research'
  | 'ai-analyze'
  | 'ai-plan'
  | 'ai-create'
  | 'ai-report'
  // Default fallback
  | 'default';

export interface ChatSuggestions {
  suggestions: string[];
  placeholder: string;
}

/**
 * Context-aware suggestions mapping
 * Each context has 3 clickable pill suggestions
 */
export const CHAT_SUGGESTIONS: Record<ChatContext, ChatSuggestions> = {
  // Dashboard - Campaigns
  'dashboard-campaigns': {
    suggestions: [
      'Why is ROAS dropping?',
      'Pause low performers',
      'Optimize budgets',
    ],
    placeholder: 'Ask about campaigns, performance, or budgets...',
  },

  // Dashboard - Ad Groups
  'dashboard-adgroups': {
    suggestions: [
      'Which ad groups have low CTR?',
      'Optimize bids',
      'Find winning creatives',
    ],
    placeholder: 'Ask about ad groups, bids, or performance...',
  },

  // Dashboard - Ads & Assets
  'dashboard-ads': {
    suggestions: [
      'Show best performing ads',
      'Why is this ad underperforming?',
      'Generate new ad copy',
    ],
    placeholder: 'Ask about ads, creatives, or performance...',
  },

  // Dashboard - Keywords
  'dashboard-keywords': {
    suggestions: [
      'Find negative keywords',
      'Show high-cost keywords',
      'Quality score issues',
    ],
    placeholder: 'Ask about keywords, bids, or quality scores...',
  },

  // Dashboard - Audiences
  'dashboard-audiences': {
    suggestions: [
      'Which audiences convert best?',
      'Create new audience',
      'Audience performance analysis',
    ],
    placeholder: 'Ask about audiences or targeting...',
  },

  // Dashboard - Reports
  'dashboard-reports': {
    suggestions: [
      'Generate performance report',
      'Export campaign data',
      'Create custom report',
    ],
    placeholder: 'Ask about reports or data exports...',
  },

  // AI Workspace - Insights
  'ai-insights': {
    suggestions: [
      'Explain this insight',
      'Show more opportunities',
      'What should I do?',
    ],
    placeholder: 'Ask about insights or recommendations...',
  },

  // AI Workspace - Research
  'ai-research': {
    suggestions: [
      'Find keywords for jackets',
      'Who are my competitors?',
      'Audience insights',
    ],
    placeholder: 'Research keywords, competitors, or audiences...',
  },

  // AI Workspace - Analyze
  'ai-analyze': {
    suggestions: [
      'Compare top 3 campaigns',
      'Why did CPA increase?',
      'Performance trends',
    ],
    placeholder: 'Analyze performance, trends, or comparisons...',
  },

  // AI Workspace - Plan
  'ai-plan': {
    suggestions: [
      'Create Q2 plan with $20K budget',
      'Adjust budget for campaign',
      'Plan monthly strategy',
    ],
    placeholder: 'Plan budgets, timelines, or strategies...',
  },

  // AI Workspace - Create
  'ai-create': {
    suggestions: [
      'Create campaign for winter jackets',
      'Generate ad copy',
      'Build Performance Max campaign',
    ],
    placeholder: 'Create campaigns, ads, or content...',
  },

  // AI Workspace - Report
  'ai-report': {
    suggestions: [
      'Generate executive summary',
      'Create performance report',
      'Export to PDF',
    ],
    placeholder: 'Generate reports or summaries...',
  },

  // Default fallback
  default: {
    suggestions: [
      'How can I help?',
      'Show me insights',
      'Get started',
    ],
    placeholder: 'Ask your AI Co-Pilot anything...',
  },
};

/**
 * Get suggestions for a given context
 */
export function getChatSuggestions(context: ChatContext): ChatSuggestions {
  return CHAT_SUGGESTIONS[context] || CHAT_SUGGESTIONS.default;
}

/**
 * Determine context from current route and mode
 */
export function getChatContext(
  pathname: string,
  mode?: string
): ChatContext {
  // AI Workspace modes
  if (pathname.startsWith('/ai')) {
    if (mode) {
      const aiContext = `ai-${mode}` as ChatContext;
      if (aiContext in CHAT_SUGGESTIONS) {
        return aiContext;
      }
    }
    return 'ai-insights'; // Default AI workspace context
  }

  // Dashboard views
  if (pathname.startsWith('/dashboard')) {
    if (pathname.includes('/ad-groups')) return 'dashboard-adgroups';
    if (pathname.includes('/ads')) return 'dashboard-ads';
    if (pathname.includes('/keywords')) return 'dashboard-keywords';
    if (pathname.includes('/audiences')) return 'dashboard-audiences';
    if (pathname.includes('/reports')) return 'dashboard-reports';
    return 'dashboard-campaigns'; // Default dashboard context
  }

  return 'default';
}

