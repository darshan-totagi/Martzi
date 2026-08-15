import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Field, PrimaryButton, Screen } from '@/components/ui';
import { Mart, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function RegisterMartScreen() {
  const colors = useColors();
  const { addMart } = useApp();
  const [form, setForm] = useState({ owner: '', phone: '', name: '', address: '', area: '', pincode: '', minimum: '199' });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = () => {
    if (!form.owner || !form.phone || !form.name || !form.address || !form.area) { Alert.alert('Almost there', 'Please fill the owner, mart, and address details.'); return; }
    const newMart: Mart = { id: `mart-${Date.now()}`, name: form.name, rating: 0, distance: 3.2, deliveryTime: '30–40 min', minimumOrder: Number(form.minimum) || 199, deliveryFee: 30, isOpen: false, address: form.address, area: form.area, approvalStatus: 'pending', image: require('../assets/images/produce-bag.jpg') };
    addMart(newMart);
    Alert.alert('Application submitted', 'Your mart is pending approval. You can check its status from the owner dashboard.', [{ text: 'Open owner dashboard', onPress: () => router.replace('/owner') }]);
  };
  // @ts-expect-error The scaffold Feather typings omit the store glyph used by Expo at runtime.
  return <Screen><View style={styles.header}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.secondary }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>Register your mart</Text><View style={{ width: 40 }} /></View><View style={[styles.intro, { backgroundColor: colors.primary }]}><View style={[styles.introIcon, { backgroundColor: colors.accent }]}><Feather name="store" size={22} color={colors.accentForeground} /></View><Text style={[styles.introTitle, { color: colors.primaryForeground }]}>Bring your neighborhood closer.</Text><Text style={[styles.introBody, { color: colors.primaryForeground }]}>Share a few details and the LocalMart team will review your application.</Text></View><Text style={[styles.section, { color: colors.foreground }]}>Owner details</Text><Field label="Owner name" value={form.owner} onChangeText={(value) => set('owner', value)} placeholder="Your full name" /><Field label="Phone number" value={form.phone} onChangeText={(value) => set('phone', value)} placeholder="+91 98765 43210" keyboardType="phone-pad" /><Text style={[styles.section, { color: colors.foreground }]}>Mart details</Text><Field label="Mart name" value={form.name} onChangeText={(value) => set('name', value)} placeholder="e.g. Rao's Fresh Stop" /><Field label="Business address" value={form.address} onChangeText={(value) => set('address', value)} placeholder="Shop number and street" /><Field label="Area" value={form.area} onChangeText={(value) => set('area', value)} placeholder="e.g. Electronic City" /><Field label="Pincode" value={form.pincode} onChangeText={(value) => set('pincode', value)} placeholder="560100" keyboardType="numeric" /><Field label="Minimum order value" value={form.minimum} onChangeText={(value) => set('minimum', value)} placeholder="199" keyboardType="numeric" /><PrimaryButton title="Submit for review" onPress={submit} icon="arrow-right" /><Text style={[styles.note, { color: colors.mutedForeground }]}>You can add products and delivery hours after approval.</Text></Screen>;
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, marginBottom: 19 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  intro: { borderRadius: 22, padding: 17, marginBottom: 23 },
  introIcon: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  introTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, lineHeight: 27 },
  introBody: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, opacity: 0.84, marginTop: 7 },
  section: { fontFamily: 'Inter_700Bold', fontSize: 17, marginBottom: 14, marginTop: 3 },
  note: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', marginTop: 13, marginBottom: 12 },
});