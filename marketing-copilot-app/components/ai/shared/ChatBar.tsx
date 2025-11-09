'use client';

import { useState, FormEvent } from 'react';
import { useAIContext } from '@/lib/ai/context';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import { useMicrophone } from '@/lib/hooks/useMicrophone';

export default function ChatBar() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addQuestion } = useAIContext();
  
  const suggestions = [
    'Why did my CPA increase?',
    'Create a campaign for my product',
    'Show me insights about my campaigns',
    'Compare campaign A vs B',
    'Optimize my budget allocation',
    'Generate a performance report'
  ];
  const placeholder = 'Ask your AI Co-Pilot anything...';

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
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-7xl mx-auto">
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

