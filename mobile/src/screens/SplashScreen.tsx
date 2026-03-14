/**
 * THE BRUNEL ENGINE — Splash Screen
 *
 * The overture. A moment of ceremonial arrival.
 *
 * The sunburst appears first — radiating outward like dawn.
 * Then the title materializes, letter-spaced and golden.
 * Then the tagline fades in beneath.
 * A brief pause to let it breathe.
 * Then the whole composition lifts upward and fades,
 * revealing the home screen beneath.
 *
 * This isn't loading time — it's a threshold.
 * Like stepping through the revolving doors of a grand hotel.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { DecoSunburst, DecoDivider } from '../components/DecoElements';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const sunburstOpacity = useRef(new Animated.Value(0)).current;
  const sunburstScale = useRef(new Animated.Value(0.5)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dividerOpacity = useRef(new Animated.Value(0)).current;
  const dividerScale = useRef(new Animated.Value(0)).current;
  const overallOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Act I: Sunburst emerges
      Animated.parallel([
        Animated.timing(sunburstOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(sunburstScale, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      // Act II: Title materializes
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Act III: Divider draws itself
      Animated.parallel([
        Animated.timing(dividerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(dividerScale, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // Act IV: Tagline appears
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // Pause — let the moment breathe
      Animated.delay(800),

      // Act V: Curtain rises
      Animated.timing(overallOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: overallOpacity }]}>
      {/* Background glow — subtle radial from center */}
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />

      {/* Sunburst */}
      <Animated.View
        style={[
          styles.sunburstContainer,
          {
            opacity: sunburstOpacity,
            transform: [{ scale: sunburstScale }],
          },
        ]}
      >
        <DecoSunburst size={160} rays={16} />
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslateY }],
        }}
      >
        <Text style={styles.titleThe}>THE</Text>
        <Text style={styles.titleBrunel}>BRUNEL</Text>
        <Text style={styles.titleEngine}>ENGINE</Text>
      </Animated.View>

      {/* Divider */}
      <Animated.View
        style={{
          opacity: dividerOpacity,
          transform: [{ scaleX: dividerScale }],
          marginVertical: 24,
        }}
      >
        <DecoDivider width={200} />
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Turn frustrations into insight
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  glowOuter: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(212, 168, 71, 0.03)',
  },
  glowInner: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(212, 168, 71, 0.04)',
  },
  sunburstContainer: {
    marginBottom: 32,
  },
  titleThe: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 18,
    letterSpacing: 12,
    textAlign: 'center',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  titleBrunel: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 48,
    letterSpacing: 14,
    textAlign: 'center',
    color: colors.gold,
    textTransform: 'uppercase',
  },
  titleEngine: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 24,
    letterSpacing: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tagline: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
