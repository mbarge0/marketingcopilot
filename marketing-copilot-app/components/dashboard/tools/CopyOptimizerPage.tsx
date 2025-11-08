'use client';

import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Select, SelectOption } from '@/components/ui/select';
import { Tabs, TabsList, Tab } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, Lightbulb, Hash, FileText, ShoppingBag, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

export default function CopyOptimizerPage() {
  const [activeTab, setActiveTab] = useState('recommendations');
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
          <SelectOption value="last90days">Last 90 days</SelectOption>
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
          <BreadcrumbItem>Copy Optimizer</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Page Title */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900">Copy Optimizer</h1>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <Tab value="recommendations">Recommendations</Tab>
            <Tab value="library">Library</Tab>
            <Tab value="experiments">Experiments</Tab>
          </TabsList>
        </Tabs>
      </div>

      {/* Content based on active tab */}
      <div className="px-6 pb-8">
        {activeTab === 'recommendations' && <RecommendationsTab />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'experiments' && <ExperimentsTab />}
      </div>
    </div>
  );
}

function RecommendationsTab() {
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">
                Headlines with clear benefits and social proof are outperforming by +16% CTR vs account average.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Goal: Balanced
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Based on last 90 days
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Ads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Ads in Brand Awareness Q4</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-sm">Headline</th>
                  <th className="text-left p-3 font-semibold text-sm">Description</th>
                  <th className="text-right p-3 font-semibold text-sm">CTR</th>
                  <th className="text-right p-3 font-semibold text-sm">Conv. rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 text-sm">Summer Collection 2024 - Shop Now</td>
                  <td className="p-3 text-sm text-gray-600">Discover the latest trends. Free shipping on orders...</td>
                  <td className="p-3 text-right text-sm font-medium">3.2%</td>
                  <td className="p-3 text-right text-sm font-medium">1.8%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-sm">New Arrivals - Up to 40% Off</td>
                  <td className="p-3 text-sm text-gray-600">Limited time offer. Shop new styles and save big...</td>
                  <td className="p-3 text-right text-sm font-medium">2.9%</td>
                  <td className="p-3 text-right text-sm font-medium">1.5%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-sm">Exclusive Styles - Free Returns</td>
                  <td className="p-3 text-sm text-gray-600">Shop with confidence. 30-day free returns on all...</td>
                  <td className="p-3 text-right text-sm font-medium">3.5%</td>
                  <td className="p-3 text-right text-sm font-medium">2.1%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-sm">Limited Time: Save 30% Today</td>
                  <td className="p-3 text-sm text-gray-600">Premium quality at unbeatable prices. Shop before...</td>
                  <td className="p-3 text-right text-sm font-medium">2.7%</td>
                  <td className="p-3 text-right text-sm font-medium">1.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Copy */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Copy (Historical)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Social proof - +12% CTR
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Save time - +18% CTR
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Risk reduction - +9% Conv
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Social proof: &apos;Join 50,000+ happy customers&apos;</p>
            <p>Save time: &apos;Fast, free shipping on all orders&apos;</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <CardTitle>AI Suggestions</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="balanced">
                <SelectOption value="balanced">Goal: Balanced</SelectOption>
                <SelectOption value="ctr">Goal: Maximize CTR</SelectOption>
                <SelectOption value="conversion">Goal: Maximize Conversions</SelectOption>
              </Select>
              <span className="text-xs text-gray-500">Predictions based on last 90 days of performance</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Variant A */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2">
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  Social proof
                </span>
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  Trust
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                Select for test
              </label>
            </div>
            <div className="space-y-2 mb-3">
              <p className="font-semibold text-gray-900">
                Join 10,000+ Satisfied Shoppers - Shop With Confidence Today
              </p>
              <p className="text-sm text-gray-600">
                4.8 average rating from thousands of verified customers. Premium products with hassle-free returns, fast shipping, and dedicated customer support ready to help.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-600">Predicted CTR: </span>
                <span className="font-semibold text-green-600">4.3% (+0.8 vs current)</span>
              </div>
              <div>
                <span className="text-gray-600">Predicted conv. rate: </span>
                <span className="font-semibold">~2.1%</span>
              </div>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Explain why this should perform better
            </a>
          </div>

          {/* Variant B */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2">
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  Urgency
                </span>
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  Discount
                </span>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                Select for test
              </label>
            </div>
            <div className="space-y-2 mb-3">
              <p className="font-semibold text-gray-900">
                Limited Time: Extra 25% Off Everything - Flash Sale Ends Soon
              </p>
              <p className="text-sm text-gray-600">
                Hurry! Sale ends in 48 hours. Shop now and save big on our entire collection. Premium styles at unbeatable prices. Free shipping included on all orders.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-600">Predicted CTR: </span>
                <span className="font-semibold text-green-600">4.1% (+0.6 vs current)</span>
              </div>
              <div>
                <span className="text-gray-600">Predicted conv. rate: </span>
                <span className="font-semibold">~1.9%</span>
              </div>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Explain why this should perform better
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LibraryTab() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectOption value="all">Type: All</SelectOption>
          <SelectOption value="headline">Headline</SelectOption>
          <SelectOption value="description">Description</SelectOption>
          <SelectOption value="cta">CTA</SelectOption>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectOption value="all">Status: All</SelectOption>
          <SelectOption value="in-use">In Use</SelectOption>
          <SelectOption value="not-in-use">Not in Use</SelectOption>
        </Select>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          Top 10% CTR
        </span>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
          Needs improvement
        </span>
      </div>

      {/* Text Snippets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left p-3 font-semibold text-sm">Text snippet</th>
                  <th className="text-left p-3 font-semibold text-sm">Type</th>
                  <th className="text-left p-3 font-semibold text-sm">Used in</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { text: 'Join 10,000+ Satisfied Shoppers – Shop With Confidence', type: 'Headline', usedIn: 5, icon: Hash },
                  { text: 'Premium products with hassle-free returns and fast shipping.', type: 'Description', usedIn: 8, icon: FileText },
                  { text: 'Shop Now', type: 'CTA', usedIn: 12, icon: ShoppingBag },
                  { text: 'Limited Time: Extra 25% Off Everything', type: 'Headline', usedIn: 3, icon: Hash },
                  { text: 'Free shipping both ways. Extended return policy.', type: 'Description', usedIn: 6, icon: FileText },
                  { text: 'Discover New Arrivals Today', type: 'Headline', usedIn: 0, icon: Hash },
                  { text: 'Browse our latest collection of premium styles.', type: 'Description', usedIn: 0, icon: FileText },
                  { text: 'Get Started', type: 'CTA', usedIn: 4, icon: ShoppingBag },
                ].map((snippet, idx) => {
                  const Icon = snippet.icon;
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{snippet.text}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-700">{snippet.type}</td>
                      <td className="p-3 text-sm">
                        {snippet.usedIn > 0 ? (
                          <a href="#" className="text-blue-600 hover:underline">
                            Used in {snippet.usedIn} campaigns
                          </a>
                        ) : (
                          <span className="text-gray-400">Not in use</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExperimentsTab() {
  return (
    <div className="space-y-6">
      {/* Active Experiments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active experiments</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold text-sm">Experiment name</th>
                    <th className="text-left p-3 font-semibold text-sm">Scope</th>
                    <th className="text-left p-3 font-semibold text-sm">Variants</th>
                    <th className="text-left p-3 font-semibold text-sm">Status</th>
                    <th className="text-left p-3 font-semibold text-sm">Start date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline text-sm">
                        Q4 Brand Awareness – Headlines Test
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Brand Awareness Q4</td>
                    <td className="p-3 text-sm text-gray-700">A vs B</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        Running
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Nov 1, 2025</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline text-sm">
                        Social Proof vs Urgency
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Summer Sale – Shoes</td>
                    <td className="p-3 text-sm text-gray-700">A/B/C</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        Running
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Oct 28, 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Past Experiments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Past experiments</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold text-sm">Experiment name</th>
                    <th className="text-left p-3 font-semibold text-sm">Scope</th>
                    <th className="text-left p-3 font-semibold text-sm">Variants</th>
                    <th className="text-left p-3 font-semibold text-sm">Winner & lift</th>
                    <th className="text-left p-3 font-semibold text-sm">Date range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline text-sm">
                        CTA Optimization – October
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Product Launch – Accessories</td>
                    <td className="p-3 text-sm text-gray-700">A vs B</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Variant B +22% CTR
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Oct 1, 2025</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline text-sm">
                        Benefit-Focused Headlines
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Brand Awareness Q4</td>
                    <td className="p-3 text-sm text-gray-700">A/B/C</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Variant A +16% Conv
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Sep 15, 2025</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline text-sm">
                        Price Sensitivity Test
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Summer Sale – Shoes</td>
                    <td className="p-3 text-sm text-gray-700">A vs B</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Variant B +11% CTR
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Sep 1, 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

