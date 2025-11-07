'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MetaMenuItem = {
  id: 'dashboard' | 'ai' | 'settings';
  icon: string;
  href: string;
  tooltip: string;
};

const metaMenuItems: MetaMenuItem[] = [
  { id: 'dashboard', icon: '📊', href: '/dashboard', tooltip: 'Dashboard' },
  { id: 'ai', icon: '🧠', href: '/ai', tooltip: 'AI' },
  { id: 'settings', icon: '⚙️', href: '/settings', tooltip: 'Settings' },
];

export default function MetaMenu() {
  const pathname = usePathname();

  const getActiveId = (): 'dashboard' | 'ai' | 'settings' => {
    if (pathname?.startsWith('/ai')) return 'ai';
    if (pathname?.startsWith('/settings')) return 'settings';
    return 'dashboard'; // Default to dashboard
  };

  const activeId = getActiveId();

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="text-gray-900 font-bold text-lg text-center">MC</div>
      </div>
      
      <nav className="flex-1 py-4">
        {metaMenuItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-center py-3 text-sm transition-colors relative group ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              title={item.tooltip}
            >
              <span className="text-xl">{item.icon}</span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />
              )}
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.tooltip}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

