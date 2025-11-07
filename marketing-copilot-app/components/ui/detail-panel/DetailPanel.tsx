'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DetailPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function DetailPanel({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: DetailPanelProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-xl z-50 overflow-y-auto">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>{title}</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {children}
          </CardContent>
          {footer && (
            <div className="border-t p-4 flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

