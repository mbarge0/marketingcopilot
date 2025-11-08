'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Download, CreditCard } from 'lucide-react';

export default function SettingsContent() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: accounts } = await supabase
          .from('google_ads_accounts')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);
        
        setConnected(accounts ? accounts.length > 0 : false);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogleAds = async () => {
    try {
      const response = await fetch('/api/auth/google/initiate');
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate Google Ads connection');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect Google Ads account');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and integrations</p>
      </div>

      {/* Subscription Section */}
      <SubscriptionSection />

      {/* Account Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Account Integrations</CardTitle>
          <CardDescription>Connect your external accounts and services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Ads Integration */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-semibold">Google Ads</h3>
                <p className="text-sm text-gray-600">
                  {connected
                    ? 'Connected - Manage your Google Ads campaigns'
                    : 'Not connected - Connect to manage campaigns'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnectGoogleAds}
              variant={connected ? 'outline' : 'default'}
              disabled={loading}
            >
              {connected ? 'Reconnect' : 'Connect'}
            </Button>
          </div>

          {/* OpenAI Integration */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🤖</div>
              <div>
                <h3 className="font-semibold">OpenAI API</h3>
                <p className="text-sm text-gray-600">
                  API key configured in environment variables
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Configured</div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" disabled value="user@example.com" />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <Input type="text" placeholder="Your display name" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Demo Mode</h3>
                <p className="text-sm text-gray-600">
                  Use sample data without connecting accounts
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Email Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive alerts via email
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TODO Section */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">TODO: Additional Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-800">
            Future settings to implement:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Budget alert thresholds</li>
              <li>Auto-pause preferences</li>
              <li>Export preferences</li>
              <li>Theme customization</li>
            </ul>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionSection() {
  return (
    <>
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>$1000 / month</p>
                <p>Renews on Dec 09, 2025</p>
                <p>3 of 5 seats used</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Manage plan</Button>
              <Button>Upgrade</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Credits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">AI credits used this month</span>
              <span className="text-sm text-gray-600">1,240 / 2,000</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: '62%' }}
              ></div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active campaigns</span>
              <span className="text-sm text-gray-600">12 / 25</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: '48%' }}
              ></div>
            </div>
          </div>

          {/* Video Renders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Video renders this month</span>
              <span className="text-sm text-gray-600">28 / 50</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: '56%' }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Billing details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company / Billing name
              </label>
              <p className="text-sm text-gray-900">Vista Inc.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing email</label>
              <p className="text-sm text-gray-900">billing@vistastay.com</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Payment method</label>
              <Button variant="link" className="text-sm h-auto p-0">
                Update payment method
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900">Visa **** 4242, expires 08/27</span>
            </div>
          </div>

          {/* Invoices */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Invoices</h3>
              <Button variant="link" className="text-sm h-auto p-0">
                View all invoices
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { month: 'October 2025', amount: '$1000.00' },
                { month: 'September 2025', amount: '$1000.00' },
                { month: 'August 2025', amount: '$1000.00' },
              ].map((invoice, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{invoice.month}</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Paid
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-900">{invoice.amount}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

