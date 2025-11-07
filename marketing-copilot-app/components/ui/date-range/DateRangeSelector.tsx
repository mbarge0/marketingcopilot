'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type DateRange = {
  start: Date;
  end: Date;
};

type DateRangeSelectorProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
};

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export default function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const getPresetRange = (days: number): DateRange => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start, end };
  };

  const handlePresetClick = (preset: { label: string; days: number }) => {
    const range = getPresetRange(preset.days);
    setSelectedPreset(preset.label);
    onChange?.(range);
  };

  const handleCustomRange = () => {
    // For now, just use last 30 days
    // TODO: Add date picker component
    const range = getPresetRange(30);
    setSelectedPreset(null);
    onChange?.(range);
  };

  return (
    <div className="flex items-center gap-2">
      {PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant={selectedPreset === preset.label ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePresetClick(preset)}
        >
          {preset.label}
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={handleCustomRange}>
        Custom
      </Button>
    </div>
  );
}

