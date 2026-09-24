// screens/ProfileScreen.js
// Displays user profile info and a mock order history list

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

// ─── Mock Order History ────────────────────────────────────────────────────────
// In a real app, this would come from a backend or local storage
const MOCK_ORDERS = [
  {
    id: 'QB-A3F2',
    date: 'Sep 23, 2026 — 1:30 PM',
    items: 'Chicken Biryani × 1, Masala Chai × 2',
    total: '₹115',
    status: 'Completed',
  },
  {
    id: 'QB-7YK9',
    date: 'Sep 22, 2026 — 12:15 PM',
    items: 'Veg Thali × 2, Samosa × 1',
    total: '₹140',
    status: 'Completed',
  },
  {
    id: 'QB-2MQ1',
    date: 'Sep 21, 2026 — 3:00 PM',
    items: 'Cold Coffee × 1, French Fries × 1',
    total: '₹85',
    status: 'Completed',
  },
];

export default function ProfileScreen({ route }) {
  const userEmail = route?.params?.userEmail || 'Guest';
  const isGuest = userEmail === 'Guest';

  // Editable name field
  const [name, setName] = useState(isGuest ? 'Campus Guest' : userEmail.split('@')[0]);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const saveName = () => {
    if (!tempName.trim()) {
      Alert.alert('Name cannot be empty');
      return;
    }
    setName(tempName.trim());
    setEditing(false);
  };

  // Avatar initials from name
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ─── Profile Header ─── */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.nameInput}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveName}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setEditing(false); setTempName(name); }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{name}</Text>
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editBtn}>
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.profileEmail}>{isGuest ? 'Guest User' : userEmail}</Text>
      </View>

      {/* ─── Stats Row ─── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{MOCK_ORDERS.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>⭐ 4.7</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>₹340</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      {/* ─── Order History ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>

        {MOCK_ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order header */}
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{order.status}</Text>
              </View>
            </View>

            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderItems} numberOfLines={2}>{order.items}</Text>

            {/* Footer with total */}
            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>{order.total}</Text>
              <TouchableOpacity style={styles.reorderBtn}>
                <Text style={styles.reorderBtnText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* ─── App Info ─── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>QuickBite v1.0.0 · Campus Canteen App</Text>
        <Text style={styles.footerSubtext}>Made with ❤️ for the university community</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl + 10,
    borderBottomLeftRadius: RADIUS.xl + 8,
    borderBottomRightRadius: RADIUS.xl + 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.size.xl + 4,
    fontWeight: '900',
    color: COLORS.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  profileName: {
    fontSize: FONTS.size.xl,
    fontWeight: '800',
    color: COLORS.white,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  editBtnText: {
    fontSize: FONTS.size.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  editRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  nameInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    color: COLORS.white,
    fontSize: FONTS.size.md,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
  },
  saveBtnText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: FONTS.size.sm,
  },
  cancelBtn: {
    paddingHorizontal: SPACING.sm,
  },
  cancelBtnText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONTS.size.sm,
  },
  profileEmail: {
    fontSize: FONTS.size.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: -SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statNumber: {
    fontSize: FONTS.size.lg,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderId: {
    fontSize: FONTS.size.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  statusBadge: {
    backgroundColor: '#E6F9EE',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  statusBadgeText: {
    fontSize: FONTS.size.xs,
    color: COLORS.success,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  orderItems: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: SPACING.sm,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  orderTotal: {
    fontSize: FONTS.size.md,
    fontWeight: '800',
    color: COLORS.primary,
  },
  reorderBtn: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  reorderBtnText: {
    fontSize: FONTS.size.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
  },
});
