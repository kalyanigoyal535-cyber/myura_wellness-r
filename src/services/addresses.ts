import apiClient, { getErrorMessage } from './api';
import { Address } from './types';

export interface CreateAddressData {
  address_type?: 'home' | 'work' | 'other';
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

// Addresses API
export const addressesApi = {
  // Get user's addresses
  getAddresses: async (): Promise<Address[]> => {
    try {
      const response = await apiClient.get<Address[]>('/addresses/');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Create new address
  createAddress: async (data: CreateAddressData): Promise<Address> => {
    try {
      const response = await apiClient.post<Address>('/addresses/', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get address by ID
  getAddress: async (id: number): Promise<Address> => {
    try {
      const response = await apiClient.get<Address>(`/addresses/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update address
  updateAddress: async (id: number, data: UpdateAddressData): Promise<Address> => {
    try {
      const response = await apiClient.put<Address>(`/addresses/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete address
  deleteAddress: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/addresses/${id}/`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Set address as default
  setDefaultAddress: async (id: number): Promise<Address> => {
    try {
      const response = await apiClient.post<{ message: string; address: Address }>(`/addresses/${id}/set-default/`);
      return response.data.address;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};















