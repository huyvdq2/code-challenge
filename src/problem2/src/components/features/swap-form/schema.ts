// Simple validation without zod dependency
export interface SwapFormData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount?: string;
}

export const validateSwapForm = (
  data: SwapFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.fromToken) {
    errors.fromToken = 'Please select a token to swap from';
  }

  if (!data.toToken) {
    errors.toToken = 'Please select a token to swap to';
  }

  if (!data.fromAmount) {
    errors.fromAmount = 'Please enter an amount';
  } else {
    const amount = parseFloat(data.fromAmount);
    if (isNaN(amount) || amount <= 0) {
      errors.fromAmount = 'Amount must be a valid positive number';
    }
  }

  if (data.fromToken && data.toToken && data.fromToken === data.toToken) {
    errors.toToken = 'From and To tokens must be different';
  }

  return errors;
};
