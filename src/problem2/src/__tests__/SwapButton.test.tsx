import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwapButton from '../components/features/swap-form/SwapButton';

describe('SwapButton', () => {
  const defaultProps = {
    onSwap: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders swap button with default text', () => {
    render(<SwapButton {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSwap when clicked', () => {
    const onSwap = jest.fn();
    render(<SwapButton {...defaultProps} onSwap={onSwap} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onSwap).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<SwapButton {...defaultProps} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onSwap when disabled', () => {
    const onSwap = jest.fn();
    render(<SwapButton {...defaultProps} onSwap={onSwap} disabled={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onSwap).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SwapButton {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has correct button properties', () => {
    render(<SwapButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('rounded-full', 'h-10', 'w-10');
  });

  it('contains ArrowUpDown icon', () => {
    render(<SwapButton {...defaultProps} />);

    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('has correct variant and size', () => {
    render(<SwapButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full');
  });

  it('renders with displayName', () => {
    expect(SwapButton.displayName).toBe('SwapButton');
  });
});
