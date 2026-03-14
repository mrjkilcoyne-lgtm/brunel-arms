/**
 * THE BRUNEL ENGINE — Spacing & Layout System
 *
 * Art Deco is about generous white space and deliberate proportion.
 * These values create breathing room that feels luxurious,
 * not cramped or cluttered.
 *
 * Base unit: 4px (allows fine control)
 * Primary scale: multiples of 8 (standard mobile rhythm)
 */

export const spacing = {
  // Fine adjustments
  xxs: 2,
  xs: 4,

  // Standard scale
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Generous Art Deco spacing
  section: 80,
  screen: 96,
} as const;

export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const layout = {
  // Screen padding — generous, like the margins of a fine book
  screenPadding: 24,
  // Card padding
  cardPadding: 20,
  // Maximum content width
  maxWidth: 480,
  // Art Deco decorative line thickness
  lineThick: 2,
  lineThin: 1,
  lineAccent: 3,
} as const;
