import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

export type Role = 'customer' | 'owner' | 'admin';
export type PaymentMethod = 'Cash on delivery' | 'UPI' | 'Online payment';
export type OrderStatus = 'Order placed' | 'Mart accepted' | 'Preparing order' | 'Ready for delivery' | 'Out for delivery' | 'Delivered';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Mart = {
  id: string;
  name: string;
  rating: number;
  distance: number;
  deliveryTime: string;
  minimumOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  offer?: string;
  address: string;
  area: string;
  approvalStatus: ApprovalStatus;
  image: ImageSourcePropType;
};

export type Product = {
  id: string;
  martId: string;
  categoryId: string;
  name: string;
  brand: string;
  unit: string;
  price: number;
  discountPrice: number;
  stock: number;
  image: ImageSourcePropType;
  featured?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Address = {
  id: string;
  label: string;
  line: string;
  area: string;
  city: string;
  pincode: string;
};

export type Order = {
  id: string;
  martId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
};

const produceImage = require('../assets/images/produce-bag.jpg') as ImageSourcePropType;

export const categories: Category[] = [
  { id: 'fruits', name: 'Fruits & veg', icon: '🍋', color: '#f8e6b7' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', color: '#dcefe9' },
  { id: 'bakery', name: 'Bakery', icon: '🥖', color: '#f6d7b8' },
  { id: 'beverages', name: 'Beverages', icon: '☕', color: '#ded6ee' },
  { id: 'snacks', name: 'Snacks', icon: '🥨', color: '#f1d8da' },
  { id: 'household', name: 'Household', icon: '🧺', color: '#d5e5ef' },
];

export const marts: Mart[] = [
  {
    id: 'sri-lakshmi',
    name: 'Sri Lakshmi Super Mart',
    rating: 4.6,
    distance: 1.8,
    deliveryTime: '25–35 min',
    minimumOrder: 199,
    deliveryFee: 30,
    isOpen: true,
    offer: '10% OFF',
    address: '19, 1st Main Road',
    area: 'Electronic City',
    approvalStatus: 'approved',
    image: produceImage,
  },
  {
    id: 'green-basket',
    name: 'Green Basket Market',
    rating: 4.8,
    distance: 2.4,
    deliveryTime: '20–30 min',
    minimumOrder: 249,
    deliveryFee: 0,
    isOpen: true,
    offer: 'FREE DELIVERY',
    address: '8, Neeladri Road',
    area: 'Hosur Road',
    approvalStatus: 'approved',
    image: produceImage,
  },
  {
    id: 'daily-needs',
    name: 'Daily Needs & More',
    rating: 4.3,
    distance: 4.1,
    deliveryTime: '35–45 min',
    minimumOrder: 149,
    deliveryFee: 25,
    isOpen: false,
    address: '44, Begur Main Road',
    area: 'Singasandra',
    approvalStatus: 'approved',
    image: produceImage,
  },
];

export const products: Product[] = [
  { id: 'milk', martId: 'sri-lakshmi', categoryId: 'dairy', name: 'Farm fresh milk', brand: 'Nandini', unit: '1 litre', price: 58, discountPrice: 54, stock: 24, image: produceImage, featured: true },
  { id: 'atta', martId: 'sri-lakshmi', categoryId: 'fruits', name: 'Whole wheat atta', brand: 'Aashirvaad', unit: '5 kg', price: 380, discountPrice: 320, stock: 12, image: produceImage, featured: true },
  { id: 'banana', martId: 'sri-lakshmi', categoryId: 'fruits', name: 'Robusta bananas', brand: 'Local farm', unit: '1 dozen', price: 74, discountPrice: 59, stock: 18, image: produceImage, featured: true },
  { id: 'paneer', martId: 'sri-lakshmi', categoryId: 'dairy', name: 'Fresh paneer', brand: 'Milky Mist', unit: '200 g', price: 104, discountPrice: 89, stock: 10, image: produceImage },
  { id: 'coffee', martId: 'sri-lakshmi', categoryId: 'beverages', name: 'Filter coffee powder', brand: 'Suma', unit: '250 g', price: 155, discountPrice: 139, stock: 8, image: produceImage },
  { id: 'tomato', martId: 'green-basket', categoryId: 'fruits', name: 'Hybrid tomatoes', brand: 'Green Basket', unit: '1 kg', price: 62, discountPrice: 48, stock: 30, image: produceImage, featured: true },
  { id: 'bread', martId: 'green-basket', categoryId: 'bakery', name: 'Milk sandwich bread', brand: 'Modern', unit: '400 g', price: 48, discountPrice: 42, stock: 15, image: produceImage },
  { id: 'chips', martId: 'green-basket', categoryId: 'snacks', name: 'Classic salted chips', brand: 'Too Yumm', unit: '100 g', price: 30, discountPrice: 25, stock: 20, image: produceImage },
  { id: 'detergent', martId: 'green-basket', categoryId: 'household', name: 'Matic detergent', brand: 'Surf Excel', unit: '2 kg', price: 390, discountPrice: 335, stock: 7, image: produceImage },
];

const defaultAddress: Address = {
  id: 'home',
  label: 'Home',
  line: 'Flat 402, SJR Bluewaters',
  area: 'Electronic City Phase 1',
  city: 'Bengaluru',
  pincode: '560100',
};

type PersistedState = {
  cart: CartItem[];
  orders: Order[];
  role: Role;
  selectedLocation: string;
  addresses: Address[];
  localMarts: Mart[];
};

type AppContextValue = {
  hydrated: boolean;
  role: Role;
  setRole: (role: Role) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  categories: Category[];
  marts: Mart[];
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  cartMartId?: string;
  cartSubtotal: number;
  orders: Order[];
  addresses: Address[];
  addToCart: (product: Product, martId: string) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (address: Address, paymentMethod: PaymentMethod) => Order;
  advanceOrder: (orderId: string) => void;
  addAddress: (address: Address) => void;
  addMart: (mart: Mart) => void;
  approveMart: (martId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = 'localmart-state-v1';

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [role, setRole] = useState<Role>('customer');
  const [selectedLocation, setSelectedLocation] = useState('Electronic City, Bengaluru');
  const [addresses, setAddresses] = useState<Address[]>([defaultAddress]);
  const [localMarts, setLocalMarts] = useState<Mart[]>(marts);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          const parsed = JSON.parse(saved) as PersistedState;
          setCart(parsed.cart ?? []);
          setOrders(parsed.orders ?? []);
          setRole(parsed.role ?? 'customer');
          setSelectedLocation(parsed.selectedLocation ?? 'Electronic City, Bengaluru');
          setAddresses(parsed.addresses?.length ? parsed.addresses : [defaultAddress]);
          setLocalMarts(parsed.localMarts?.length ? parsed.localMarts : marts);
        }
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { cart, orders, role, selectedLocation, addresses, localMarts };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, cart, orders, role, selectedLocation, addresses, localMarts]);

  const addToCart = (product: Product, martId: string) => {
    if (cart.length > 0 && cart[0].product.martId !== martId) return false;
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      return [...current, { product, quantity: 1 }];
    });
    return true;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (address: Address, paymentMethod: PaymentMethod) => {
    const martId = cart[0]?.product.martId ?? marts[0].id;
    const mart = localMarts.find((item) => item.id === martId) ?? marts[0];
    const subtotal = cartSubtotal;
    const discount = cart.reduce((sum, item) => sum + (item.product.price - item.product.discountPrice) * item.quantity, 0);
    const deliveryFee = subtotal >= 499 || mart.deliveryFee === 0 ? 0 : mart.deliveryFee;
    const order: Order = {
      id: `LM-${Date.now().toString().slice(-6)}`,
      martId,
      items: cart,
      subtotal,
      discount,
      deliveryFee,
      platformFee: 5,
      total: subtotal + deliveryFee + 5,
      address,
      paymentMethod,
      status: 'Order placed',
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    setCart([]);
    return order;
  };

  const advanceOrder = (orderId: string) => {
    const statusOrder: OrderStatus[] = ['Order placed', 'Mart accepted', 'Preparing order', 'Ready for delivery', 'Out for delivery', 'Delivered'];
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId) return order;
      const nextIndex = Math.min(statusOrder.indexOf(order.status) + 1, statusOrder.length - 1);
      return { ...order, status: statusOrder[nextIndex] };
    }));
  };

  const value = useMemo<AppContextValue>(() => ({
    hydrated, role, setRole, selectedLocation, setSelectedLocation,
    categories, marts: localMarts, products, cart, cartCount, cartMartId: cart[0]?.product.martId,
    cartSubtotal, orders, addresses, addToCart, updateQuantity,
    removeFromCart: (productId) => setCart((current) => current.filter((item) => item.product.id !== productId)),
    clearCart: () => setCart([]),
    placeOrder, advanceOrder,
    addAddress: (address) => setAddresses((current) => [...current, address]),
    addMart: (mart) => setLocalMarts((current) => [...current, mart]),
    approveMart: (martId) => setLocalMarts((current) => current.map((mart) => mart.id === martId ? { ...mart, approvalStatus: 'approved', isOpen: true } : mart)),
  }), [hydrated, role, selectedLocation, localMarts, cart, cartCount, cartSubtotal, orders, addresses]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}