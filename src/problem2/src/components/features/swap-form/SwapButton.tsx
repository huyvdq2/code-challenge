import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
  className?: string;
}

const SwapButton = React.memo<SwapButtonProps>(
  ({ onSwap, disabled = false, className }) => (
    <div className={`flex justify-center ${className || ''}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onSwap}
        disabled={disabled}
        className="rounded-full h-10 w-10"
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  )
);

SwapButton.displayName = 'SwapButton';

export default SwapButton;
