export interface Token {
  currency: string;
  date: string;
  price: number;
}

export interface SwapState {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
  error: string | null;
  tokens: Token[];
  prices: Record<string, number>;
}

export interface SwapActions {
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  swapTokens: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPrices: (tokens: Token[], prices: Record<string, number>) => void;
  fetchTokens: () => Promise<void>;
  calculateExchange: () => void;
  submitSwap: () => Promise<void>;
}

export type SwapStore = SwapState & SwapActions;
