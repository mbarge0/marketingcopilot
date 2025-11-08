'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Maximize2, Minimize2 } from 'lucide-react';

type AIMode = 'analyze' | 'research' | 'generate' | null;

interface AIPanelProps {
  fullScreen?: boolean;
  onToggleFullScreen?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AIPanel({ 
  fullScreen = false, 
  onToggleFullScreen,
  isOpen = true,
  onToggle
}: AIPanelProps) {
  const [mode, setMode] = useState<AIMode>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // TODO: Connect to OpenAI API for chat
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `I received your message: "${userMessage}". AI chat functionality will be connected to OpenAI soon.`,
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border-l border-gray-200 flex flex-col h-full ${
        fullScreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <CardHeader className="border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <div className="flex items-center gap-2">
            {onToggleFullScreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullScreen}
                className="text-xs p-2"
                title={fullScreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {fullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            )}
            {onToggle && !fullScreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-xs p-2"
                title="Close Panel"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* AI Mode Selector */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={mode === 'analyze' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode(mode === 'analyze' ? null : 'analyze')}
            className="flex-1 text-xs"
          >
            Analyze
          </Button>
          <Button
            variant={mode === 'research' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode(mode === 'research' ? null : 'research')}
            className="flex-1 text-xs"
          >
            Research
          </Button>
          <Button
            variant={mode === 'generate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode(mode === 'generate' ? null : 'generate')}
            className="flex-1 text-xs"
          >
            Generate
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        {!mode && (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500 p-8">
            <div>
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="font-semibold mb-2">Select an AI Mode</h3>
              <p className="text-sm mb-4">
                Choose Analyze, Research, or Generate to get started
              </p>
              <div className="text-xs space-y-2">
                <div>• <strong>Analyze:</strong> Get insights about your campaigns</div>
                <div>• <strong>Research:</strong> Research competitors and keywords</div>
                <div>• <strong>Generate:</strong> Create campaigns and ad copy</div>
              </div>
            </div>
          </div>
        )}

        {mode && (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-8">
                  {mode === 'analyze' && '💬 Ask me to analyze your campaign performance...'}
                  {mode === 'research' && '💬 Ask me to research keywords or competitors...'}
                  {mode === 'generate' && '💬 Ask me to generate campaigns or ad copy...'}
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <Button type="submit" disabled={loading || !message.trim()} size="sm">
                Send
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </div>
  );
}


