/**
 * THE BRUNEL ENGINE — Home Screen
 *
 * The grand lobby. A place of arrival and intention-setting.
 *
 * Art Deco lobbies were designed to make you feel important
 * the moment you walked in. This screen does the same:
 * it greets you with visual grandeur, then offers a single,
 * clear invitation to begin.
 *
 * The design communicates: "This is a serious instrument.
 * You are about to think clearly about something that matters."
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';
import {
  DecoSunburst,
  DecoDivider,
  DecoChevronBar,
  DecoFan,
} from '../components/DecoElements';
import { DecoButton } from '../components/DecoButton';
import { DecoCard } from '../components/DecoCard';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onStartInterview: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartInterview }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ──────────────────────────────────────────── */}
        <View style={styles.header}>
          <DecoChevronBar width={width - 80} />

          <View style={styles.titleBlock}>
            <Text style={styles.titleThe}>THE</Text>
            <Text style={styles.titleBrunel}>BRUNEL</Text>
            <Text style={styles.titleEngine}>ENGINE</Text>
          </View>

          <DecoDivider width={width - 100} />
        </View>

        {/* ─── Hero Statement ──────────────────────────────────── */}
        <View style={styles.heroSection}>
          <DecoSunburst size={100} rays={12} />
          <Text style={styles.heroText}>
            Every problem contains{'\n'}the seed of its solution.
          </Text>
          <Text style={styles.heroSub}>
            A structured conversation to unlock{'\n'}
            your clearest thinking.
          </Text>
        </View>

        {/* ─── How It Works ────────────────────────────────────── */}
        <DecoCard title="The Process" accent>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>I</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>DISCOVERY</Text>
              <Text style={styles.stepDesc}>
                We explore what's really happening — beneath the surface frustration
                to the root cause.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.step}>
            <Text style={styles.stepNumber}>II</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>EXPLORATION</Text>
              <Text style={styles.stepDesc}>
                We challenge assumptions, apply first-principles thinking,
                and search for the angle nobody's tried.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.step}>
            <Text style={styles.stepNumber}>III</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>INSIGHT</Text>
              <Text style={styles.stepDesc}>
                Your private report — with pathways, provocations,
                and the first step you can take today.
              </Text>
            </View>
          </View>
        </DecoCard>

        {/* ─── Philosophy Card ─────────────────────────────────── */}
        <DecoCard style={styles.philosophyCard}>
          <DecoFan size={60} />
          <Text style={styles.philosophyText}>
            "The best way to have a good idea is to have a lot of ideas
            — then throw away the bad ones."
          </Text>
          <Text style={styles.philosophyAttrib}>— Linus Pauling</Text>
        </DecoCard>

        {/* ─── Begin Button ────────────────────────────────────── */}
        <View style={styles.ctaSection}>
          <DecoButton
            title="Begin Session"
            onPress={onStartInterview}
            variant="primary"
            style={styles.ctaButton}
          />
          <Text style={styles.ctaNote}>
            Takes 5–10 minutes. Completely private.
          </Text>
        </View>

        {/* ─── Footer ──────────────────────────────────────────── */}
        <View style={styles.footer}>
          <DecoDivider width={200} color={colors.graphite} />
          <Text style={styles.footerText}>
            Named for Isambard Kingdom Brunel{'\n'}
            Engineer of impossible things
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.screen,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  titleBlock: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  titleThe: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 14,
    letterSpacing: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  titleBrunel: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 36,
    letterSpacing: 12,
    color: colors.gold,
    textTransform: 'uppercase',
    marginVertical: 4,
  },
  titleEngine: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 16,
    letterSpacing: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  heroText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 22,
    lineHeight: 32,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  heroSub: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 1,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  // Steps
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.sm,
  },
  stepNumber: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: colors.gold,
    width: 40,
    marginRight: spacing.md,
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 14,
    letterSpacing: 3,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  stepDesc: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  stepDivider: {
    height: 1,
    backgroundColor: colors.graphite,
    marginVertical: spacing.md,
    opacity: 0.5,
  },

  // Philosophy
  philosophyCard: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  philosophyText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  philosophyAttrib: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  ctaButton: {
    minWidth: 220,
  },
  ctaNote: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: spacing.md,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: spacing.section,
  },
  footerText: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
