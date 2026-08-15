import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton, ProductCard, Pill, QuantityStepper, Screen, SectionHeader } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function MartScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { marts, products, categories, cart, addToCart, clearCart, updateQuantity } = useApp();
  const mart = marts.find((item) => item.id === id) ?? marts[0];
  const martProducts = products.filter((product) => product.martId === mart.id);
  const addProduct = (product: typeof martProducts[number]) => {
    const added = addToCart(product, mart.id);
    if (!added) Alert.alert('Your cart has another mart', 'Each order is fulfilled by one mart so everything arrives together.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear cart & continue', onPress: () => { clearCart(); addToCart(product, mart.id); } }]);
  };
  return <Screen><View style={styles.coverWrap}><Image source={mart.image} style={styles.cover} resizeMode="cover" /><LinearGradient colors={['rgba(20,56,44,0.1)', 'rgba(20,56,44,0.72)']} style={StyleSheet.absoluteFill} /><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.card }]}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable><View style={styles.coverText}><Pill label={mart.isOpen ? 'OPEN NOW' : 'CLOSED'} tone={mart.isOpen ? 'green' : 'muted'} /><Text style={[styles.coverTitle, { color: colors.primaryForeground }]}>{mart.name}</Text><Text style={[styles.coverSubtitle, { color: colors.primaryForeground }]}>{mart.area} · {mart.distance.toFixed(1)} km away</Text></View></View><View style={styles.infoRow}><Info icon="star" title={`${mart.rating}`} body="Rating" /><Info icon="clock" title={mart.deliveryTime} body="Delivery" /><Info icon="truck" title={mart.deliveryFee === 0 ? 'Free' : `₹${mart.deliveryFee}`} body="Delivery fee" /></View><View style={[styles.addressCard, { backgroundColor: colors.secondary }]}><Feather name="map-pin" size={17} color={colors.primary} /><View style={{ flex: 1 }}><Text style={[styles.addressTitle, { color: colors.foreground }]}>{mart.address}, {mart.area}</Text><Text style={[styles.addressBody, { color: colors.mutedForeground }]}>Open daily · Minimum order ₹{mart.minimumOrder}</Text></View><Feather name="chevron-right" size={17} color={colors.primary} /></View>{categories.filter((category) => martProducts.some((product) => product.categoryId === category.id)).map((category) => { const categoryProducts = martProducts.filter((product) => product.categoryId === category.id); return <View key={category.id}><SectionHeader title={category.name} action={`${categoryProducts.length} items`} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>{categoryProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity ?? 0} onAdd={() => addProduct(product)} />)}</ScrollView></View>; })}<View style={{ height: 26 }} />{cart.length > 0 && <PrimaryButton title={`View cart · ₹${useApp().cartSubtotal}`} onPress={() => router.push('/(tabs)/cart')} icon="shopping-cart" />}</Screen>;
}

function Info({ icon, title, body }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; body: string }) { const colors = useColors(); return <View style={styles.info}><Feather name={icon} size={16} color={colors.primary} /><Text style={[styles.infoTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.infoBody, { color: colors.mutedForeground }]}>{body}</Text></View>; }

const styles = StyleSheet.create({
  coverWrap: { height: 244, borderRadius: 26, overflow: 'hidden', position: 'relative', marginTop: 7 },
  cover: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  back: { position: 'absolute', top: 15, left: 15, width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  coverText: { position: 'absolute', left: 18, bottom: 18 },
  coverTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, marginTop: 10 },
  coverSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 5, opacity: 0.9 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 17 },
  info: { flex: 1, alignItems: 'center', gap: 4 },
  infoTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  infoBody: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  addressCard: { borderRadius: 17, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  addressTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  addressBody: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 5 },
  productRow: { paddingRight: 10 },
});