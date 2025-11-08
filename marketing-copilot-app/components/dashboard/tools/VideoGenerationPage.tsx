'use client';

import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Select, SelectOption } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, ChevronDown, Plus, Sparkles, Play, GripVertical } from 'lucide-react';

export default function VideoGenerationPage() {
  const [scope, setScope] = useState('brand-awareness-q4');
  const [dateRange, setDateRange] = useState('last30days');

  return (
    <div className="space-y-6 bg-gray-50">
      {/* Filters Header */}
      <div className="flex justify-end gap-3 px-6 py-4 bg-white border-b border-gray-200">
        <Select value={scope} onValueChange={setScope}>
          <SelectOption value="brand-awareness-q4">Scope: Brand Awareness Q4</SelectOption>
          <SelectOption value="all-campaigns">Scope: All campaigns</SelectOption>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectOption value="today">Today</SelectOption>
          <SelectOption value="last7days">Last 7 days</SelectOption>
          <SelectOption value="last30days">Last 30 days</SelectOption>
        </Select>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbItem>AI</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Video Generation</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Page Title */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Generation</h1>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8 space-y-6">
        <VideoBriefSection />
        <AssetsSection />
        <StoryboardSection />
        <PreviewGenerateSection />
      </div>
    </div>
  );
}

function VideoBriefSection() {
  const [videoTitle, setVideoTitle] = useState('Austin Hotels Q4 Promo');
  const [objective, setObjective] = useState('brand-awareness');
  const [seconds, setSeconds] = useState('15');
  const [frames, setFrames] = useState('5');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('performance');
  const [brief, setBrief] = useState('');
  const [brandKit, setBrandKit] = useState('travelpass-default');
  const [voiceover, setVoiceover] = useState('ai-female-neutral');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video brief</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          This video will be attached to Brand Awareness Q4 (based on the current scope).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video title</label>
          <Input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectOption value="brand-awareness">Brand awareness</SelectOption>
            <SelectOption value="conversions">Conversions</SelectOption>
            <SelectOption value="traffic">Traffic</SelectOption>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target length</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="flex-1"
              />
              <span className="self-center text-sm text-gray-600">seconds</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={frames}
                onChange={(e) => setFrames(e.target.value)}
                className="flex-1"
              />
              <span className="self-center text-sm text-gray-600">Frames</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aspect ratio</label>
          <div className="flex gap-2">
            {['16:9', '9:16', '1:1'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  aspectRatio === ratio
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
          <div className="flex gap-2">
            {['Performance', 'UGC-style', 'Product demo'].map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s.toLowerCase().replace(' ', '-'))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  style === s.toLowerCase().replace(' ', '-')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">High-level brief</label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Describe your video concept, target audience, and key messages..."
            className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand kit</label>
            <Select value={brandKit} onValueChange={setBrandKit}>
              <SelectOption value="travelpass-default">TravelPass - Default</SelectOption>
              <SelectOption value="custom">Custom</SelectOption>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voiceover</label>
            <Select value={voiceover} onValueChange={setVoiceover}>
              <SelectOption value="ai-female-neutral">AI female, neutral</SelectOption>
              <SelectOption value="ai-male-neutral">AI male, neutral</SelectOption>
              <SelectOption value="ai-female-energetic">AI female, energetic</SelectOption>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" className="flex items-center gap-2">
            Next: Assets & storyboard
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AssetsSection() {
  const assets = [
    { id: 1, name: 'Dashboard', selected: true },
    { id: 2, name: 'Laptop', selected: true },
    { id: 3, name: 'Smartphone', selected: true },
    { id: 4, name: 'Resort', selected: true },
    { id: 5, name: 'Landscape', selected: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets for this video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add images
          </Button>
          <Button variant="outline">Choose from library</Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="relative flex-shrink-0 w-32 h-32 rounded-lg bg-gray-200 border-2 border-gray-300 flex items-center justify-center"
            >
              <span className="text-xs text-gray-500">{asset.name}</span>
              {asset.selected && (
                <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StoryboardSection() {
  const frames = [
    {
      id: 1,
      image: 'Dashboard',
      text: 'Still guessing which campaigns work?',
      duration: '3',
      transition: 'Fade',
      effect: 'Subtle zoom',
    },
    {
      id: 2,
      image: 'Laptop',
      text: 'Get real-time insights',
      duration: '3',
      transition: 'Slide',
      effect: 'Pan left',
    },
    {
      id: 3,
      image: 'Smartphone',
      text: 'Book your Austin getaway',
      duration: '3',
      transition: 'Fade',
      effect: 'Pan right',
    },
    {
      id: 4,
      image: 'Resort',
      text: 'Luxury meets affordability',
      duration: '3',
      transition: 'Zoom',
      effect: 'Subtle zoom',
    },
    {
      id: 5,
      image: 'Landscape',
      text: 'Reserve today - Limited time offer',
      duration: '3',
      transition: 'Cut',
      effect: 'None',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Storyboard (5 frames)</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add frame
            </Button>
            <Button variant="outline" size="sm">Distribute duration evenly</Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI: suggest text & transitions
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-semibold text-sm"></th>
                <th className="text-left p-3 font-semibold text-sm">Frame #</th>
                <th className="text-left p-3 font-semibold text-sm">Image</th>
                <th className="text-left p-3 font-semibold text-sm">On-screen text</th>
                <th className="text-left p-3 font-semibold text-sm">Duration (s)</th>
                <th className="text-left p-3 font-semibold text-sm">Transition</th>
                <th className="text-left p-3 font-semibold text-sm">Effect</th>
              </tr>
            </thead>
            <tbody>
              {frames.map((frame) => (
                <tr key={frame.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  </td>
                  <td className="p-3 text-sm font-medium">{frame.id}</td>
                  <td className="p-3">
                    <div className="w-16 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      {frame.image}
                    </div>
                  </td>
                  <td className="p-3 text-sm">{frame.text}</td>
                  <td className="p-3">
                    <Input type="number" value={frame.duration} className="w-16" />
                  </td>
                  <td className="p-3">
                    <Select defaultValue={frame.transition.toLowerCase().replace(' ', '-')}>
                      <SelectOption value="fade">Fade</SelectOption>
                      <SelectOption value="slide">Slide</SelectOption>
                      <SelectOption value="zoom">Zoom</SelectOption>
                      <SelectOption value="cut">Cut</SelectOption>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Select defaultValue={frame.effect.toLowerCase().replace(' ', '-')}>
                      <SelectOption value="subtle-zoom">Subtle zoom</SelectOption>
                      <SelectOption value="pan-left">Pan left</SelectOption>
                      <SelectOption value="pan-right">Pan right</SelectOption>
                      <SelectOption value="none">None</SelectOption>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Total duration: 15s
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewGenerateSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview & generate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-50">Preview not yet generated</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Video details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Total length: 15s</p>
                <p>Frames: 5</p>
                <p>Aspect ratio: 16:9</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export preset</label>
              <Select defaultValue="webm-1080p">
                <SelectOption value="webm-1080p">WEBM 1080p</SelectOption>
                <SelectOption value="mp4-1080p">MP4 1080p</SelectOption>
                <SelectOption value="mp4-720p">MP4 720p</SelectOption>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Generate video
              </Button>
              <Button variant="outline">Save draft</Button>
            </div>
            <p className="text-xs text-gray-500">
              Video not yet generated for this configuration.
            </p>
            <div className="pt-2">
              <div className="h-1 bg-gray-200 rounded-full">
                <div className="h-1 bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0:00</span>
                <span>/ 15s</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

