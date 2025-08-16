// Implementation A: Iterative approach using a for loop
var sum_to_n_a = function (n) {
  if (!Number.isInteger(n) || n <= 0) return -1 // Invalid input
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i
  }
  return sum
}

// Implementation B: Mathematical formula approach
var sum_to_n_b = function (n) {
  if (!Number.isInteger(n) || n <= 0) return -1 // Invalid input
  return (n * (n + 1)) / 2
}

// Implementation C: Recursive approach
var sum_to_n_c = function (n) {
  if (!Number.isInteger(n) || n <= 0) return -1 // Invalid input
  if (n === 1) return 1
  return n + sum_to_n_c(n - 1)
}

// Comprehensive testing function
function runTests() {
  const testCases = [
    { input: 0, expected: -1, description: 'zero (invalid)' },
    { input: -5, expected: -1, description: 'negative (invalid)' },
    { input: 3.14, expected: -1, description: 'decimal (invalid)' },
    { input: 5.7, expected: -1, description: 'float (invalid)' },
    { input: '5', expected: -1, description: 'string (invalid)' },
    { input: null, expected: -1, description: 'null (invalid)' },
    { input: undefined, expected: -1, description: 'undefined (invalid)' },
    { input: NaN, expected: -1, description: 'NaN (invalid)' },
    { input: Infinity, expected: -1, description: 'Infinity (invalid)' },
    { input: 1, expected: 1, description: 'one' },
    { input: 5, expected: 15, description: 'small positive integer' },
    { input: 10, expected: 55, description: 'medium positive integer' },
    { input: 100, expected: 5050, description: 'large positive integer' },
  ]

  const implementations = [
    { name: 'A (Iterative)', func: sum_to_n_a },
    { name: 'B (Mathematical)', func: sum_to_n_b },
    { name: 'C (Recursive)', func: sum_to_n_c },
  ]

  console.log('=== COMPREHENSIVE TESTING ===\n')

  let allTestsPassed = true

  testCases.forEach((testCase) => {
    console.log(`Testing ${testCase.description} (n = ${testCase.input}):`)

    implementations.forEach((impl) => {
      const result = impl.func(testCase.input)
      const passed = result === testCase.expected
      const status = passed ? '✓ PASS' : '✗ FAIL'

      console.log(`  ${impl.name}: ${result} ${status}`)

      if (!passed) {
        console.log(`    Expected: ${testCase.expected}, Got: ${result}`)
        allTestsPassed = false
      }
    })

    console.log()
  })

  console.log(`=== OVERALL RESULT ===`)
  console.log(allTestsPassed ? '✓ All tests PASSED!' : '✗ Some tests FAILED!')

  return allTestsPassed
}

// Run the tests
runTests()
