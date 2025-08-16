export const TOKEN_ICON_BASE_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

// Mapping for tokens that have different naming conventions
const TOKEN_NAME_MAPPING: Record<string, string> = {
  STEVMOS: 'stEVMOS',
  RATOM: 'rATOM',
  STOSMO: 'stOSMO',
  STATOM: 'stATOM',
  STLUNA: 'stLUNA',
  // Add more mappings as needed
};

export const getTokenIconUrl = (currency: string): string => {
  const mappedName = TOKEN_NAME_MAPPING[currency] || currency;
  return `${TOKEN_ICON_BASE_URL}/${mappedName}.svg`;
};

export const normalizeTokenName = (currency: string): string => {
  return TOKEN_NAME_MAPPING[currency] || currency;
};
