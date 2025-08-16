import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: string;
}

interface ComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

const Combobox = React.memo<ComboboxProps>(
  ({
    value,
    onValueChange,
    options,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyText = 'No options found.',
    disabled = false,
    className,
  }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = useMemo(() => {
      if (!search) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }, [options, search]);

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    );

    const handleSelect = useCallback(
      (optionValue: string) => {
        onValueChange(optionValue);
        setOpen(false);
        setSearch('');
      },
      [onValueChange]
    );

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setOpen(!open);
        setSearch('');
      }
    }, [disabled, open]);

    // Close dropdown when clicking outside
    useEffect(() => {
      if (!open) return undefined;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
          setSearch('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open]);

    return (
      <div className={cn('relative', className)} ref={containerRef}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          onClick={handleToggle}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.icon && (
                <img
                  src={selectedOption.icon}
                  alt=""
                  className="h-4 w-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                      'hover:bg-accent hover:text-accent-foreground focus:bg-accent',
                      value === option.value &&
                        'bg-accent text-accent-foreground'
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.icon && (
                      <img
                        src={option.icon}
                        alt=""
                        className="mr-2 h-4 w-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;
