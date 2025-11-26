import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  Gift,
  ShieldCheck,
  Truck,
  Phone,
  User,
  MapPin,
  CreditCard,
  Wallet,
  Sparkles,
  X,
  Tag,
} from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: 'cod' | 'card' | 'upi';
  updatesOptIn: boolean;
};

const initialForm: CheckoutForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  paymentMethod: 'cod',
  updatesOptIn: true,
};

const COUPONS = [
  {
    code: 'EXCLUSIVEBOTTLE',
    minSubtotal: 899,
    reward: 'Free glass bottle will be added to your order.',
    description: 'Add products worth ₹899/- to unlock a complimentary Minimalist glass bottle (limited time).',
  },
  {
    code: 'TRAVEL799',
    minSubtotal: 799,
    reward: 'Free travel pouch will be added.',
    description: 'Spend ₹799/- and receive an exclusive travel pouch for your skincare minis.',
  },
  {
    code: 'OAT599',
    minSubtotal: 599,
    reward: 'Enjoy a free 50ml oat extract cleanser.',
    description: 'Cross ₹599/- to unlock a refreshing oat cleanser mini on the house.',
  },
];

const Checkout: React.FC = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { previousPath, openDrawerOnBack }: { previousPath?: string; openDrawerOnBack?: boolean } =
    (location.state as { previousPath?: string; openDrawerOnBack?: boolean }) || {};
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const openCartDrawer = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('myura:open-cart'));
    }
  };

  const handleBackToCart = () => {
    const targetPath = previousPath || '/cart';
    navigate(targetPath);
    if (openDrawerOnBack) {
      setTimeout(() => {
        openCartDrawer();
      }, 100);
    }
  };


  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const selectedCouponDetail = useMemo(
    () => COUPONS.find((coupon) => coupon.code === appliedCoupon) ?? null,
    [appliedCoupon]
  );

  const handleFormChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCoupon = (code?: string) => {
    const normalized = (code || couponInput).trim().toUpperCase();

    if (!normalized) {
      setCouponMessage('Enter a coupon code to apply.');
      return;
    }

    const coupon = COUPONS.find((c) => c.code === normalized);

    if (!coupon) {
      setCouponMessage('Coupon not found. Please try a different code.');
      return;
    }

    if (subtotal < coupon.minSubtotal) {
      setCouponMessage(`Add ₹${coupon.minSubtotal - subtotal} more to unlock ${coupon.code}.`);
      return;
    }

    setAppliedCoupon(coupon.code);
    setCouponMessage(`${coupon.code} applied! ${coupon.reward}`);
    setCouponInput('');
  };

  const isFormValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim() &&
    items.length > 0;

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid || placingOrder) return;

    setPlacingOrder(true);
    setTimeout(() => {
      clear();
      navigate('/', { replace: true });
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-500 mb-6">Add products to your cart before heading to checkout.</p>
          <Link
            to="/product"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Browse products
            <ArrowLeft className="rotate-180 w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600">
            <button
              type="button"
              onClick={handleBackToCart}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </button>
            <span className="hidden sm:block text-xs uppercase tracking-[0.25em] text-slate-400">Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-slate-900">
            <ShoppingBag className="h-5 w-5" />
            <p className="text-lg font-semibold">Secure Checkout</p>
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <div className="space-y-6 lg:col-span-2">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Contact Details</p>
                  <p className="text-xs text-slate-500">We will send order updates on WhatsApp/SMS</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="text-slate-600">Full name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                    placeholder="Enter your name"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-600">Phone number</span>
                  <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400 transition">
                    <span className="px-3 text-slate-500 text-sm border-r border-slate-200">+91</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="flex-1 px-3 py-2.5 focus:outline-none"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </label>
              </div>

              <label className="space-y-1 text-sm block">
                <span className="text-slate-600">Email address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  placeholder="name@example.com (optional)"
                />
              </label>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Delivery Address</p>
                  <p className="text-xs text-slate-500">Ships across India within 3-5 working days</p>
                </div>
              </div>

              <label className="space-y-1 text-sm block">
                <span className="text-slate-600">Street address</span>
                <textarea
                  value={form.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition resize-none"
                  placeholder="House number, street name, area"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="text-slate-600">City</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-600">State</span>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => handleFormChange('state', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-600">Postal code</span>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => handleFormChange('postalCode', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                    placeholder="6 digit PIN"
                  />
                </label>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Payment Method</p>
                  <p className="text-xs text-slate-500">No-questions-asked return policy</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: Phone },
                  { value: 'card', label: 'Cards / NetBanking', icon: CreditCard },
                  { value: 'upi', label: 'UPI Apps', icon: Sparkles },
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`border rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition hover:border-slate-400 ${
                      form.paymentMethod === value ? 'border-slate-900 shadow-sm' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      className="sr-only"
                      checked={form.paymentMethod === value}
                      onChange={() => handleFormChange('paymentMethod', value)}
                    />
                    <Icon className="h-5 w-5 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-900">{label}</span>
                    <span className="text-xs text-slate-500">
                      {value === 'cod' && 'Pay when the order is delivered'}
                      {value === 'card' && 'Visa, MasterCard, RuPay & more'}
                      {value === 'upi' && 'Google Pay, PhonePe, Paytm, BHIM'}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="bg-slate-900 text-white px-5 py-4 flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" />
                <p className="text-base font-semibold">Order Summary</p>
              </div>

              <div className="p-5 space-y-4">
                {items.map((item) => {
                  const product = getProductById(item.id);
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                        {product?.image ? (
                          <ResponsiveProductImage
                            image={product.image}
                            className="w-full h-full"
                            imgClassName="object-contain p-2"
                          />
                        ) : (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  );
                })}

                <div className="border-t border-slate-200 pt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-slate-400" />
                      Shipping
                    </span>
                    <span className="font-semibold text-slate-900">
                      {shipping === 0 ? <span className="text-emerald-600">Free</span> : `₹${shipping}`}
                    </span>
                  </div>
                  {selectedCouponDetail && (
                    <div className="flex justify-between text-emerald-700">
                      <span>{selectedCouponDetail.code}</span>
                      <span className="font-semibold">Gift added</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-200" />
                  <div className="flex justify-between text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold text-slate-900">Coupons & Offers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(true)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  View all ({COUPONS.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Tag className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </div>
              {couponMessage && <p className="text-xs text-slate-500">{couponMessage}</p>}
              {appliedCoupon && selectedCouponDetail && (
                <p className="text-xs text-emerald-600 font-medium">
                  {selectedCouponDetail.reward}
                </p>
              )}
            </section>
      {showCouponModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Available coupons"
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <p className="text-sm font-semibold">Available Coupons</p>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="rounded-full p-1 hover:bg-white/20 transition"
                aria-label="Close coupon list"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 space-y-3">
              {COUPONS.map((coupon) => (
                <div
                  key={coupon.code}
                  className="border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{coupon.code}</p>
                      <p className="text-xs text-slate-500">Spend ₹{coupon.minSubtotal}+ </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleApplyCoupon(coupon.code);
                        setShowCouponModal(false);
                      }}
                      className="text-xs font-semibold text-slate-900 hover:text-slate-700"
                    >
                      {appliedCoupon === coupon.code ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">{coupon.description}</p>
                  <p className="text-[11px] text-slate-400">{coupon.reward}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <p className="text-sm font-semibold text-slate-900">100% secured payment</p>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={form.updatesOptIn}
                  onChange={(e) => handleFormChange('updatesOptIn', e.target.checked)}
                  className="mt-0.5"
                />
                Send me order updates & offers (no spam)
              </label>
              <button
                type="submit"
                disabled={!isFormValid || placingOrder}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Placing order...' : 'Place Order'}
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                By proceeding, you agree to Minimalist&apos;s privacy policy & T&C
              </p>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;

