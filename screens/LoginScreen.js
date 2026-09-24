// screens/LoginScreen.js
// Simple login form with email/password + "Continue as Guest"
// No real authentication — any non-empty email/password leads to Home

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Shake animation ref for invalid login attempt
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Simple client-side validation: both fields must be non-empty
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Trigger a left-right shake animation when validation fails
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    if (!validate()) {
      triggerShake();
      return;
    }
    // Navigate to Home — replace so Login isn't in the back-stack
    navigation.replace('Home', { userEmail: email });
  };

  const handleGuest = () => {
    // Guest users skip auth entirely
    navigation.replace('Home', { userEmail: 'Guest' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header area */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍔 QuickBite</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Order your favourite campus meals</Text>
        </View>

        {/* Form card with shake animation on error */}
        <Animated.View
          style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
        >
          {/* Email field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="you@university.edu"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Password field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Login button */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Sign In →</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest button */}
          <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} activeOpacity={0.7}>
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: height * 0.1,
    paddingBottom: SPACING.xxl + 20,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logo: {
    fontSize: FONTS.size.xl,
    color: COLORS.white,
    fontWeight: '800',
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  title: {
    fontSize: FONTS.size.xxl + 2,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.size.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xxl,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  fieldGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.size.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.size.xs,
    marginTop: SPACING.xs,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textLight,
    fontSize: FONTS.size.sm,
  },
  guestBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 4,
    alignItems: 'center',
  },
  guestBtnText: {
    color: COLORS.primary,
    fontSize: FONTS.size.md,
    fontWeight: '600',
  },
});
