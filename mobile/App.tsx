/**
 * THE BRUNEL ENGINE — Main Application
 *
 * Orchestrates the three-act structure:
 * 1. Splash — The overture
 * 2. Home — The grand lobby
 * 3. Interview — The private consultation
 * 4. Report — The treasure map
 *
 * Loads Art Deco typefaces and manages screen transitions
 * with the ceremony they deserve.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreenNative from 'expo-splash-screen';
import { colors } from './src/theme/colors';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InterviewScreen } from './src/screens/InterviewScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { Message } from './src/services/api';

// Prevent the native splash screen from auto-hiding
SplashScreenNative.preventAutoHideAsync();

type Screen = 'splash' | 'home' | 'interview' | 'report';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [transcript, setTranscript] = useState<Message[]>([]);

  // Load Art Deco typefaces
  const [fontsLoaded] = useFonts({
    // Josefin Sans — geometric display face
    'JosefinSans-Light': require('./assets/fonts/JosefinSans-Light.ttf'),
    'JosefinSans-Regular': require('./assets/fonts/JosefinSans-Regular.ttf'),
    'JosefinSans-Medium': require('./assets/fonts/JosefinSans-Medium.ttf'),
    'JosefinSans-SemiBold': require('./assets/fonts/JosefinSans-SemiBold.ttf'),
    'JosefinSans-Bold': require('./assets/fonts/JosefinSans-Bold.ttf'),

    // Playfair Display — elegant serif
    'PlayfairDisplay-Regular': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Medium': require('./assets/fonts/PlayfairDisplay-Medium.ttf'),
    'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-Italic': require('./assets/fonts/PlayfairDisplay-Italic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSplashComplete = () => {
    setCurrentScreen('home');
  };

  const handleStartInterview = () => {
    setTranscript([]);
    setCurrentScreen('interview');
  };

  const handleInterviewComplete = (interviewTranscript: Message[]) => {
    setTranscript(interviewTranscript);
    setCurrentScreen('report');
  };

  const handleNewSession = () => {
    setTranscript([]);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnight} />

      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen onStartInterview={handleStartInterview} />
      )}

      {currentScreen === 'interview' && (
        <InterviewScreen
          onComplete={handleInterviewComplete}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'report' && (
        <ReportScreen
          transcript={transcript}
          onNewSession={handleNewSession}
          onBack={handleBackToHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
});
