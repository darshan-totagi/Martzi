import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, QuantityStepper, Screen, SectionHeader } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function CartScreen() {
  const colors = useColors();
  const { cart, cartSubtotal, marts, updateQuantity, removeFromCart } = useApp();
  const mart = marts.find((item) => item.id === cart[0]?.product.martId);
  const delivery = cartSubtotal >= 499 || !mart || mart.deliveryFee === 0 ? 0 : mart.deliveryFee;
  const total = cartSubtotal + delivery + 5;
  // @ts-expect-error The scaffold Feather typings omit the store glyph used by Expo at runtime.
  return <Screen><View style={styles.top}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>READY WHEN YOU ARE</Text><Text style={[styles.title, { color: colors.foreground }]}>Your cart</Text></View><Feather name="shopping-cart" size={24} color={colors.primary} /></View>{cart.length === 0 ? <View style={styles.emptyWrap}><View style={[styles.cartIllustration, { backgroundColor: colors.secondary }]}><Feather name="shopping-bag" size={30} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your basket is empty</Text><Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>Pick up a few favorites from a mart near you.</Text><PrimaryButton title="Explore nearby marts" onPress={() => router.push('/(tabs)/explore')} icon="arrow-right" /></View> : <><View style={[styles.martPill, { backgroundColor: colors.secondary }]}><Feather name="store" size={17} color={colors.primary} /><View style={{ flex: 1 }}><Text style={[styles.martPillName, { color: colors.foreground }]}>{mart?.name}</Text><Text style={[styles.martPillMeta, { color: colors.mutedForeground }]}>{mart?.deliveryTime} · one mart per order</Text></View><Feather name="check-circle" size={18} color={colors.primary} /></View><SectionHeader title={`${cart.reduce((sum, item) => sum + item.quantity, 0)} items`} />{cart.map((item) => <View key={item.product.id} style={[styles.item, { borderBottomColor: colors.border }]}><Image source={item.product.image} style={styles.itemImage} /><View style={styles.itemInfo}><Text style={[styles.itemName, { color: colors.foreground }]}>{item.product.name}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.product.unit} · {item.product.brand}</Text><Text style={[styles.itemPrice, { color: colors.foreground }]}>₹{item.product.discountPrice * item.quantity}</Text></View><View style={styles.itemActions}><QuantityStepper quantity={item.quantity} onChange={(quantity) => updateQuantity(item.product.id, quantity)} /><Feather name="trash-2" size={15} color={colors.mutedForeground} onPress={() => removeFromCart(item.product.id)} /></View></View>)}<SectionHeader title="Bill details" /><View style={[styles.bill, { backgroundColor: colors.card, borderColor: colors.border }]}><BillRow label="Item total" value={`₹${cartSubtotal}`} /><BillRow label="Discount" value={`-₹${cart.reduce((sum, item) => sum + (item.product.price - item.product.discountPrice) * item.quantity, 0)}`} green /><BillRow label="Delivery fee" value={delivery === 0 ? 'FREE' : `₹${delivery}`} green={delivery === 0} /><BillRow label="Platform fee" value="₹5" /><View style={[styles.totalLine, { borderTopColor: colors.border }]}><Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text><Text style={[styles.totalValue, { color: colors.foreground }]}>₹{total}</Text></View></View><PrimaryButton title="Continue to checkout" onPress={() => router.push('/checkout')} icon="arrow-right" /></>}</Screen>;
}

function BillRow({ label, value, green }: { label: string; value: string; green?: boolean }) { const colors = useColors(); return <View style={styles.billRow}><Text style={[styles.billLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.billValue, { color: green ? colors.primary : colors.foreground }]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 17, marginBottom: 24 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, marginTop: 5 },
  emptyWrap: { alignItems: 'center', paddingTop: 66 },
  cartIllustration: { width: 84, height: 84, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 19 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', marginTop: 8, marginBottom: 22 },
  martPill: { borderRadius: 18, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  martPillName: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  martPillMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, gap: 11 },
  itemImage: { width: 64, height: 64, borderRadius: 16 },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  itemMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  itemPrice: { fontFamily: 'Inter_700Bold', fontSize: 14, marginTop: 8 },
  itemActions: { alignItems: 'flex-end', gap: 13 },
  bill: { borderWidth: 1, borderRadius: 19, padding: 15, marginBottom: 18 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  billValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  totalLine: { borderTopWidth: 1, marginTop: 3, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  totalValue: { fontFamily: 'Inter_700Bold', fontSize: 19 },
});