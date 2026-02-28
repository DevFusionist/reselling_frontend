// User Types
export type UserRole = "ADMIN" | "CUSTOMER" | "RESELLER";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles: UserRole[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Product Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number | string;
  stock: number;
  isActive: boolean;
  optionValues?: VariantOptionValue[];
}

export interface VariantOption {
  id: string;
  name: string; // "Color", "Size", etc.
  position: number;
  values: VariantOptionValue[];
}

export interface VariantOptionValue {
  id: string;
  value: string; // "Red", "Large", etc.
  position: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  sku?: string;
  categoryId?: string;
  category?: Category;
  isActive: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  options?: VariantOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  skip: number;
  take: number;
}

// Pricing Types
export interface PricingItem {
  productId: string;
  quantity: number;
  sellerPrice: number;
}

export interface PricingCalculation {
  subtotal: number;
  commission: number;
  total: number;
  items: Array<{
    productId: string;
    basePrice: number;
    sellerPrice: number;
    quantity: number;
    subtotal: number;
    commission: number;
  }>;
}

export interface MarginValidation {
  valid: boolean;
  basePrice: number;
  sellerPrice: number;
  margin: number;
  marginPercentage: number;
}

// Order Types
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  commission: number | string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  sellerId?: string;
  shareLinkId?: string;
  status: OrderStatus;
  totalAmount: number | string;
  commission: number | string;
  currency: string;
  shippingAddress?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  userId: string;
  sellerId?: string;
  shareLinkId?: string;
  shippingAddress?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    sellerPrice: number;
  }>;
}

// Payment Types
export type PaymentMethod = "CARD" | "UPI" | "NETBANKING" | "WALLET";
export type PaymentStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number | string;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RazorpayOrderResponse {
  payment: Payment;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    key: string;
  };
}

// Wallet Types
export type TransactionType =
  | "COMMISSION_CREATED"
  | "COMMISSION_UNLOCKED"
  | "PAYOUT_REQUESTED"
  | "PAYOUT_APPROVED"
  | "PAYOUT_REJECTED"
  | "PAYOUT_PROCESSED"
  | "REFUND";

export type PayoutStatus = "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";

export interface Wallet {
  id: string;
  sellerId: string;
  pendingBalance: number | string;
  availableBalance: number | string;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  orderId?: string;
  type: TransactionType;
  amount: number | string;
  balanceBefore: number | string;
  balanceAfter: number | string;
  description?: string;
  metadata?: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  walletId: string;
  sellerId: string;
  amount: number | string;
  status: PayoutStatus;
  bankAccount?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Share Link Types
export interface ShareLink {
  id: string;
  code: string;
  sellerId: string;
  productId?: string;
  sellerPrice?: number;
  url: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  product?: Product;
}

export interface ShareLinkStats {
  clicks: number;
  conversions: number;
  conversionRate: number;
  totalRevenue: number | string;
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  sellerPrice?: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  sellerId?: string;
  shareLinkId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

