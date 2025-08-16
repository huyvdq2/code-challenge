import { formatAmount, formatTimestamp } from '../lib/utils';

describe('Basic Utils Tests', () => {
  it('should format amounts correctly', () => {
    expect(formatAmount('1000')).toBe('1,000');
    expect(formatAmount('0.123456789')).toBe('0.123,456,789');
    expect(formatAmount('')).toBe('0');
  });

  it('should format timestamps correctly', () => {
    const testDate = new Date('2023-08-17T12:00:00Z').getTime();
    const result = formatTimestamp(testDate);
    expect(result).toContain('Aug');
  });
});
