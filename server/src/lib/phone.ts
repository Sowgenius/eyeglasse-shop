/**
 * Phone number utilities for Senegal (+221)
 */

const SENEGAL_COUNTRY_CODE = '221';
const VALID_PREFIXES = ['70', '75', '76', '77', '78'];

/**
 * Normalizes a phone number for storage
 * Converts to format: 221XXXXXXXXX (without +)
 */
export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Already has country code
  if (digits.startsWith(SENEGAL_COUNTRY_CODE)) {
    return digits;
  }
  
  // Starts with 0 (e.g., 0771234567)
  if (digits.startsWith('0') && digits.length === 10) {
    return SENEGAL_COUNTRY_CODE + digits.substring(1);
  }
  
  // Direct 9 digits (e.g., 771234567)
  if (digits.length === 9) {
    return SENEGAL_COUNTRY_CODE + digits;
  }
  
  // Already has +221
  if (phone.includes('+221')) {
    return digits;
  }
  
  // Return as-is if can't parse
  return digits || null;
}

/**
 * Formats a phone number for display
 * Converts from 221XXXXXXXXX to +221 XX XXX XXXX
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  const normalized = normalizePhoneNumber(phone);
  if (!normalized || normalized.length < 10) return phone;
  
  // Format as +221 XX XXX XXXX
  const part1 = normalized.substring(3, 5);
  const part2 = normalized.substring(5, 8);
  const part3 = normalized.substring(8, 12);
  
  return `+221 ${part1} ${part2} ${part3}`.trim();
}

/**
 * Validates if a phone number is valid for Senegal
 */
export function isValidSenegalPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return false;
  
  // Must be 12 digits starting with 221
  if (normalized.length !== 12 || !normalized.startsWith(SENEGAL_COUNTRY_CODE)) {
    return false;
  }
  
  // Check prefix
  const prefix = normalized.substring(3, 5);
  return VALID_PREFIXES.includes(prefix);
}
