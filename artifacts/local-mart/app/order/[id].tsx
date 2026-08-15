import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { OrderStatusBadge, PrimaryButton, Screen, SectionHeader } from '@/components/ui';
import { OrderStatus, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const steps: { status: OrderStatus; icon: React.ComponentProps<typeof Feather>['name']; body: string }[] = [
  { status: 'Order placed', icon: 'check', body: 'We sent your order to the mart.' },
  { status: 'Mart accepted', icon: 'shopping-bag', body: 'The mart has confirmed your basket.' },
  { status: 'Preparing order', icon: 'package', body: 'Your groceries are being packed.' },
  { status: 'Ready for delivery', icon: 'box', body: 'Everything is ready to leave the mart.' },
  { status: 'Out for delivery', icon: 'truck', body: 'Your rider is on the way.' },
  { status: 'Delivered', icon: 'home', body: 'Enjoy your fresh picks.' },
];

export default function OrderScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, marts, advanceOrder } = useApp();
  const order = orders.find((item) => item.id === id) ?? orders[0];
  if (!order) return <Screen><Text style={[styles.notFound, { color: colors.foreground }]}>Order not found</Text></Screen>;
  const mart = marts.find((item) => item.id === order.martId);
  const currentIndex = steps.findIndex((step) => step.status === order.status);
  return <Screen><View style={styles.header}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>Track order</Text><Pressable onPress={() => Alert.alert('Need a hand?', 'Our support team can help with your order.')}><Feather name="help-circle" size={21} color={colors.foreground} /></Pressable></View><View style={[styles.hero, { backgroundColor: colors.primary }]}><View style={styles.heroTop}><View><Text style={[styles.heroEyebrow, { color: colors.primaryForeground }]}>ORDER {order.id}</Text><Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>{order.status}</Text></View><OrderStatusBadge status={order.status} /></View><Text style={[styles.heroBody, { color: colors.primaryForeground }]}>{order.status === 'Delivered' ? 'Delivered with care from' : 'Arriving from'} {mart?.name}</Text><View style={[styles.eta, { backgroundColor: colors.accent }]}><Feather name="clock" size={15} color={colors.accentForeground} /><Text style={[styles.etaText, { color: colors.accentForeground }]}>{order.status === 'Delivered' ? 'Delivered today' : 'Estimated in 25–35 min'}</Text></View></View><SectionHeader title="Order progress" /><View style={styles.timeline}>{steps.map((step, index) => { const done = index <= currentIndex; const active = index === currentIndex; return <View key={step.status} style={styles.timelineRow}><View style={styles.timelineRail}>{<View style={[styles.timelineIcon, { backgroundColor: done ? colors.primary : colors.muted, borderColor: done ? colors.primary : colors.border }]}><Feather name={step.icon} size={14} color={done ? colors.primaryForeground : colors.mutedForeground} /></View>}{index < steps.length - 1 && <View style={[styles.line, { backgroundColor: index < currentIndex ? colors.primary : colors.border }]} />}</View><View style={styles.timelineCopy}><Text style={[styles.stepTitle, { color: done ? colors.foreground : colors.mutedForeground }]}>{step.status}</Text><Text style={[styles.stepBody, { color: colors.mutedForeground }]}>{active ? step.body : index < currentIndex ? 'Completed' : 'Up next'}</Text></View></View>; })}</View><SectionHeader title="Order details" /><View style={[styles.details, { backgroundColor: colors.card, borderColor: colors.border }]}><Detail label="Delivering to" value={`${order.address.line}, ${order.address.area}`} /><Detail label="Payment" value={order.paymentMethod} /><Detail label="Total" value={`₹${order.total}`} /></View>{order.status !== 'Delivered' && <PrimaryButton title="Advance demo status" onPress={() => advanceOrder(order.id)} icon="arrow-right" />}<Pressable onPress={() => Alert.alert('Contact mart', 'Calling the mart is available for active orders.')} style={styles.contact}><Feather name="phone" size={17} color={colors.primary} /><Text style={[styles.contactText, { color: colors.primary }]}>Contact the mart</Text></Pressable></Screen>;
}

function Detail({ label, value }: { label: string; value: string }) { const colors = useColors(); return <View style={styles.detail}><Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text></View>; }
const styles = StyleSheet.create({
  notFound: { fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 80, textAlign: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, marginBottom: 19 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  hero: { borderRadius: 23, padding: 17, minHeight: 156 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.4, opacity: 0.82 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 23, marginTop: 9 },
  heroBody: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 19, opacity: 0.9 },
  eta: { alignSelf: 'flex-start', borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, marginTop: 11 },
  etaText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  timeline: { paddingVertical: 4 },
  timelineRow: { flexDirection: 'row', minHeight: 67 },
  timelineRail: { width: 34, alignItems: 'center' },
  timelineIcon: { width: 29, height: 29, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  line: { width: 2, flex: 1, marginVertical: 3 },
  timelineCopy: { flex: 1, paddingLeft: 12, paddingTop: 2 },
  stepTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  stepBody: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  details: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 13, marginBottom: 17 },
  detail: { flexDirection: 'row', justifyContent: 'space-between', gap: 14 },
  detailLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  detailValue: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'right', flex: 1 },
  contact: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 19 },
  contactText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});