'use client';

import { useState } from 'react';
import AIPanel from '@/components/ui/ai-panel/AIPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIModePage() {
  const [fullScreen, setFullScreen] = useState(false);

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <AIPanel fullScreen={true} onToggleFullScreen={() => setFullScreen(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-2xl font-semibold mb-2">AI Assistant Workspace</h2>
                <p className="mb-6">
                  Use the AI panel on the right to analyze campaigns, research keywords, or generate content.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold mb-1">Analyze</h3>
                    <p className="text-sm text-gray-600">
                      Get insights about campaign performance
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="font-semibold mb-1">Research</h3>
                    <p className="text-sm text-gray-600">
                      Research competitors and keywords
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">✨</div>
                    <h3 className="font-semibold mb-1">Generate</h3>
                    <p className="text-sm text-gray-600">
                      Create campaigns and ad copy
                    </p>
                  </div>
                </div>
              </div>

              {/* TODO: Add workspace features */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>TODO:</strong> Add workspace features such as:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Campaign analysis results display</li>
                    <li>Research findings visualization</li>
                    <li>Generated content preview</li>
                    <li>History of AI interactions</li>
                  </ul>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <AIPanel fullScreen={false} onToggleFullScreen={() => setFullScreen(true)} />
    </div>
  );
}

