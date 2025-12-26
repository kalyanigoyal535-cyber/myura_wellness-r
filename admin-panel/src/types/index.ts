// User Types (matching new schema)
export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_number?: string;
  photo?: string;
  dob?: string;
  anniversary?: string;
  address?: string; // JSON string
  is_verified?: boolean;
  status?: 'Active' | 'Inactive' | 'Blocked';
  is_staff?: boolean; // For admin users
  is_superuser?: boolean; // For admin users
  created_at?: string;
  date_joined?: string;
  updated_at?: string;
  // For admins (admins table has name field)
  name?: string;
}

// Admin Types
export interface Admin {
  id: number;
  name: string;
  email: string;
  photo?: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

// Product Types (matching new schema)
export interface Product {
  product_id: number;
  slug?: string;
  category_id: string;
  name: string;
  headline?: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  accent_gradient?: string;
  notes: string[] | null;
  summary: string;
  description: string;
  benefits: string[] | null;
  key_ingredients: string;
  suitable_for: string;
  how_to_use: string;
  faqs?: string;
  hero_tagline?: string;
  image?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  // Computed/joined fields
  category?: ProductCategory;
  image_url?: string;
}

// Product Category Types (matching new schema)
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  headline?: string;
  description?: string;
  accent_gradient?: string;
  hero_tagline?: string;
  image_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  // Computed fields
  products_count?: number;
}

// Order Types (matching new schema)
export interface Order {
  order_id: number;
  id?: number; // Keep for compatibility
  order_number: string;
  user_id?: number;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'; // Keep for compatibility
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  payment_method?: string;
  shipping_address: ShippingAddress | string; // JSON string or parsed object
  billing_address?: ShippingAddress | string;
  discount_amount: number;
  shipping_fee: number;
  cod_fee: number;
  total_amount: number;
  applied_coupon?: string; // JSON string
  tracking_number?: string;
  created_at: string;
  updated_at?: string;
  // Computed/joined fields
  user_email?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  // Computed/joined fields
  product?: Product;
  product_name?: string;
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

// Contact Submission Types
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

// Blog Types (matching new schema)
export interface Blog {
  blog_id: number;
  id?: number; // Keep for compatibility
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  content_blocks?: any; // JSON structured content
  featured_image?: string;
  thumbnail?: string;
  author_id: number;
  author?: string;
  status: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
  tags?: string[] | null;
  view_count: number;
  views?: number; // Alias for view_count
  date?: string;
  created_at: string;
  updated_at?: string;
  // Computed/joined fields
  featured_image_url?: string;
  author_name?: string;
  published?: boolean; // Computed from status
  published_at?: string; // Computed from created_at when status is published
  category?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  overview: {
    total_users: number;
    total_products: number;
    total_orders: number;
    total_revenue: number;
  };
  monthly: {
    orders: number;
    orders_growth: number;
    revenue: number;
    revenue_growth: number;
  };
  recent_orders: Order[];
  pending_contacts: number;
}

// API Response Types
export interface ApiResponse<T> {
  count?: number;
  total?: number;
  page?: number;
  page_size?: number;
  results: T[];
}

export interface ApiError {
  error: string;
  errors?: Array<{ field: string; message: string }>;
}

// Form Types
export interface ProductFormData {
  category: string;
  slug?: string;
  name: string;
  headline?: string;
  price: string;
  original_price?: string;
  rating?: string;
  reviews_count?: string;
  in_stock: boolean;
  accent_gradient?: string;
  summary: string;
  description: string;
  key_ingredients: string;
  suitable_for: string;
  how_to_use: string;
  faqs?: string;
  hero_tagline?: string;
  notes: string[];
  benefits: string[];
  image?: File | null;
}

export interface CategoryFormData {
  id: string;
  name: string;
  slug?: string;
  headline?: string;
  description?: string;
  accent_gradient?: string;
  hero_tagline?: string;
  image?: File | null;
}

export interface BlogFormData {
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  content_blocks?: any;
  featured_image?: File | null;
  thumbnail?: File | null;
  author?: string;
  author_id?: number;
  published: boolean;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  category?: string;
  meta_title?: string;
  meta_description?: string;
  date?: string;
}

// Notification Types
export interface Notification {
  id: number;
  type: 'user_registered' | 'order_placed' | 'order_updated' | 'contact_submission' | 'system';
  title: string;
  message: string;
  related_id?: number | null;
  related_type?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}

// Event Handler Types
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
