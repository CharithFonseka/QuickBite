// screens/CheckoutScreen.js
// Shows an order summary and a "Place Order" button
// On placing: generates a random order ID, clears the cart,
// and navigates to OrderTracking

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

// ─── Order ID Generator ────────────────────────────────────────────────────────
// Generates a short alphanumeric order ID like "QB-A3F2"
// Math.random().toString(36) converts a random decimal to base-36 (0-9, a-z)
// .substring(2, 6) picks 4 characters from the middle of that string
// .toUpperCase() makes it look cleaner
function generateOrderId() {
  return 'QB-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ─── Pickup Time Generator ─────────────────────────────────────────────────────
// Returns a formatted time string that is 15 minutes from now
function getPickupTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function CheckoutScreen({ navigation }) {
  const { items, cartTotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false); // Shows loading spinner briefly

  const TAX_RATE = 0.05;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax;

  const handlePlaceOrder = () => {
    setPlacing(true);

    // Simulate a brief "processing" delay before confirming
    setTimeout(() => {
      const orderId = generateOrderId();
      const pickupTime = getPickupTime();

      clearCart(); // Empty the cart after placing the order

      // Navigate to tracking — replace so user can't go "back" to checkout
      navigation.replace('OrderTracking', { orderId, pickupTime });
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ─── Order Items List ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Order</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.orderRow}>
            <Text style={styles.orderQty}>{item.quantity}×</Text>
            <Text style={styles.orderName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.orderTotal}>₹{(item.price * item.quantity).toFixed(0)}</Text>
          </View>
        ))}
      </View>

      {/* ─── Pickup Info ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <View>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>Campus Canteen, Block A</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏱</Text>
          <View>
            <Text style={styles.infoLabel}>Estimated Pickup</Text>
            <Text style={styles.infoValue}>~15 minutes after order</Text>
          </View>
        </View>
      </View>

      {/* ─── Price Summary ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{cartTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (5%)</Text>
          <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
      </View>

      {/* ─── Payment Method ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentIcon}>💳</Text>
          <Text style={styles.paymentText}>Pay at Counter (Cash / UPI)</Text>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>Selected</Text>
          </View>
        </View>
      </View>

      {/* ─── Place Order Button ─── */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.placeBtn, placing && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={placing}
          activeOpacity={0.85}
        >
          {placing ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.placeBtnText}>Place Order 🚀</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          By placing your order, you agree to pick it up within 30 minutes.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: FONTS.size.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  orderQty: {
    fontSize: FONTS.size.sm,
    fontWeight: '700',
    color: COLORS.primary,
    width: 28,
  },
  orderName: {
    flex: 1,
    fontSize: FONTS.size.sm,
    color: COLORS.textPrimary,
  },
  orderTotal: {
    fontSize: FONTS.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONTS.size.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONTS.size.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalRow: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: FONTS.size.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONTS.size.lg,
    fontWeight: '900',
    color: COLORS.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  paymentIcon: {
    fontSize: 22,
  },
  paymentText: {
    flex: 1,
    fontSize: FONTS.size.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  paymentBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  paymentBadgeText: {
    fontSize: FONTS.size.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  btnContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  placeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  placeBtnDisabled: {
    opacity: 0.7,
  },
  placeBtnText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 17,
  },
});
