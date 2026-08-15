import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { OrderStatusBadge, PrimaryButton, Screen, SectionHeader } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function OwnerScreen() {
  const colors = useColors();
  const { marts, products, orders, advanceOrder, role, setRole, currentUser } = useApp();
  
  // Find the mart owned by the currently logged-in user
  const ownedMart = marts.find((mart) => mart.ownerId === currentUser?.id) || marts[marts.length - 1];
  const ownedOrders = orders.filter((order) => order.martId === ownedMart?.id);
  const stats = [{ label: "Today's orders", value: ownedOrders.length || '12', icon: 'shopping-bag' as const }, { label: "Today's revenue", value: ownedOrders.length ? `₹${ownedOrders.reduce((sum, item) => sum + item.total, 0)}` : '₹4,860', icon: 'trending-up' as const }, { label: 'Total products', value: products.filter((product) => product.martId === ownedMart?.id).length || '48', icon: 'package' as const }, { label: 'Low stock', value: '3', icon: 'alert-circle' as const }];
  // @ts-expect-error The scaffold Feather typings omit the store glyph used by Expo at runtime.
  return <Screen><View style={styles.header}><Pressable onPress={() => { setRole('customer'); router.back(); }} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable><View style={{ alignItems: 'center' }}><Text style={[styles.eyebrow, { color: colors.primary }]}>OWNER CONSOLE</Text><Text style={[styles.title, { color: colors.foreground }]}>Mart dashboard</Text></View><Pressable onPress={() => router.push('/(tabs)/profile')}><Feather name="user" size={21} color={colors.foreground} /></Pressable></View><View style={[styles.storeCard, { backgroundColor: colors.primary }]}><View style={[styles.storeIcon, { backgroundColor: colors.accent }]}><Feather name="store" size={21} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.storeName, { color: colors.primaryForeground }]}>{ownedMart?.name ?? 'Your mart'}</Text><Text style={[styles.storeMeta, { color: colors.primaryForeground }]}>{ownedMart?.approvalStatus === 'pending' ? 'Pending approval' : 'Open · Electronic City'}</Text></View><Feather name="more-horizontal" size={21} color={colors.primaryForeground} /></View><View style={styles.stats}>{stats.map((stat) => <View key={stat.label} style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.statIcon, { backgroundColor: colors.secondary }]}><Feather name={stat.icon} size={16} color={colors.primary} /></View><Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text></View>)}</View><SectionHeader title="Order queue" action="See all" onPress={() => undefined} />{ownedOrders.length === 0 ? <View style={[styles.empty, { backgroundColor: colors.secondary }]}><Feather name="inbox" size={20} color={colors.primary} /><Text style={[styles.emptyText, { color: colors.secondaryForeground }]}>New customer orders will appear here.</Text></View> : ownedOrders.map((order) => <View key={order.id} style={[styles.order, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.orderTop}><View><Text style={[styles.orderId, { color: colors.foreground }]}>{order.id}</Text><Text style={[styles.orderMeta, { color: colors.mutedForeground }]}>{order.items.length} items · {order.paymentMethod}</Text></View><OrderStatusBadge status={order.status} /></View><PrimaryButton title="Advance status" onPress={() => advanceOrder(order.id)} icon="arrow-right" /></View>)}<SectionHeader title="Manage your mart" /><View style={styles.actions}><Action title="Products" icon="package" onPress={() => router.push('/add-product')} /><Action title="Offers" icon="tag" onPress={() => Alert.alert('Offers', 'Create a percentage or product-specific offer for your customers.')} /><Action title="Insights" icon="bar-chart-2" onPress={() => Alert.alert('Insights', 'Your top-selling category is everyday groceries.')} /></View><Text style={[styles.footer, { color: colors.mutedForeground }]}>Demo owner view · data stays on this device</Text></Screen>;
}

function Action({ title, icon, onPress }: { title: string; icon: React.ComponentProps<typeof Feather>['name']; onPress: () => void }) { const colors = useColors(); return <Pressable onPress={onPress} style={[styles.action, { backgroundColor: colors.secondary }]}><Feather name={icon} size={17} color={colors.primary} /><Text style={[styles.actionText, { color: colors.foreground }]}>{title}</Text><Feather name="chevron-right" size={15} color={colors.mutedForeground} /></Pressable>; }
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, marginBottom: 19 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 4 },
  storeCard: { borderRadius: 22, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11 },
  storeIcon: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  storeName: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  storeMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.85, marginTop: 4 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 15 },
  stat: { width: '48%', minHeight: 113, borderRadius: 18, borderWidth: 1, padding: 12 },
  statIcon: { width: 31, height: 31, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 21, marginTop: 10 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 },
  empty: { borderRadius: 17, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  order: { borderRadius: 18, borderWidth: 1, padding: 13, marginBottom: 10, gap: 13 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  orderId: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  orderMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  actions: { gap: 9 },
  action: { minHeight: 53, borderRadius: 16, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionText: { fontFamily: 'Inter_700Bold', fontSize: 13, flex: 1 },
  footer: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 25 },
});