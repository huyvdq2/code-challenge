import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TokenSelect } from '../components/common';

const TEST_DATE = '2023-08-16';
const SEARCH_PLACEHOLDER = 'Search tokens...';
const mockTokens = [
  { currency: 'ETH', price: 1800, date: TEST_DATE },
  { currency: 'BTC', price: 26000, date: TEST_DATE },
  { currency: 'USDC', price: 1, date: TEST_DATE },
];

describe('TokenSelect', () => {
  const defaultProps = {
    value: '',
    onValueChange: jest.fn(),
    label: 'Test Token',
    tokens: mockTokens,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    render(<TokenSelect {...defaultProps} />);

    expect(screen.getByText('Test Token Token')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(<TokenSelect {...defaultProps} />);

    expect(screen.getByText('Select test token token')).toBeInTheDocument();
  });

  it('displays selected token', () => {
    render(<TokenSelect {...defaultProps} value="ETH" />);

    expect(screen.getByText(/ETH - \$1800\.0000/)).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(<TokenSelect {...defaultProps} />);

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
      ).toBeInTheDocument();
      expect(screen.getByText(/ETH - \$1800\.0000/)).toBeInTheDocument();
      expect(screen.getByText(/BTC - \$26000\.0000/)).toBeInTheDocument();
      expect(screen.getByText(/USDC - \$1\.0000/)).toBeInTheDocument();
    });
  });

  it('filters tokens based on search', async () => {
    render(<TokenSelect {...defaultProps} />);

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(SEARCH_PLACEHOLDER);
      fireEvent.change(searchInput, { target: { value: 'ETH' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/ETH - \$1800\.0000/)).toBeInTheDocument();
      expect(screen.queryByText(/BTC - \$26000\.0000/)).not.toBeInTheDocument();
    });
  });

  it('calls onValueChange when token is selected', async () => {
    const onValueChange = jest.fn();
    render(<TokenSelect {...defaultProps} onValueChange={onValueChange} />);

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    await waitFor(() => {
      const ethOption = screen.getByText(/ETH - \$1800\.0000/);
      fireEvent.click(ethOption);
    });

    expect(onValueChange).toHaveBeenCalledWith('ETH');
  });

  it('shows error message when provided', () => {
    render(<TokenSelect {...defaultProps} error="Please select a token" />);

    expect(screen.getByText('Please select a token')).toBeInTheDocument();
  });

  it('disables dropdown when disabled prop is true', () => {
    render(<TokenSelect {...defaultProps} disabled={true} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeDisabled();
  });

  it('shows "No tokens found" when search has no results', async () => {
    render(<TokenSelect {...defaultProps} />);

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(SEARCH_PLACEHOLDER);
      fireEvent.change(searchInput, { target: { value: 'XYZ' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No tokens found')).toBeInTheDocument();
    });
  });
});
