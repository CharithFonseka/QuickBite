// screens/HomeScreen.js
// The main menu browsing screen with:
//  - Custom header with greeting + cart icon
//  - Search bar to filter items by name
//  - Category tab filter (All, Meals, Beverages, Snacks)
//  - 2-column grid of MenuItemCards

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import menuData from '../data/menu.json';
import MenuItemCard from '../components/MenuItemCard';
import CartBadge from '../components/CartBadge';
import { useCart } from '../context/CartContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

// All available categories — "All" shows every item
const CATEGORIES = ['All', 'Meals', 'Beverages', 'Snacks'];

export default function HomeScreen({ navigation, route }) {
  const { cartCount, addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract the user's name from login route params
  const userEmail = route?.params?.userEmail || 'Guest';
  const displayName = userEmail === 'Guest' ? 'Guest' : userEmail.split('@')[0];

  // useMemo ensures filtering only runs when dependencies change (not every render)
  const filteredItems = useMemo(() => {
    return menuData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Render each item card in the FlatList
  const renderItem = ({ item }) => (
    <MenuItemCard
      item={item}
      onPress={() => navigation.navigate('ItemDetail', { item })}
      onAdd={() => addItem(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ─── Custom Header ─── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {displayName}! 👋</Text>
          <Text style={styles.headerTitle}>What would you like?</Text>
        </View>

        {/* Cart icon with badge */}
        <View>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            <CartBadge count={cartCount} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Search Bar ─── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {/* Clear button — only shows when there's text */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ─── Category Filter Tabs ─── */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              selectedCategory === cat && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === cat && styles.categoryTabTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── Menu Grid ─── */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Two-column grid layout
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        // Empty state
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        }
        // Profile icon in the list header
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.resultCount}>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </Text>
            {/* Profile button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', { userEmail })}
              style={styles.profileBtn}
            >
              <Text style={styles.profileBtnText}>👤 Profile</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.size.sm,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: '800',
    color: COLORS.white,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 22,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    padding: 0,
  },
  clearBtn: {
    fontSize: 14,
    color: COLORS.textLight,
    paddingHorizontal: SPACING.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryTabActive: {
    backgroundColor: COLORS.white,
  },
  categoryTabText: {
    fontSize: FONTS.size.sm,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  list: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    minHeight: 400,
  },
  row: {
    justifyContent: 'space-between',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  resultCount: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  profileBtn: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileBtnText: {
    fontSize: FONTS.size.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.size.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
  },
});
