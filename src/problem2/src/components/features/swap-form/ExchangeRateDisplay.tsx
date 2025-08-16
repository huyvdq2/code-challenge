import React from 'react';

interface ExchangeRateDisplayProps {
  fromToken?: string;
  toToken?: string;
  rate?: number;
  className?: string;
}

const DECIMAL_PLACES = 6;

const ExchangeRateDisplay = React.memo<ExchangeRateDisplayProps>(
  ({ fromToken, toToken, rate, className }) => {
    const getRateMessage = (): string => {
      if (!fromToken || !toToken || !rate) {
        return 'Rate unavailable';
      }
      return `1 ${fromToken} = ${rate.toFixed(DECIMAL_PLACES)} ${toToken}`;
    };

    return (
      <div
        className={`text-center text-sm text-muted-foreground p-2 bg-muted rounded ${className || ''}`}
      >
        {getRateMessage()}
      </div>
    );
  }
);

ExchangeRateDisplay.displayName = 'ExchangeRateDisplay';

export default ExchangeRateDisplay;
