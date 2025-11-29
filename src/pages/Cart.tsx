import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag, Sparkles, ShieldCheck, Truck, Gift, ArrowRight, Heart, Star, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ResponsiveProductImage, { ResponsiveImageDescriptor } from '../components/ResponsiveProductImage';
import { getProductById, productCatalog, type ProductRecord } from '../data/products';

// Helper to convert string URL to ResponsiveImageDescriptor
const urlToImageDescriptor = (url: string, alt: string): ResponsiveImageDescriptor => {
  return {
    alt,
    fallback: url,
    sources: [
      {
        srcSet: url,
        media: '(min-width: 1024px)',
      },
      {
        srcSet: url,
        media: '(min-width: 768px)',
      },
      {
        srcSet: url,
        media: '(max-width: 767px)',
      },
    ],
  };
};

const Cart: React.FC = () => {
  const { items, updateQty, removeItem, subtotal, addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingRecommendation, setAddingRecommendation] = useState<string | null>(null);
  const [updatingQty, setUpdatingQty] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [productImages, setProductImages] = useState<Map<string, string>>(new Map());
  
  // Map product names to static product slugs for image lookup
  // This is more reliable than ID mapping since IDs can change
  const productNameToSlugMap: Record<string, string> = {
    'DIA CARE': 'dia-care',
    'LIVER DETOX FORMULA': 'liver-detox',
    'BONE & JOINT SUPPORT': 'bone-joint-support',
    'GUT AND DIGESTION': 'gut-and-digestion',
    "WOMEN'S HEALTH PLUS": 'womens-health-plus',
    "MEN'S VITALITY BOOSTER": 'mens-vitality-booster',
  };
  
  // Get product from static data by matching name or ID
  const getProductForCartItem = (itemId: string, itemName?: string): ProductRecord | null => {
    // First try direct lookup by ID (if it's a slug)
    let product = getProductById(itemId);
    
    // If not found, try matching by product name
    if (!product && itemName) {
      const normalizedName = itemName.toUpperCase().trim();
      
      // Try the name-to-slug map first
      const slug = productNameToSlugMap[normalizedName];
      if (slug) {
        product = getProductById(slug);
      }
      
      // If still not found, search by name in product catalog
      if (!product) {
        product = productCatalog.find(p => {
          const productName = p.name.toUpperCase().trim();
          return productName === normalizedName;
        }) || null;
      }
    }
    
    
    return product || null;
  };
  
  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;
  const savings = items.reduce((acc, item) => {
    const product = getProductForCartItem(item.id, item.name);
    if (product && product.originalPrice > product.price) {
      return acc + (product.originalPrice - product.price) * item.qty;
    }
    return acc;
  }, 0);

  // Track visible items for smooth entrance animations
  useEffect(() => {
    items.forEach((item) => {
      if (!visibleItems.has(item.id)) {
        // Delay each item's appearance for staggered effect
        setTimeout(() => {
          setVisibleItems((prev) => new Set(prev).add(item.id));
        }, 50);
      }
    });
    
    // Clean up removed items from visible set
    const itemIds = new Set(items.map((item) => item.id));
    setVisibleItems((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (itemIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [items, visibleItems]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    setVisibleItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, 400));
    removeItem(id);
    setRemovingId(null);
  };

  const handleUpdateQty = async (id: string, newQty: number) => {
    setUpdatingQty(id);
    updateQty(id, newQty);
    // Brief animation feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    setUpdatingQty(null);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout', {
      state: {
        previousPath: location.pathname,
        openDrawerOnBack: false,
      },
    });
  };

  const recommendedProducts = useMemo(() => {
    if (items.length === 0) return productCatalog.slice(0, 4);
    return productCatalog
      .filter((product) => !items.some((cartItem) => cartItem.id === product.id))
      .slice(0, 4);
  }, [items]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header - Minimalist */}
      <section className="bg-white border-b border-slate-200 py-6 sm:py-8">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Continue Shopping</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 text-slate-700" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight">
                Cart ({items.length})
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {items.length === 0 ? (
          /* Empty Cart State - Minimalist */
          <div 
            className="max-w-lg mx-auto text-center py-20 sm:py-28"
            style={{
              animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-slate-100 rounded-full blur-2xl opacity-60" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 sm:h-14 sm:w-14 text-slate-300" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm sm:text-base">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link 
              to="/product"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:bg-slate-800 transition-all duration-300 active:scale-[0.98]"
            >
              <span>Browse Products</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items + Recommendations */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => {
                    const product = getProductForCartItem(item.id);
                const isRemoving = removingId === item.id;
                const isVisible = visibleItems.has(item.id);
                const isUpdating = updatingQty === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`cart-item group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 ease-out ${
                      isRemoving 
                        ? 'cart-item-exit' 
                        : isVisible
                        ? 'cart-item-enter'
                        : 'opacity-0 translate-y-4'
                    } ${isUpdating ? 'ring-2 ring-blue-200' : ''}`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                      {/* Product Image with enhanced styling */}
                      <div className="flex-shrink-0">
                        <Link
                          to={`/product/${item.id}`}
                          className="block group/image"
                        >
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 group-hover:border-slate-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
                            {(() => {
                              // Always use static product images directly (no API URLs needed)
                              const staticProduct = getProductForCartItem(item.id, item.name);
                              
                              if (staticProduct?.image) {
                                return (
                                  <ResponsiveProductImage
                                    image={staticProduct.image}
                                    className="w-full h-full"
                                    imgClassName="object-contain p-2 group-hover/image:scale-110 transition-transform duration-500"
                                  />
                                );
                              }
                              
                              // Fallback: No image available - show placeholder
                              return (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                  <ShoppingBag className="h-8 w-8 text-slate-300" />
                                </div>
                              );
                            })()}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors duration-300" />
                          </div>
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.id}`}
                              className="block group/link"
                            >
                              <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 mb-1 group-hover/link:text-slate-700 transition-colors line-clamp-2 leading-snug">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                  {item.variant}
                                </p>
                              )}
                            </Link>
                            
                            {/* Price Display */}
                            <div className="flex items-center gap-2.5 mt-2.5">
                              {product && product.originalPrice > product.price ? (
                                <>
                                  <span className="text-base sm:text-lg font-bold text-slate-900">
                                    ₹{item.price}
                                  </span>
                                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-base sm:text-lg font-bold text-slate-900">
                                  ₹{item.price}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Remove Button - Minimalist style */}
                          <button 
                            onClick={() => handleRemove(item.id)}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 group/remove active:scale-95"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4 group-hover/remove:rotate-90 transition-transform duration-300" />
                          </button>
                        </div>

                        {/* Quantity Controls & Total */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          {/* Quantity Selector - Enhanced */}
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider hidden sm:block">
                              Qty:
                            </span>
                            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                              <button 
                                onClick={() => handleUpdateQty(item.id, Math.max(1, item.qty - 1))}
                                className="quantity-btn p-2 sm:p-2.5 hover:bg-slate-50 active:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={item.qty <= 1 || isUpdating}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                              <span className={`quantity-value px-4 py-2 text-sm font-semibold text-slate-900 min-w-[2.5rem] text-center border-x border-slate-200 transition-all duration-300 ${isUpdating ? 'scale-110 text-blue-600' : ''}`}>
                                {item.qty}
                              </span>
                              <button 
                                onClick={() => handleUpdateQty(item.id, Math.min(99, item.qty + 1))}
                                className="quantity-btn p-2 sm:p-2.5 hover:bg-slate-50 active:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={item.qty >= 99 || isUpdating}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total - Enhanced */}
                          <div className="text-right sm:text-left">
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                              Total
                            </p>
                            <p className={`text-lg sm:text-xl font-bold text-slate-900 transition-all duration-300 ${isUpdating ? 'scale-105' : ''}`}>
                              ₹{(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary - Minimalist Style */}
            <aside className="lg:col-span-1">
              <div 
                className="order-summary sticky top-8 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-slide-in-right"
                style={{
                  animation: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Header - Clean minimalist */}
                <div className="bg-slate-900 px-5 sm:px-6 py-4 border-b border-slate-800">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {/* Savings Badge - Subtle */}
                  {savings > 0 && (
                    <div className="savings-badge flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50/80 border border-emerald-100 animate-pulse-subtle">
                      <Gift className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                          You Save
                        </p>
                        <p className="text-base font-bold text-emerald-700">
                          ₹{savings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown - Clean */}
                  <div className="space-y-3.5 pt-1">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium text-slate-600">Subtotal</span>
                      <span className="text-sm font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Shipping</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    {subtotal < 799 && subtotal > 0 && (
                      <div className="text-[11px] text-slate-600 bg-blue-50/60 border border-blue-100 p-2.5 rounded-lg">
                        <span className="font-semibold text-blue-700">₹{799 - subtotal}</span> more for <span className="font-semibold text-emerald-600">free shipping</span>
                      </div>
                    )}

                    <div className="h-px bg-slate-200 my-4" />

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-base font-semibold text-slate-900">Total</span>
                      <span className="text-xl font-bold text-slate-900">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button - Minimalist */}
                  <button 
                    onClick={handleCheckout}
                    className="w-full mt-6 group relative inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    disabled={items.length === 0}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      Checkout
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Trust Badges - Minimal */}
                  <div className="mt-6 grid grid-cols-1 gap-2.5">
                    <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
                      <ShieldCheck className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Secure Checkout</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
                      <Truck className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Free Shipping over ₹799</p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Shopping Link */}
                  <Link
                    to="/product"
                    className="block w-full text-center mt-4 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Customers Also Bought */}
      {recommendedProducts.length > 0 && (
        <section className="pb-16 pt-8 border-t border-slate-200">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                You may also like
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                Customers also bought
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms backwards`,
                  }}
                >
                  <div className="relative flex flex-col gap-3 p-4">
                    <Link to={`/product/${product.id}`} className="block group/image">
                      <div className="relative rounded-lg bg-slate-50 border border-slate-100 overflow-hidden aspect-square">
                        <ResponsiveProductImage
                          image={product.image}
                          className="w-full h-full"
                          imgClassName="object-contain p-4 group-hover/image:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <div className="space-y-2">
                      <Link to={`/product/${product.id}`}>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-slate-700 transition-colors">
                          {product.name}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-slate-600">{product.rating}.0</span>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-slate-900">₹{product.price}</p>
                          <p className="text-xs text-slate-400 line-through">₹{product.originalPrice}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (addingRecommendation === product.id) return;
                        setAddingRecommendation(product.id);
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image?.fallback || '',
                        }, 1);
                        setTimeout(() => setAddingRecommendation(null), 1000);
                      }}
                      disabled={addingRecommendation === product.id}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {addingRecommendation === product.id ? (
                        <>
                          <Sparkles className="h-3 w-3 animate-pulse" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3 w-3" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Cart Animations CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes cartItemEnter {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes cartItemExit {
          to {
            opacity: 0;
            transform: translateX(-100%) scale(0.9);
            margin-bottom: -200px;
            height: 0;
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        
        @keyframes pulseSubtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        
        .cart-item-enter {
          animation: cartItemEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .cart-item-exit {
          animation: cartItemExit 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-pulse-subtle {
          animation: pulseSubtle 2s ease-in-out infinite;
        }
        
        .quantity-btn:active {
          transform: scale(0.9);
        }
        
        .quantity-value {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cart-item {
          will-change: transform, opacity;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: rgba(148, 163, 184, 0.3);
        }
        
        .savings-badge {
          animation: pulseSubtle 3s ease-in-out infinite;
        }
        
        /* Smooth transitions for all interactive elements */
        .cart-item * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Loading state for quantity updates */
        .cart-item[style*="ring-2"] {
          animation: none;
        }
        
        /* Smooth number transitions */
        .quantity-value,
        .order-summary span:last-child {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </main>
  );
};

export default Cart;
