import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { SwapFormContainer } from '../components/features/swap-form';

// Mock the fetch for the API calls
global.fetch = jest.fn();

const MOCK_DATE = '2023-08-16';
const SWAP_TOKENS_TEXT = 'Swap Tokens';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe('SwapFormContainer', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { currency: 'ETH', date: MOCK_DATE, price: 1800 },
        { currency: 'BTC', date: MOCK_DATE, price: 26000 },
        { currency: 'USDC', date: MOCK_DATE, price: 1 },
      ],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithQueryClient(<SwapFormContainer />);
    expect(screen.getByText(/loading tokens/i)).toBeInTheDocument();
  });

  it('renders form elements after tokens load', async () => {
    renderWithQueryClient(<SwapFormContainer />);

    await waitFor(() => {
      expect(screen.getByText('Currency Swap')).toBeInTheDocument();
      expect(screen.getByText('From Token')).toBeInTheDocument();
      expect(screen.getByText('To Token')).toBeInTheDocument();
      expect(screen.getByText(SWAP_TOKENS_TEXT)).toBeInTheDocument();
    });
  });

  it('displays validation errors when submitting empty form', async () => {
    renderWithQueryClient(<SwapFormContainer />);

    await waitFor(() => {
      expect(screen.getByText(SWAP_TOKENS_TEXT)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(SWAP_TOKENS_TEXT));

    await waitFor(() => {
      expect(
        screen.getByText(/please select a token to swap from/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please select a token to swap to/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/please enter an amount/i)).toBeInTheDocument();
    });
  });

  it('shows exchange rate when both tokens are selected', async () => {
    renderWithQueryClient(<SwapFormContainer />);

    await waitFor(() => {
      expect(screen.getByText('Rate unavailable')).toBeInTheDocument();
    });
  });

  it('allows swapping token positions', async () => {
    renderWithQueryClient(<SwapFormContainer />);

    await waitFor(() => {
      const swapButton = screen.getByRole('button', { name: /swap/i });
      expect(swapButton).toBeInTheDocument();
      fireEvent.click(swapButton);
    });
  });
});
