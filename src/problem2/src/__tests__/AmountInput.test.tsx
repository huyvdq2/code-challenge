import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AmountInput } from '../components/common';

describe('AmountInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    label: 'Test Amount',
    token: 'ETH',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label and input', () => {
    render(<AmountInput {...defaultProps} />);

    expect(screen.getByLabelText(/test amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('displays token symbol', () => {
    render(<AmountInput {...defaultProps} />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '123' } });

    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('formats value with commas', () => {
    render(<AmountInput {...defaultProps} value="1000" />);

    expect(screen.getByDisplayValue('1,000')).toBeInTheDocument();
  });

  it('shows USD value when price is provided', () => {
    render(<AmountInput {...defaultProps} value="1" price={1800} />);

    expect(screen.getByText('≈ $1800.00 USD')).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    render(<AmountInput {...defaultProps} error="Required field" />);

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<AmountInput {...defaultProps} disabled={true} />);

    expect(screen.getByPlaceholderText('0.00')).toBeDisabled();
  });

  it('only allows numeric input', () => {
    const onChange = jest.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText('0.00');

    // Valid numeric input
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(onChange).toHaveBeenCalledWith('123.45');

    // Invalid alphabetic input should not call onChange
    onChange.mockClear();
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
