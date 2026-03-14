/**
 * THE BRUNEL ENGINE — Art Deco Text Input
 *
 * An input field that feels like writing on hotel stationery
 * at the Ritz. Gold underline, elegant serif placeholder,
 * and a subtle glow when focused.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface DecoTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
}

export const DecoTextInput: React.FC<DecoTextInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Speak your mind...',
  multiline = true,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Gold accent line on focus */}
      <View style={[styles.topLine, focused && styles.topLineFocused]} />

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          maxLength={2000}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          textAlignVertical="top"
        />

        {/* Send button — a gold arrow, like a compass needle */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={disabled || !value.trim()}
          style={[
            styles.sendButton,
            value.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M2 21L23 12L2 3L2 10L17 12L2 14L2 21Z"
              fill={value.trim() ? colors.midnight : colors.textMuted}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Bottom decorative border */}
      <View style={[styles.bottomLine, focused && styles.bottomLineFocused]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.slate,
    borderRadius: 4,
    overflow: 'hidden',
  },
  topLine: {
    height: 1,
    backgroundColor: colors.graphite,
  },
  topLineFocused: {
    height: 2,
    backgroundColor: colors.gold,
    opacity: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    maxHeight: 120,
    paddingVertical: spacing.sm,
  },
  inputFocused: {
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: colors.gold,
  },
  sendButtonInactive: {
    backgroundColor: colors.graphite,
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.graphite,
  },
  bottomLineFocused: {
    height: 2,
    backgroundColor: colors.gold,
    opacity: 0.4,
  },
});
