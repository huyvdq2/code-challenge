import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { getTokenIconUrl } from '@/lib/tokenUtils';
import { formatAmount, formatTimestamp } from '@/lib/utils';
import { SwapHistoryItem } from '@/store/swapHistoryStore';

interface HistoryItemProps {
  item: SwapHistoryItem;
}

const HistoryItem = React.memo<HistoryItemProps>(({ item }) => (
  <div className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <img
              src={getTokenIconUrl(item.fromToken)}
              alt={item.fromToken}
              className="w-6 h-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="font-medium">{formatAmount(item.fromAmount)}</span>
            <span className="text-muted-foreground">{item.fromToken}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <img
              src={getTokenIconUrl(item.toToken)}
              alt={item.toToken}
              className="w-6 h-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="font-medium">{formatAmount(item.toAmount)}</span>
            <span className="text-muted-foreground">{item.toToken}</span>
          </div>
        </div>
        {item.rate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3 w-3" />
            <span>{item.rate}</span>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          {formatTimestamp(item.timestamp)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {item.status === 'success' ? 'Success' : 'Failed'}
        </span>
      </div>
    </div>
  </div>
));

HistoryItem.displayName = 'HistoryItem';

export default HistoryItem;
