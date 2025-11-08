import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <main className="min-h-[70vh] bg-stone-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="flex items-center space-x-3">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-2 text-sm sm:text-base font-minimal">Continue Shopping</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 font-display">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-slate-600 mb-4 font-minimal">Your cart is empty.</p>
                <Link to="/product" className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm font-sharp">Browse Products</Link>
              </div>
            )}
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={item.image} alt={item.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover ring-1 ring-slate-200" loading="lazy" decoding="async" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium text-slate-900 truncate font-sharp">{item.name}</p>
                      {item.variant && <p className="text-xs sm:text-sm text-slate-500 font-minimal">{item.variant}</p>}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-slate-200">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2 hover:bg-slate-100 rounded-l-full text-slate-600"><Minus className="h-4 w-4" /></button>
                      <span className="px-3 text-sm text-slate-700">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 hover:bg-slate-100 rounded-r-full text-slate-600"><Plus className="h-4 w-4" /></button>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-slate-900 font-sharp">₹ {item.price * item.qty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1 self-start">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-slate-900 font-display">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-minimal">Subtotal</span>
                  <span className="font-medium text-slate-900 font-sharp">₹ {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-minimal">Shipping</span>
                  <span className="font-medium text-slate-900 font-sharp">{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-slate-900 font-display">Total</span>
                  <span className="font-semibold text-slate-900 font-display">₹ {total}</span>
                </div>
              </div>
              <button disabled={items.length === 0} className="w-full mt-5 inline-flex justify-center items-center px-4 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-sharp">Proceed to Checkout</button>
              <p className="mt-3 text-xs text-slate-500 text-center font-minimal">Free shipping on orders over ₹799</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;


