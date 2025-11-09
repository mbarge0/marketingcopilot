'use client';

import { useState, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import { useMicrophone } from '@/lib/hooks/useMicrophone';

// Dashboard-specific suggestions based on current page
const DASHBOARD_SUGGESTIONS: Record<string, string[]> = {
  '/dashboard': [
    'Why did spend increase?',
    'Show my latest insights',
    'What needs attention?',
  ],
  '/dashboard/ad-groups': [
    'Which ad groups are performing best?',
    'Create new ad group',
    'Optimize ad group bids',
  ],
  '/dashboard/ads': [
    'Write new ad copy',
    'Which ads have highest CTR?',
    'Duplicate best performing ad',
  ],
  '/dashboard/keywords': [
    'Find keywords under $2 CPC',
    'Which keywords should I pause?',
    'Add negative keywords',
  ],
  '/dashboard/audiences': [
    'Which audiences convert best?',
    'Create new audience',
    'Optimize audience targeting',
  ],
  '/dashboard/reports': [
    'Generate weekly summary',
    'Create executive report',
    'Export campaign performance',
  ],
};

const DASHBOARD_PLACEHOLDERS: Record<string, string> = {
  '/dashboard': 'Ask your AI Co-Pilot anything...',
  '/dashboard/ad-groups': 'Ask about ad groups...',
  '/dashboard/ads': 'Ask about ads & assets...',
  '/dashboard/keywords': 'Ask about keywords...',
  '/dashboard/audiences': 'Ask about audiences...',
  '/dashboard/reports': 'Ask about reports...',
};

export default function DashboardChatBar() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  
  const suggestions = DASHBOARD_SUGGESTIONS[pathname || '/dashboard'] || DASHBOARD_SUGGESTIONS['/dashboard'];
  const placeholder = DASHBOARD_PLACEHOLDERS[pathname || '/dashboard'] || DASHBOARD_PLACEHOLDERS['/dashboard'];

  const handleTranscript = (text: string) => {
    setMessage(text);
  };

  const { isListening, isSupported, startListening, stopListening, error } = useMicrophone(handleTranscript);

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);

    try {
      // TODO: Connect to OpenAI API
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('User asked:', userMessage);
      // In the future, this will show results in the main content area
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(suggestion)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full text-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === '/' && e.target === document.activeElement) {
                e.preventDefault();
              }
            }}
          />
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                isListening
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}
          {error && (
            <div className="absolute -top-8 left-0 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              {error}
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={loading || !message.trim()} 
          size="default"
          className="px-6 hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1" />
              Send
            </>
          )}
        </Button>
      </form>
    </div>
  );
}


