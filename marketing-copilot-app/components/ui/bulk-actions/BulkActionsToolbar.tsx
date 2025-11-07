'use client';

import { Button } from '@/components/ui/button';

type BulkAction = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline';
};

type BulkActionsToolbarProps = {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection?: () => void;
};

export default function BulkActionsToolbar({
  selectedCount,
  actions,
  onClearSelection,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        {onClearSelection && (
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear selection
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'default'}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

