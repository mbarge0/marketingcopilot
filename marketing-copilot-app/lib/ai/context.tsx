'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIModeKey } from '@/lib/ai/aiModes';
import { ContentCardData } from '@/components/ai/workspace/ContentCard';

interface AIContextType {
  currentMode: AIModeKey;
  viewedCampaigns: string[];
  askedQuestions: string[];
  takenActions: string[];
  contentCards: ContentCardData[];
  setCurrentMode: (mode: AIModeKey) => void;
  addViewedCampaign: (campaignId: string) => void;
  addQuestion: (question: string) => void;
  addAction: (action: string) => void;
  addContentCards: (cards: ContentCardData[]) => void;
  updateContentCard: (id: string, data: any) => void;
  clearContext: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<AIModeKey>('insights');
  const [viewedCampaigns, setViewedCampaigns] = useState<string[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [takenActions, setTakenActions] = useState<string[]>([]);
  const [contentCards, setContentCards] = useState<ContentCardData[]>([]);

  // Load context from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-context');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.viewedCampaigns) setViewedCampaigns(parsed.viewedCampaigns);
        if (parsed.askedQuestions) setAskedQuestions(parsed.askedQuestions);
        if (parsed.takenActions) setTakenActions(parsed.takenActions);
        // Note: contentCards are not persisted to avoid stale data
      } catch (e) {
        console.error('Failed to load AI context:', e);
      }
    }
  }, []);

  // Save context to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ai-context',
      JSON.stringify({
        viewedCampaigns,
        askedQuestions,
        takenActions,
      })
    );
  }, [viewedCampaigns, askedQuestions, takenActions]);

  const addViewedCampaign = (campaignId: string) => {
    setViewedCampaigns((prev) => {
      if (!prev.includes(campaignId)) {
        return [...prev, campaignId];
      }
      return prev;
    });
  };

  const addQuestion = (question: string) => {
    setAskedQuestions((prev) => [...prev, question]);
  };

  const addAction = (action: string) => {
    setTakenActions((prev) => [...prev, action]);
  };

  const addContentCards = (cards: ContentCardData[]) => {
    setContentCards((prev) => [...prev, ...cards]);
  };

  const updateContentCard = (id: string, data: any) => {
    setContentCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, data: { ...card.data, ...data } } : card))
    );
  };

  const clearContext = () => {
    setViewedCampaigns([]);
    setAskedQuestions([]);
    setTakenActions([]);
    setContentCards([]);
    localStorage.removeItem('ai-context');
  };

  return (
    <AIContext.Provider
      value={{
        currentMode,
        viewedCampaigns,
        askedQuestions,
        takenActions,
        contentCards,
        setCurrentMode,
        addViewedCampaign,
        addQuestion,
        addAction,
        addContentCards,
        updateContentCard,
        clearContext,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within AIContextProvider');
  }
  return context;
}


