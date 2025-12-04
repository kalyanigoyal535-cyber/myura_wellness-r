import apiClient, { getErrorMessage } from './api';

export interface CreatePhonePePaymentRequest {
  amount: number; // Amount in paise
  order_id: number;
}

export interface CreatePhonePePaymentResponse {
  payment_url: string;
  transaction_id: string;
  order_id: number;
}

export interface VerifyPhonePePaymentRequest {
  transaction_id: string;
  order_id: number;
}

export const phonepeApi = {
  // Create PhonePe payment request
  createPayment: async (data: CreatePhonePePaymentRequest): Promise<CreatePhonePePaymentResponse> => {
    try {
      const response = await apiClient.post<CreatePhonePePaymentResponse>(
        '/payments/phonepe/create/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Verify payment status
  verifyPayment: async (data: VerifyPhonePePaymentRequest): Promise<{ success: boolean; payment_status: string; order?: any }> => {
    try {
      const response = await apiClient.post<{ success: boolean; payment_status: string; order?: any }>(
        '/payments/phonepe/verify/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Cashfree Payment API
export interface CreateCashfreePaymentRequest {
  amount: number; // Amount in rupees
  order_id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

export interface CreateCashfreePaymentResponse {
  payment_session_id: string;
  payment_url: string;
  order_id: number;
}

export interface VerifyCashfreePaymentRequest {
  order_id: string; // Cashfree order ID (ORDER_xxx)
  order_db_id: number; // Database order ID
}

export const cashfreeApi = {
  // Create Cashfree payment session
  createPayment: async (data: CreateCashfreePaymentRequest): Promise<CreateCashfreePaymentResponse> => {
    try {
      const response = await apiClient.post<CreateCashfreePaymentResponse>(
        '/payments/cashfree/create/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Verify payment status
  verifyPayment: async (data: VerifyCashfreePaymentRequest): Promise<{ success: boolean; payment_status: string; order?: any }> => {
    try {
      const response = await apiClient.post<{ success: boolean; payment_status: string; order?: any }>(
        '/payments/cashfree/verify/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

