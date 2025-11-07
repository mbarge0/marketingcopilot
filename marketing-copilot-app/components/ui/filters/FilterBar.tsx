'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FilterOption = {
  value: string;
  label: string;
};

type FilterBarProps = {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: Array<{
    label: string;
    options: FilterOption[];
    value?: string;
    onChange?: (value: string) => void;
  }>;
};

export default function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters = [],
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
      {onSearchChange && (
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        {filters.map((filter, index) => (
          <select
            key={index}
            value={filter.value || ''}
            onChange={(e) => filter.onChange?.(e.target.value)}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

