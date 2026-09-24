// screens/OrderTrackingScreen.js
// Simulates order status progressing through:
//   Placed → Preparing → Ready for Pickup
//
// Uses setInterval to auto-advance every 4 seconds (demo mode)
// Also provides a manual "Next Status" button for presentations

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

// ─── Status Definitions ────────────────────────────────────────────────────────
// Each step has an emoji, label, and description shown to the user
const ORDER_STATUSES = [
  {
    id: 'placed',
    label: 'Order Placed',
    emoji: '✅',
    description: 'Your order has been received by the canteen.',
  },
  {
    id: 'preparing',
    label: 'Preparing',
    emoji: '👨‍🍳',
    description: 'The kitchen is cooking your order fresh!',
  },
  {
    id: 'ready',
    label: 'Ready for Pickup',
    emoji: '🎉',
    description: 'Your order is ready! Head to Counter 3.',
  },
];

// How many seconds between automatic status advances (for demo)
const AUTO_ADVANCE_INTERVAL_MS = 4000;

export default function OrderTrackingScreen({ route, navigation }) {
  const { orderId, pickupTime } = route.params;

  // currentStep is an index into ORDER_STATUSES (0, 1, 2)
  const [currentStep, setCurrentStep] = useState(0);

  // Pulse animation for the active status indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ─── Pulse Animation Loop ──────────────────────────────────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // ─── Auto-Advance Logic ────────────────────────────────────────────────────
  // Sets up an interval that increments the step every AUTO_ADVANCE_INTERVAL_MS
  // Clears itself once we reach the last status (no infinite loop)
  useEffect(() => {
    if (currentStep >= ORDER_STATUSES.length - 1) return; // Already at last step

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ORDER_STATUSES.length - 1) return prev + 1;
        return prev;
      });
    }, AUTO_ADVANCE_INTERVAL_MS);

    // Clear the interval when the component unmounts or step changes
    return () => clearInterval(interval);
  }, [currentStep]);

  const activeStatus = ORDER_STATUSES[currentStep];
  const isComplete = currentStep === ORDER_STATUSES.length - 1;

  const advanceManually = () => {
    if (currentStep < ORDER_STATUSES.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Order ID Banner ─── */}
      <View style={styles.orderBanner}>
        <Text style={styles.orderLabel}>Order ID</Text>
        <Text style={styles.orderId}>{orderId}</Text>
        <Text style={styles.pickupTime}>Estimated pickup: {pickupTime}</Text>
      </View>

      {/* ─── Current Status (animated) ─── */}
      <Animated.View style={[styles.statusCard, { transform: [{ scale: isComplete ? 1 : pulseAnim }] }]}>
        <Text style={styles.statusEmoji}>{activeStatus.emoji}</Text>
        <Text style={styles.statusLabel}>{activeStatus.label}</Text>
        <Text style={styles.statusDesc}>{activeStatus.description}</Text>
      </Animated.View>

      {/* ─── Progress Steps ─── */}
      <View style={styles.stepsContainer}>
        {ORDER_STATUSES.map((status, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <View key={status.id} style={styles.stepRow}>
              {/* Step indicator dot */}
              <View style={styles.stepLeft}>
                <View
                  style={[
                    styles.stepDot,
                    isDone && styles.stepDotDone,
                    isActive && styles.stepDotActive,
                  ]}
                >
                  <Text style={styles.stepDotText}>
                    {isDone ? '✓' : index + 1}
                  </Text>
                </View>
                {/* Connector line between dots */}
                {index < ORDER_STATUSES.length - 1 && (
                  <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                )}
              </View>

              {/* Step info */}
              <View style={styles.stepInfo}>
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                  {status.emoji} {status.label}
                </Text>
                {isActive && (
                  <Text style={styles.stepDesc}>{status.description}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Manual Advance (for demo) ─── */}
      {!isComplete && (
        <TouchableOpacity style={styles.nextBtn} onPress={advanceManually} activeOpacity={0.8}>
          <Text style={styles.nextBtnText}>⏭ Next Status (Demo)</Text>
        </TouchableOpacity>
      )}

      {/* ─── Final CTA when order is ready ─── */}
      {isComplete && (
        <View style={styles.completedSection}>
          <Text style={styles.completedTitle}>🎊 Enjoy your meal!</Text>
          <Text style={styles.completedSubtitle}>
            Please collect at Counter 3 with your Order ID
          </Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.homeBtnText}>Back to Menu 🏠</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  orderBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  orderLabel: {
    fontSize: FONTS.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  orderId: {
    fontSize: FONTS.size.xxl,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  pickupTime: {
    fontSize: FONTS.size.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  statusEmoji: {
    fontSize: 52,
    marginBottom: SPACING.sm,
  },
  statusLabel: {
    fontSize: FONTS.size.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  statusDesc: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  stepsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  stepLeft: {
    alignItems: 'center',
    width: 28,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepDotDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepDotText: {
    fontSize: FONTS.size.xs,
    fontWeight: '800',
    color: COLORS.white,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: COLORS.border,
    marginVertical: 3,
  },
  stepLineDone: {
    backgroundColor: COLORS.success,
  },
  stepInfo: {
    flex: 1,
    paddingBottom: SPACING.md,
  },
  stepLabel: {
    fontSize: FONTS.size.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  nextBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm + 4,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nextBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.size.md,
  },
  completedSection: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  completedTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  completedSubtitle: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  homeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOWS.sm,
  },
  homeBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: FONTS.size.md,
  },
});
