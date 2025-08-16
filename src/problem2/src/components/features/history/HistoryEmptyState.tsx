import React from 'react';
import { Clock } from 'lucide-react';

interface HistoryEmptyStateProps {
  className?: string;
}

const HistoryEmptyState = React.memo<HistoryEmptyStateProps>(
  ({ className }) => (
    <div
      className={`text-center text-muted-foreground py-8 ${className || ''}`}
    >
      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>No swap history yet</p>
      <p className="text-sm">Your completed swaps will appear here</p>
    </div>
  )
);

HistoryEmptyState.displayName = 'HistoryEmptyState';

export default HistoryEmptyState;
