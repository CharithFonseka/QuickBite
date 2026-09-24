// screens/ItemDetailScreen.js
// Full-screen view of a single menu item with quantity selector and Add to Cart

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params; // Menu item passed from Home screen
  const { addItem, items } = useCart();

  // Local quantity state — user selects how many before adding to cart
  const [quantity, setQuantity] = useState(1);

  // How many of this item are already in the cart
  const existingCartItem = items.find((i) => i.id === item.id);
  const alreadyInCart = existingCartItem ? existingCartItem.quantity : 0;

  const decrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const increase = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    // Add the item 'quantity' times (addItem increments by 1 each call)
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    Alert.alert(
      'Added to Cart! 🛒',
      `${quantity} × ${item.name} added`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

      {/* Popular badge overlay */}
      {item.popular && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 Popular Choice</Text>
        </View>
      )}

      {/* Content Card */}
      <View style={styles.card}>
        {/* Category + prep time */}
        <View style={styles.metaRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{item.category}</Text>
          </View>
          <Text style={styles.prepTime}>⏱ {item.prepTime}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>

        {/* Name */}
        <Text style={styles.name}>{item.name}</Text>

        {/* Price */}
        <Text style={styles.price}>₹{item.price}</Text>

        {/* Description */}
        <Text style={styles.sectionLabel}>About this item</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* Already-in-cart indicator */}
        {alreadyInCart > 0 && (
          <View style={styles.inCartBanner}>
            <Text style={styles.inCartText}>
              🛒 {alreadyInCart} already in your cart
            </Text>
          </View>
        )}

        {/* ─── Quantity Selector ─── */}
        <Text style={styles.sectionLabel}>Quantity</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
            onPress={decrease}
            activeOpacity={0.7}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity style={styles.qtyBtn} onPress={increase} activeOpacity={0.7}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>

          {/* Subtotal for this selection */}
          <Text style={styles.selectionTotal}>
            = ₹{(item.price * quantity).toFixed(0)}
          </Text>
        </View>

        {/* Add to Cart button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>
            Add {quantity} to Cart — ₹{(item.price * quantity).toFixed(0)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: width,
    height: width * 0.65,
  },
  badge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONTS.size.xs,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -SPACING.lg,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    ...SHADOWS.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  pill: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  pillText: {
    fontSize: FONTS.size.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  prepTime: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
  },
  rating: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginLeft: 'auto',
  },
  name: {
    fontSize: FONTS.size.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 30,
  },
  price: {
    fontSize: FONTS.size.xl + 4,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: FONTS.size.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  description: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  inCartBanner: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  inCartText: {
    fontSize: FONTS.size.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  qtyBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  qtyBtnText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  qtyValue: {
    fontSize: FONTS.size.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  selectionTotal: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
