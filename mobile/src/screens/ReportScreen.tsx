/**
 * THE BRUNEL ENGINE — Report Screen
 *
 * The treasure map. The payoff. The reason for the journey.
 *
 * This screen unfolds like a beautifully bound private dossier.
 * Each section is a discrete panel — a page in a folio —
 * with its own visual weight and character.
 *
 * The Art Deco aesthetic isn't decorative here; it's structural.
 * The geometric precision communicates: this analysis is rigorous.
 * The gold accents communicate: but it was made with care.
 *
 * Reading this report should feel like opening a letter from
 * a brilliant friend who spent the evening thinking about
 * your problem and came up with things you never considered.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography, fonts } from '../theme/typography';
import { spacing, layout, radius } from '../theme/spacing';
import {
  DecoDivider,
  DecoSunburst,
  DecoChevronBar,
  DecoFan,
  DecoFrame,
} from '../components/DecoElements';
import { DecoCard } from '../components/DecoCard';
import { DecoButton } from '../components/DecoButton';
import { generateAnalysis, Message, AnalysisReport } from '../services/api';

interface ReportScreenProps {
  transcript: Message[];
  onNewSession: () => void;
  onBack: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  transcript,
  onNewSession,
  onBack,
}) => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateAnalysis(transcript);
      setReport(data);
    } catch (e: any) {
      setError(e.message || 'Failed to generate report');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <DecoSunburst size={80} rays={12} />
          <Text style={styles.loadingTitle}>GENERATING REPORT</Text>
          <DecoDivider width={200} />
          <Text style={styles.loadingSubtitle}>
            Analyzing your conversation...{'\n'}
            Searching for patterns and pathways...
          </Text>
          <ActivityIndicator size="large" color={colors.gold} style={{ marginTop: 32 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
          <DecoButton title="Try Again" onPress={loadReport} style={{ marginTop: 24 }} />
          <DecoButton title="Go Back" onPress={onBack} variant="ghost" style={{ marginTop: 12 }} />
        </View>
      </SafeAreaView>
    );
  }

  // Effort/impact badge colors
  const effortColor = (effort: string) => {
    if (effort === 'low') return colors.emerald;
    if (effort === 'high') return colors.ruby;
    return colors.gold;
  };

  const commitmentLabel = (c: string) => {
    if (c === 'ready_to_act') return 'READY TO ACT';
    if (c === 'considering') return 'CONSIDERING';
    return 'EXPLORING';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Report Header ───────────────────────────────── */}
        <View style={styles.reportHeader}>
          <DecoChevronBar width={280} />

          <Text style={styles.reportTitle}>YOUR REPORT</Text>

          <DecoDivider width={240} />
        </View>

        {/* ─── The One Line ────────────────────────────────── */}
        <DecoFrame style={styles.oneLineFrame}>
          <Text style={styles.oneLine}>{report.one_line}</Text>
        </DecoFrame>

        {/* ─── Reframe ─────────────────────────────────────── */}
        <View style={styles.reframeSection}>
          <DecoFan size={50} />
          <Text style={styles.reframeText}>{report.reframe}</Text>
        </View>

        {/* ─── Summary & Core Issue ────────────────────────── */}
        <DecoCard title="The Situation" accent>
          <Text style={styles.bodyText}>{report.summary}</Text>
          <View style={styles.coreIssueBox}>
            <Text style={styles.coreIssueLabel}>ROOT CAUSE</Text>
            <Text style={styles.coreIssueText}>{report.core_issue}</Text>
          </View>

          {/* Metrics bar */}
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{report.severity}</Text>
              <Text style={styles.metricLabel}>SEVERITY</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{commitmentLabel(report.commitment)}</Text>
              <Text style={styles.metricLabel}>READINESS</Text>
            </View>
          </View>
        </DecoCard>

        {/* ─── Blind Spots ─────────────────────────────────── */}
        {report.blind_spots && report.blind_spots.length > 0 && (
          <DecoCard title="Blind Spots" accent>
            {report.blind_spots.map((spot, i) => (
              <View key={i} style={styles.blindSpotItem}>
                <View style={styles.blindSpotDot} />
                <Text style={styles.bodyText}>{spot}</Text>
              </View>
            ))}
          </DecoCard>
        )}

        {/* ─── Pathways ────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.heading, styles.sectionTitle]}>PATHWAYS</Text>
          <DecoDivider width={200} />
        </View>

        {report.pathways.map((pathway, index) => (
          <DecoCard key={index} accent style={styles.pathwayCard}>
            <View style={styles.pathwayHeader}>
              <Text style={styles.pathwayName}>{pathway.name}</Text>
              <View style={styles.pathwayBadges}>
                <View style={[styles.badge, { borderColor: effortColor(pathway.effort) }]}>
                  <Text style={[styles.badgeText, { color: effortColor(pathway.effort) }]}>
                    {pathway.effort.toUpperCase()} EFFORT
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.bodyText}>{pathway.description}</Text>

            {pathway.mental_model && (
              <View style={styles.mentalModelBox}>
                <Text style={styles.mentalModelLabel}>MENTAL MODEL</Text>
                <Text style={styles.mentalModelText}>{pathway.mental_model}</Text>
              </View>
            )}

            <View style={styles.firstStepBox}>
              <Text style={styles.firstStepLabel}>FIRST STEP</Text>
              <Text style={styles.firstStepText}>{pathway.first_step}</Text>
            </View>

            <View style={styles.pathwayMeta}>
              <Text style={styles.metaText}>{pathway.timeframe}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{pathway.impact} impact</Text>
            </View>
          </DecoCard>
        ))}

        {/* ─── Creative Angles ─────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.heading, styles.sectionTitle]}>CREATIVE ANGLES</Text>
          <DecoDivider width={200} />
        </View>

        {report.creative_angles.map((angle, index) => (
          <DecoCard key={index} style={styles.creativeCard}>
            <Text style={styles.creativeIdea}>{angle.idea}</Text>
            <Text style={styles.creativeWhy}>{angle.why}</Text>
            {angle.analogy && (
              <View style={styles.analogyBox}>
                <Text style={styles.analogyLabel}>ANALOGY</Text>
                <Text style={styles.analogyText}>{angle.analogy}</Text>
              </View>
            )}
          </DecoCard>
        ))}

        {/* ─── Provocations ────────────────────────────────── */}
        {report.provocations && report.provocations.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[typography.heading, styles.sectionTitle]}>PROVOCATIONS</Text>
              <DecoDivider width={200} />
            </View>
            <DecoFrame style={styles.provocationsFrame}>
              {report.provocations.map((prov, i) => (
                <Text key={i} style={styles.provocText}>{prov}</Text>
              ))}
            </DecoFrame>
          </>
        )}

        {/* ─── What If ─────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.heading, styles.sectionTitle]}>WHAT IF</Text>
          <DecoDivider width={200} />
        </View>

        <DecoFrame style={styles.whatIfFrame}>
          {report.what_if.map((q, index) => (
            <View key={index} style={styles.whatIfItem}>
              <Text style={styles.whatIfQ}>{q}</Text>
              {index < report.what_if.length - 1 && (
                <View style={styles.whatIfDivider} />
              )}
            </View>
          ))}
        </DecoFrame>

        {/* ─── Existing Landscape ──────────────────────────── */}
        {report.existing_landscape && report.existing_landscape.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[typography.heading, styles.sectionTitle]}>LANDSCAPE</Text>
              <DecoDivider width={200} />
            </View>

            {report.existing_landscape.map((item, index) => (
              <DecoCard key={index} style={styles.landscapeCard}>
                <TouchableOpacity
                  onPress={() => item.url && Linking.openURL(item.url)}
                  disabled={!item.url}
                >
                  <Text style={styles.landscapeName}>{item.name}</Text>
                </TouchableOpacity>
                <Text style={styles.bodyText}>{item.what_they_do}</Text>
                <Text style={styles.landscapeGap}>Gap: {item.gap}</Text>
              </DecoCard>
            ))}
          </>
        )}

        {/* ─── Next Actions ────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.heading, styles.sectionTitle]}>NEXT ACTIONS</Text>
          <DecoDivider width={200} />
        </View>

        <DecoCard accent>
          {report.next_actions.map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <View style={styles.actionNumber}>
                <Text style={styles.actionNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.bodyText, styles.actionText]}>{action}</Text>
            </View>
          ))}
        </DecoCard>

        {/* ─── Commitment Device ───────────────────────────── */}
        {report.commitment_device && (
          <DecoFrame style={styles.commitmentFrame}>
            <Text style={styles.commitmentLabel}>YOUR COMMITMENT</Text>
            <Text style={styles.commitmentText}>{report.commitment_device}</Text>
          </DecoFrame>
        )}

        {/* ─── Tools ───────────────────────────────────────── */}
        {report.tools && report.tools.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[typography.heading, styles.sectionTitle]}>TOOLS</Text>
              <DecoDivider width={200} />
            </View>

            {report.tools.map((tool, index) => (
              <DecoCard key={index} style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <TouchableOpacity
                    onPress={() => tool.url && Linking.openURL(tool.url)}
                    disabled={!tool.url}
                  >
                    <Text style={styles.toolName}>{tool.name}</Text>
                  </TouchableOpacity>
                  <Text style={styles.toolCost}>{tool.cost}</Text>
                </View>
                <Text style={styles.bodySmall}>{tool.description}</Text>
                <Text style={styles.toolCategory}>{tool.category}</Text>
              </DecoCard>
            ))}
          </>
        )}

        {/* ─── Pattern ─────────────────────────────────────── */}
        {report.pattern && (
          <View style={styles.patternSection}>
            <Text style={styles.patternLabel}>PATTERN RECOGNITION</Text>
            <Text style={styles.patternText}>{report.pattern}</Text>
          </View>
        )}

        {/* ─── Parting Shot ────────────────────────────────── */}
        {report.parting_shot && (
          <View style={styles.partingShotSection}>
            <DecoDivider width={200} />
            <Text style={styles.partingShot}>{report.parting_shot}</Text>
          </View>
        )}

        {/* ─── Footer ──────────────────────────────────────── */}
        <View style={styles.footer}>
          <DecoDivider width={200} color={colors.graphite} />
          <DecoButton
            title="New Session"
            onPress={onNewSession}
            variant="secondary"
            style={styles.newSessionButton}
          />
          <Text style={styles.footerText}>
            This report is private. No data is stored.
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

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 14,
    letterSpacing: 4,
    color: colors.gold,
    textTransform: 'uppercase',
    marginTop: 32,
    marginBottom: 16,
  },
  loadingSubtitle: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
  errorText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    color: colors.ruby,
    textAlign: 'center',
  },

  // Report Header
  reportHeader: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  reportTitle: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 24,
    letterSpacing: 8,
    color: colors.gold,
    textTransform: 'uppercase',
    marginVertical: spacing.lg,
  },

  // One Line
  oneLineFrame: {
    marginBottom: spacing.xl,
  },
  oneLine: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    lineHeight: 30,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Reframe
  reframeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  reframeText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 17,
    lineHeight: 26,
    color: colors.gold,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },

  // Body text (reused)
  bodyText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  bodySmall: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  // Core Issue
  coreIssueBox: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.graphite,
  },
  coreIssueLabel: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 11,
    letterSpacing: 3,
    color: colors.goldMuted,
    marginBottom: 8,
  },
  coreIssueText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
  },

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.graphite,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 16,
    color: colors.gold,
    letterSpacing: 1,
  },
  metricLabel: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textMuted,
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.graphite,
  },

  // Blind Spots
  blindSpotItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  blindSpotDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ruby,
    marginTop: 9,
    marginRight: 12,
  },

  // Section Headers
  sectionHeader: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },

  // Pathways
  pathwayCard: {
    marginBottom: spacing.md,
  },
  pathwayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  pathwayName: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 16,
    letterSpacing: 2,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    flex: 1,
  },
  pathwayBadges: {
    flexDirection: 'row',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 9,
    letterSpacing: 1,
  },
  mentalModelBox: {
    backgroundColor: colors.goldGhost,
    borderRadius: radius.xs,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.goldMuted,
  },
  mentalModelLabel: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.goldMuted,
    marginBottom: 6,
  },
  mentalModelText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  firstStepBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.graphite,
  },
  firstStepLabel: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.emerald,
    marginBottom: 6,
  },
  firstStepText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  pathwayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  metaText: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  metaDot: {
    color: colors.textMuted,
    marginHorizontal: 8,
  },

  // Creative Angles
  creativeCard: {
    marginBottom: spacing.md,
  },
  creativeIdea: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  creativeWhy: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  analogyBox: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.graphite,
  },
  analogyLabel: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.amethyst,
    marginBottom: 4,
  },
  analogyText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  // Provocations
  provocationsFrame: {
    marginBottom: spacing.lg,
  },
  provocText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  // What If
  whatIfFrame: {
    marginBottom: spacing.lg,
  },
  whatIfItem: {
    marginBottom: spacing.sm,
  },
  whatIfQ: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  whatIfDivider: {
    height: 1,
    backgroundColor: colors.graphite,
    opacity: 0.3,
    marginTop: spacing.md,
    marginHorizontal: spacing.xxl,
  },

  // Landscape
  landscapeCard: {
    marginBottom: spacing.sm,
  },
  landscapeName: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.sapphireLight,
    marginBottom: 6,
  },
  landscapeGap: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
    marginTop: 6,
  },

  // Next Actions
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 0,
  },
  actionNumberText: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 12,
    color: colors.gold,
  },
  actionText: {
    flex: 1,
  },

  // Commitment
  commitmentFrame: {
    marginTop: spacing.xl,
  },
  commitmentLabel: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 11,
    letterSpacing: 3,
    color: colors.goldMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  commitmentText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Tools
  toolCard: {
    marginBottom: spacing.sm,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  toolName: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 13,
    letterSpacing: 1,
    color: colors.sapphireLight,
  },
  toolCost: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  toolCategory: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 6,
  },

  // Pattern
  patternSection: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.graphite,
    borderRadius: radius.sm,
  },
  patternLabel: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 11,
    letterSpacing: 3,
    color: colors.amethyst,
    marginBottom: 8,
  },
  patternText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  // Parting Shot
  partingShotSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  partingShot: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    lineHeight: 26,
    color: colors.gold,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: spacing.section,
  },
  newSessionButton: {
    marginTop: spacing.xl,
    minWidth: 180,
  },
  footerText: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
