/**
 * Phone number formatting utilities for Senegal (+221)
 * 
 * Senegal phone number format:
 * - Country code: +221
 * - Mobile numbers: 10 digits, typically start with 70, 75, 76, 77, 78
 * - Examples: +221 77 123 4567, 221771234567, 771234567
 */

/**
 * Formats a phone number for display in Senegal
 * @param phone - Raw phone number (any format)
 * @returns Formatted phone number: +221 XX XXX XXXX
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle different input formats
  let normalized: string;
  
  if (digits.startsWith('221')) {
    // Already has country code (221771234567)
    normalized = digits;
  } else if (digits.startsWith('0') && digits.length === 9) {
    // Starts with 0 (0771234567)
    normalized = '221' + digits.substring(1);
  } else if (digits.length === 9) {
    // Direct 9 digits (771234567)
    normalized = '221' + digits;
  } else if (digits.startsWith('+221')) {
    // Already has +221
    normalized = digits.replace(/\D/g, '');
  } else {
    // Try to handle as-is
    normalized = digits;
  }
  
  // Format as +221 XX XXX XXXX
  if (normalized.length >= 10) {
    const part1 = normalized.substring(3, 5);
    const part2 = normalized.substring(5, 8);
    const part3 = normalized.substring(8, 12);
    return `+221 ${part1} ${part2} ${part3}`.trim();
  }
  
  return phone; // Return original if can't parse
}

/**
 * Normalizes a phone number for storage (removes formatting)
 * @param phone - Raw phone number
 * @returns Normalized: 221XXXXXXXXX (without +)
 */
export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('221')) {
    return digits;
  } else if (digits.startsWith('0') && digits.length === 10) {
    return '221' + digits.substring(1);
  } else if (digits.length === 9) {
    return '221' + digits;
  } else if (digits.startsWith('+221')) {
    return digits.replace(/\D/g, '');
  }
  
  return digits || null;
}

/**
 * Validates if a phone number is valid for Senegal
 * @param phone - Phone number to validate
 * @returns true if valid Senegal number
 */
export function isValidSenegalPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return false;
  
  // Must be 12 digits starting with 221
  if (normalized.length !== 12 || !normalized.startsWith('221')) {
    return false;
  }
  
  // Check prefix (70, 75, 76, 77, 78)
  const prefix = normalized.substring(3, 5);
  const validPrefixes = ['70', '75', '76', '77', '78'];
  
  return validPrefixes.includes(prefix);
}
