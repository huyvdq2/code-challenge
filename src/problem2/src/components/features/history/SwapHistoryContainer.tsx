import React from 'react';
import { Clock } from 'lucide-react';
import { useSwapHistoryStore } from '@/store/swapHistoryStore';
import HistoryHeader from './HistoryHeader';
import HistoryEmptyState from './HistoryEmptyState';
import HistoryItem from './HistoryItem';

const SwapHistoryContainer: React.FC = () => {
  const { history, clearHistory } = useSwapHistoryStore();

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Swap History
          </h2>
        </div>
        <HistoryEmptyState />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg border">
      <HistoryHeader onClearHistory={clearHistory} />
      <div className="overflow-y-auto max-h-[65vh]">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SwapHistoryContainer;
