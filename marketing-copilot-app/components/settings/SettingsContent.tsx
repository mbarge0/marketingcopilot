'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

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

