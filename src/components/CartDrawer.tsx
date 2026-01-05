import React, {  useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Gift, Sparkles, ArrowRight, Heart, Tag, Copy, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ResponsiveProductImage from './ResponsiveProductImage';
import { type ProductRecord } from '../data/products';
import { productsApi } from '../services/products';
import { apiProductsToFrontend } from '../utils/productConverter';
import { couponsApi, type Coupon } from '../services/coupons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQty, removeItem, subtotal, addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingQty, setUpdatingQty] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [alsoBoughtProducts, setAlsoBoughtProducts] = useState<ProductRecord[]>([]);
  const [loadingAlsoBought, setLoadingAlsoBought] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Find selected coupon detail
  const selectedCouponDetail = useMemo(
    () => coupons.find((coupon) => coupon.code === appliedCoupon) ?? null,
    [appliedCoupon, coupons]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || !selectedCouponDetail) return 0;
    
    const discountValue = typeof selectedCouponDetail.discount_value === 'number' 
      ? selectedCouponDetail.discount_value 
      : parseFloat(String(selectedCouponDetail.discount_value)) || 0;
    const maxDiscount = selectedCouponDetail.max_discount 
      ? (typeof selectedCouponDetail.max_discount === 'number'
          ? selectedCouponDetail.max_discount
          : parseFloat(String(selectedCouponDetail.max_discount)) || null)
      : null;
    
    if (selectedCouponDetail.discount_type === 'percentage') {
      const discount = (subtotal * discountValue) / 100;
      if (maxDiscount !== null && discount > maxDiscount) {
        return Number(maxDiscount) || 0;
      }
      return Number(discount) || 0;
    } else {
      return Number(discountValue) || 0;
    }
  }, [appliedCoupon, selectedCouponDetail, subtotal]);

  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 49;
  const discountedSubtotal = subtotal - discountAmount;
  const total = discountedSubtotal + shipping;

  const savings = items.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + (item.originalPrice - item.price) * item.qty;
    }
    return acc;
  }, 0);

  const originalSubtotal = items.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + item.originalPrice * item.qty;
    }
    return acc + item.price * item.qty;
  }, 0);

  const discountPercent = originalSubtotal > 0 
    ? Math.round(((originalSubtotal - subtotal) / originalSubtotal) * 100) 
    : 0;

  // Fetch active coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const activeCoupons = await couponsApi.getActiveCoupons();
        setCoupons(activeCoupons);
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
        setCoupons([]);
      } finally {
        setLoadingCoupons(false);
      }
    };

    if (isOpen) {
      fetchCoupons();
    }
  }, [isOpen]);



  useEffect(() => {
    if (!isOpen) return;
    
    // Add new items to visible set
    items.forEach((item) => {
      if (!visibleItems.has(item.id)) {
        setTimeout(() => {
          setVisibleItems((prev) => {
            if (prev.has(item.id)) return prev;
            const next = new Set(prev);
            next.add(item.id);
            return next;
          });
        }, 50);
      }
    });

    // Remove old items from visible set
    const itemIds = new Set(items.map((item) => item.id));
    let hasRemoved = false;
    visibleItems.forEach((id) => {
      if (!itemIds.has(id)) hasRemoved = true;
    });

    if (hasRemoved) {
    setVisibleItems((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (itemIds.has(id)) next.add(id);
      });
      return next;
    });
    }
  }, [items, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    setVisibleItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    try {
      await removeItem(id);
      // Wait for animation to complete before clearing removing state
    await new Promise(resolve => setTimeout(resolve, 400));
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Re-add to visible items if removal failed
      setVisibleItems((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    } finally {
    setRemovingId(null);
    }
  };

  const handleUpdateQty = async (id: string, newQty: number) => {
    setUpdatingQty(id);
    updateQty(id, newQty);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUpdatingQty(null);
  };

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout', {
      state: {
        previousPath: location.pathname,
        openDrawerOnBack: true,
      },
    });
  };

  if (typeof window === 'undefined') return null;
  if (!document.body) return null;

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy coupon:', err);
    }
  };

  const handleApplyCoupon = async (code?: string) => {
    const normalized = (code || couponCode).trim().toUpperCase();

    if (!normalized) return;

    try {
      const validation = await couponsApi.validateCoupon(normalized, subtotal);
      
      if (!validation.valid) {
        alert('Invalid coupon code or minimum order amount not met.');
        return;
      }

      setAppliedCoupon(normalized);
    setShowCouponModal(false);
    } catch (err) {
      console.error('Failed to validate coupon:', err);
    }
  };

  // Fetch "also bought" products from API
  useEffect(() => {
    const fetchAlsoBoughtProducts = async () => {
      try {
        setLoadingAlsoBought(true);
        // Fetch featured products or popular products
        const response = await productsApi.getProducts({ 
          in_stock: true,
          page: 1 
        });
        
        const allProducts = apiProductsToFrontend(response.results || []);
        
        // Filter out products already in cart
        const filteredProducts = items.length > 0
          ? allProducts.filter((product) => 
              !items.some((cartItem) => String(cartItem.id) === String(product.numericId))
            )
          : allProducts;
        
        // Take first 6 products
        setAlsoBoughtProducts(filteredProducts.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch also bought products:', err);
        setAlsoBoughtProducts([]);
      } finally {
        setLoadingAlsoBought(false);
      }
    };

    if (isOpen) {
      fetchAlsoBoughtProducts();
    }
  }, [isOpen, items]);

  return (
    <>
      {createPortal(
        <>
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 10000 }}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] max-w-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 10001 }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <h2 className="text-base font-semibold text-slate-900">
            Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="bg-slate-900 text-white px-5 py-3 text-xs font-medium flex-shrink-0">
            Use code WELCOME10 at checkout for 10% off your first order.
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-slate-200 rounded-full blur-2xl opacity-50" />
                <ShoppingBag className="relative h-16 w-16 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-display">Your cart is empty</h3>
              <p className="text-sm text-slate-600 mb-6">Start your wellness journey by adding natural supplements</p>
              <Link
                to="/product"
                onClick={onClose}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white rounded-lg font-semibold text-sm hover:from-slate-900 hover:via-slate-900 hover:to-slate-900 transition-all shadow-md hover:shadow-lg"
              >
                Explore Wellness Products
              </Link>
            </div>
          ) : (
            <div className="px-5 py-3 space-y-3">
              {items.map((item, index) => {
                const isRemoving = removingId === item.id;
                const isVisible = visibleItems.has(item.id);
                const isUpdating = updatingQty === item.id;

                return (
                  <div
                    key={item.id}
                    className={`relative border rounded-lg bg-gradient-to-br from-white to-slate-50/30 p-3 transition-all duration-500 shadow-sm hover:shadow-md ${
                      isRemoving 
                        ? 'opacity-0 scale-95 -translate-x-4' 
                        : isVisible
                        ? 'opacity-100 scale-100'
                        : 'opacity-0'
                    } ${isUpdating ? 'ring-1 ring-slate-300' : ''} ${
                      isVisible ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200'
                    }`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    <div className="flex gap-3">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={onClose}
                        className="flex-shrink-0 group/image"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-50 to-white border border-slate-200 overflow-hidden shadow-md group-hover/image:shadow-lg group-hover/image:border-slate-300 transition-all duration-300">
                          {item.image && item.image !== "" ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                              <ShoppingBag className="h-6 w-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.id}`}
                              onClick={onClose}
                              className="block"
                            >
                              <h3 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-slate-700 transition-colors uppercase tracking-wide leading-tight">
                                {item.name}
                              </h3>
                            </Link>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {item.originalPrice && item.originalPrice > item.price ? (
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm font-bold text-slate-900">₹{item.price}</span>
                            <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice}</span>
                            <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF)
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-slate-900 mb-2">₹{item.price}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="inline-flex items-center rounded-md border border-slate-300 bg-white overflow-hidden shadow-sm hover:shadow transition-shadow">
                            <button
                              onClick={() => handleUpdateQty(item.id, Math.max(1, item.qty - 1))}
                              disabled={item.qty <= 1 || isUpdating}
                              className="p-1.5 hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className={`px-3 py-1.5 text-xs font-semibold text-slate-900 min-w-[2rem] text-center border-x border-slate-300 bg-slate-50 ${isUpdating ? 'text-slate-600' : ''}`}>
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.id, Math.min(99, item.qty + 1))}
                              disabled={item.qty >= 99 || isUpdating}
                              className="p-1.5 hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            ₹{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {items.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent opacity-40"></div>
              <div className="relative z-10">
                <div className="flex gap-2 mb-2.5">
                  <div className="flex-1 relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="p-1.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-md">
                        <Tag className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 text-sm border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-500 transition-all bg-white shadow-md hover:shadow-lg hover:border-slate-400 font-medium placeholder:text-slate-400"
                    />
                    {couponCode && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">8 coupons available</span>
                  <button
                    onClick={() => setShowCouponModal(true)}
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <span>View Coupons</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-200 bg-gradient-to-br from-white via-slate-50/30 to-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-800">Customers also bought</span>
                <span className="text-[10px] text-slate-500 font-medium">Tailored for your ritual</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full border-2 border-slate-200 shadow-lg hover:bg-white hover:border-slate-300 transition-all hover:scale-110"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-700" />
                </button>

                <div
                  ref={carouselRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth pb-2 px-8 hide-scrollbar"
                >
                  {loadingAlsoBought ? (
                    <div className="flex items-center justify-center w-full py-8">
                      <p className="text-xs text-slate-500">Loading products...</p>
                    </div>
                  ) : alsoBoughtProducts.length === 0 ? (
                    <div className="flex items-center justify-center w-full py-8">
                      <p className="text-xs text-slate-500">No products available</p>
                    </div>
                  ) : (
                    alsoBoughtProducts.map((product) => {
                    return (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="group relative flex flex-col w-[140px] flex-shrink-0 p-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-slate-50/50 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative w-full aspect-square rounded-lg bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 overflow-hidden shadow-md group-hover:shadow-xl transition-all mb-2">
                            {product.image ? (
                            <ResponsiveProductImage
                                image={product.image}
                              className="w-full h-full"
                              imgClassName="object-contain p-1.5"
                            />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                <ShoppingBag className="h-8 w-8 text-slate-400" />
                              </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="flex-1 flex flex-col relative z-10">
                          <h4 className="text-[10px] font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 uppercase tracking-wide mb-1">
                            {product.name}
                          </h4>
                          {product.headline && (
                            <p className="text-[9px] text-slate-500 mb-2 font-medium line-clamp-1">{product.headline}</p>
                          )}
                          
                          <div className="flex flex-col items-start mb-2">
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <>
                                <span className="text-xs font-bold text-slate-900">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-[9px] text-slate-400 line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-slate-900">
                                ₹{product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                                addItem({
                                id: String(product.numericId || product.id),
                                name: product.name,
                                price: product.price,
                                image: product.image?.fallback || '',
                              });
                            }}
                            className="w-full px-2 py-1.5 text-[9px] font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg hover:from-slate-900 hover:to-slate-900 shadow-sm hover:shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Quick Add
                          </button>
                        </div>
                      </Link>
                    );
                  })
                  )}
                </div>

                <button
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full border-2 border-slate-200 shadow-lg hover:bg-white hover:border-slate-300 transition-all hover:scale-110"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 text-slate-700" />
                </button>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-white flex-shrink-0">
            {savings > 0 && (
              <div className="px-5 py-1 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-60"></div>
                <div className="flex items-center justify-center gap-1.5 relative z-10">
                  <div className="p-0.5 bg-white/20 backdrop-blur rounded-full border border-white/30 shadow-sm">
                    <Gift className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-[11px] font-semibold text-white tracking-wide">
                    ₹{savings.toLocaleString()} Saved so far!
                  </p>
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full blur-lg"></div>
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full blur-lg"></div>
                </div>
              </div>
            )}

            <div className="px-5 py-2 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 border-b border-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 to-transparent opacity-30"></div>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Estimated Total</span>
                <div className="text-right">
                  {(discountPercent > 0 || discountAmount > 0) && (
                    <span className="text-[9px] text-slate-400 line-through block mb-0.5">
                      ₹{(subtotal + shipping).toLocaleString()}
                    </span>
                  )}
                  {discountAmount > 0 && (
                    <span className="text-[9px] text-slate-600 block mb-0.5 font-semibold">
                      Coupon: -₹{Math.round(discountAmount).toLocaleString()}
                    </span>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-900 tracking-tight">
                      ₹{total.toLocaleString()}
                    </span>
                    {(discountPercent > 0 || appliedCoupon) && (
                      <span className="text-[9px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded-md shadow-sm">
                        {appliedCoupon ? (selectedCouponDetail?.discount_type === 'percentage' ? `${selectedCouponDetail.discount_value}% OFF` : `₹${selectedCouponDetail?.discount_value} OFF`) : `${discountPercent}% OFF`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {shipping === 0 && (
                <div className="flex items-center gap-1.5 mt-1 relative z-10">
                  <div className="p-0.5 bg-slate-800 rounded-full shadow-sm">
                    <Heart className="h-2 w-2 text-white fill-white" />
                  </div>
                  <p className="text-[9px] text-slate-700 font-bold">
                    Free shipping included
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 py-2 bg-gradient-to-b from-white via-slate-50/30 to-white">
              <button
                onClick={handleCheckout}
                className="w-full py-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl font-bold text-xs hover:from-slate-950 hover:via-slate-900 hover:to-slate-950 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
                <Sparkles className="h-3.5 w-3.5 relative z-10" />
                <span className="relative z-10 tracking-wider font-extrabold">Checkout</span>
              </button>
              <p className="text-[9px] text-center text-slate-500 mt-1 font-semibold">
                Combine Wellness Points in Next Step
              </p>
            </div>

            <div className="px-5 pb-2 pt-1.5 bg-white">
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {['Paytm', 'GPay', 'PhonePe', 'UPI', 'Cards'].map((method) => (
                  <div
                    key={method}
                    className="text-[9px] font-bold text-slate-700 bg-gradient-to-br from-white via-slate-50 to-white border-2 border-slate-200 px-2.5 py-1 rounded-lg shadow-md hover:shadow-lg hover:border-slate-300 hover:scale-105 transition-all"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  )}

      {showCouponModal && createPortal(
        <>
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300 z-[10002]"
            onClick={() => setShowCouponModal(false)}
            aria-hidden={!showCouponModal}
          />

          <div
            className="fixed inset-0 z-[10003] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Available Coupons"
            aria-hidden={!showCouponModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Available Coupons</h2>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingCoupons ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-3" />
                    <p className="text-sm text-slate-500">Loading coupons...</p>
                  </div>
                ) : coupons.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-slate-500">No coupons available at this moment.</p>
                  </div>
                ) : (
                  coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="relative border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-slate-50/50"
                      style={{ borderLeftColor: '#45576f', borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">{coupon.code}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md text-white bg-slate-700">
                              {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                          </span>
                        </div>
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">{coupon.name}</h3>
                          {coupon.description && <p className="text-xs text-slate-600">{coupon.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-slate-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleApplyCoupon(coupon.code)}
                          className="px-4 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-md hover:shadow-lg bg-slate-800 hover:bg-slate-900"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default CartDrawer;

