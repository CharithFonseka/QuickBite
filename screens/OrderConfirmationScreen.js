// screens/OrderConfirmationScreen.js
// Shown immediately after placing an order — displays the order ID,
// pickup time, and a celebratory confirmation before tracking begins.
// The user either taps "Track Order" or it auto-navigates after 3s.

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

export default function OrderConfirmationScreen({ route, navigation }) {
  const { orderId, pickupTime } = route.params;

  // Scale-in + fade animation for the success checkmark
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Play entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate to OrderTracking after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('OrderTracking', { orderId, pickupTime });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated success circle */}
      <Animated.View
        style={[
          styles.successCircle,
          { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
        ]}
      >
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your food is being prepared fresh just for you 🍽️
        </Text>

        {/* Order details card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup Time</Text>
            <Text style={styles.detailValue}>{pickupTime}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup Point</Text>
            <Text style={styles.detailValue}>Counter 3, Block A</Text>
          </View>
        </View>

        <Text style={styles.autoHint}>Redirecting to tracking in 3s…</Text>

        {/* Manual CTA */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.replace('OrderTracking', { orderId, pickupTime })}
          activeOpacity={0.85}
        >
          <Text style={styles.trackBtnText}>Track My Order →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Text style={styles.menuBtnText}>Back to Menu</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  checkmark: {
    fontSize: 52,
    color: COLORS.white,
    fontWeight: '900',
  },
  title: {
    fontSize: FONTS.size.xxxl,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: width * 0.75,
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: FONTS.size.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  autoHint: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  trackBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl + 8,
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  trackBtnText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontWeight: '800',
  },
  menuBtn: {
    paddingVertical: SPACING.sm,
  },
  menuBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.size.md,
    fontWeight: '600',
  },
});
