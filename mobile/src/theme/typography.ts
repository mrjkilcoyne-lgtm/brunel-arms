/**
 * THE BRUNEL ENGINE — Typography System
 *
 * Art Deco typography is about contrast and hierarchy:
 * - Display faces: geometric, bold, commanding (Josefin Sans)
 * - Body faces: elegant, readable, warm (System serif fallback / Playfair Display)
 *
 * Josefin Sans captures the geometric precision of Art Deco lettering —
 * those clean, architectural forms you see on 1920s building facades.
 *
 * We use generous letter-spacing on headings (like engraved brass plates)
 * and tight, readable spacing on body text.
 */

import { TextStyle } from 'react-native';
import { colors } from './colors';

// Font family constants — loaded via expo-font
export const fonts = {
  // Geometric sans — headings, buttons, labels
  display: 'JosefinSans-Regular',
  displayMedium: 'JosefinSans-Medium',
  displaySemiBold: 'JosefinSans-SemiBold',
  displayBold: 'JosefinSans-Bold',
  displayLight: 'JosefinSans-Light',

  // Elegant serif — body text, quotes, reports
  serif: 'PlayfairDisplay-Regular',
  serifMedium: 'PlayfairDisplay-Medium',
  serifBold: 'PlayfairDisplay-Bold',
  serifItalic: 'PlayfairDisplay-Italic',
} as const;

/**
 * Type scale based on a 1.25 ratio (Major Third)
 * anchored at 16px body text.
 * This gives us a refined, not-too-dramatic scale
 * that feels elegant on mobile.
 */
export const typography = {
  // ─── Display Styles ──────────────────────────────────────────
  // The grand entrance — splash screens, hero moments
  hero: {
    fontFamily: fonts.displayLight,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 8,
    textTransform: 'uppercase',
    color: colors.textGold,
  } as TextStyle,

  // Screen titles — commanding, architectural
  title: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: colors.textPrimary,
  } as TextStyle,

  // Section headers
  heading: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.textGold,
  } as TextStyle,

  // Subsection headers
  subheading: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  } as TextStyle,

  // ─── Body Styles ─────────────────────────────────────────────
  // Primary body text — warm, readable serif
  body: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 0.3,
    color: colors.textPrimary,
  } as TextStyle,

  // Smaller body text
  bodySmall: {
    fontFamily: fonts.serif,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
    color: colors.textSecondary,
  } as TextStyle,

  // ─── UI Styles ───────────────────────────────────────────────
  // Buttons and interactive elements
  button: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.midnight,
  } as TextStyle,

  // Small labels, captions, metadata
  label: {
    fontFamily: fonts.display,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  } as TextStyle,

  // Chat messages — slightly more intimate
  chat: {
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  } as TextStyle,

  // Quotes and pulled text — italic serif
  quote: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.3,
    color: colors.textGold,
  } as TextStyle,

  // Numbers and data
  data: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 1,
    color: colors.gold,
  } as TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;
