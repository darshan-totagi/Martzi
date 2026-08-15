import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Field, PrimaryButton, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function AddProductScreen() {
  const colors = useColors();
  const { categories, marts, currentUser, addProductToMart } = useApp();

  // Find owned mart if user is an owner
  const ownedMart = marts.find(m => m.ownerId === currentUser?.id);

  const [selectedMartId, setSelectedMartId] = useState(
    currentUser?.role === 'admin' ? (marts[0]?.id || '') : (ownedMart?.id || '')
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [unit, setUnit] = useState('500 g');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('20');

  // Verify owner has a mart
  if (currentUser?.role === 'owner' && !ownedMart) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={32} color={colors.destructive} />
          <Text style={[styles.errorTitle, { color: colors.foreground }]}>No Mart Registered</Text>
          <Text style={[styles.errorBody, { color: colors.mutedForeground }]}>
            You must register your mart and have it approved before adding products.
          </Text>
          <PrimaryButton title="Go Back" onPress={() => router.back()} secondary />
        </View>
      </Screen>
    );
  }

  const handleSubmit = () => {
    if (!name.trim() || !brand.trim() || !unit.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('Incomplete details', 'Please fill in all product details.');
      return;
    }

    const priceNum = Number(price);
    const discountPriceNum = discountPrice ? Number(discountPrice) : priceNum;
    const stockNum = Number(stock);

    if (isNaN(priceNum) || isNaN(discountPriceNum) || isNaN(stockNum)) {
      Alert.alert('Invalid details', 'Price, discount price, and stock must be valid numbers.');
      return;
    }

    if (discountPriceNum > priceNum) {
      Alert.alert('Invalid pricing', 'Discount price cannot be higher than the original price.');
      return;
    }

    addProductToMart(selectedMartId, {
      categoryId: selectedCategoryId,
      name,
      brand,
      unit,
      price: priceNum,
      discountPrice: discountPriceNum,
      stock: stockNum,
      featured: false
    });

    const targetMart = marts.find(m => m.id === selectedMartId);
    Alert.alert(
      'Product added!',
      `"${name}" was successfully added to ${targetMart?.name || 'your mart'}!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <Screen scroll={true}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.secondary }]}>
          <Feather name="arrow-left" size={19} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Add New Product</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Target Mart Selection (Admin only) */}
      {currentUser?.role === 'admin' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Mart</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {marts.map((m) => {
              const isActive = selectedMartId === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedMartId(m.id)}
                  style={[
                    styles.optionButton,
                    { borderColor: colors.border },
                    isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                >
                  <Text style={[styles.optionText, { color: isActive ? colors.primaryForeground : colors.foreground }]}>
                    {m.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {categories.map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={[
                  styles.optionButton,
                  { borderColor: colors.border },
                  isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.optionText, { color: isActive ? colors.primaryForeground : colors.foreground }]}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Fields */}
      <View style={styles.form}>
        <Field
          label="Product Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Fresh Mangoes"
        />

        <Field
          label="Brand"
          value={brand}
          onChangeText={setBrand}
          placeholder="e.g. Local Orchard"
        />

        <View style={styles.splitRow}>
          <View style={{ flex: 1 }}>
            <Field
              label="Unit / Size"
              value={unit}
              onChangeText={setUnit}
              placeholder="e.g. 500 g"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Initial Stock"
              value={stock}
              onChangeText={setStock}
              placeholder="20"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.splitRow}>
          <View style={{ flex: 1 }}>
            <Field
              label="Original Price (₹)"
              value={price}
              onChangeText={setPrice}
              placeholder="100"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Discount Price (₹)"
              value={discountPrice}
              onChangeText={setDiscountPrice}
              placeholder="85"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={{ height: 10 }} />
        <PrimaryButton
          title="Add Product to Catalog"
          onPress={handleSubmit}
          icon="plus-circle"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, marginBottom: 19 },
  back: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    gap: 8,
    paddingRight: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  optionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  categoryIcon: {
    fontSize: 14,
  },
  form: {
    gap: 15,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
    gap: 12,
  },
  errorTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  errorBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
});
