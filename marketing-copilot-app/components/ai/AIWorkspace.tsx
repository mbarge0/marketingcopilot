'use client';

import { useState } from 'react';
import { useAIContext } from '@/lib/ai/context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ai/workspace/ContentCard';
import { 
  Lightbulb, 
  Search, 
  BarChart3, 
  Sparkles, 
  FileText,
  TrendingUp,
  Target,
  Zap,
  MessageSquare
} from 'lucide-react';

export default function AIWorkspace() {
  const { askedQuestions, contentCards, updateContentCard } = useAIContext();
  const hasActivity = askedQuestions.length > 0 || contentCards.length > 0;

  const quickActions = [
    {
      icon: Lightbulb,
      title: 'Get Insights',
      description: 'Analyze campaign performance and get recommendations',
      prompt: 'Show me insights about my campaigns',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Search,
      title: 'Research',
      description: 'Find keywords, competitors, and audience insights',
      prompt: 'Research keywords for my product',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'Deep dive into performance metrics and trends',
      prompt: 'Analyze my campaign performance',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      icon: Sparkles,
      title: 'Create',
      description: 'Build new campaigns and ad copy with AI',
      prompt: 'Create a campaign for my product',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      icon: FileText,
      title: 'Report',
      description: 'Generate reports and summaries',
      prompt: 'Generate a performance report',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Optimize',
      description: 'Improve bids, budgets, and targeting',
      prompt: 'Optimize my campaigns',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    },
  ];

  const handleQuickAction = (prompt: string) => {
    // Find the chat input and set the value
    const chatInput = document.querySelector('input[placeholder*="Ask"]') as HTMLInputElement;
    if (chatInput) {
      chatInput.value = prompt;
      chatInput.focus();
      // Trigger input event to update React state
      const event = new Event('input', { bubbles: true });
      chatInput.dispatchEvent(event);
    }
  };

  if (hasActivity) {
    // Show workspace with content cards when there's activity
    return (
      <div className="min-h-full p-6 w-full">
        <div className="w-full max-w-none pr-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Workspace</h1>
            <p className="text-gray-600">Your AI-powered marketing command center</p>
          </div>
          
          {/* Content Cards Area */}
          <div className="grid gap-6">
            {contentCards.length > 0 ? (
              contentCards.map((card, index) => (
                <ContentCard
                  key={card.id}
                  card={card}
                  onUpdate={updateContentCard}
                  index={index}
                />
              ))
            ) : (
              <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium mb-1">Your AI responses and content will appear here</p>
                    <p className="text-xs text-gray-400">Start a conversation using the AI panel on the right</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show getting started guidance when no activity
  return (
    <div className="min-h-full p-6 w-full">
      <div className="w-full max-w-none pr-8">
        {/* Welcome Section */}
        <div className="text-center mb-12 mt-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
            <Zap className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Workspace
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered marketing command center. Ask questions, get insights, create campaigns, and optimize performance—all through natural conversation.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={idx}
                  className={`cursor-pointer transition-all ${action.color} border-2`}
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-white ${action.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Getting Started Tips */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Getting Started
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium mb-1">Start a conversation</p>
                  <p className="text-sm text-gray-600">Type your question or request in the AI panel on the right, or use voice input with the microphone</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium mb-1">Get AI-powered insights</p>
                  <p className="text-sm text-gray-600">The AI will analyze your campaigns and provide actionable recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium mb-1">View results in workspace</p>
                  <p className="text-sm text-gray-600">All responses and content cards will appear in this central workspace area</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium mb-1">Use voice input</p>
                  <p className="text-sm text-gray-600">Click the microphone icon in the AI panel to speak your questions naturally</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Prompts */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Try asking:</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Why did my CPA increase last week?',
              'Create a campaign for winter jackets',
              'Show me insights about my top campaigns',
              'Compare campaign A vs campaign B',
              'Optimize my budget allocation',
              'Generate a performance report'
            ].map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => handleQuickAction(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

