import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Category, Mart, Product } from '@/context/AppContext';

export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: object }) {
  const colors = useColors();
  if (!scroll) return <View style={[styles.screen, { backgroundColor: colors.background }, style]}>{children}</View>;
  const { ScrollView } = require('react-native') as typeof import('react-native');
  return <ScrollView style={[styles.screen, { backgroundColor: colors.background }, style]} contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

export function IconButton({ icon, onPress, color, size = 20, badge }: { icon: React.ComponentProps<typeof Feather>['name']; onPress?: () => void; color?: string; size?: number; badge?: number }) {
  const colors = useColors();
  return (
    <Pressable testID={`icon-${icon}`} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
      <Feather name={icon} size={size} color={color ?? colors.foreground} />
      {!!badge && <View style={[styles.badgeDot, { backgroundColor: colors.accent }]}><Text style={[styles.badgeText, { color: colors.accentForeground }]}>{badge}</Text></View>}
    </Pressable>
  );
}

export function SectionHeader({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>{action && <Pressable onPress={onPress}><Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text></Pressable>}</View>;
}

export function PrimaryButton({ title, onPress, icon, secondary = false, disabled = false }: { title: string; onPress: () => void; icon?: React.ComponentProps<typeof Feather>['name']; secondary?: boolean; disabled?: boolean }) {
  const colors = useColors();
  return <Pressable testID={`button-${title}`} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: secondary ? colors.secondary : colors.primary, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 }, secondary && { borderColor: colors.border, borderWidth: 1 }]}>{icon && <Feather name={icon} size={17} color={secondary ? colors.secondaryForeground : colors.primaryForeground} />}<Text style={[styles.primaryButtonText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>{title}</Text></Pressable>;
}

export function Pill({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'green' | 'muted' }) {
  const colors = useColors();
  const bg = tone === 'green' ? '#dcefe4' : tone === 'muted' ? colors.muted : colors.accent;
  const fg = tone === 'green' ? colors.primary : tone === 'muted' ? colors.mutedForeground : colors.accentForeground;
  return <View style={[styles.pill, { backgroundColor: bg }]}><Text style={[styles.pillText, { color: fg }]}>{label}</Text></View>;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search products, marts or categories' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  const colors = useColors();
  return <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={19} color={colors.mutedForeground} /><TextInput testID="search-input" value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} returnKeyType="search" /></View>;
}

export function CategoryBubble({ category, onPress }: { category: Category; onPress?: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.category, { backgroundColor: category.color, opacity: pressed ? 0.75 : 1 }]}><Text style={styles.categoryIcon}>{category.icon}</Text><Text style={[styles.categoryName, { color: colors.foreground }]} numberOfLines={1}>{category.name}</Text></Pressable>;
}

export function ProductCard({ product, onPress, quantity = 0, onAdd }: { product: Product; onPress?: () => void; quantity?: number; onAdd?: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.productCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 }]}><View style={[styles.productImageWrap, { backgroundColor: colors.muted }]}><Image source={product.image} style={styles.productImage} resizeMode="cover" />{product.price > product.discountPrice && <Pill label={`${Math.round((1 - product.discountPrice / product.price) * 100)}% OFF`} />}</View><Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>{product.name}</Text><Text style={[styles.productMeta, { color: colors.mutedForeground }]}>{product.brand} · {product.unit}</Text><View style={styles.productBottom}><View><Text style={[styles.productPrice, { color: colors.foreground }]}>₹{product.discountPrice}</Text><Text style={[styles.strikePrice, { color: colors.mutedForeground }]}>₹{product.price}</Text></View>{onAdd && <Pressable testID={`add-${product.id}`} onPress={onAdd} style={({ pressed }) => [styles.addButton, { backgroundColor: colors.primary, opacity: pressed ? 0.72 : 1 }]}>{quantity > 0 ? <Text style={[styles.addButtonText, { color: colors.primaryForeground }]}>{quantity} in cart</Text> : <Feather name="plus" size={18} color={colors.primaryForeground} />}</Pressable>}</View></Pressable>;
}

