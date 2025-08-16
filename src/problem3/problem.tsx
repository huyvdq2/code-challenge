interface WalletBalance {
  currency: string
  amount: number
  // ERROR 1: Missing 'blockchain' property
  // WHY: The code uses balance.blockchain throughout but it's not defined in the interface
  // This will cause TypeScript compilation errors
}

interface FormattedWalletBalance {
  currency: string
  amount: number
  formatted: string
  // ERROR 2: Should extend WalletBalance instead of redefining properties
  // WHY: This duplicates properties and doesn't include 'blockchain' which is used later
  // Should be: interface FormattedWalletBalance extends WalletBalance { formatted: string; }

  // ERROR 3: Missing 'usdValue' property
  // WHY: The code calculates usdValue and passes it to WalletRow, but it's not in the interface
}

interface Props extends BoxProps {
  // ERROR 4: Empty interface extending BoxProps
  // WHY: This is not technically an error but is unnecessary - could use BoxProps directly
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  // ERROR 5: Unused destructuring - 'children' is never used in the component
  // WHY: This creates an unnecessary variable that's never referenced
  // Should just use: const { ...rest } = props; or use props directly

  const balances = useWalletBalances()
  const prices = usePrices()

  const getPriority = (blockchain: any): number => {
    // ERROR 6: Using 'any' type loses type safety
    // WHY: Should be 'string' for proper TypeScript checking
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain)
        // ERROR 7: 'balance.blockchain' doesn't exist on WalletBalance interface
        // WHY: blockchain property is missing from the interface definition

        if (lhsPriority > -99) {
          // ERROR 8: 'lhsPriority' is undefined - should be 'balancePriority'
          // WHY: Variable name mismatch - lhsPriority was never declared

          if (balance.amount <= 0) {
            // ERROR 9: Logic error - returning true for zero/negative amounts
            // WHY: This keeps zero balances when it should probably filter them out
            return true
          }
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        // ERROR 10: Same blockchain property issue as above
        // WHY: lhs.blockchain and rhs.blockchain don't exist on WalletBalance

        if (leftPriority > rightPriority) {
          return -1
        } else if (rightPriority > leftPriority) {
          return 1
        }
        // ERROR 11: Missing return statement for equal case
        // WHY: When priorities are equal, function returns undefined instead of 0
        // This can cause inconsistent sorting behavior
      })
  }, [balances, prices])
  // ERROR 12: 'prices' dependency is unnecessary
  // WHY: prices is not used in this useMemo, only balances should be in dependency array

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    }
  })
  // ERROR 13: formattedBalances is created but never used
  // WHY: This variable is computed but the code uses sortedBalances in the rows mapping instead

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // ERROR 14: Type mismatch - sortedBalances is WalletBalance[] not FormattedWalletBalance[]
      // WHY: sortedBalances doesn't have the 'formatted' property, so balance.formatted will be undefined

      const usdValue = prices[balance.currency] * balance.amount
      return (
        <WalletRow
          className={classes.row}
          key={index}
          // ERROR 15: Using array index as key is an anti-pattern
          // WHY: Can cause React rendering issues when list order changes
          // Should use unique identifier like currency-blockchain combination

          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
          // ERROR 16: balance.formatted is undefined
          // WHY: sortedBalances items don't have formatted property
        />
      )
    }
  )

  return <div {...rest}>{rows}</div>
}

// ADDITIONAL PERFORMANCE ISSUES:
// ERROR 17: getPriority function recreated on every render
// WHY: Function is defined inside component, causing unnecessary re-renders and useMemo invalidation

// ERROR 18: Missing memoization for expensive operations
// WHY: formattedBalances mapping runs on every render, should be memoized

// ERROR 19: Double iteration inefficiency
// WHY: Creating formattedBalances then mapping sortedBalances separately is wasteful
