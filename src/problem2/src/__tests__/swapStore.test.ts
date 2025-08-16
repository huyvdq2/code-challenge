import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useSwapStore from '../store/swapStore';

// Mock fetch
global.fetch = jest.fn();

describe('useSwapStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setFromToken, setToToken, setFromAmount, setToAmount } =
      useSwapStore.getState();
    setFromToken('ETH');
    setToToken('USDC');
    setFromAmount('');
    setToAmount('');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSwapStore());

    expect(result.current.fromToken).toBe('ETH');
    expect(result.current.toToken).toBe('USDC');
    expect(result.current.fromAmount).toBe('');
    expect(result.current.toAmount).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update fromToken', () => {
    const { result } = renderHook(() => useSwapStore());

    act(() => {
      result.current.setFromToken('BTC');
    });

    expect(result.current.fromToken).toBe('BTC');
  });

  it('should update fromAmount', () => {
    const { result } = renderHook(() => useSwapStore());

    act(() => {
      result.current.setFromAmount('1.5');
    });

    expect(result.current.fromAmount).toBe('1.5');
  });

  it('should fetch tokens successfully', async () => {
    const mockTokens = [
      { currency: 'ETH', date: '2023-08-16', price: 1800 },
      { currency: 'BTC', date: '2023-08-16', price: 26000 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokens,
    });

    const { result } = renderHook(() => useSwapStore());

    await act(async () => {
      await result.current.fetchTokens();
    });

    expect(result.current.tokens).toEqual(mockTokens);
    expect(result.current.prices).toEqual({
      ETH: 1800,
      BTC: 26000,
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch tokens error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useSwapStore());

    await act(async () => {
      await result.current.fetchTokens();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });

  it('should calculate exchange correctly', () => {
    const { result } = renderHook(() => useSwapStore());

    // Set up prices
    act(() => {
      result.current.prices.ETH = 1800;
      result.current.prices.USDC = 1;
      result.current.setFromAmount('1');
    });

    act(() => {
      result.current.calculateExchange();
    });

    expect(result.current.toAmount).toBe('1800.000000');
  });
});
