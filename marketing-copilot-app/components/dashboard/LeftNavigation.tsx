'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LeftNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Campaigns', href: '/dashboard', icon: '📊' },
    { label: 'Ad Groups', href: '/dashboard/ad-groups', icon: '📁' },
    { label: 'Ads & Assets', href: '/dashboard/ads', icon: '📝' },
    { label: 'Keywords', href: '/dashboard/keywords', icon: '🔑' },
    { label: 'Audiences', href: '/dashboard/audiences', icon: '👥' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
  ];

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>
      <nav className="px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

