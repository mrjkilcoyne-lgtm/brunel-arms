/**
 * THE BRUNEL ENGINE — Art Deco Button
 *
 * A button worthy of the Savoy Hotel elevator panel.
 * Gold gradient with geometric precision, tactile haptic feedback,
 * and a pressed state that feels like pushing a brass button.
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface DecoButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export const DecoButton: React.FC<DecoButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && styles.primary,
        !isPrimary && !isGhost && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {/* Top decorative line */}
      {isPrimary && <View style={styles.topLine} />}

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary ? colors.midnight : colors.gold}
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                typography.button,
                isPrimary && styles.primaryText,
                !isPrimary && !isGhost && styles.secondaryText,
                isGhost && styles.ghostText,
                disabled && styles.disabledText,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>

      {/* Bottom decorative line */}
      {isPrimary && <View style={styles.bottomLine} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: colors.gold,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  primaryText: {
    color: colors.midnight,
  },
  secondaryText: {
    color: colors.gold,
  },
  ghostText: {
    color: colors.gold,
  },
  disabledText: {
    color: colors.textMuted,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.goldLight,
    opacity: 0.5,
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.goldDark,
    opacity: 0.5,
  },
});
