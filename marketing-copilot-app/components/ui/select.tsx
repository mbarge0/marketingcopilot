'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SelectOptionProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

function Select({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedChild = React.Children.toArray(children).find(
    (child) =>
      React.isValidElement(child) &&
      (child as React.ReactElement<SelectOptionProps>).props.value === value
  );

  const selectedLabel =
    React.isValidElement(selectedChild) &&
    typeof selectedChild.props.children === 'string'
      ? selectedChild.props.children
      : value;

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div ref={selectRef} className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isOpen && 'ring-2 ring-blue-500 ring-offset-2'
          )}
        >
          <span className="text-gray-700">{selectedLabel}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-500 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              {React.Children.map(children, (child) => {
                if (React.isValidElement<SelectOptionProps>(child)) {
                  return React.cloneElement(child, {
                    isSelected: child.props.value === value,
                    onClick: () => handleValueChange(child.props.value),
                  });
                }
                return child;
              })}
            </div>
          </div>
        )}
      </div>
    </SelectContext.Provider>
  );
}

function SelectOption({
  value,
  children,
  isSelected,
  onClick,
}: SelectOptionProps & {
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full px-3 py-2 text-left text-sm transition-colors',
        isSelected
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      {children}
    </button>
  );
}

export { Select, SelectOption };

