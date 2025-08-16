import { renderHook } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import { useSwapHistoryStore } from '../store/swapHistoryStore';

const MAX_HISTORY_RECORDS = 50;
const TEST_RECORDS_COUNT = 52;
const ETH_PRICE = 1800;
const LAST_RECORD_INDEX = 49;

describe('useSwapHistoryStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useSwapHistoryStore.getState().clearHistory();
  });

  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useSwapHistoryStore());

    expect(result.current.history).toEqual([]);
  });

  it('should add swap record', () => {
    const { result } = renderHook(() => useSwapHistoryStore());

    act(() => {
      result.current.addSwapRecord({
        fromToken: 'ETH',
        toToken: 'USDC',
        fromAmount: '1',
        toAmount: '1800',
        status: 'success',
        rate: '1 ETH = 1800 USDC',
      });
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      fromToken: 'ETH',
      toToken: 'USDC',
      fromAmount: '1',
      toAmount: '1800',
      status: 'success',
      rate: '1 ETH = 1800 USDC',
    });
    expect(result.current.history[0].id).toBeDefined();
    expect(result.current.history[0].timestamp).toBeDefined();
  });

  it('should add multiple records in correct order', () => {
    const { result } = renderHook(() => useSwapHistoryStore());

    act(() => {
      result.current.addSwapRecord({
        fromToken: 'ETH',
        toToken: 'USDC',
        fromAmount: '1',
        toAmount: '1800',
        status: 'success',
      });

      result.current.addSwapRecord({
        fromToken: 'BTC',
        toToken: 'ETH',
        fromAmount: '0.5',
        toAmount: '25',
        status: 'failed',
      });
    });

    expect(result.current.history).toHaveLength(2);
    // Most recent should be first
    expect(result.current.history[0].fromToken).toBe('BTC');
    expect(result.current.history[1].fromToken).toBe('ETH');
  });

  it('should limit history to 50 records', () => {
    const { result } = renderHook(() => useSwapHistoryStore());

    act(() => {
      // Add 52 records
      for (let i = 0; i < TEST_RECORDS_COUNT; i++) {
        result.current.addSwapRecord({
          fromToken: 'ETH',
          toToken: 'USDC',
          fromAmount: i.toString(),
          toAmount: (i * ETH_PRICE).toString(),
          status: 'success',
        });
      }
    });

    expect(result.current.history).toHaveLength(MAX_HISTORY_RECORDS);
    // Should keep the most recent 50
    expect(result.current.history[0].fromAmount).toBe('51');
    expect(result.current.history[LAST_RECORD_INDEX].fromAmount).toBe('2');
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useSwapHistoryStore());

    act(() => {
      // Add some records first
      result.current.addSwapRecord({
        fromToken: 'ETH',
        toToken: 'USDC',
        fromAmount: '1',
        toAmount: '1800',
        status: 'success',
      });
    });

    expect(result.current.history).toHaveLength(1);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
  });

  it('should handle failed transactions', () => {
    const { result } = renderHook(() => useSwapHistoryStore());

    // Clear history to ensure a clean state
    act(() => {
      result.current.clearHistory();
    });

    // Add a failed transaction record
    act(() => {
      result.current.addSwapRecord({
        fromToken: 'ETH',
        toToken: 'USDC',
        fromAmount: '1',
        toAmount: '1800',
        status: 'failed',
      });
    });

    // Verify the status of the added record
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].status).toBe('failed');
  });
});
