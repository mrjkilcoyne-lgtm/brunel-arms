/**
 * THE BRUNEL ENGINE — Art Deco Color System
 *
 * Inspired by the Chrysler Building lobby, the Orient Express,
 * and the golden age of transatlantic liners.
 *
 * The palette balances deep midnight tones with burnished metallics,
 * creating a sense of intellectual luxury — like thinking inside
 * a beautifully appointed private library.
 */

export const colors = {
  // ─── Foundation ──────────────────────────────────────────────
  // The deep, dark backdrop — like polished obsidian
  midnight: '#0A0E1A',
  // Slightly lighter for cards and surfaces
  charcoal: '#131829',
  // Elevated surfaces — panels, modals
  slate: '#1C2237',
  // Subtle borders and dividers
  graphite: '#2A3150',

  // ─── Metallics ───────────────────────────────────────────────
  // Primary gold — the hero accent. Warm, confident, unmistakable.
  gold: '#D4A847',
  // Lighter gold for highlights and active states
  goldLight: '#E8C76A',
  // Deeper gold for pressed states and shadows
  goldDark: '#B8922E',
  // Muted gold for secondary elements
  goldMuted: '#8B7535',
  // Very subtle gold wash for backgrounds
  goldGhost: 'rgba(212, 168, 71, 0.08)',

  // Platinum/silver for secondary metallic accents
  silver: '#C0C5D4',
  silverMuted: '#8891A8',

  // Bronze for tertiary accents
  bronze: '#CD7F32',
  bronzeLight: '#D4944A',

  // ─── Jewel Tones ─────────────────────────────────────────────
  // Used sparingly for status, categories, and visual variety
  emerald: '#2D8B57',
  emeraldLight: '#3DA86D',
  ruby: '#C23B3B',
  rubyLight: '#D45555',
  sapphire: '#2B5EA7',
  sapphireLight: '#4178C4',
  amethyst: '#7B4FA2',
  amethystLight: '#9468B8',

  // ─── Typography & Content ────────────────────────────────────
  // Primary text — warm white, never harsh
  textPrimary: '#F0EDE5',
  // Secondary text — the silver of engraved invitations
  textSecondary: '#A8AEBB',
  // Muted text — subtle, like pencil notes in margins
  textMuted: '#6B7280',
  // Gold text for headings and emphasis
  textGold: '#D4A847',

  // ─── Functional ──────────────────────────────────────────────
  success: '#2D8B57',
  warning: '#D4A847',
  error: '#C23B3B',
  info: '#2B5EA7',

  // ─── Gradients (defined as arrays for LinearGradient) ────────
  // The signature gradient — midnight to deep space
  gradientDark: ['#0A0E1A', '#131829', '#1C2237'] as const,
  // Gold shimmer — for accent bars and highlights
  gradientGold: ['#B8922E', '#D4A847', '#E8C76A'] as const,
  // Subtle surface gradient
  gradientSurface: ['#131829', '#1C2237'] as const,
  // Hero gradient — for the splash and key moments
  gradientHero: ['#0A0E1A', '#131829', '#0A0E1A'] as const,
} as const;

export type ColorKey = keyof typeof colors;
