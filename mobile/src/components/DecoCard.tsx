/**
 * THE BRUNEL ENGINE — Art Deco Card
 *
 * Elevated surface component with subtle gold border accents
 * and optional header ornamentation. Each card feels like
 * a panel in a lacquered Japanese screen — contained,
 * precious, deliberate.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

interface DecoCardProps {
  children: React.ReactNode;
  title?: string;
  accent?: boolean;
  style?: any;
}

export const DecoCard: React.FC<DecoCardProps> = ({
  children,
  title,
  accent = false,
  style,
}) => (
  <View style={[styles.card, accent && styles.accent, style]}>
    {/* Top border accent — a gold inlay line */}
    {accent && <View style={styles.topAccent} />}

    {title && (
      <View style={styles.header}>
        {/* Left dash */}
        <View style={styles.headerDash} />
        <Text style={[typography.subheading, styles.headerText]}>{title}</Text>
        {/* Right dash */}
        <View style={styles.headerDash} />
      </View>
    )}

    <View style={styles.content}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.charcoal,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.graphite,
    overflow: 'hidden',
  },
  accent: {
    borderColor: 'rgba(212, 168, 71, 0.2)',
  },
  topAccent: {
    height: 2,
    backgroundColor: colors.gold,
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerDash: {
    flex: 1,
    height: 1,
    backgroundColor: colors.graphite,
  },
  headerText: {
    marginHorizontal: spacing.md,
    color: colors.goldMuted,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
});
