/**
 * THE BRUNEL ENGINE — Interview Screen
 *
 * The private consultation room. Where the real work happens.
 *
 * Design philosophy: The conversation should feel like sitting
 * in a leather armchair in a wood-paneled office, speaking with
 * someone who is genuinely brilliant and genuinely listening.
 *
 * The UI recedes. The words take center stage.
 * Gold accents mark the interviewer's voice.
 * Your own words appear in clean, warm white.
 *
 * A subtle phase indicator at the top shows progress
 * without creating pressure — like the hands of a
 * beautiful clock you glance at, not stare at.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography, fonts } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';
import { DecoDivider } from '../components/DecoElements';
import { DecoTextInput } from '../components/DecoTextInput';
import { DecoButton } from '../components/DecoButton';
import { sendMessage, Message } from '../services/api';

interface InterviewScreenProps {
  onComplete: (transcript: Message[]) => void;
  onBack: () => void;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Start the conversation
  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const initialMessages: Message[] = [
        { role: 'user', content: 'I\'d like to work through a problem I\'m facing.' },
      ];
      const response = await sendMessage(initialMessages);
      setMessages([{ role: 'assistant', content: response }]);
    } catch (error) {
      setMessages([{
        role: 'assistant',
        content: 'I seem to be having trouble connecting. Please check that the server is running and try again.',
      }]);
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputText.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setMessageCount(prev => prev + 1);
    setIsLoading(true);

    try {
      const response = await sendMessage(updatedMessages);

      if (response.includes('[INTERVIEW_COMPLETE]')) {
        setInterviewComplete(true);
        const cleanResponse = response.replace('[INTERVIEW_COMPLETE]', '').trim();
        if (cleanResponse) {
          setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection interrupted. Your conversation is preserved — try sending again.',
      }]);
    }

    setIsLoading(false);
  };

  const handleGenerateReport = () => {
    onComplete(messages);
  };

  // Determine interview phase for subtle progress indication
  const getPhase = (): string => {
    if (messageCount <= 3) return 'DISCOVERY';
    if (messageCount <= 6) return 'EXPLORATION';
    return 'SYNTHESIS';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ─── Header ──────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>{'‹'}</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>SESSION</Text>
            <Text style={styles.headerPhase}>{getPhase()}</Text>
          </View>

          {/* Phase indicator — three dots showing progress */}
          <View style={styles.phaseIndicator}>
            <View style={[styles.phaseDot, styles.phaseDotActive]} />
            <View style={[styles.phaseDot, messageCount > 3 && styles.phaseDotActive]} />
            <View style={[styles.phaseDot, messageCount > 6 && styles.phaseDotActive]} />
          </View>
        </View>

        <View style={styles.headerDivider} />

        {/* ─── Messages ────────────────────────────────────── */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageScroll}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.assistantAccent} />
              )}
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDots}>
                <Text style={styles.loadingText}>Listening</Text>
                <ActivityIndicator size="small" color={colors.gold} style={{ marginLeft: 8 }} />
              </View>
            </View>
          )}

          {interviewComplete && (
            <View style={styles.completeSection}>
              <DecoDivider width={200} />
              <Text style={styles.completeText}>
                Interview complete. Ready to generate your insight report.
              </Text>
              <DecoButton
                title="Generate Report"
                onPress={handleGenerateReport}
                variant="primary"
                style={styles.generateButton}
              />
            </View>
          )}
        </ScrollView>

        {/* ─── Input ───────────────────────────────────────── */}
        {!interviewComplete && (
          <View style={styles.inputContainer}>
            <DecoTextInput
              value={inputText}
              onChangeText={setInputText}
              onSubmit={handleSend}
              placeholder="Share what's on your mind..."
              disabled={isLoading}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 32,
    color: colors.gold,
    marginTop: -4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'JosefinSans-SemiBold',
    fontSize: 12,
    letterSpacing: 4,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  headerPhase: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 10,
    letterSpacing: 3,
    color: colors.goldMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  phaseIndicator: {
    flexDirection: 'row',
    gap: 6,
    width: 40,
    justifyContent: 'flex-end',
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.graphite,
  },
  phaseDotActive: {
    backgroundColor: colors.gold,
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.graphite,
    opacity: 0.5,
  },

  // Messages
  messageScroll: {
    flex: 1,
  },
  messageContent: {
    padding: layout.screenPadding,
    paddingBottom: spacing.xxl,
  },
  messageBubble: {
    marginBottom: spacing.lg,
    maxWidth: '90%',
    position: 'relative',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.slate,
    borderRadius: 12,
    borderBottomRightRadius: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
  assistantAccent: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 2,
    backgroundColor: colors.gold,
    opacity: 0.5,
    borderRadius: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 26,
  },
  userText: {
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.textPrimary,
  },
  assistantText: {
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },

  // Loading
  loadingContainer: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
  },
  loadingText: {
    fontFamily: 'JosefinSans-Light',
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },

  // Complete
  completeSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.xl,
  },
  completeText: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.lg,
    lineHeight: 24,
  },
  generateButton: {
    minWidth: 200,
  },

  // Input
  inputContainer: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
});
