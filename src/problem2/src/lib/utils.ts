import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: string | number): string {
  if (!amount || amount === '' || isNaN(Number(amount))) {
    return '0';
  }

  const num = Number(amount);
  const [integer, decimal] = num.toString().split('.');

  // Format integer part with commas
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Format decimal part with commas every 3 digits
  if (decimal) {
    const formattedDecimal = decimal
      .replace(/(\d{3})/g, '$1,')
      .replace(/,$/, '');
    return `${formattedInteger}.${formattedDecimal}`;
  }

  return formattedInteger;
}

const INVALID_DATE_TEXT = 'Invalid date';
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const MILLISECONDS_IN_MINUTE = 1000 * 60;
const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY;

function getRelativeTimeString(diffMs: number): string {
  const diffMins = Math.floor(diffMs / MILLISECONDS_IN_MINUTE);
  const diffHours = Math.floor(diffMs / MILLISECONDS_IN_HOUR);
  const diffDays = Math.floor(diffMs / MILLISECONDS_IN_DAY);

  if (diffMins < 1) {
    return 'Just now';
  }

  if (diffMins < MINUTES_IN_HOUR) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  }

  if (diffHours < HOURS_IN_DAY) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  if (diffDays < DAYS_IN_WEEK) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return '';
}

export function formatTimestamp(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) {
    return INVALID_DATE_TEXT;
  }

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return INVALID_DATE_TEXT;
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const relativeTime = getRelativeTimeString(diffMs);
    if (relativeTime) {
      return relativeTime;
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return INVALID_DATE_TEXT;
  }
}
