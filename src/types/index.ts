export type OrderStatus =
  | "pending"
  | "paid"
  | "picking"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cost_price: number;
  sell_price: number;
  stock_quantity: number;
  sku: string | null;
  category_id: string | null;
  supplier_id: string | null;
  images: string[];
  is_active: boolean;
  weight_oz: number | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  supplier?: Supplier;
}

export interface Customer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  stripe_payment_intent: string | null;
  fulfillment_notes: string | null;
  shipped_at: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
