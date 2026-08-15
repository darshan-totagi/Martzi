import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType, Platform } from 'react-native';

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
  ownerId?: string; // Links a mart to its owner user ID
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

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  createdAt?: string;
};

const produceImage = require('../assets/images/produce-bag.jpg') as ImageSourcePropType;

const getApiUrl = (path: string): string => {
  if (process.env.EXPO_PUBLIC_DOMAIN) {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    const protocol = (domain.startsWith('localhost') || domain.startsWith('127.0.0.1') || domain.startsWith('192.168.')) ? 'http' : 'https';
    return `${protocol}://${domain}${path}`;
  }
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:5000${path}`;
};

export const categories: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: '🌾', color: '#e2f0d9' },
  { id: 'fruits', name: 'Fruits & veg', icon: '🍋', color: '#f8e6b7' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', color: '#dcefe9' },
  { id: 'bakery', name: 'Bakery', icon: '🥖', color: '#f6d7b8' },
  { id: 'beverages', name: 'Beverages', icon: '☕', color: '#ded6ee' },
  { id: 'snacks', name: 'Snacks', icon: '🥨', color: '#f1d8da' },
  { id: 'gifts', name: 'Gifts & Chocolates', icon: '🎁', color: '#fce4ec' },
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
    ownerId: 'sri-lakshmi-owner',
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
    ownerId: 'green-basket-owner',
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
    ownerId: 'daily-needs-owner',
  },
];

export const products: Product[] = [
  // Sri Lakshmi Super Mart Products
  { id: 'milk', martId: 'sri-lakshmi', categoryId: 'dairy', name: 'Farm fresh milk', brand: 'Nandini', unit: '1 litre', price: 58, discountPrice: 54, stock: 24, image: produceImage, featured: true },
  { id: 'atta', martId: 'sri-lakshmi', categoryId: 'groceries', name: 'Whole wheat atta', brand: 'Aashirvaad', unit: '5 kg', price: 380, discountPrice: 320, stock: 12, image: produceImage, featured: true },
  { id: 'rice', martId: 'sri-lakshmi', categoryId: 'groceries', name: 'Basmati Rice', brand: 'India Gate', unit: '1 kg', price: 110, discountPrice: 95, stock: 15, image: produceImage },
  { id: 'oil', martId: 'sri-lakshmi', categoryId: 'groceries', name: 'Sunflower Oil', brand: 'Fortune', unit: '1 litre', price: 140, discountPrice: 125, stock: 20, image: produceImage },
  { id: 'banana', martId: 'sri-lakshmi', categoryId: 'fruits', name: 'Robusta bananas', brand: 'Local farm', unit: '1 dozen', price: 74, discountPrice: 59, stock: 18, image: produceImage, featured: true },
  { id: 'paneer', martId: 'sri-lakshmi', categoryId: 'dairy', name: 'Fresh paneer', brand: 'Milky Mist', unit: '200 g', price: 104, discountPrice: 89, stock: 10, image: produceImage },
  { id: 'coffee', martId: 'sri-lakshmi', categoryId: 'beverages', name: 'Filter coffee powder', brand: 'Suma', unit: '250 g', price: 155, discountPrice: 139, stock: 8, image: produceImage },
  { id: 'chocolate-box', martId: 'sri-lakshmi', categoryId: 'gifts', name: 'Assorted Chocolates', brand: 'Cadbury', unit: '250 g', price: 250, discountPrice: 220, stock: 12, image: produceImage },
  { id: 'gift-basket', martId: 'sri-lakshmi', categoryId: 'gifts', name: 'Festival Gift Hamper', brand: 'Celebrations', unit: '1 pack', price: 499, discountPrice: 449, stock: 5, image: produceImage },
  
  // Green Basket Market Products
  { id: 'tomato', martId: 'green-basket', categoryId: 'fruits', name: 'Hybrid tomatoes', brand: 'Green Basket', unit: '1 kg', price: 62, discountPrice: 48, stock: 30, image: produceImage, featured: true },
  { id: 'bread', martId: 'green-basket', categoryId: 'bakery', name: 'Milk sandwich bread', brand: 'Modern', unit: '400 g', price: 48, discountPrice: 42, stock: 15, image: produceImage },
  { id: 'chips', martId: 'green-basket', categoryId: 'snacks', name: 'Classic salted chips', brand: 'Too Yumm', unit: '100 g', price: 30, discountPrice: 25, stock: 20, image: produceImage },
  { id: 'detergent', martId: 'green-basket', categoryId: 'household', name: 'Matic detergent', brand: 'Surf Excel', unit: '2 kg', price: 390, discountPrice: 335, stock: 7, image: produceImage },
  { id: 'sugar', martId: 'green-basket', categoryId: 'groceries', name: 'Refined Sugar', brand: 'Madhur', unit: '1 kg', price: 60, discountPrice: 52, stock: 25, image: produceImage },
  { id: 'dark-chocolate', martId: 'green-basket', categoryId: 'gifts', name: 'Premium Dark Chocolate', brand: 'Amul', unit: '150 g', price: 150, discountPrice: 135, stock: 18, image: produceImage },
  { id: 'apples', martId: 'green-basket', categoryId: 'fruits', name: 'Red Apples', brand: 'Shimla Farms', unit: '1 kg', price: 180, discountPrice: 159, stock: 12, image: produceImage },
  { id: 'green-tea', martId: 'green-basket', categoryId: 'beverages', name: 'Organic Green Tea', brand: 'Lipton', unit: '25 bags', price: 160, discountPrice: 145, stock: 15, image: produceImage },

  // Daily Needs & More Products
  { id: 'daily-atta', martId: 'daily-needs', categoryId: 'groceries', name: 'Pillsbury Chakki Atta', brand: 'Pillsbury', unit: '5 kg', price: 395, discountPrice: 345, stock: 10, image: produceImage, featured: true },
  { id: 'daily-salt', martId: 'daily-needs', categoryId: 'groceries', name: 'Iodized Crystal Salt', brand: 'Tata Salt', unit: '1 kg', price: 28, discountPrice: 24, stock: 50, image: produceImage },
  { id: 'daily-oil', martId: 'daily-needs', categoryId: 'groceries', name: 'Refined Groundnut Oil', brand: 'Gemini', unit: '1 litre', price: 195, discountPrice: 175, stock: 15, image: produceImage },
  { id: 'daily-potato', martId: 'daily-needs', categoryId: 'fruits', name: 'Organic Potatoes', brand: 'Local Farm', unit: '1 kg', price: 40, discountPrice: 32, stock: 40, image: produceImage },
  { id: 'daily-onion', martId: 'daily-needs', categoryId: 'fruits', name: 'Red Onions', brand: 'Local Farm', unit: '1 kg', price: 50, discountPrice: 38, stock: 35, image: produceImage },
  { id: 'daily-butter', martId: 'daily-needs', categoryId: 'dairy', name: 'Salted Butter Block', brand: 'Amul', unit: '100 g', price: 56, discountPrice: 52, stock: 30, image: produceImage, featured: true },
  { id: 'daily-curd', martId: 'daily-needs', categoryId: 'dairy', name: 'Thick Curd Cup', brand: 'Nandini', unit: '500 g', price: 35, discountPrice: 32, stock: 20, image: produceImage },
  { id: 'daily-rusk', martId: 'daily-needs', categoryId: 'bakery', name: 'Premium Sooji Rusk', brand: 'Britannia', unit: '150 g', price: 50, discountPrice: 45, stock: 25, image: produceImage },
  { id: 'daily-brown-bread', martId: 'daily-needs', categoryId: 'bakery', name: 'Atta Brown Bread', brand: 'English Oven', unit: '400 g', price: 55, discountPrice: 48, stock: 12, image: produceImage },
  { id: 'daily-tea', martId: 'daily-needs', categoryId: 'beverages', name: 'Premium Gold Tea Bags', brand: 'Taj Mahal', unit: '100 bags', price: 320, discountPrice: 289, stock: 8, image: produceImage },
  { id: 'daily-chips', martId: 'daily-needs', categoryId: 'snacks', name: 'Spanish Tomato Chips', brand: 'Lays', unit: '50 g', price: 20, discountPrice: 18, stock: 40, image: produceImage },
  { id: 'daily-vim', martId: 'daily-needs', categoryId: 'household', name: 'Dishwash Lemon Gel', brand: 'Vim', unit: '500 ml', price: 120, discountPrice: 105, stock: 18, image: produceImage },
  { id: 'daily-harpic', martId: 'daily-needs', categoryId: 'household', name: 'Toilet Cleaner Liquid', brand: 'Harpic', unit: '1 litre', price: 190, discountPrice: 168, stock: 14, image: produceImage },
  { id: 'daily-truffles', martId: 'daily-needs', categoryId: 'gifts', name: 'Fine Hazelnut Chocolates', brand: 'Ferrero Rocher', unit: '16 pieces', price: 549, discountPrice: 499, stock: 6, image: produceImage },
];

export const defaultUsers: User[] = [
  { id: 'customer-id', name: 'Ananya Rao', email: 'ananya@email.com', password: 'password', role: 'customer' },
  { id: 'sri-lakshmi-owner', name: 'Sri Lakshmi Owner', email: 'owner@email.com', password: 'owner123', role: 'owner' },
  { id: 'admin-id', name: 'Super Admin', email: 'admin@email.com', password: 'admin123', role: 'admin' },
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
  users: User[];
  currentUser: User | null;
  localProducts: Product[];
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
  users: User[];
  currentUser: User | null;
  addToCart: (product: Product, martId: string) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (address: Address, paymentMethod: PaymentMethod) => Order;
  advanceOrder: (orderId: string) => void;
  addAddress: (address: Address) => void;
  addMart: (mart: Mart) => void;
  approveMart: (martId: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
  addProductToMart: (martId: string, product: Omit<Product, 'id' | 'martId' | 'image'>) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = 'localmart-state-v2';

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [role, setRole] = useState<Role>('customer');
  const [selectedLocation, setSelectedLocation] = useState('Electronic City, Bengaluru');
  const [addresses, setAddresses] = useState<Address[]>([defaultAddress]);
  const [localMarts, setLocalMarts] = useState<Mart[]>(marts);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

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
          setUsers(parsed.users?.length ? parsed.users : defaultUsers);
          setCurrentUser(parsed.currentUser ?? null);
          setLocalProducts(parsed.localProducts?.length ? parsed.localProducts : products);
        }
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { 
      cart, 
      orders, 
      role, 
      selectedLocation, 
      addresses, 
      localMarts, 
      users, 
      currentUser, 
      localProducts 
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, cart, orders, role, selectedLocation, addresses, localMarts, users, currentUser, localProducts]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const user = await response.json() as User;
      setCurrentUser(user);
      setRole(user.role);
      return true;
    } catch (err) {
      console.error("Login fetch error:", err);
      // Fallback to local offline check if server is down for some reason
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (foundUser) {
        setCurrentUser(foundUser);
        setRole(foundUser.role);
        return true;
      }
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, selectedRole: Role): Promise<User> => {
    try {
      const response = await fetch(getApiUrl('/api/users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: selectedRole }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to register user");
      }

      const newUser = await response.json() as User;
      setUsers(current => [...current, newUser]);
      return newUser;
    } catch (err: any) {
      console.error("Register fetch error:", err);
      // Fallback to local offline creation if server is down
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: selectedRole,
        createdAt: new Date().toISOString()
      };
      setUsers(current => [...current, newUser]);
      return newUser;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('customer');
    setCart([]);
  };

  const addProductToMart = (martId: string, productData: Omit<Product, 'id' | 'martId' | 'image'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      martId,
      image: produceImage,
    };
    setLocalProducts((current) => [...current, newProduct]);
  };

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
    categories, marts: localMarts, products: localProducts, cart, cartCount, cartMartId: cart[0]?.product.martId,
    cartSubtotal, orders, addresses, users, currentUser, addToCart, updateQuantity,
    removeFromCart: (productId) => setCart((current) => current.filter((item) => item.product.id !== productId)),
    clearCart: () => setCart([]),
    placeOrder, advanceOrder,
    addAddress: (address) => setAddresses((current) => [...current, address]),
    addMart: (mart) => {
      // Auto-assign ownerId if the current user is an owner
      const martWithOwner = {
        ...mart,
        ownerId: currentUser?.role === 'owner' ? currentUser.id : undefined
      };
      setLocalMarts((current) => [...current, martWithOwner]);
    },
    approveMart: (martId) => setLocalMarts((current) => current.map((mart) => mart.id === martId ? { ...mart, approvalStatus: 'approved', isOpen: true } : mart)),
    login, register, logout, addProductToMart
  }), [hydrated, role, selectedLocation, localMarts, localProducts, cart, cartCount, cartSubtotal, orders, addresses, users, currentUser]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}