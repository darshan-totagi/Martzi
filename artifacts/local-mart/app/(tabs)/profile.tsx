import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton, Screen, SectionHeader } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { Role, useApp } from '@/context/AppContext';

const roleLabels: Record<Role, string> = { customer: 'Customer', owner: 'Mart owner', admin: 'Super admin' };

export default function ProfileScreen() {
  const colors = useColors();
  const { role, setRole, addresses, orders, currentUser, logout } = useApp();
  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    if (nextRole === 'owner') router.push('/owner');
    if (nextRole === 'admin') router.push('/admin');
  };

  const displayName = currentUser?.name || 'Guest User';
  const displayEmail = currentUser?.email || 'guest@localmart.com';
  const displayInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'GU';

  // @ts-expect-error The scaffold Feather typings omit the store glyph used by Expo at runtime.
  return <Screen><View style={styles.top}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR LOCALMART</Text><Text style={[styles.title, { color: colors.foreground }]}>Profile</Text></View><Pressable onPress={() => Alert.alert('Profile saved', 'Your preferences are synced on this device.')}><Feather name="settings" size={22} color={colors.foreground} /></Pressable></View><View style={[styles.profileCard, { backgroundColor: colors.primary }]}><View style={[styles.profileAvatar, { backgroundColor: colors.accent }]}><Text style={[styles.profileAvatarText, { color: colors.accentForeground }]}>{displayInitials}</Text></View><View style={{ flex: 1 }}><Text style={[styles.profileName, { color: colors.primaryForeground }]}>{displayName}</Text><Text style={[styles.profileEmail, { color: colors.primaryForeground }]}>{displayEmail}</Text><View style={[styles.roleBadge, { backgroundColor: colors.primaryForeground }]}><Text style={[styles.roleBadgeText, { color: colors.primary }]}>{roleLabels[role]} mode</Text></View></View><Feather name="edit-2" size={17} color={colors.primaryForeground} /></View><SectionHeader title="Quick access" /><View style={styles.menuGrid}><MenuItem icon="package" title="My orders" value={`${orders.length}`} onPress={() => router.push('/(tabs)/orders')} /><MenuItem icon="map-pin" title="Saved addresses" value={`${addresses.length}`} onPress={() => Alert.alert('Saved addresses', addresses.map((address) => `${address.label}: ${address.line}`).join('\\n'))} /><MenuItem icon="heart" title="Favorites" value="8" onPress={() => Alert.alert('Favorites', 'Your favorite marts and products will appear here.')} /><MenuItem icon="help-circle" title="Help & support" onPress={() => Alert.alert('We are here to help', 'Chat support is available every day from 8 AM to 10 PM.')} /><MenuItem icon="log-out" title="Sign out" onPress={() => { logout(); router.replace('/login'); }} /></View><SectionHeader title="Try another view" /><View style={[styles.rolePanel, { backgroundColor: colors.secondary }]}><Text style={[styles.rolePanelTitle, { color: colors.foreground }]}>See LocalMart from every side</Text><Text style={[styles.rolePanelBody, { color: colors.mutedForeground }]}>Switch between demo roles to explore the marketplace, mart operations, and platform controls.</Text><View style={styles.roleOptions}><RoleOption role="customer" active={role === 'customer'} onPress={() => switchRole('customer')} /><RoleOption role="owner" active={role === 'owner'} onPress={() => switchRole('owner')} /><RoleOption role="admin" active={role === 'admin'} onPress={() => switchRole('admin')} /></View></View><SectionHeader title="Grow with LocalMart" /><PrimaryButton title="Register your mart" onPress={() => router.push('/register-mart')} icon="store" secondary /><View style={styles.footer}><Text style={[styles.footerText, { color: colors.mutedForeground }]}>LocalMart · made for nearby living</Text><Text style={[styles.footerLinks, { color: colors.mutedForeground }]}>Terms  ·  Privacy  ·  Version 1.0</Text></View></Screen>;
}

function MenuItem({ icon, title, value, onPress }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; value?: string; onPress: () => void }) { const colors = useColors(); return <Pressable onPress={onPress} style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={18} color={colors.primary} /></View><Text style={[styles.menuTitle, { color: colors.foreground }]}>{title}</Text>{value && <Text style={[styles.menuValue, { color: colors.mutedForeground }]}>{value}</Text>}<Feather name="chevron-right" size={16} color={colors.mutedForeground} /></Pressable>; }

// @ts-expect-error The scaffold Feather typings omit the store glyph used by Expo at runtime.
function RoleOption({ role, active, onPress }: { role: Role; active: boolean; onPress: () => void }) { const colors = useColors(); return <Pressable onPress={onPress} style={[styles.roleOption, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}><Feather name={role === 'customer' ? 'shopping-bag' : role === 'owner' ? 'store' : 'shield'} size={16} color={active ? colors.primaryForeground : colors.primary} /><Text style={[styles.roleOptionText, { color: active ? colors.primaryForeground : colors.foreground }]}>{roleLabels[role]}</Text></Pressable>; }

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 17, marginBottom: 22 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, marginTop: 5 },
  profileCard: { minHeight: 127, borderRadius: 23, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileAvatar: { width: 57, height: 57, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  profileEmail: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4, opacity: 0.82 },
  roleBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginTop: 10 },
  roleBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  menuGrid: { gap: 9 },
  menuItem: { minHeight: 61, borderRadius: 16, borderWidth: 1, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  menuValue: { fontFamily: 'Inter_500Medium', fontSize: 12, marginRight: 3 },
  rolePanel: { borderRadius: 20, padding: 15 },
  rolePanelTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  rolePanelBody: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 5 },
  roleOptions: { gap: 8, marginTop: 13 },
  roleOption: { minHeight: 43, borderRadius: 13, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12 },
  roleOptionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  footer: { alignItems: 'center', marginTop: 30, gap: 7 },
  footerText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  footerLinks: { fontFamily: 'Inter_400Regular', fontSize: 10 },
});