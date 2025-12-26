import apiClient, { getErrorMessage } from './api';

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_to: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ValidateCouponResponse {
  coupon: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_discount: number | null;
  };
  discount_amount: string;
  valid: boolean;
}

export const couponsApi = {
  // Get all active coupons (public)
  getActiveCoupons: async (): Promise<Coupon[]> => {
    try {
      const response = await apiClient.get<{ coupons: Coupon[] } | Coupon[]>('/coupons/active/');
      // Handle both response formats
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.coupons)) {
        return data.coupons;
      } else if (data && Array.isArray((data as any).results)) {
        return (data as any).results;
      }
      return [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Validate coupon code
  validateCoupon: async (code: string, orderAmount?: number): Promise<ValidateCouponResponse> => {
    try {
      const response = await apiClient.post<ValidateCouponResponse>('/coupons/validate/', {
        code,
        order_amount: orderAmount,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

