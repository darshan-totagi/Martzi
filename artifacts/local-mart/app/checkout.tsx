import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Address, PaymentMethod, useApp } from '@/context/AppContext';
import { Field, PrimaryButton, Screen, SectionHeader } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

const paymentMethods: { label: PaymentMethod; icon: React.ComponentProps<typeof Feather>['name']; note: string }[] = [
  { label: 'Cash on delivery', icon: 'truck', note: 'Pay when your order arrives' },
  { label: 'UPI', icon: 'smartphone', note: 'Fast and secure UPI checkout' },
  { label: 'Online payment', icon: 'credit-card', note: 'Cards and net banking' },
];

export default function CheckoutScreen() {
  const colors = useColors();
  const { cart, cartSubtotal, marts, addresses, placeOrder } = useApp();
  const mart = marts.find((item) => item.id === cart[0]?.product.martId);
  const [address, setAddress] = useState<Address>(addresses[0]);
  const [payment, setPayment] = useState<PaymentMethod>('Cash on delivery');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ line: '', area: '', pincode: '' });
  const delivery = cartSubtotal >= 499 || !mart || mart.deliveryFee === 0 ? 0 : mart.deliveryFee;
  const total = cartSubtotal + delivery + 5;
  const submit = () => {
    if (!cart.length) { Alert.alert('Your cart is empty'); return; }
    const selected = showNewAddress ? { id: 'new', label: 'New address', line: newAddress.line || 'Flat 402, SJR Bluewaters', area: newAddress.area || 'Electronic City Phase 1', city: 'Bengaluru', pincode: newAddress.pincode || '560100' } : address;
    const order = placeOrder(selected, payment);
    router.replace(`/order/${order.id}`);
  };
  return <Screen><View style={styles.header}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>Checkout</Text><View style={{ width: 40 }} /></View><View style={[styles.secure, { backgroundColor: colors.secondary }]}><Feather name="shield" size={17} color={colors.primary} /><Text style={[styles.secureText, { color: colors.secondaryForeground }]}>Your order is protected from mart to doorstep.</Text></View><SectionHeader title="Delivery address" action={showNewAddress ? 'Use saved' : 'Add new'} onPress={() => setShowNewAddress((value) => !value)} />{showNewAddress ? <View><Field label="House / flat / street" value={newAddress.line} onChangeText={(value) => setNewAddress((current) => ({ ...current, line: value }))} placeholder="e.g. Flat 402, SJR Bluewaters" /><Field label="Area" value={newAddress.area} onChangeText={(value) => setNewAddress((current) => ({ ...current, area: value }))} placeholder="e.g. Electronic City Phase 1" /><Field label="Pincode" value={newAddress.pincode} onChangeText={(value) => setNewAddress((current) => ({ ...current, pincode: value }))} placeholder="560100" keyboardType="numeric" /></View> : addresses.map((item) => <Pressable key={item.id} onPress={() => setAddress(item)} style={[styles.address, { backgroundColor: address.id === item.id ? colors.secondary : colors.card, borderColor: address.id === item.id ? colors.primary : colors.border }]}><View style={[styles.addressIcon, { backgroundColor: colors.primary }]}><Feather name="home" size={16} color={colors.primaryForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.addressLabel, { color: colors.foreground }]}>{item.label}</Text><Text style={[styles.addressText, { color: colors.mutedForeground }]}>{item.line}, {item.area}, {item.city} - {item.pincode}</Text></View>{address.id === item.id && <Feather name="check-circle" size={19} color={colors.primary} />}</Pressable>)}<SectionHeader title="Payment method" />{paymentMethods.map((method) => <Pressable key={method.label} onPress={() => setPayment(method.label)} style={[styles.payment, { backgroundColor: payment === method.label ? colors.secondary : colors.card, borderColor: payment === method.label ? colors.primary : colors.border }]}><View style={[styles.paymentIcon, { backgroundColor: payment === method.label ? colors.primary : colors.muted }]}><Feather name={method.icon} size={17} color={payment === method.label ? colors.primaryForeground : colors.primary} /></View><View style={{ flex: 1 }}><Text style={[styles.paymentLabel, { color: colors.foreground }]}>{method.label}</Text><Text style={[styles.paymentNote, { color: colors.mutedForeground }]}>{method.note}</Text></View><View style={[styles.radio, { borderColor: payment === method.label ? colors.primary : colors.border }]}>{payment === method.label && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}</View></Pressable>)}<SectionHeader title="Order summary" /><View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}><SummaryRow label={`${cart.reduce((sum, item) => sum + item.quantity, 0)} items from ${mart?.name ?? 'mart'}`} value={`₹${cartSubtotal}`} /><SummaryRow label="Delivery" value={delivery === 0 ? 'FREE' : `₹${delivery}`} /><SummaryRow label="Platform fee" value="₹5" /><View style={[styles.total, { borderTopColor: colors.border }]}><Text style={[styles.totalLabel, { color: colors.foreground }]}>To pay</Text><Text style={[styles.totalValue, { color: colors.foreground }]}>₹{total}</Text></View></View><PrimaryButton title={`Place order · ₹${total}`} onPress={submit} icon="check" /></Screen>;
}

function SummaryRow({ label, value }: { label: string; value: string }) { const colors = useColors(); return <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{value}</Text></View>; }
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, marginBottom: 19 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  secure: { borderRadius: 15, padding: 12, flexDirection: 'row', gap: 9, alignItems: 'center' },
  secureText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  address: { minHeight: 72, borderRadius: 17, borderWidth: 1, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  addressIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addressLabel: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  addressText: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, marginTop: 4 },
  payment: { minHeight: 68, borderRadius: 17, borderWidth: 1, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  paymentIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  paymentLabel: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  paymentNote: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  summary: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 11 },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  summaryValue: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  total: { borderTopWidth: 1, paddingTop: 13, marginTop: 2, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  totalValue: { fontFamily: 'Inter_700Bold', fontSize: 18 },
});