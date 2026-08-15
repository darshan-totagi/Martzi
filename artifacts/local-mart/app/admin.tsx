import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, Screen, SectionHeader } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function AdminScreen() {
  const colors = useColors();
  const { marts, orders, products, approveMart, setRole } = useApp();
  const pending = marts.filter((mart) => mart.approvalStatus === 'pending');
  const metrics = [{ label: 'Total users', value: '1,248', icon: 'users' as const }, { label: 'Active marts', value: marts.filter((mart) => mart.approvalStatus === 'approved').length, icon: 'shopping-bag' as const }, { label: 'Total orders', value: orders.length || '386', icon: 'package' as const }, { label: 'Revenue today', value: '₹28.4k', icon: 'trending-up' as const }];
  // @ts-expect-error The scaffold Feather typings omit the store glyph used by Expo at runtime.
  return <Screen><View style={styles.header}><Pressable onPress={() => { setRole('customer'); router.back(); }} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable><View style={{ alignItems: 'center' }}><Text style={[styles.eyebrow, { color: colors.primary }]}>CONTROL ROOM</Text><Text style={[styles.title, { color: colors.foreground }]}>Admin overview</Text></View><Feather name="shield" size={21} color={colors.foreground} /></View><View style={styles.metrics}>{metrics.map((metric) => <View key={metric.label} style={[styles.metric, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.metricIcon, { backgroundColor: colors.secondary }]}><Feather name={metric.icon} size={16} color={colors.primary} /></View><Text style={[styles.metricValue, { color: colors.foreground }]}>{metric.value}</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{metric.label}</Text></View>)}</View><View style={[styles.health, { backgroundColor: colors.secondary }]}><View style={[styles.healthDot, { backgroundColor: colors.primary }]} /><Text style={[styles.healthTitle, { color: colors.foreground }]}>Platform is running smoothly</Text><Text style={[styles.healthMeta, { color: colors.mutedForeground }]}>98.6% fulfillment rate</Text></View><SectionHeader title="Mart approvals" action={`${pending.length} pending`} />{pending.length === 0 ? <View style={[styles.empty, { backgroundColor: colors.secondary }]}><Feather name="check-circle" size={19} color={colors.primary} /><Text style={[styles.emptyText, { color: colors.secondaryForeground }]}>No pending mart applications.</Text></View> : pending.map((mart) => <View key={mart.id} style={[styles.mart, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.martIcon, { backgroundColor: colors.accent }]}><Feather name="store" size={18} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.martName, { color: colors.foreground }]}>{mart.name}</Text><Text style={[styles.martMeta, { color: colors.mutedForeground }]}>{mart.area} · ₹{mart.minimumOrder} minimum</Text></View><Pressable onPress={() => { approveMart(mart.id); Alert.alert('Mart approved', `${mart.name} is now visible to nearby customers.`); }} style={[styles.approve, { backgroundColor: colors.primary }]}><Feather name="check" size={16} color={colors.primaryForeground} /></Pressable></View>)}<SectionHeader title="Platform shortcuts" /><Shortcut title="Manage categories" icon="grid" onPress={() => Alert.alert('Categories', 'Fruits & veg, dairy, bakery, beverages, snacks, and household are active.')} /><Shortcut title="Review advertisements" icon="image" onPress={() => Alert.alert('Advertisements', 'The weekend fresh picks campaign is active.')} /><Shortcut title="View analytics" icon="bar-chart-2" onPress={() => Alert.alert('Analytics', 'Marts near Electronic City drive the most repeat orders.')} /><Text style={[styles.footer, { color: colors.mutedForeground }]}>Demo admin view · data stays on this device</Text></Screen>;
}

function Shortcut({ title, icon, onPress }: { title: string; icon: React.ComponentProps<typeof Feather>['name']; onPress: () => void }) { const colors = useColors(); return <Pressable onPress={onPress} style={[styles.shortcut, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.shortcutIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={17} color={colors.primary} /></View><Text style={[styles.shortcutTitle, { color: colors.foreground }]}>{title}</Text><Feather name="chevron-right" size={16} color={colors.mutedForeground} /></Pressable>; }
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, marginBottom: 20 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 4 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  metric: { width: '48%', minHeight: 113, borderRadius: 18, borderWidth: 1, padding: 12 },
  metricIcon: { width: 31, height: 31, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 10 },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  health: { borderRadius: 16, padding: 13, marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 8 },
  healthDot: { width: 9, height: 9, borderRadius: 5 },
  healthTitle: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  healthMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, marginLeft: 'auto' },
  empty: { borderRadius: 17, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  mart: { borderRadius: 18, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  martIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  martName: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  martMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  approve: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shortcut: { minHeight: 58, borderRadius: 16, borderWidth: 1, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  shortcutIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shortcutTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  footer: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 25 },
});