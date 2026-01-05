import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ResponsiveProductImage from './ResponsiveProductImage';
import { type ProductRecord } from '../data/products';
import { productsApi } from '../services/products';
import { apiProductsToFrontend } from '../utils/productConverter';

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
  const [alsoBoughtProducts, setAlsoBoughtProducts] = useState<ProductRecord[]>([]);
  const [loadingAlsoBought, setLoadingAlsoBought] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  // Fetch "also bought" products from API
  useEffect(() => {
    const fetchAlsoBoughtProducts = async () => {
      try {
        setLoadingAlsoBought(true);
        const response = await productsApi.getProducts({ 
          in_stock: true,
          page: 1 
        });
        
        const allProducts = apiProductsToFrontend(response.results || []);
        const filteredProducts = items.length > 0
          ? allProducts.filter((product) => 
              !items.some((cartItem) => String(cartItem.id) === String(product.numericId))
            )
          : allProducts;
        
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

  const originalSubtotal = items.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + item.originalPrice * item.qty;
    }
    return acc + item.price * item.qty;
  }, 0);

  const discountPercent = originalSubtotal > 0 
    ? Math.round(((originalSubtotal - subtotal) / originalSubtotal) * 100) 
    : 0;

  useEffect(() => {
    if (!isOpen) return;
    
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
    await new Promise(resolve => setTimeout(resolve, 400));
    } catch (error) {
      console.error('Failed to remove item:', error);
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
              <div className="bg-slate-900 text-white px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-center flex-shrink-0">
                View and apply coupons at checkout.
          </div>
        )}

            <div className="overflow-y-auto overscroll-contain flex-initial">
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
                <div className="px-5 py-4 border-t border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customers also bought</span>
                    <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                    }
                  }}
                        className="p-1.5 rounded-full border border-slate-200 hover:border-slate-900 transition-colors"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (carouselRef.current) {
                            carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                          }
                        }}
                        className="p-1.5 rounded-full border border-slate-200 hover:border-slate-900 transition-colors"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-3 w-3" />
                </button>
                    </div>
                  </div>

                <div
                  ref={carouselRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar pb-2"
                  >
                    {loadingAlsoBought ? (
                      [1, 2, 3].map((n) => (
                        <div key={n} className="w-[140px] flex-shrink-0 animate-pulse">
                          <div className="aspect-square bg-slate-100 rounded-xl mb-3" />
                          <div className="h-3 bg-slate-100 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                      ))
                    ) : (
                      alsoBoughtProducts.map((product) => (
                        <div key={product.id} className="w-[140px] flex-shrink-0 group">
                          <Link to={`/product/${product.id}`} onClick={onClose} className="block mb-3">
                            <div className="aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden relative group-hover:border-slate-300 transition-all">
                              {product.image ? (
                            <ResponsiveProductImage
                                  image={product.image}
                              className="w-full h-full"
                                  imgClassName="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-8 w-8 text-slate-200" />
                                </div>
                              )}
                        </div>
                          </Link>
                          <Link to={`/product/${product.id}`} onClick={onClose} className="block mb-2">
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide line-clamp-1 group-hover:text-slate-600 transition-colors">
                            {product.name}
                          </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[9px] text-slate-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          </Link>
                          <button
                            onClick={() => addItem({
                              id: String(product.numericId || product.id),
                              name: product.name,
                              price: product.price,
                              image: product.image?.fallback || '',
                            })}
                            className="w-full py-2 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-200 bg-white flex-shrink-0 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.15)] mt-auto">
                {/* Professional Order Summary */}
                <div className="px-6 py-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-slate-900 font-black">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Shipping Fee</span>
                    <span className={shipping === 0 ? "text-emerald-600 font-black uppercase text-[10px] tracking-widest" : "text-slate-900 font-black"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="pt-4 mt-3 border-t-2 border-slate-100 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1.5">Estimated Total</span>
                      <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">₹{total.toLocaleString()}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex flex-col items-end gap-1.5">
                        {originalSubtotal > subtotal && (
                          <span className="text-[10px] font-bold text-slate-400 line-through">₹{originalSubtotal.toLocaleString()}</span>
                        )}
                        <span className="text-[10px] font-black text-white bg-emerald-600 px-2.5 py-1 rounded-lg shadow-md">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-8 pt-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-[0.98] flex items-center justify-center gap-4 group uppercase tracking-[0.2em] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <Sparkles className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform relative z-10" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
        , document.body)}
    </>
  );
};

export default CartDrawer;
