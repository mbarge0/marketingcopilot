'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Layers,
  FileText,
  Key,
  Users,
  FileBarChart,
  Wrench,
  Sparkles,
  Video,
  Shield,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
  defaultExpanded: boolean;
  storageKey: string;
}

function NavSection({
  title,
  icon: Icon,
  items,
  defaultExpanded,
  storageKey,
}: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setIsExpanded(stored === 'true');
    }
  }, [storageKey]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
    localStorage.setItem(storageKey, String(newValue));
  };

  const isAnyItemActive = items.some((item) => pathname === item.href);

  return (
    <div className="mb-1">
      <button
        onClick={toggleExpanded}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isAnyItemActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-50'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const ItemIcon = item.icon;
            return (
              <div key={item.href} className="relative">
                {isActive && (
                  <div className="absolute -left-[17px] top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-blue-600" />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <ItemIcon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LeftNavigation() {
  const overviewItems: NavItem[] = [
    { label: 'Campaigns', href: '/dashboard', icon: Target },
    { label: 'Ad Groups', href: '/dashboard/ad-groups', icon: Layers },
    { label: 'Ads & Assets', href: '/dashboard/ads', icon: FileText },
    { label: 'Keywords', href: '/dashboard/keywords', icon: Key },
    { label: 'Audiences', href: '/dashboard/audiences', icon: Users },
    { label: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
  ];

  const toolsItems: NavItem[] = [
    {
      label: 'Copy Optimizer',
      href: '/dashboard/tools/copy-optimizer',
      icon: Sparkles,
    },
    {
      label: 'Video Generation',
      href: '/dashboard/tools/video-generation',
      icon: Video,
    },
    {
      label: 'Ad Fraud',
      href: '/dashboard/tools/ad-fraud',
      icon: Shield,
    },
  ];

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <nav className="px-2 py-4">
        <NavSection
          title="Overview"
          icon={BarChart3}
          items={overviewItems}
          defaultExpanded={true}
          storageKey="nav-overview-expanded"
        />
        <NavSection
          title="Tools"
          icon={Wrench}
          items={toolsItems}
          defaultExpanded={false}
          storageKey="nav-tools-expanded"
        />
      </nav>
    </div>
  );
}

