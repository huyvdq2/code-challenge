import { useQuery } from '@tanstack/react-query';
import { Token } from '../store/types';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';

export const fetchTokenPrices = async (): Promise<Token[]> => {
  const response = await fetch(PRICES_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch token prices');
  }
  const data: Token[] = await response.json();

  // Filter duplicates by currency, keeping the most recent one
  return data.reduce((acc: Token[], current: Token) => {
    const existingIndex = acc.findIndex(
      (token) => token.currency === current.currency
    );
    if (existingIndex >= 0) {
      // Keep the token with the most recent date
      if (new Date(current.date) > new Date(acc[existingIndex].date)) {
        acc[existingIndex] = current;
      }
    } else {
      acc.push(current);
    }
    return acc;
  }, []);
};

export const useTokenPrices = () => {
  return useQuery({
    queryKey: ['tokenPrices'],
    queryFn: fetchTokenPrices,
    // 30 seconds
    staleTime: 30000,
    // Refetch every minute
    refetchInterval: 60000,
  });
};