export function MartCard({ mart, onPress }: { mart: Mart; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.martCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.92 : 1 }]}><Image source={mart.image} style={styles.martImage} resizeMode="cover" /><View style={styles.martInfo}><View style={styles.martTitleRow}><Text style={[styles.martName, { color: colors.foreground }]} numberOfLines={1}>{mart.name}</Text>{mart.offer && <Pill label={mart.offer} />}</View><Text style={[styles.martArea, { color: colors.mutedForeground }]}>{mart.area} · {mart.distance.toFixed(1)} km away</Text><View style={styles.martStats}><View style={styles.stat}><Feather name="star" size={13} color={colors.accentForeground} /><Text style={[styles.statText, { color: colors.foreground }]}>{mart.rating}</Text></View><View style={styles.stat}><Feather name="clock" size={13} color={colors.mutedForeground} /><Text style={[styles.statText, { color: colors.mutedForeground }]}>{mart.deliveryTime}</Text></View><Text style={[styles.openStatus, { color: mart.isOpen ? colors.primary : colors.destructive }]}>{mart.isOpen ? 'Open now' : 'Closed'}</Text></View></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></Pressable>;
}

export function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (quantity: number) => void }) {
  const colors = useColors();
  return <View style={styles.stepper}><Pressable onPress={() => onChange(quantity - 1)} style={[styles.stepButton, { backgroundColor: colors.secondary }]}><Feather name="minus" size={15} color={colors.secondaryForeground} /></Pressable><Text style={[styles.stepValue, { color: colors.foreground }]}>{quantity}</Text><Pressable onPress={() => onChange(quantity + 1)} style={[styles.stepButton, { backgroundColor: colors.primary }]}><Feather name="plus" size={15} color={colors.primaryForeground} /></Pressable></View>;
}

export function EmptyState({ icon = 'shopping-bag', title, body, action, onAction }: { icon?: React.ComponentProps<typeof Feather>['name']; title: string; body: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={25} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{body}</Text>{action && onAction && <PrimaryButton title={action} onPress={onAction} secondary />}</View>;
}

export function OrderStatusBadge({ status }: { status: string }) {
  const colors = useColors();
  const delivered = status === 'Delivered';
  return <View style={[styles.statusBadge, { backgroundColor: delivered ? '#dcefe4' : colors.accent }]}><View style={[styles.statusDot, { backgroundColor: delivered ? colors.primary : colors.accentForeground }]} /><Text style={[styles.statusText, { color: delivered ? colors.primary : colors.accentForeground }]}>{status}</Text></View>;
}

export function Field({ label, value, onChangeText, placeholder, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'phone-pad' | 'numeric' }) {
  const colors = useColors();
  return <View style={styles.field}><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} keyboardType={keyboardType} style={[styles.fieldInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenContent: { paddingHorizontal: 18, paddingBottom: 116 },
  iconButton: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badgeDot: { position: 'absolute', top: -3, right: -2, minWidth: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 13 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 19 },
  sectionAction: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  primaryButton: { minHeight: 50, borderRadius: 17, paddingHorizontal: 20, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  pill: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  pillText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.2 },
  searchBar: { minHeight: 50, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14 },
  category: { width: 82, height: 92, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  categoryIcon: { fontSize: 29, marginBottom: 7 },
  categoryName: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textAlign: 'center' },
  productCard: { width: 163, minHeight: 252, borderRadius: 20, borderWidth: 1, padding: 10, marginRight: 12 },
  productImage: { width: '100%', height: '100%' },
  productImageWrap: { height: 122, borderRadius: 14, overflow: 'hidden', position: 'relative', marginBottom: 10 },
  productName: { fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 19 },
  productMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  productBottom: { marginTop: 'auto', paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productPrice: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  strikePrice: { fontFamily: 'Inter_400Regular', textDecorationLine: 'line-through', fontSize: 11, marginTop: 2 },
  addButton: { minWidth: 38, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 9 },
  addButtonText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  martCard: { borderRadius: 20, borderWidth: 1, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 11 },
  martImage: { width: 76, height: 76, borderRadius: 15 },
  martInfo: { flex: 1 },
  martTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  martName: { fontFamily: 'Inter_700Bold', fontSize: 14, flexShrink: 1 },
  martArea: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  martStats: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  openStatus: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginLeft: 'auto' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  stepButton: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepValue: { fontFamily: 'Inter_700Bold', fontSize: 14, minWidth: 15, textAlign: 'center' },
  emptyState: { borderRadius: 23, borderWidth: 1, padding: 26, alignItems: 'center', marginTop: 24 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7, marginBottom: 18, maxWidth: 270 },
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  field: { marginBottom: 14 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginBottom: 7 },
  fieldInput: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, minHeight: 48, fontFamily: 'Inter_400Regular', fontSize: 14 },
});

export const uiStyles = styles;