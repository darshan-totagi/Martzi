import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { CategoryBubble, MartCard, ProductCard, Screen, SearchBar, SectionHeader } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function ExploreScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ category?: string }>();
  const { products, marts, categories, cart } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(params.category ?? 'all');
  const query = search.toLowerCase().trim();
  const filteredProducts = useMemo(() => products.filter((product) => (activeCategory === 'all' || product.categoryId === activeCategory) && (!query || `${product.name} ${product.brand}`.toLowerCase().includes(query))), [activeCategory, products, query]);
  const filteredMarts = marts.filter((mart) => mart.approvalStatus === 'approved' && (!query || `${mart.name} ${mart.area}`.toLowerCase().includes(query)));
  return (
    <Screen>
      <View style={styles.top}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>DISCOVER</Text><Text style={[styles.title, { color: colors.foreground }]}>Find your next staple.</Text></View><Pressable onPress={() => router.push('/(tabs)/profile')} style={[styles.filterButton, { backgroundColor: colors.secondary }]}><Feather name="sliders" size={18} color={colors.secondaryForeground} /></Pressable></View>
      <SearchBar value={search} onChangeText={setSearch} />
      <SectionHeader title="Categories" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}><Pressable onPress={() => setActiveCategory('all')} style={[styles.allCategory, { backgroundColor: activeCategory === 'all' ? colors.primary : colors.secondary }]}><Feather name="grid" size={17} color={activeCategory === 'all' ? colors.primaryForeground : colors.secondaryForeground} /><Text style={[styles.allCategoryText, { color: activeCategory === 'all' ? colors.primaryForeground : colors.secondaryForeground }]}>All</Text></Pressable>{categories.map((category) => <CategoryBubble key={category.id} category={category} onPress={() => setActiveCategory(category.id)} />)}</ScrollView>
      <SectionHeader title={query ? `Results for “${search}”` : 'Nearby marts'} action="Sort" onPress={() => undefined} />
      {!query && filteredMarts.map((mart) => <MartCard key={mart.id} mart={mart} onPress={() => router.push(`/mart/${mart.id}`)} />)}
      {(query || filteredProducts.length > 0) && <><SectionHeader title="Products" action={`${filteredProducts.length} found`} /><View style={styles.productGrid}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart.find((item) => item.product.id === product.id)?.quantity ?? 0} onPress={() => router.push(`/mart/${product.martId}`)} onAdd={() => router.push(`/mart/${product.martId}`)} />)}</View></>}
      {!query && <View style={[styles.tip, { backgroundColor: colors.secondary }]}><Feather name="compass" size={19} color={colors.primary} /><Text style={[styles.tipText, { color: colors.secondaryForeground }]}>Everything here is within 5 km of your delivery spot.</Text></View>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 17, marginBottom: 18 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.6, marginTop: 5 },
  filterButton: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  row: { paddingRight: 8 },
  allCategory: { height: 92, width: 66, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 7, marginRight: 10 },
  allCategoryText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tip: { marginTop: 25, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipText: { fontFamily: 'Inter_500Medium', fontSize: 12, flex: 1, lineHeight: 17 },
});