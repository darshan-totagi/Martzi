import { pgTable, text, integer, boolean, doublePrecision, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// 1. Categories Table
export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

// 2. Marts Table
export const martsTable = pgTable("marts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  rating: doublePrecision("rating").default(0).notNull(),
  distance: doublePrecision("distance").default(0).notNull(),
  deliveryTime: text("delivery_time").notNull(),
  minimumOrder: integer("minimum_order").default(0).notNull(),
  deliveryFee: integer("delivery_fee").default(0).notNull(),
  isOpen: boolean("is_open").default(false).notNull(),
  offer: text("offer"),
  address: text("address").notNull(),
  area: text("area").notNull(),
  approvalStatus: text("approval_status").default("pending").notNull(), // 'approved' | 'pending' | 'rejected'
  image: text("image"), // local path/name or url
});

// 3. Products Table
export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  martId: text("mart_id").references(() => martsTable.id, { onDelete: "cascade" }).notNull(),
  categoryId: text("category_id").references(() => categoriesTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  unit: text("unit").notNull(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price").notNull(),
  stock: integer("stock").default(0).notNull(),
  image: text("image"),
  featured: boolean("featured").default(false).notNull(),
});

// 4. Addresses Table
export const addressesTable = pgTable("addresses", {
  id: text("id").primaryKey(),
  label: text("label").notNull(), // 'Home', 'Work', etc.
  line: text("line").notNull(),
  area: text("area").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
});

// 5. Orders Table
export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  martId: text("mart_id").references(() => martsTable.id, { onDelete: "cascade" }).notNull(),
  items: jsonb("items").notNull(), // stores array of cart items
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  platformFee: integer("platform_fee").notNull(),
  total: integer("total").notNull(),
  address: jsonb("address").notNull(), // snapshot of delivery address
  paymentMethod: text("payment_method").notNull(), // 'Cash on delivery' | 'UPI' | 'Online payment'
  status: text("status").notNull(), // 'Order placed' | 'Mart accepted' | ...
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Users Table
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(), // plain-text or hashed password for credentials
  role: text("role").default("customer").notNull(), // 'customer' | 'owner' | 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertCategorySchema = createInsertSchema(categoriesTable);
export const insertMartSchema = createInsertSchema(martsTable);
export const insertProductSchema = createInsertSchema(productsTable);
export const insertAddressSchema = createInsertSchema(addressesTable);
export const insertOrderSchema = createInsertSchema(ordersTable);
export const insertUserSchema = createInsertSchema(usersTable);