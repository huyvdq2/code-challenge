import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { useTokenPrices, fetchTokenPrices } from '../hooks/useTokenPrices';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useTokenPrices', () => {
  it('returns loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: 'Error fetching data',
    });

    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Error fetching data');
  });

  it('returns success state with data', () => {
    const mockData = [
      { currency: 'ETH', price: 1800 },
      { currency: 'BTC', price: 25000 },
    ];
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
    });

    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles empty data array', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    });

    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('handles unexpected data structure', () => {
    const mockData = [{ unexpectedKey: 'unexpectedValue' }];
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
    });

    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles null data', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
    });

    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

global.fetch = jest.fn();

describe('fetchTokenPrices', () => {
  it('throws an error when fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(fetchTokenPrices()).rejects.toThrow(
      'Failed to fetch token prices'
    );
  });

  const MOCK_ETH = { currency: 'ETH', date: '2023-01-01', price: 1800 };
  const MOCK_BTC = { currency: 'BTC', date: '2023-01-01', price: 25000 };
  const MOCK_ETH_RECENT = { currency: 'ETH', date: '2023-01-02', price: 1900 };

  it('filters duplicates and keeps the most recent token', async () => {
    const mockData = [MOCK_ETH, MOCK_ETH_RECENT, MOCK_BTC];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchTokenPrices();

    expect(result).toEqual([MOCK_ETH_RECENT, MOCK_BTC]);
  });

  it('returns all tokens when no duplicates exist', async () => {
    const mockData = [MOCK_ETH, MOCK_BTC];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchTokenPrices();

    expect(result).toEqual(mockData);
  });
});
