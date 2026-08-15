import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryBubble, MartCard, Pill, ProductCard, Screen, SectionHeader, SearchBar } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { categories, useApp } from '@/context/AppContext';

const heroImage = require('../../assets/images/hero-groceries.jpg');

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedLocation, setSelectedLocation, marts, products, cart, cartCount, cartSubtotal } = useApp();
  const [search, setSearch] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const nearbyMarts = marts.filter((mart) => mart.approvalStatus === 'approved' && mart.distance <= 5).sort((a, b) => a.distance - b.distance);
  const featuredProducts = products.filter((product) => product.featured);

  useEffect(() => { void requestLocation(false); }, []);

  async function requestLocation(showFeedback: boolean) {
    if (locationLoading) return;
    setLocationLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        if (showFeedback) Alert.alert('Location stays flexible', 'You can keep browsing Electronic City or choose another delivery area from the location pill.');
        return;
      }
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const places = await Location.reverseGeocodeAsync({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      const place = places[0];
      const nextLocation = [place?.district ?? place?.subregion, place?.city ?? place?.region].filter(Boolean).join(', ');
      if (nextLocation) setSelectedLocation(nextLocation);
    } catch {
      if (showFeedback) Alert.alert('Could not find your location', 'You can still browse nearby marts and choose an area manually.');
    } finally {
      setLocationLoading(false);
    }
  }

  const searchResults = useMemo(() => search.trim() ? products.filter((product) => `${product.name} ${product.brand}`.toLowerCase().includes(search.toLowerCase())) : [], [products, search]);

  return (
    <Screen style={{ paddingTop: insets.top }}>
      <View style={styles.header}>
        <Pressable onPress={() => void requestLocation(true)} style={styles.locationButton}>
          <View style={[styles.locationPin, { backgroundColor: colors.accent }]}><Feather name="map-pin" size={15} color={colors.accentForeground} /></View>
          <View><Text style={[styles.deliveringLabel, { color: colors.mutedForeground }]}>Delivering to</Text><Text style={[styles.locationText, { color: colors.foreground }]} numberOfLines={1}>{locationLoading ? 'Finding you…' : selectedLocation}</Text></View>
          <Feather name="chevron-down" size={17} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.headerActions}><Pressable onPress={() => Alert.alert('You are all caught up', 'Order updates and fresh offers will appear here.')} style={[styles.headerIcon, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="bell" size={19} color={colors.foreground} /><View style={[styles.notificationDot, { backgroundColor: colors.accent }]} /></Pressable><Pressable onPress={() => router.push('/(tabs)/profile')} style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>AR</Text></Pressable></View>
      </View>
      <View style={styles.greeting}><Text style={[styles.greetingTitle, { color: colors.foreground }]}>Good morning, Ananya</Text><Text style={[styles.greetingBody, { color: colors.mutedForeground }]}>Your neighborhood is looking fresh today.</Text></View>
      <SearchBar value={search} onChangeText={setSearch} />
      {searchResults.length > 0 && <View style={[styles.searchResults, { backgroundColor: colors.card, borderColor: colors.border }]}>{searchResults.slice(0, 3).map((product) => <Pressable key={product.id} onPress={() => router.push(`/mart/${product.martId}`)} style={styles.searchResult}><Image source={product.image} style={styles.searchResultImage} /><View style={{ flex: 1 }}><Text style={[styles.searchResultTitle, { color: colors.foreground }]}>{product.name}</Text><Text style={[styles.searchResultMeta, { color: colors.mutedForeground }]}>{product.brand} · ₹{product.discountPrice}</Text></View><Feather name="arrow-up-right" size={16} color={colors.primary} /></Pressable>)}</View>}
      <Pressable style={styles.hero} onPress={() => router.push('/(tabs)/explore')}><Image source={heroImage} style={StyleSheet.absoluteFill} resizeMode="cover" /><LinearGradient colors={['rgba(21,57,45,0.92)', 'rgba(21,57,45,0.25)']} start={{ x: 0, y: 0.6 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} /><View style={styles.heroCopy}><Pill label="THIS WEEKEND" /><Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Fresh picks, closer than you think.</Text><Text style={[styles.heroBody, { color: colors.primaryForeground }]}>Save up to 30% on everyday essentials from marts near you.</Text><View style={[styles.heroCta, { backgroundColor: colors.accent }]}><Text style={[styles.heroCtaText, { color: colors.accentForeground }]}>Shop deals</Text><Feather name="arrow-up-right" size={15} color={colors.accentForeground} /></View></View></Pressable>
      <SectionHeader title="Shop by category" action="See all" onPress={() => router.push('/(tabs)/explore')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>{categories.map((category) => <CategoryBubble key={category.id} category={category} onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: category.id } })} />)}</ScrollView>
      <SectionHeader title="Marts near you" action="View map" onPress={() => void requestLocation(true)} />
      {nearbyMarts.map((mart) => <MartCard key={mart.id} mart={mart} onPress={() => router.push(`/mart/${mart.id}`)} />)}
      <View style={[styles.offerStrip, { backgroundColor: colors.secondary }]}><View style={[styles.offerIcon, { backgroundColor: colors.accent }]}><Feather name="truck" size={19} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.offerTitle, { color: colors.foreground }]}>Free delivery on ₹499+</Text><Text style={[styles.offerBody, { color: colors.mutedForeground }]}>A little more in the basket, zero delivery fee.</Text></View><Feather name="chevron-right" size={18} color={colors.primary} /></View>
      <SectionHeader title="Popular this week" action="Browse all" onPress={() => router.push('/(tabs)/explore')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>{featuredProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity ?? 0} onPress={() => router.push(`/mart/${product.martId}`)} onAdd={() => router.push(`/mart/${product.martId}`)} />)}</ScrollView>
      {cartCount > 0 && <Pressable onPress={() => router.push('/(tabs)/cart')} style={[styles.floatingCart, { backgroundColor: colors.primary }]}><View><Text style={[styles.floatingCartLabel, { color: colors.primaryForeground }]}>Your cart · {cartCount} items</Text><Text style={[styles.floatingCartTotal, { color: colors.primaryForeground }]}>₹{cartSubtotal}</Text></View><View style={[styles.floatingCartArrow, { backgroundColor: colors.accent }]}><Feather name="arrow-right" size={17} color={colors.accentForeground} /></View></Pressable>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingBottom: 5 },
  locationButton: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  locationPin: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  deliveringLabel: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  locationText: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 2, maxWidth: 190 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  headerIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  notificationDot: { width: 6, height: 6, borderRadius: 3, position: 'absolute', top: 7, right: 8 },
  avatar: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  greeting: { marginTop: 22, marginBottom: 16 },
  greetingTitle: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.6 },
  greetingBody: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 5 },
  searchResults: { borderWidth: 1, borderRadius: 16, marginTop: 6, overflow: 'hidden' },
  searchResult: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee5d8' },
  searchResultImage: { width: 36, height: 36, borderRadius: 10 },
  searchResultTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  searchResultMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 },
  hero: { height: 212, borderRadius: 24, overflow: 'hidden', marginTop: 18 },
  heroCopy: { padding: 20, width: '76%', flex: 1, justifyContent: 'center' },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 30, marginTop: 12 },
  heroBody: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 7, opacity: 0.9 },
  heroCta: { alignSelf: 'flex-start', flexDirection: 'row', gap: 5, alignItems: 'center', borderRadius: 11, paddingHorizontal: 11, paddingVertical: 8, marginTop: 15 },
  heroCtaText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  horizontalRow: { paddingRight: 10 },
  offerStrip: { marginTop: 24, borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  offerIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  offerBody: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  floatingCart: { position: 'absolute', left: 18, right: 18, bottom: 96, borderRadius: 18, padding: 10, paddingLeft: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowOpacity: 0.16, shadowRadius: 12, elevation: 6 },
  floatingCartLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, opacity: 0.86 },
  floatingCartTotal: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 3 },
  floatingCartArrow: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
