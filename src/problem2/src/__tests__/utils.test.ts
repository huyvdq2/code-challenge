import { cn, formatAmount, formatTimestamp } from '../lib/utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const isActive = false;
    const isVisible = true;
    expect(cn('base', isActive && 'conditional')).toBe('base');
    expect(cn('base', isVisible && 'conditional')).toBe('base conditional');
  });

  it('handles arrays and objects', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn({ active: true, inactive: false })).toBe('active');
  });

  it('handles Tailwind merge conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(null, undefined)).toBe('');
  });
});

describe('formatAmount', () => {
  it('formats small amounts correctly', () => {
    expect(formatAmount('0.001')).toBe('0.001');
    expect(formatAmount('0.1234567')).toBe('0.123,456,7');
  });

  it('formats large amounts correctly', () => {
    expect(formatAmount('1000')).toBe('1,000');
    expect(formatAmount('1234567')).toBe('1,234,567');
  });

  it('handles decimal numbers', () => {
    expect(formatAmount('123.456789')).toBe('123.456,789');
    expect(formatAmount('1000.123456789')).toBe('1,000.123,456,789');
  });

  it('handles edge cases', () => {
    expect(formatAmount('0')).toBe('0');
    expect(formatAmount('')).toBe('0');
    expect(formatAmount('invalid')).toBe('0');
    expect(formatAmount('NaN')).toBe('0');
  });

  it('handles negative numbers', () => {
    expect(formatAmount('-123')).toBe('-123');
    expect(formatAmount('-1000')).toBe('-1,000');
  });
});

describe('formatTimestamp', () => {
  const mockDate = new Date('2023-08-17T12:00:00.000Z');
  const mockTimestamp = mockDate.getTime();

  it('formats timestamp correctly', () => {
    const result = formatTimestamp(mockTimestamp);
    // Adjusted for client timezone
    expect(result).toContain('Aug');
    expect(result).toContain('17');
  });

  it('handles different timestamps', () => {
    const jan1 = new Date('2023-01-01T09:30:00.000Z').getTime();
    const result = formatTimestamp(jan1);
    expect(result).toContain('Jan');
    expect(result).toContain('1');
  });

  it('handles edge cases', () => {
    expect(formatTimestamp(0)).toBeDefined();
    expect(formatTimestamp(NaN)).toBeDefined();

    // Should handle very large timestamps
    const farFuture = new Date('2099-12-31T23:59:59.999Z').getTime();
    expect(formatTimestamp(farFuture)).toBeDefined();
  });
});
