import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the fetch for the API calls
global.fetch = jest.fn();

const MOCK_DATE = '2023-08-16';

describe('App Integration Tests', () => {
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

  it('renders the main app components', async () => {
    render(<App />);

    expect(screen.getByText(/currency swap/i)).toBeInTheDocument();
    expect(screen.getByText('Swap History')).toBeInTheDocument();
  });

  it('displays swap form after tokens load', async () => {
    render(<App />);

    expect(screen.getByText('From Token')).toBeInTheDocument();
    expect(screen.getByText('To Token')).toBeInTheDocument();
    expect(screen.getByText('You Pay Amount')).toBeInTheDocument();
    expect(screen.getByText('You Receive Amount')).toBeInTheDocument();
  });

  it('displays empty history state initially', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no swap history yet/i)).toBeInTheDocument();
      expect(
        screen.getByText(/your completed swaps will appear here/i)
      ).toBeInTheDocument();
    });
  });

  it('loads without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('has proper semantic structure', () => {
    render(<App />);

    // Check for main content area
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
