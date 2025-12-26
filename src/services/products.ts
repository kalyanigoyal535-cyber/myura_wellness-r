import apiClient, { getErrorMessage } from './api';
import { Product, ProductListResponse, ProductCategory } from './types';

export interface ProductFilters {
  category?: string;
  categories?: string; // comma-separated
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  max_rating?: number;
  on_sale?: boolean;
  has_discount?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<ProductListResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.category) params.append('category', filters.category);
        if (filters.categories) params.append('categories', filters.categories);
        if (filters.in_stock !== undefined) params.append('in_stock', String(filters.in_stock));
        if (filters.min_price !== undefined) params.append('min_price', String(filters.min_price));
        if (filters.max_price !== undefined) params.append('max_price', String(filters.max_price));
        if (filters.min_rating !== undefined) params.append('min_rating', String(filters.min_rating));
        if (filters.max_rating !== undefined) params.append('max_rating', String(filters.max_rating));
        if (filters.on_sale !== undefined) params.append('on_sale', String(filters.on_sale));
        if (filters.has_discount !== undefined) params.append('has_discount', String(filters.has_discount));
        if (filters.search) params.append('search', filters.search);
        if (filters.ordering) params.append('ordering', filters.ordering);
        if (filters.page) params.append('page', String(filters.page));
      }

      const queryString = params.toString();
      const url = `/products/${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<ProductListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getProduct: async (id: number | string): Promise<Product> => {
    try {
      // Support both numeric ID and slug
      const response = await apiClient.get<Product>(`/products/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      // Search for product by slug
      const allProducts = await productsApi.getProducts({ search: slug });
      const found = allProducts.results?.find(
        (p) => p.slug?.toLowerCase() === slug.toLowerCase()
      );
      return found || null;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>('/products/featured/');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getRelatedProducts: async (productId: number): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>(`/products/related/?product_id=${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getCategories: async (): Promise<ProductCategory[]> => {
    try {
      const response = await apiClient.get<ProductCategory[]>('/categories/');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getCategory: async (id: string, filters?: { in_stock?: boolean; search?: string }): Promise<ProductCategory & { products: Product[]; products_count: number }> => {
    try {
      const params = new URLSearchParams();
      if (filters?.in_stock !== undefined) params.append('in_stock', String(filters.in_stock));
      if (filters?.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const url = `/categories/${id}/${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<ProductCategory & { products: Product[]; products_count: number }>(url);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};















