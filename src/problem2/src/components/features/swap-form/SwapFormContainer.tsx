import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { useSwapHistoryStore } from '@/store/swapHistoryStore';
import { SwapFormData, validateSwapForm } from './schema';
import TokenSelect from '../../common/TokenSelect';
import AmountInput from '../../common/AmountInput';
import SwapButton from './SwapButton';
import ExchangeRateDisplay from './ExchangeRateDisplay';
import { Button } from '@/components/ui/button';

const DECIMAL_PLACES = 6;
const SUCCESS_RATE = 0.3;
const API_DELAY = 1000;

const SwapFormContainer: React.FC = () => {
  const { addSwapRecord } = useSwapHistoryStore();
  const {
    data: tokensData,
    isLoading: tokensLoading,
    error: tokensError,
  } = useTokenPrices();

  const [formData, setFormData] = useState<SwapFormData>({
    fromToken: '',
    toToken: '',
    fromAmount: '',
    toAmount: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize valid tokens and prices
  const { validTokens, prices } = useMemo(() => {
    if (!tokensData) {
      return { validTokens: [], prices: {} };
    }

    const tokens = tokensData.filter((token) => token.price > 0);
    const pricesMap = tokens.reduce(
      (acc, token) => {
        acc[token.currency] = token.price;
        return acc;
      },
      {} as Record<string, number>
    );

    return { validTokens: tokens, prices: pricesMap };
  }, [tokensData]);

  // Calculate exchange rate and update toAmount
  const exchangeRate = useMemo(() => {
    if (
      !formData.fromToken ||
      !formData.toToken ||
      !prices[formData.fromToken] ||
      !prices[formData.toToken]
    ) {
      return null;
    }
    return prices[formData.fromToken] / prices[formData.toToken];
  }, [formData.fromToken, formData.toToken, prices]);

  // Update toAmount when fromAmount or exchange rate changes
  useEffect(() => {
    if (
      formData.fromAmount &&
      exchangeRate &&
      !isNaN(parseFloat(formData.fromAmount))
    ) {
      const calculatedAmount = (
        parseFloat(formData.fromAmount) * exchangeRate
      ).toFixed(DECIMAL_PLACES);
      setFormData((prev) => ({ ...prev, toAmount: calculatedAmount }));
    } else {
      setFormData((prev) => ({ ...prev, toAmount: '' }));
    }
  }, [formData.fromAmount, exchangeRate]);

  const updateField = useCallback(
    (field: keyof SwapFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const swapTokens = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: '',
      toAmount: '',
    }));
    setErrors({});
  }, []);

  const handleSwapSuccess = useCallback(
    (data: SwapFormData) => {
      const rate = exchangeRate
        ? `1 ${data.fromToken} = ${exchangeRate.toFixed(DECIMAL_PLACES)} ${data.toToken}`
        : undefined;

      addSwapRecord({
        fromToken: data.fromToken,
        toToken: data.toToken,
        fromAmount: data.fromAmount,
        toAmount: data.toAmount || '',
        status: 'success',
        rate,
      });

      toast.success('Swap Successful!', {
        description: `Successfully swapped ${data.fromAmount} ${data.fromToken} for ${data.toAmount} ${data.toToken}`,
      });

      // Reset form amounts
      setFormData((prev) => ({ ...prev, fromAmount: '', toAmount: '' }));
    },
    [addSwapRecord, exchangeRate]
  );

  const handleSwapFailure = useCallback(
    (data: SwapFormData) => {
      addSwapRecord({
        fromToken: data.fromToken,
        toToken: data.toToken,
        fromAmount: data.fromAmount,
        toAmount: data.toAmount || '',
        status: 'failed',
      });

      toast.error('Swap Failed', {
        description: 'Insufficient liquidity or network error',
      });
    },
    [addSwapRecord]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateSwapForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > SUCCESS_RATE;

      if (isSuccess) {
        handleSwapSuccess(formData);
      } else {
        handleSwapFailure(formData);
      }
    } catch {
      toast.error('Swap Failed', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || tokensLoading || !!tokensError;

  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      );
    }
    if (tokensLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading tokens...
        </>
      );
    }
    if (tokensError) {
      return 'Failed to load tokens';
    }
    return 'Swap Tokens';
  };

  return (
    <div className="w-full mx-auto p-6 bg-card rounded-lg shadow-lg border">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">Currency Swap</h1>
        <p className="text-center text-muted-foreground">
          Swap your digital assets instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-background">
          <TokenSelect
            value={formData.fromToken}
            onValueChange={(value) => updateField('fromToken', value)}
            label="From"
            tokens={validTokens}
            disabled={isFormDisabled}
            error={errors.fromToken}
          />
          <AmountInput
            value={formData.fromAmount}
            onChange={(value) => updateField('fromAmount', value)}
            label="You Pay"
            token={formData.fromToken}
            disabled={isFormDisabled}
            price={
              formData.fromToken && prices[formData.fromToken]
                ? prices[formData.fromToken]
                : undefined
            }
            error={errors.fromAmount}
            inputProps={{ autoFocus: true }}
          />
        </div>

        {/* Swap Button */}
        <SwapButton onSwap={swapTokens} disabled={isFormDisabled} />

        {/* To Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-background">
          <TokenSelect
            value={formData.toToken}
            onValueChange={(value) => updateField('toToken', value)}
            label="To"
            tokens={validTokens}
            disabled={isFormDisabled}
            error={errors.toToken}
          />
          {/* Always disabled as it's calculated */}
          <AmountInput
            value={formData.toAmount || ''}
            onChange={(value) => updateField('toAmount', value)}
            label="You Receive"
            token={formData.toToken}
            disabled={true}
            price={
              formData.toToken && prices[formData.toToken]
                ? prices[formData.toToken]
                : undefined
            }
          />
        </div>

        {/* Exchange Rate */}
        <ExchangeRateDisplay
          fromToken={formData.fromToken}
          toToken={formData.toToken}
          rate={exchangeRate || undefined}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isFormDisabled}>
          {getButtonContent()}
        </Button>
      </form>
    </div>
  );
};

export default SwapFormContainer;
