import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import Combobox, { ComboboxOption } from '@/components/ui/combobox';
import { getTokenIconUrl } from '@/lib/tokenUtils';
import { Token } from '@/store/types';

interface TokenSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  label: string;
  tokens: Token[];
  disabled?: boolean;
  error?: string;
  className?: string;
}

const TokenSelect = React.memo<TokenSelectProps>(
  ({
    value,
    onValueChange,
    label,
    tokens,
    disabled = false,
    error,
    className,
  }) => {
    const options: ComboboxOption[] = useMemo(
      () =>
        tokens.map((token) => ({
          value: token.currency,
          label: `${token.currency} - $${token.price.toFixed(4)}`,
          icon: getTokenIconUrl(token.currency),
        })),
      [tokens]
    );

    const labelId = useMemo(() => `${label.toLowerCase()}-token`, [label]);

    return (
      <div className={`space-y-2 ${className || ''}`}>
        <Label htmlFor={labelId}>{label} Token</Label>
        <Combobox
          value={value}
          onValueChange={onValueChange}
          options={options}
          placeholder={`Select ${label.toLowerCase()} token`}
          searchPlaceholder="Search tokens..."
          emptyText="No tokens found"
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

TokenSelect.displayName = 'TokenSelect';

export default TokenSelect;
