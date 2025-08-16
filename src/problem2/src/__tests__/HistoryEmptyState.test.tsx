import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryEmptyState from '../components/features/history/HistoryEmptyState';

describe('HistoryEmptyState', () => {
  it('renders empty state message', () => {
    render(<HistoryEmptyState />);

    expect(screen.getByText('No swap history yet')).toBeInTheDocument();
  });

  it('renders descriptive text', () => {
    render(<HistoryEmptyState />);

    expect(
      screen.getByText('Your completed swaps will appear here')
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <HistoryEmptyState className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
