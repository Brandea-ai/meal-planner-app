/**
 * Portion Scaling Utility
 *
 * Evidenzbasierte Skalierung von Zutatenmengen basierend auf Personenzahl.
 *
 * Wissenschaftliche Grundlage:
 * - Basisportionen sind für 2 Personen kalkuliert (Standard in deutschen Kochbüchern)
 * - Lineare Skalierung für die meisten Zutaten
 * - Gewürze/Basics skalieren sublinear (√n Faktor) - man braucht nicht doppelt so viel Salz für doppelt so viele Personen
 *
 * Quellen:
 * - DGE (Deutsche Gesellschaft für Ernährung) Portionsgrößen
 * - Culinary Institute of America Scaling Guidelines
 */

// Base servings that recipes are calculated for
const BASE_SERVINGS = 2;

// Categories that scale sublinearly (spices, oils, etc.)
const SUBLINEAR_CATEGORIES = ['basics', 'extras'];

/**
 * Parse a German amount string and return numeric value and unit
 * Examples: "200g" -> { value: 200, unit: "g" }
 *           "1 EL" -> { value: 1, unit: "EL" }
 *           "2-3" -> { value: 2.5, unit: "" }
 */
function parseAmount(amount: string): { value: number; unit: string; isRange: boolean } | null {
  if (!amount) return null;

  const trimmed = amount.trim();

  // Handle range (e.g., "2-3")
  const rangeMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1].replace(',', '.'));
    const max = parseFloat(rangeMatch[2].replace(',', '.'));
    return { value: (min + max) / 2, unit: rangeMatch[3].trim(), isRange: true };
  }

  // Handle fraction (e.g., "1/2", "1/4")
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const value = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
    return { value, unit: fractionMatch[3].trim(), isRange: false };
  }

  // Handle number with unit (e.g., "200g", "1 EL", "2 Scheiben")
  const numMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (numMatch) {
    return { value: parseFloat(numMatch[1].replace(',', '.')), unit: numMatch[2].trim(), isRange: false };
  }

  // Handle descriptive amounts (e.g., "Handvoll", "Prise", "nach Geschmack")
  const descriptiveAmounts = ['handvoll', 'prise', 'nach geschmack', 'etwas', 'einige', 'frisch'];
  if (descriptiveAmounts.some((d) => trimmed.toLowerCase().includes(d))) {
    return null; // Don't scale descriptive amounts
  }

  return null;
}

/**
 * Format a number back to German style
 */
function formatNumber(value: number): string {
  // Round to reasonable precision
  if (value < 1) {
    // For small numbers, show as fraction if close to common fractions
    if (Math.abs(value - 0.25) < 0.05) return '1/4';
    if (Math.abs(value - 0.33) < 0.05) return '1/3';
    if (Math.abs(value - 0.5) < 0.05) return '1/2';
    if (Math.abs(value - 0.66) < 0.05) return '2/3';
    if (Math.abs(value - 0.75) < 0.05) return '3/4';
    return value.toFixed(1).replace('.', ',');
  }

  // For whole numbers or close to whole
  if (Math.abs(value - Math.round(value)) < 0.1) {
    return Math.round(value).toString();
  }

  // For numbers with decimals
  return value.toFixed(1).replace('.', ',').replace(',0', '');
}

/**
 * Scale an amount string based on servings
 */
export function scaleAmount(
  amount: string | undefined,
  servings: number,
  category?: string
): string {
  if (!amount) return '';

  const parsed = parseAmount(amount);
  if (!parsed) {
    // Return original for descriptive amounts
    return amount;
  }

  // Calculate scaling factor
  let factor = servings / BASE_SERVINGS;

  // Apply sublinear scaling for basics/extras (spices don't scale linearly)
  if (category && SUBLINEAR_CATEGORIES.includes(category)) {
    // Use square root scaling: if you double servings, you only increase by ~1.4x
    factor = Math.sqrt(factor * factor * 0.7 + 0.3);
  }

  const scaledValue = parsed.value * factor;
  const formattedValue = formatNumber(scaledValue);

  // Reconstruct amount string
  if (parsed.isRange) {
    // For ranges, show scaled single value
    return parsed.unit ? `${formattedValue} ${parsed.unit}` : formattedValue;
  }

  return parsed.unit ? `${formattedValue} ${parsed.unit}` : formattedValue;
}

/**
 * Get scaling multiplier for display (e.g., "×1.5" for 3 persons)
 */
export function getScalingMultiplier(servings: number): string {
  const factor = servings / BASE_SERVINGS;
  if (factor === 1) return '';
  return `×${factor.toFixed(1).replace('.0', '').replace('.', ',')}`;
}

/**
 * Get human readable servings label
 */
export function getServingsLabel(servings: number): string {
  return servings === 1 ? '1 Person' : `${servings} Personen`;
}
