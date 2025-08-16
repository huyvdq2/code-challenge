// Data Types
interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
  usdValue: number
}

// Business Logic - Priority Configuration
/**
 * Priority mapping for different blockchain networks.
 * Higher values indicate higher priority in sorting.
 */
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const

/**
 * Get priority value for a blockchain.
 * @param blockchain - The blockchain name
 * @returns Priority number (higher = more important), -99 for unknown blockchains
 */
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99
}

// Business Logic - Data Processing Hooks
/**
 * Filters wallet balances to only include supported blockchains with positive amounts.
 * @param balances - Raw wallet balances
 * @returns Filtered balances array
 */
const useFilteredBalances = (balances: WalletBalance[]) => {
  return useMemo(() => {
    return balances.filter((balance) => {
      const balancePriority = getPriority(balance.blockchain)
      // Only include balances from supported blockchains with positive amounts
      return balancePriority > -99 && balance.amount > 0
    })
  }, [balances])
}

/**
 * Sorts wallet balances by blockchain priority (highest priority first).
 * @param balances - Filtered wallet balances
 * @returns Sorted balances array
 */
const useSortedBalances = (balances: WalletBalance[]) => {
  return useMemo(() => {
    return balances.sort((lhs, rhs) => {
      const leftPriority = getPriority(lhs.blockchain)
      const rightPriority = getPriority(rhs.blockchain)

      // Sort by priority: higher priority comes first
      if (leftPriority > rightPriority) {
        return -1
      } else if (rightPriority > leftPriority) {
        return 1
      }
      return 0 // Equal priority
    })
  }, [balances])
}

/**
 * Formats wallet balances for display, adding formatted amounts and USD values.
 * @param balances - Sorted wallet balances
 * @param prices - Currency to USD price mapping
 * @returns Formatted balances with display strings and USD values
 */
const useFormattedBalances = (
  balances: WalletBalance[],
  prices: Record<string, number>
): FormattedWalletBalance[] => {
  return useMemo(() => {
    return balances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(), // Format amount for display
      usdValue: prices[balance.currency] * balance.amount, // Calculate USD equivalent
    }))
  }, [balances, prices])
}

/**
 * Main business logic hook that combines filtering, sorting, and formatting.
 * Orchestrates the entire data transformation pipeline.
 * @returns Ready-to-display wallet balances
 */
const useWalletData = () => {
  // Get raw data from external hooks
  const balances = useWalletBalances()
  const prices = usePrices()

  // Transform data through processing pipeline
  const filteredBalances = useFilteredBalances(balances)
  const sortedBalances = useSortedBalances(filteredBalances)
  const formattedBalances = useFormattedBalances(sortedBalances, prices)

  return formattedBalances
}

// UI Layer - Pure Presentation Components
interface WalletListProps {
  balances: FormattedWalletBalance[]
}

/**
 * Renders a list of wallet balance rows.
 * Pure component - only handles presentation, no business logic.
 * @param balances - Formatted wallet balances ready for display
 */
const WalletList: React.FC<WalletListProps> = ({ balances }) => (
  <>
    {balances.map((balance) => (
      <WalletRow
        key={`${balance.currency}-${balance.blockchain}`} // Unique key for React reconciliation
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    ))}
  </>
)

/**
 * Main wallet page component.
 * Container component that orchestrates data fetching and rendering.
 * Separates business logic (useWalletData) from presentation (WalletList).
 */
const WalletPage: React.FC<BoxProps> = (props) => {
  // Get processed wallet data from business logic layer
  const formattedBalances = useWalletData()

  return (
    <div {...props}>
      <WalletList balances={formattedBalances} />
    </div>
  )
}
