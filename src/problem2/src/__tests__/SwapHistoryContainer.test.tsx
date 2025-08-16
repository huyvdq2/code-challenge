import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwapHistoryContainer } from '../components/features/history';

// Mock the store
const mockClearHistory = jest.fn();
let mockHistory: Array<{
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'success' | 'failed';
  timestamp: number;
  rate?: string;
}> = [];

jest.mock('../store/swapHistoryStore', () => ({
  useSwapHistoryStore: () => ({
    history: mockHistory,
    clearHistory: mockClearHistory,
  }),
}));

describe('SwapHistoryContainer', () => {
  beforeEach(() => {
    mockClearHistory.mockClear();
    // Set up history with data
    mockHistory = [
      {
        id: '1',
        fromToken: 'ETH',
        toToken: 'BTC',
        fromAmount: '1',
        toAmount: '0.069',
        status: 'success' as const,
        timestamp: Date.now(),
        rate: '1 ETH = 0.069 BTC',
      },
      {
        id: '2',
        fromToken: 'BTC',
        toToken: 'USDC',
        fromAmount: '0.1',
        toAmount: '2600',
        status: 'failed' as const,
        timestamp: Date.now() - 1000000,
      },
    ];
  });

  it('renders history items when there is data', () => {
    render(<SwapHistoryContainer />);

    expect(screen.getByText('Swap History')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getAllByText('BTC')).toHaveLength(2);
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('shows clear all button when there is history', () => {
    render(<SwapHistoryContainer />);

    if (mockHistory.length > 0) {
      const clearButton = screen.getByText('Clear All');
      expect(clearButton).toBeInTheDocument();
    } else {
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    }
  });

  it('calls clearHistory when clear button is clicked', () => {
    render(<SwapHistoryContainer />);

    if (mockHistory.length > 0) {
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);
      expect(mockClearHistory).toHaveBeenCalledTimes(1);
    }
  });
});

describe('SwapHistoryContainer - Empty State', () => {
  beforeEach(() => {
    mockClearHistory.mockClear();
    // Set up empty history
    mockHistory = [];
  });

  it('renders empty state when no history', () => {
    render(<SwapHistoryContainer />);

    expect(screen.getByText('Swap History')).toBeInTheDocument();
    expect(screen.getByText(/no swap history yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your completed swaps will appear here/i)
    ).toBeInTheDocument();
  });

  it('does not show clear button when empty', () => {
    render(<SwapHistoryContainer />);

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });
});
