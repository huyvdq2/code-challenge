import React, { useCallback, useMemo } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTokenIconUrl } from '@/lib/tokenUtils';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  token?: string;
  disabled?: boolean;
  price?: number;
  error?: string;
  inputProps?: InputProps;
  className?: string;
}

const DECIMAL_REGEX = /^\d*\.?\d*$/;
const COMMA_FORMAT_REGEX = /\B(?=(\d{3})+(?!\d))/g;

const AmountInput = React.memo<AmountInputProps>(
  ({
    value,
    onChange,
    label,
    token,
    disabled = false,
    price,
    error,
    inputProps,
    className,
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove commas for parsing
        const inputValue = e.target.value.replace(/,/g, '');

        // Allow only numbers and one decimal point
        if (inputValue === '' || DECIMAL_REGEX.test(inputValue)) {
          // Pass raw value to onChange
          onChange(inputValue);
        }
      },
      [onChange]
    );

    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      },
      []
    );

    // Memoize expensive calculations
    const displayValue = useMemo(() => {
      return value ? value.replace(COMMA_FORMAT_REGEX, ',') : '';
    }, [value]);

    const usdValue = useMemo(() => {
      if (!price || !value) return null;
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? null : (numericValue * price).toFixed(2);
    }, [price, value]);

    const inputId = useMemo(() => `${label.toLowerCase()}-amount`, [label]);

    return (
      <div className={`space-y-2 ${className || ''}`}>
        <Label htmlFor={inputId}>
          {label} Amount {token && `(${token})`}
        </Label>
        <div className="relative">
          <Input
            {...inputProps}
            id={inputId}
            type="text"
            placeholder="0.00"
            value={displayValue}
            onChange={handleChange}
            disabled={disabled}
            className={`pr-20 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          {token && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <img
                src={getTokenIconUrl(token)}
                alt={token}
                className="w-4 h-4"
                onError={handleImageError}
              />
              <span className="text-sm text-muted-foreground">{token}</span>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {usdValue && (
          <p className="text-xs text-muted-foreground">≈ ${usdValue} USD</p>
        )}
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';

export default AmountInput;
