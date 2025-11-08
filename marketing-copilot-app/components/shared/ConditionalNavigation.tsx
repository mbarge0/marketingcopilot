'use client';

import { usePathname } from 'next/navigation';
import LeftNavigation from '@/components/dashboard/LeftNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const isAIMode = pathname?.startsWith('/ai');

  // Hide Overview and Tools menu on AI Workspace pages
  if (isAIMode) {
    return null;
  }

  return <LeftNavigation />;
}

