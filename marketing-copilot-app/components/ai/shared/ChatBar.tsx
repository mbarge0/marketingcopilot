'use client';

import { useState, FormEvent } from 'react';
import { AIModeKey, MODE_PLACEHOLDERS, MODE_SUGGESTIONS } from '@/lib/ai/aiModes';
import { useAIContext } from '@/lib/ai/context';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatBarProps {
  mode: AIModeKey;
}

export default function ChatBar({ mode }: ChatBarProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addQuestion } = useAIContext();
  const suggestions = MODE_SUGGESTIONS[mode] || [];
  const placeholder = MODE_PLACEHOLDERS[mode] || 'Ask anything...';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);
    addQuestion(userMessage);

    try {
      // TODO: Connect to OpenAI API
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In the future, this will create a new ContentCard with results
      console.log('User asked:', userMessage);
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

