// API Response Types

// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_joined: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message?: string;
}

// Product Types
export interface ProductCategory {
  id: string;
  name: string;
  headline?: string;
  description?: string;
  accent_gradient?: string;
  hero_tagline?: string;
  image?: string;
  image_url?: string;
  products_count?: number;
  created_at: string;
}

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  alt_text: string;
  order: number;
}

export interface Product {
  id: number;
  category: ProductCategory;
  name: string;
  headline?: string;
  price: string;
  original_price?: string;
  originalPrice?: string; // camelCase for frontend compatibility
  discount_percent: number;
  rating: string;
  reviews_count: number;
  reviews?: number; // camelCase for frontend compatibility
  in_stock: boolean;
  inStock?: boolean; // camelCase for frontend compatibility
  accent_gradient?: string;
  accentGradient?: string; // camelCase for frontend compatibility
  notes: string[];
  summary: string;
  description?: string;
  benefits?: string[];
  key_ingredients?: string;
  keyIngredients?: string; // camelCase for frontend compatibility
  suitable_for?: string;
  suitableFor?: string; // camelCase for frontend compatibility
  how_to_use?: string;
  howToUse?: string; // camelCase for frontend compatibility
  faqs?: string;
  hero_tagline?: string;
  heroTagline?: string; // camelCase for frontend compatibility
  image?: string;
  image_url?: string;
  gallery_images?: ProductImage[];
  gallery?: ProductImage[]; // camelCase for frontend compatibility
  created_at: string;
  updated_at?: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  product_id?: number;
  quantity: number;
  subtotal: string;
  created_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_amount: string;
  created_at: string;
  updated_at: string;
}

// Address Types
export interface Address {
  id: number;
  address_type: 'home' | 'work' | 'other';
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

// Order Types
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  subtotal: string;
  created_at: string;
}

export interface ShippingAddress {
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: number;
  order_number: string;
  user?: number;
  user_email?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  shipping_address: ShippingAddress;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  shipping_address?: ShippingAddress;
  shipping_address_id?: number;
  payment_method?: string;
  payment_id?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
}

// Contact Types
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactSubmissionRequest {
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
}

// API Error Types
export interface ApiError {
  error?: string;
  message?: string;
  detail?: string;
  [key: string]: any;
}

