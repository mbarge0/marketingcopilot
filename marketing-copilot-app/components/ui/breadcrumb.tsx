import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

function Breadcrumb({ children, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-gray-600', className)}
    >
      {children}
    </nav>
  );
}

function BreadcrumbItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('flex items-center', className)}>{children}</span>
  );
}

function BreadcrumbSeparator({ className }: { className?: string }) {
  return (
    <ChevronRight
      className={cn('h-4 w-4 text-gray-400', className)}
      aria-hidden="true"
    />
  );
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator };

