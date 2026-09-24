// components/MenuItemCard.js
// Reusable card component displayed in the Home screen grid/list
// Shows item image, name, category badge, price and an Add button

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
// Two-column grid: subtract padding and gap then divide by 2
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.sm) / 2;

export default function MenuItemCard({ item, onPress, onAdd }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Item image */}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Popular badge */}
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>🔥 Popular</Text>
        </View>
      )}

      <View style={styles.info}>
        {/* Category pill */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        {/* Rating and prep time row */}
        <View style={styles.metaRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.prepTime}>⏱ {item.prepTime}</Text>
        </View>

        {/* Price + Add button */}
        <View style={styles.footer}>
          <Text style={styles.price}>₹{item.price}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  image: {
    width: '100%',
    height: 130,
  },
  popularBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  popularText: {
    fontSize: FONTS.size.xs,
    color: COLORS.white,
    fontWeight: '700',
  },
  info: {
    padding: SPACING.sm,
  },
  categoryPill: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  categoryText: {
    fontSize: FONTS.size.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  name: {
    fontSize: FONTS.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  rating: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
  },
  prepTime: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FONTS.size.md,
    fontWeight: '800',
    color: COLORS.primary,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
});
