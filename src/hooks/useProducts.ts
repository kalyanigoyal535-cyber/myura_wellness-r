import { useState, useEffect, useCallback } from 'react';
import { productsApi, ProductFilters } from '../services/products';
import { Product as ApiProduct } from '../services/types';
import { ProductRecord } from '../data/products';
import { apiProductsToFrontend, apiProductToFrontend } from '../utils/productConverter';

interface UseProductsOptions {
  filters?: ProductFilters;
  autoFetch?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { filters, autoFetch = true } = options;
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const fetchProducts = useCallback(async (customFilters?: ProductFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productsApi.getProducts(customFilters || filters);
      const frontendProducts = apiProductsToFrontend(response.results);
      setProducts(frontendProducts);
      setHasMore(!!response.next);
      setNextPage(response.next);
      return frontendProducts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  const loadMore = useCallback(async () => {
    if (!nextPage || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(nextPage);
      const data = await response.json();
      const newProducts = apiProductsToFrontend(data.results);
      setProducts(prev => [...prev, ...newProducts]);
      setHasMore(!!data.next);
      setNextPage(data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more products');
    } finally {
      setIsLoading(false);
    }
  }, [nextPage, isLoading]);

  return {
    products,
    isLoading,
    error,
    hasMore,
    fetchProducts,
    loadMore,
    refetch: () => fetchProducts(),
  };
};

// Hook for fetching a single product
export const useProduct = (productId: string | number) => {
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiProduct = await productsApi.getProduct(Number(productId));
        setProduct(apiProductToFrontend(apiProduct));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, isLoading, error };
};

// Hook for featured products
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiProducts = await productsApi.getFeaturedProducts();
        const frontendProducts = apiProductsToFrontend(apiProducts);
        setProducts(frontendProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { products, isLoading, error };
};

