import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { EmptyState, OrderStatusBadge, Screen, SectionHeader } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function OrdersScreen() {
  const colors = useColors();
  const { orders, marts } = useApp();
  return <Screen><View style={styles.top}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR JOURNEY</Text><Text style={[styles.title, { color: colors.foreground }]}>Orders</Text></View><View style={[styles.count, { backgroundColor: colors.accent }]}><Text style={[styles.countText, { color: colors.accentForeground }]}>{orders.length}</Text></View></View>{orders.length === 0 ? <EmptyState icon="package" title="Your next basket is waiting" body="Orders from marts near you will show up here once you check out." action="Browse nearby marts" onAction={() => router.push('/(tabs)/explore')} /> : orders.map((order) => { const mart = marts.find((item) => item.id === order.martId); return <Pressable key={order.id} onPress={() => router.push(`/order/${order.id}`)} style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.orderHeader}><View style={styles.orderMart}><Image source={mart?.image} style={styles.orderImage} /><View><Text style={[styles.martName, { color: colors.foreground }]}>{mart?.name ?? 'Local mart'}</Text><Text style={[styles.orderId, { color: colors.mutedForeground }]}>{order.id} · {order.items.length} items</Text></View></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></View><View style={styles.orderDivider} /><View style={styles.orderBottom}><OrderStatusBadge status={order.status} /><Text style={[styles.orderTotal, { color: colors.foreground }]}>₹{order.total}</Text></View></Pressable>; })}<SectionHeader title="Need something else?" /><Pressable onPress={() => router.push('/(tabs)/explore')} style={[styles.reorder, { backgroundColor: colors.secondary }]}><View style={[styles.reorderIcon, { backgroundColor: colors.primary }]}><Feather name="repeat" size={17} color={colors.primaryForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.reorderTitle, { color: colors.foreground }]}>Restock your staples</Text><Text style={[styles.reorderBody, { color: colors.mutedForeground }]}>Find your everyday essentials in one tap.</Text></View><Feather name="arrow-up-right" size={18} color={colors.primary} /></Pressable></Screen>;
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 17, marginBottom: 24 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, marginTop: 5 },
  count: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  orderCard: { borderRadius: 20, borderWidth: 1, padding: 14, marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderMart: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  orderImage: { width: 45, height: 45, borderRadius: 13 },
  martName: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  orderId: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  orderDivider: { height: 1, backgroundColor: '#eee5d8', marginVertical: 13 },
  orderBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderTotal: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  reorder: { borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  reorderIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  reorderTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  reorderBody: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
});