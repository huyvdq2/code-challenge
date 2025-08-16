import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SwapHistoryItem {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'success' | 'failed';
  timestamp: number;
  rate?: string;
}

interface SwapHistoryState {
  history: SwapHistoryItem[];
  addSwapRecord: (record: Omit<SwapHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useSwapHistoryStore = create<SwapHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addSwapRecord: (record) => {
        // Replace magic number with a constant
        const MAX_HISTORY_LENGTH = 50;

        const newRecord: SwapHistoryItem = {
          ...record,
          id: Math.random().toString(),
          timestamp: Date.now(),
          // Default to 'success' if not provided
          status: record.status || 'success',
        };

        // Update history while keeping only the last MAX_HISTORY_LENGTH records
        set({
          history: [
            newRecord,
            ...get().history.slice(0, MAX_HISTORY_LENGTH - 1),
          ],
        });
      },

      // Clear all history
      clearHistory: () => set({ history: [] }),
    }),

    // Persist history under this name
    {
      name: 'swap-history',
    }
  )
);
