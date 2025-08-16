import { create } from 'zustand';
import { SwapStore, Token } from './types';

// Define a constant for decimal places
const DECIMAL_PLACES = 6;

// Constant for timeout duration
const TIMEOUT_DURATION = 2000;

const useSwapStore = create<SwapStore>((set, get) => ({
  // State
  fromToken: 'ETH',
  toToken: 'USDC',
  fromAmount: '',
  toAmount: '',
  isLoading: false,
  error: null,
  tokens: [],
  prices: {},

  // Actions
  setFromToken: (token: string) => {
    set({ fromToken: token });
    get().calculateExchange();
  },

  setToToken: (token: string) => {
    set({ toToken: token });
    get().calculateExchange();
  },

  setFromAmount: (amount: string) => {
    set({ fromAmount: amount });
    get().calculateExchange();
  },

  setToAmount: (amount: string) => {
    set({ toAmount: amount });
    // Calculate reverse exchange
    const { fromToken, toToken, prices } = get();
    const fromPrice = prices[fromToken] || 0;
    const toPrice = prices[toToken] || 0;

    if (!fromPrice || !toPrice || !amount) {
      set({ fromAmount: '' });
      return;
    }

    const toAmountNum = parseFloat(amount);
    const fromAmountNum = (toAmountNum * toPrice) / fromPrice;
    set({ fromAmount: fromAmountNum.toFixed(DECIMAL_PLACES) });
  },

  swapTokens: () => {
    const { fromToken, toToken, fromAmount, toAmount } = get();
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: fromAmount,
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  setPrices: (tokens: Token[], prices: Record<string, number>) => {
    set({ tokens, prices });
    get().calculateExchange();
  },

  fetchTokens: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        'https://interview.switcheo.com/prices.json'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }

      const data: Token[] = await response.json();

      // Filter tokens with prices and create prices map
      const tokensWithPrices = data.filter((token) => token.price > 0);
      const pricesMap = tokensWithPrices.reduce(
        (acc, token) => {
          acc[token.currency] = token.price;
          return acc;
        },
        {} as Record<string, number>
      );

      set({
        tokens: tokensWithPrices,
        prices: pricesMap,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateExchange: () => {
    const { fromAmount, fromToken, toToken, prices } = get();

    // Rename function parameters to avoid conflicts
    function isExchangeInvalid(
      amount: string,
      tokenFrom: string,
      tokenTo: string,
      tokenPrices: Record<string, number>
    ): boolean {
      if (!amount || !tokenFrom || !tokenTo) {
        return true;
      }

      if (!(tokenPrices[tokenFrom] && tokenPrices[tokenTo])) {
        return true;
      }

      return false;
    }

    // Use the new function
    const isInvalidExchange = isExchangeInvalid(
      fromAmount,
      fromToken,
      toToken,
      prices
    );

    if (isInvalidExchange) {
      set({ toAmount: '' });
      return;
    }

    const fromAmountNum = parseFloat(fromAmount);
    const toAmountNum = (fromAmountNum * prices[fromToken]) / prices[toToken];

    // Set the calculated amount with fixed decimal places
    set({ toAmount: toAmountNum.toFixed(DECIMAL_PLACES) });
  },

  submitSwap: async () => {
    const { fromAmount, fromToken, toAmount, toToken } = get();
    set({ isLoading: true });

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT_DURATION));

      alert(
        `Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`
      );
    } catch (err) {
      // Cast error to Error type
      const error = err as Error;
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useSwapStore;
