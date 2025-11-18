import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag, Sparkles, ShieldCheck, Truck, Gift, ArrowRight, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { getProductById, productCatalog } from '../data/products';

const Cart: React.FC = () => {
  const { items, updateQty, removeItem, subtotal, addItem } = useCart();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingRecommendation, setAddingRecommendation] = useState<string | null>(null);
  
  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;
  const savings = items.reduce((acc, item) => {
    const product = getProductById(item.id);
    if (product && product.originalPrice > product.price) {
      return acc + (product.originalPrice - product.price) * item.qty;
    }
    return acc;
  }, 0);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    // Add a small delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 300));
    removeItem(id);
    setRemovingId(null);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout page
    alert('Checkout functionality coming soon!');
  };

  const recommendedProducts = useMemo(() => {
    if (items.length === 0) return productCatalog.slice(0, 4);
    return productCatalog
      .filter((product) => !items.some((cartItem) => cartItem.id === product.id))
      .slice(0, 4);
  }, [items]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-8 sm:py-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-2 text-slate-200 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Continue Shopping</span>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-slate-200" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Your Cart
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {items.length === 0 ? (
          /* Empty Cart State */
          <div 
            className="max-w-2xl mx-auto text-center py-16 sm:py-24"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full blur-2xl opacity-50" />
              <ShoppingBag className="relative h-20 w-20 sm:h-24 sm:w-24 text-slate-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link 
              to="/product"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>Browse Products</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items + Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => {
                const product = getProductById(item.id);
                const isRemoving = removingId === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-500 ${
                      isRemoving 
                        ? 'opacity-0 scale-95 -translate-x-4' 
                        : 'opacity-100 scale-100 translate-x-0 hover:shadow-2xl hover:border-slate-300'
                    }`}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration="600"
                  >
                    {/* Decorative Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 group-hover:border-slate-300 transition-all duration-300 shadow-md group-hover:shadow-lg">
                          {product?.image ? (
                            <ResponsiveProductImage
                              image={product.image}
                              className="w-full h-full"
                              imgClassName="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.id}`}
                              className="block group/link"
                            >
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 group-hover/link:text-slate-700 transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                  {item.variant}
                                </p>
                              )}
                            </Link>
                            {product && product.originalPrice > product.price && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg sm:text-xl font-bold text-slate-900">
                                  ₹{item.price}
                                </span>
                                <span className="text-sm text-slate-400 line-through">
                                  ₹{product.originalPrice}
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                              </div>
                            )}
                            {(!product || product.originalPrice <= product.price) && (
                              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                                ₹{item.price}
                              </p>
                            )}
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            onClick={() => handleRemove(item.id)}
                            className="flex-shrink-0 p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group/remove"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4 w-5 h-5 group-hover/remove:scale-110 transition-transform" />
                          </button>
                        </div>

                        {/* Quantity Controls & Total */}
                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              Quantity:
                            </span>
                            <div className="inline-flex items-center rounded-full border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
                              <button 
                                onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                                className="p-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.qty <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-[3rem] text-center border-x border-slate-200">
                                {item.qty}
                              </span>
                              <button 
                                onClick={() => updateQty(item.id, Math.min(99, item.qty + 1))}
                                className="p-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.qty >= 99}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                              Item Total
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900">
                              ₹{item.price * item.qty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div 
                className="sticky top-8 rounded-2xl border-2 border-slate-200 bg-white shadow-xl overflow-hidden"
                data-aos="fade-left"
                data-aos-delay="200"
                data-aos-duration="600"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Savings Badge */}
                  {savings > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
                      <Gift className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                          Total Savings
                        </p>
                        <p className="text-lg font-bold text-emerald-700">
                          ₹{savings}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Subtotal</span>
                      <span className="text-base font-bold text-slate-900">₹{subtotal}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">Shipping</span>
                      </div>
                      <span className="text-base font-bold text-slate-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    {subtotal < 799 && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="font-semibold text-emerald-600">₹{799 - subtotal}</span> more for free shipping!
                      </div>
                    )}

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-4" />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-slate-900">₹{total}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={handleCheckout}
                    className="w-full mt-6 group relative inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative flex items-center gap-2">
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2.5 shadow-inner">
                      <ShieldCheck className="h-6 w-6 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-slate-500">Secure</p>
                        <p className="text-[11px] font-semibold text-slate-900">Encrypted checkout</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2.5 shadow-inner">
                      <Truck className="h-6 w-6 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-slate-500">Shipping</p>
                        <p className="text-[11px] font-semibold text-slate-900">Free over ₹799</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2.5 shadow-inner">
                      <Heart className="h-6 w-6 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-slate-500">Promise</p>
                        <p className="text-[11px] font-semibold text-slate-900">30-day guarantee</p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Shopping Link */}
                  <Link
                    to="/product"
                    className="block w-full text-center mt-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Customers Also Bought */}
      {recommendedProducts.length > 0 && (
        <section className="pb-16 pt-4">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3" data-aos="fade-up" data-aos-duration="700">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Curated Ritual Pairings
              </p>
              <h2 className="text-3xl font-bold text-slate-900 font-display">
                Customers also bought
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Elevate your wellness routine with these perfectly paired rituals—handpicked from our communityʼs favorite combinations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl border-2 border-white/70 bg-gradient-to-br from-white to-slate-50 shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  data-aos-duration="600"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col gap-4 p-4">
                    <div className="relative rounded-2xl bg-white/80 border border-slate-100 shadow-inner">
                      <ResponsiveProductImage
                        image={product.image}
                        className="w-full aspect-square rounded-2xl"
                        imgClassName="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-800 shadow-sm">
                        Ritual
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{product.rating}.0</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">₹{product.price}</p>
                        <p className="text-xs text-slate-400 line-through">₹{product.originalPrice}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition-all duration-300 hover:border-slate-300 hover:text-slate-900"
                      >
                        Explore
                      </Link>
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
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {addingRecommendation === product.id ? (
                          <>
                            <Sparkles className="h-3 w-3 animate-pulse" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3 w-3" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Cart;
