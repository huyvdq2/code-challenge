import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryHeader from '../components/features/history/HistoryHeader';

describe('HistoryHeader', () => {
  const defaultProps = {
    onClearHistory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header title', () => {
    render(<HistoryHeader {...defaultProps} />);

    expect(screen.getByText('Swap History')).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<HistoryHeader {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Swap History');
  });

  it('renders clear history button', () => {
    render(<HistoryHeader {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /clear all/i })
    ).toBeInTheDocument();
  });

  it('calls onClearHistory when clear button is clicked', () => {
    const onClearHistory = jest.fn();
    render(<HistoryHeader {...defaultProps} onClearHistory={onClearHistory} />);

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearButton);

    expect(onClearHistory).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <HistoryHeader {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
