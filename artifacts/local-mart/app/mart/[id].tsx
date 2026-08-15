import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton, Pill, Screen } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function MartScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { marts, products, categories, cart, addToCart, clearCart } = useApp();
  const mart = marts.find((item) => item.id === id) ?? marts[0];
  
  // Filter products for this mart
  const martProducts = products.filter((product) => product.martId === mart.id);
  
  // Find active categories that actually contain products in this mart
  const activeCategories = categories.filter((category) => 
    martProducts.some((product) => product.categoryId === category.id)
  );

  // Keep track of the currently selected category
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  // Set the default selected category when the screen loads or switching marts
  React.useEffect(() => {
    if (activeCategories.length > 0) {
      // Default to the first category that has products
      setSelectedCategoryId(activeCategories[0].id);
    }
  }, [mart.id]);

  // Sync selection if the currently selected category becomes invalid (e.g. not in activeCategories)
  React.useEffect(() => {
    if (activeCategories.length > 0 && !activeCategories.some(c => c.id === selectedCategoryId)) {
      setSelectedCategoryId(activeCategories[0].id);
    }
  }, [activeCategories, selectedCategoryId]);

  const selectedCategory = activeCategories.find((c) => c.id === selectedCategoryId) || activeCategories[0];
  const selectedCategoryProducts = selectedCategory 
    ? martProducts.filter((product) => product.categoryId === selectedCategory.id) 
    : [];

  const addProduct = (product: typeof martProducts[number]) => {
    const added = addToCart(product, mart.id);
    if (!added) {
      Alert.alert(
        'Your cart has another mart',
        'Each order is fulfilled by one mart so everything arrives together.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear cart & continue', 
            onPress: () => { 
              clearCart(); 
              addToCart(product, mart.id); 
            } 
          }
        ]
      );
    }
  };

  return (
    <Screen>
      {/* Cover Image and Header */}
      <View style={styles.coverWrap}>
        <Image source={mart.image} style={styles.cover} resizeMode="cover" />
        <LinearGradient colors={['rgba(20,56,44,0.1)', 'rgba(20,56,44,0.72)']} style={StyleSheet.absoluteFill} />
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={19} color={colors.foreground} />
        </Pressable>
        <View style={styles.coverText}>
          <Pill label={mart.isOpen ? 'OPEN NOW' : 'CLOSED'} tone={mart.isOpen ? 'green' : 'muted'} />
          <Text style={[styles.coverTitle, { color: colors.primaryForeground }]}>{mart.name}</Text>
          <Text style={[styles.coverSubtitle, { color: colors.primaryForeground }]}>
            {mart.area} · {mart.distance.toFixed(1)} km away
          </Text>
        </View>
      </View>

      {/* Info Stats */}
      <View style={styles.infoRow}>
        <Info icon="star" title={`${mart.rating}`} body="Rating" />
        <Info icon="clock" title={mart.deliveryTime} body="Delivery" />
        <Info icon="truck" title={mart.deliveryFee === 0 ? 'Free' : `₹${mart.deliveryFee}`} body="Delivery fee" />
      </View>

      {/* Address Card */}
      <View style={[styles.addressCard, { backgroundColor: colors.secondary }]}>
        <Feather name="map-pin" size={17} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.addressTitle, { color: colors.foreground }]}>{mart.address}, {mart.area}</Text>
          <Text style={[styles.addressBody, { color: colors.mutedForeground }]}>
            Open daily · Minimum order ₹{mart.minimumOrder}
          </Text>
        </View>
        <Feather name="chevron-right" size={17} color={colors.primary} />
      </View>

      {/* Catalog Split Layout */}
      <View style={styles.catalogContainer}>
        {/* Left Sidebar Categories */}
        <View style={[styles.sidebar, { borderRightColor: colors.border }]}>
          {activeCategories.map((cat) => {
            const isActive = cat.id === selectedCategoryId;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={({ pressed }) => [
                  styles.sidebarItem,
                  { backgroundColor: isActive ? colors.secondary : 'transparent' },
                  pressed && { opacity: 0.8 }
                ]}
              >
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
                <Text style={styles.sidebarIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.sidebarLabel,
                    { color: isActive ? colors.foreground : colors.mutedForeground },
                    isActive && styles.sidebarLabelActive
                  ]}
                  numberOfLines={2}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Right Products Content */}
        <View style={styles.productContent}>
          <Text style={[styles.categoryTitle, { color: colors.foreground }]}>
            {selectedCategory?.name || 'Products'}
          </Text>
          {selectedCategoryProducts.length > 0 ? (
            selectedCategoryProducts.map((product) => (
              <CatalogProductRow
                key={product.id}
                product={product}
                quantity={cart.find((item) => item.product.id === product.id)?.quantity ?? 0}
                onAdd={() => addProduct(product)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No items available in this category.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: 26 }} />
      {cart.length > 0 && (
        <PrimaryButton 
          title={`View cart · ₹${useApp().cartSubtotal}`} 
          onPress={() => router.push('/(tabs)/cart')} 
          icon="shopping-cart" 
        />
      )}
    </Screen>
  );
}

function Info({ icon, title, body }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; body: string }) {
  const colors = useColors();
  return (
    <View style={styles.info}>
      <Feather name={icon} size={16} color={colors.primary} />
      <Text style={[styles.infoTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.infoBody, { color: colors.mutedForeground }]}>{body}</Text>
    </View>
  );
}

function CatalogProductRow({ product, quantity, onAdd }: { product: any; quantity: number; onAdd: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.catalogRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.catalogProductImageWrap, { backgroundColor: colors.muted }]}>
        <Image source={product.image} style={styles.catalogProductImage} resizeMode="cover" />
      </View>
      <View style={styles.catalogProductInfo}>
        <Text style={[styles.catalogProductName, { color: colors.foreground }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.catalogProductMeta, { color: colors.mutedForeground }]}>{product.brand} · {product.unit}</Text>
        <View style={styles.catalogProductPriceRow}>
          <Text style={[styles.catalogProductPrice, { color: colors.foreground }]}>₹{product.discountPrice}</Text>
          {product.price > product.discountPrice && (
            <Text style={[styles.catalogStrikePrice, { color: colors.mutedForeground }]}>₹{product.price}</Text>
          )}
        </View>
      </View>
      <Pressable 
        testID={`add-${product.id}`}
        onPress={onAdd} 
        style={({ pressed }) => [
          styles.catalogAddButton, 
          { backgroundColor: colors.primary, opacity: pressed ? 0.72 : 1 }
        ]}
      >
        {quantity > 0 ? (
          <Text style={[styles.catalogAddButtonText, { color: colors.primaryForeground }]}>{quantity} in cart</Text>
        ) : (
          <Feather name="plus" size={16} color={colors.primaryForeground} />
        )}
      </Pressable>
    </View>
  );
}

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
  
  catalogContainer: {
    flexDirection: 'row',
    marginTop: 15,
    minHeight: 450,
  },
  sidebar: {
    width: 90,
    borderRightWidth: 1,
    paddingRight: 6,
    paddingVertical: 10,
    alignItems: 'stretch',
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '15%',
    height: '70%',
    width: 4,
    borderRadius: 2,
  },
  sidebarIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  sidebarLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textAlign: 'center',
  },
  sidebarLabelActive: {
    fontFamily: 'Inter_700Bold',
  },
  productContent: {
    flex: 1,
    paddingLeft: 14,
    paddingVertical: 10,
  },
  categoryTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  catalogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  catalogProductImageWrap: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
  },
  catalogProductImage: {
    width: '100%',
    height: '100%',
  },
  catalogProductInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  catalogProductName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    lineHeight: 17,
  },
  catalogProductMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginTop: 2,
  },
  catalogProductPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  catalogProductPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  catalogStrikePrice: {
    fontFamily: 'Inter_400Regular',
    textDecorationLine: 'line-through',
    fontSize: 10,
  },
  catalogAddButton: {
    minWidth: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  catalogAddButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
});