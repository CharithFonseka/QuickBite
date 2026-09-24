// screens/CartScreen.js
// Displays all cart items with quantity controls and a computed subtotal
// Cart state persists across screen navigation via CartContext (React Context)

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function CartScreen({ navigation }) {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();

  // Handle completely removing an item with confirmation
  const handleRemove = (item) => {
    Alert.alert('Remove Item', `Remove ${item.name} from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(item) },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  // Render a single cart item row
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Thumbnail */}
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />

      {/* Info */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price} each</Text>

        {/* ─── Quantity Controls ─── */}
        <View style={styles.qtyRow}>
          {/* Decrease — if quantity is 1, this removes the item */}
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.qtyBtnText}>{item.quantity === 1 ? '🗑' : '−'}</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Line total for this item */}
      <View style={styles.lineTotal}>
        <Text style={styles.lineTotalText}>
          ₹{(item.price * item.quantity).toFixed(0)}
        </Text>
        <TouchableOpacity onPress={() => handleRemove(item)}>
          <Text style={styles.removeBtn}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Empty Cart ───
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add some delicious items from the menu!</Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.browseBtnText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Delivery fee and tax (fixed mock values) ───
  const DELIVERY_FEE = 0;      // Free pickup at canteen
  const TAX_RATE = 0.05;       // 5% GST
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax + DELIVERY_FEE;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        // Order summary in the list footer
        ListFooterComponent={
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (5%)</Text>
              <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pickup Fee</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>FREE</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.cartHeader}>
            <Text style={styles.cartCount}>{items.length} item{items.length > 1 ? 's' : ''}</Text>
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearBtn}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Sticky Checkout Button */}
      <View style={styles.checkoutBar}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout — ₹{total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: 100, // Space above the sticky button
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  cartCount: {
    fontSize: FONTS.size.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clearBtn: {
    fontSize: FONTS.size.sm,
    color: COLORS.error,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.md,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  itemName: {
    fontSize: FONTS.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  qtyValue: {
    fontSize: FONTS.size.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  lineTotal: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  lineTotalText: {
    fontSize: FONTS.size.md,
    fontWeight: '800',
    color: COLORS.primary,
  },
  removeBtn: {
    fontSize: 14,
    color: COLORS.textLight,
    padding: SPACING.xs,
  },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  summaryTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
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
    marginTop: SPACING.sm,
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
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: FONTS.size.md,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOWS.sm,
  },
  browseBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONTS.size.md,
  },
});
