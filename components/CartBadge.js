// components/CartBadge.js
// Small badge displayed on the cart icon showing the number of items

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function CartBadge({ count }) {
  // Don't render the badge if cart is empty
  if (!count || count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.size.xs - 1,
    fontWeight: '800',
  },
});
