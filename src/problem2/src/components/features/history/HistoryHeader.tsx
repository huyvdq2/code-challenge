import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryHeaderProps {
  onClearHistory: () => void;
  className?: string;
}

const HistoryHeader = React.memo<HistoryHeaderProps>(
  ({ onClearHistory, className }) => (
    <div
      className={`flex items-center justify-between p-6 border-b ${className || ''}`}
    >
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Swap History
      </h2>
      <Button variant="outline" size="sm" onClick={onClearHistory}>
        Clear All
      </Button>
    </div>
  )
);

HistoryHeader.displayName = 'HistoryHeader';

export default HistoryHeader;
