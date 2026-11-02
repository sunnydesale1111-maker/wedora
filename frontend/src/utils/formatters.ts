/**
 * Utility functions for consistent presentation-layer formatting across Wedora.
 */

/**
 * Format a vendor or organizer rating to show strictly one digit after the decimal point.
 * Examples:
 *   formatRating(4.899999999) -> "4.9"
 *   formatRating(4.856) -> "4.9"
 *   formatRating(4.823) -> "4.8"
 *   formatRating(5) -> "5.0"
 */
export function formatRating(val?: number | null, fallback = 4.8): string {
  if (val === undefined || val === null || isNaN(Number(val))) {
    return fallback.toFixed(1);
  }
  return Number(val).toFixed(1);
}

