// screens/SplashScreen.js
// Shows the QuickBite logo/branding for 1.5 seconds, then navigates to Login

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // Animated values for the fade-in and scale-up entrance effect
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Play entrance animation then navigate after 1.5s total
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // After 1.5s, replace the splash with Login (no back-navigation to splash)
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    // Clean up timer if component unmounts early
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* App icon / emoji logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🍔</Text>
        </View>

        <Text style={styles.appName}>QuickBite</Text>
        <Text style={styles.tagline}>Campus Food, Delivered Fast</Text>
      </Animated.View>

      {/* Bottom wave decoration */}
      <View style={styles.wave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logoEmoji: {
    fontSize: 52,
  },
  appName: {
    fontSize: FONTS.size.xxxl + 6,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: FONTS.size.md,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
  },
  wave: {
    position: 'absolute',
    bottom: -80,
    width: width * 1.4,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'center',
  },
});
