import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  Filter,
  Search,
  ShieldCheck,
  Award,
  CheckCircle2,
  ShoppingCart,
  Sparkles,
  X,
  ArrowRight,
  Loader2,
  Package,
  RefreshCw,
  Disc,
} from "lucide-react";
import ResponsiveProductImage from "../components/ResponsiveProductImage";
import { useCart } from "../context/CartContext";
import { productsApi } from "../services/products";
import {
  apiProductsToFrontend,
  apiProductToFrontend,
} from "../utils/productConverter";
import { ProductRecord } from "../data/products";
import DiscoverBenefitsOfProducts from "@/components/discoverBenefitsOfProducts/DiscoverBenefitsOfProducts";

// Helper function to check if a product is ProSeries
const isProSeriesProduct = (productId: string): boolean => {
  return productId.startsWith("pro-");
};

const Product: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize search query from URL parameter
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build ordering parameter
      let ordering = "-created_at";
      if (sortBy === "price-low") {
        ordering = "price";
      } else if (sortBy === "price-high") {
        ordering = "-price";
      } else if (sortBy === "rating") {
        ordering = "-rating";
      } else if (sortBy === "newest") {
        ordering = "-created_at";
      }

      const response = await productsApi.getProducts({
        search: searchQuery.trim() || undefined,
        ordering,
        page: 1,
      });

      // Convert API products to frontend format
      const convertedProducts = apiProductsToFrontend(response.results || []);
      setProducts(convertedProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search - update URL after user stops typing
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce URL update and API refetch
      searchTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          setSearchParams({ search: value }, { replace: true });
        } else {
          setSearchParams({}, { replace: true });
        }
        // Refetch will happen automatically via filters dependency
      }, 500);
    },
    [setSearchParams]
  );

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Handle sort change
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value);
    },
    []
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get product detail URL - use slug if available, otherwise use numeric ID
  const getProductUrl = useCallback((product: ProductRecord) => {
    // Use slug for routing if available, otherwise use numeric ID
    // The slug should match the product detail route
    if (
      product.id &&
      typeof product.id === "string" &&
      product.id.includes("-")
    ) {
      return `/product/${product.id}`;
    }
    // Fallback to numeric ID
    return `/product/${product.numericId || product.id}`;
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-4 sm:py-6"
        data-aos="fade-down"
        data-aos-duration="900"
        data-aos-easing="ease-out-cubic"
      >
        <div
          className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-0.5 sm:space-y-2"
          data-aos="zoom-in"
          data-aos-delay="120"
          data-aos-duration="900"
          data-aos-easing="ease-out-cubic"
        >
          <h1 className="text-lg sm:text-4xl font-bold text-white leading-tight tracking-[0.3em]">
            PRODUCT
          </h1>
          <p className="hidden sm:block text-sm sm:text-lg text-slate-200 leading-snug">
            Wellness you can feel, results you can see.
          </p>
        </div>
      </section>

      {/* Product Collection Section */}
      <section className="py-8 sm:py-20 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Search and Filter Bar */}
          <div
            className="mb-8 sm:mb-10"
            data-aos="fade-up"
            data-aos-duration="850"
            data-aos-easing="ease-out-quart"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 pl-12 pr-12 text-xs sm:text-sm text-slate-600 shadow-[0_15px_35px_-28px_rgba(15,23,42,0.4)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-500/70"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-all duration-200"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-4">
                <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 hover:border-slate-400">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="flex-1 sm:flex-none rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.35)] focus:border-slate-400 focus:outline-none"
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery.trim() && (
            <div className="mb-4 text-sm text-slate-600">
              <span className="font-semibold">
                {products.length}{" "}
                {products.length === 1 ? "product found" : "products found"}
              </span>
              {searchQuery.trim() && (
                <span className="ml-2">
                  for "
                  <span className="font-bold text-slate-900">
                    {searchQuery}
                  </span>
                  "
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-slate-900" size={48} />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 ? (
            <div
              className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
              data-aos="fade-up"
              data-aos-duration="900"
              data-aos-delay="180"
              data-aos-easing="ease-out-cubic"
            >
              {products.map((product, index) => {
                const discountPercent = Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                );
                const productUrl = getProductUrl(product);

                return (
                  <Link
                    key={product.id}
                    to={productUrl}
                    className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-950 text-white shadow-xl transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_35px_65px_rgba(15,23,42,0.55)] block"
                    data-aos="fade-up"
                    data-aos-delay={160 + index * 80}
                    data-aos-duration="850"
                    data-aos-easing="ease-out-cubic"
                  >
                    {/* ProSeries Badge */}
                    {isProSeriesProduct(product.id) && (
                      <div
                        className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 lg:left-3 lg:top-3 z-20 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-2 sm:px-2.5 lg:px-3 lg:py-1 py-0.5 text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.22em] lg:tracking-[0.25em] text-white shadow-[0_4px_12px_-4px_rgba(217,119,6,0.6),0_2px_6px_-2px_rgba(251,191,36,0.4)] backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105 border border-amber-300/50"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                      >
                        <div className="relative flex items-center gap-1 lg:gap-1.5">
                          <Award className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                            ProSeries
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Sale Badge */}
                    {discountPercent > 0 && (
                      <div
                        className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 lg:right-3 lg:top-3 z-20 rounded-full bg-rose-500/95 px-2 lg:px-3 py-0.5 lg:py-1 text-[7px] sm:text-[8px] lg:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] lg:tracking-[0.35em] text-white shadow-md backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0.5 group-hover:bg-rose-400/95"
                        data-aos="zoom-in"
                        data-aos-delay="220"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                      >
                        Sale
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 z-0 bg-gradient-to-br ${product.accentGradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
                      aria-hidden="true"
                    ></div>
                    <div className="pointer-events-none absolute inset-0 z-[1]">
                      <div className="absolute -inset-px rounded-[28px] border border-white/5 opacity-0 transition-all duration-700 group-hover:opacity-80 group-hover:border-white/20"></div>
                      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-80">
                        <div className="absolute -top-10 left-1/2 h-32 w-48 -translate-x-1/2 rotate-6 rounded-full bg-white/30 blur-3xl"></div>
                        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 bg-gradient-to-tr from-white/10 via-white/0 to-transparent blur-2xl animate-pulse"></div>
                      </div>
                    </div>
                    <div
                      className="absolute inset-x-8 top-10 hidden sm:block h-32 rounded-full bg-white/20 blur-3xl pointer-events-none"
                      aria-hidden="true"
                    ></div>
                    <div className="relative z-10 flex h-full flex-col gap-3 p-3 sm:p-4">
                      <div className="relative">
                        <div className="relative block rounded-3xl bg-white/5 shadow-inner transition-transform duration-500 group-hover:scale-[1.01]">
                          <ResponsiveProductImage
                            image={product.image}
                            className="w-full aspect-square overflow-hidden rounded-3xl"
                            imgClassName="object-contain w-full h-full p-0 m-0 transition-transform duration-700 ease-out"
                          />
                        </div>
                        {product.inStock && (
                          <div className="absolute left-6 top-6 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                            In Stock
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex text-xs font-semibold sm:text-lg lg:text-xl text-white group-hover:text-myura-purple-200 transition-colors">
                            {product.name}
                          </span>
                          <div className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-white/10 px-1.5 sm:px-2 py-0.5">
                            <div className="flex items-center gap-0 sm:gap-0.5 text-amber-200">
                              {[...Array(Math.floor(product.rating || 0))].map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-2 w-2 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 fill-current"
                                  />
                                )
                              )}
                            </div>
                            <span className="text-[8px] sm:text-[10px] lg:text-xs font-semibold text-white/80">
                              {product.rating
                                ? product.rating.toFixed(1)
                                : "0.0"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[8px] sm:text-xs lg:text-sm uppercase tracking-[0.24em] text-white/60">
                          {product.reviews || 0}{" "}
                          {product.reviews === 1 ? "review" : "reviews"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 sm:px-3 sm:py-1 lg:px-4 lg:py-1.5 text-slate-900 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.45)]">
                          <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-1 py-0.5 text-[7px] sm:text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                            Deal
                          </span>
                          <span className="font-display text-xs sm:text-xl lg:text-2xl font-semibold tracking-tight">
                            ₹{product.price}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-1 py-0.5 sm:px-2 sm:py-1 text-[7px] sm:text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                          Save {discountPercent}%
                        </span>
                        <span className="text-[6.5px] sm:text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                          MRP ₹{product.originalPrice}
                        </span>
                      </div>

                      <div className="mt-auto pt-1 flex gap-1.5 sm:gap-2 lg:gap-3">
                        <span className="inline-flex flex-1 items-center justify-center rounded-full bg-white/15 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-white transition-all duration-300 group-hover:bg-white/25 pointer-events-none">
                          {/* Arrow icon on mobile, text on desktop */}
                          <ArrowRight className="h-3 w-3 sm:hidden" />
                          <span className="hidden sm:inline text-[8px] sm:text-[9px] lg:text-[10px] font-semibold uppercase tracking-[0.15em] lg:tracking-[0.18em]">
                            Explore Ritual
                          </span>
                        </span>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (addingToCart === product.id) return;
                            setAddingToCart(product.id);
                            try {
                              await addItem(
                                {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image?.fallback || "",
                                },
                                1
                              );
                            } catch (error) {
                              console.error("Error adding to cart:", error);
                            } finally {
                              setTimeout(() => setAddingToCart(null), 1000);
                            }
                          }}
                          disabled={
                            addingToCart === product.id || !product.inStock
                          }
                          className="group/btn relative inline-flex flex-1 items-center justify-center rounded-full bg-white/20 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-[7px] sm:text-[8px] lg:text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.15em] lg:tracking-[0.18em] text-white transition-all duration-300 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden whitespace-nowrap z-20"
                        >
                          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                          <span className="relative inline-flex items-center">
                            {addingToCart === product.id ? (
                              <span>Added!</span>
                            ) : (
                              <span>Add to Cart</span>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="max-w-2xl mx-auto py-20 sm:py-28 text-center"
              style={{
                animation: "fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Animated Background Elements */}
              <div className="relative inline-flex items-center justify-center mb-8">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-purple-50 to-rose-50 rounded-full blur-3xl opacity-60 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 via-blue-50 to-slate-100 rounded-full blur-2xl opacity-40" />

                {/* Icon Container */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-white via-slate-50 to-slate-100 border-2 border-slate-200/80 flex items-center justify-center shadow-xl backdrop-blur-sm">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100/50 via-pink-100/50 to-rose-100/50 opacity-50" />
                  {searchQuery.trim() ? (
                    <Search
                      className="h-16 w-16 sm:h-20 sm:w-20 text-slate-400 relative z-10"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Package
                      className="h-16 w-16 sm:h-20 sm:w-20 text-slate-400 relative z-10"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                  {searchQuery.trim() ? (
                    <>
                      No products found
                      <span className="block text-2xl sm:text-3xl font-semibold text-slate-600 mt-2">
                        for "{searchQuery}"
                      </span>
                    </>
                  ) : (
                    "No products available"
                  )}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                  {searchQuery.trim() ? (
                    <>
                      We couldn't find any products matching your search. Try
                      different keywords or browse our full collection.
                    </>
                  ) : (
                    <>
                      We're currently updating our product catalog. Check back
                      soon for amazing wellness products!
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {searchQuery.trim() ? (
                  <>
                    <button
                      onClick={handleClearSearch}
                      className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 transition-all duration-300 active:scale-[0.98] transform"
                    >
                      <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Clear Search</span>
                    </button>
                    <Link
                      to="/product"
                      className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] transform"
                    >
                      <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                      <span>View All Products</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/"
                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 transition-all duration-300 active:scale-[0.98] transform"
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                  </Link>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discover Benefits Section */}
   <DiscoverBenefitsOfProducts />
    </div>
  );
};

export default Product;
