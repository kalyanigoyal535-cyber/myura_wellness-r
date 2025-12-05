import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { ordersApi } from '../services/orders';
import { Order } from '../services/types';
import { useAuth } from '../context/AuthContext';

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract parameters from URL
  const orderId = searchParams.get('order_id');
  const errorMessage = searchParams.get('error') || searchParams.get('message');
  const paymentGateway = searchParams.get('gateway') || 'phonepe';

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        navigate('/my-account', { state: { redirectTo: `/payment/failure?order_id=${orderId}` } });
        return;
      }

      try {
        setLoading(true);
        const orderData = await ordersApi.getOrder(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isAuthenticated, navigate]);

  // Format amount
  const formatAmount = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  // Get error message
  const getErrorMessage = () => {
    if (errorMessage) {
      return decodeURIComponent(errorMessage);
    }
    if (error) {
      return error;
    }
    return 'Payment could not be processed. Please try again or use a different payment method.';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Failed</h1>
          <p className="text-slate-600">We couldn't process your payment. Don't worry, your order is safe.</p>
        </div>

        {/* Error Message Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">What happened?</h3>
              <p className="text-sm text-amber-800">{getErrorMessage()}</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="bg-slate-900 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Order Number</p>
                  <p className="text-xl font-semibold">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">Total Amount</p>
                  <p className="text-xl font-semibold">{formatAmount(order.total_amount)}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600">Payment Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                  <XCircle className="w-3 h-3" />
                  Failed
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Your order has been created but payment is pending. You can retry payment or choose a different payment
                method.
              </p>
            </div>
          </div>
        )}

        {/* Common Reasons */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Common Reasons for Payment Failure</h2>
          </div>
          <div className="p-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></div>
              <p>Insufficient funds in your account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></div>
              <p>Incorrect card details or expired card</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></div>
              <p>Network connectivity issues</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></div>
              <p>Bank security restrictions or OTP timeout</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {order && (
            <Link
              to={`/order-details/${order.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Payment
            </Link>
          )}
          <Link
            to="/checkout"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Checkout
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-2">
            If the problem persists, please try using Cash on Delivery (COD) or contact our support team.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-slate-700 underline"
          >
            Contact Support
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              • Your order is safe and will not be processed until payment is successful.
            </p>
            <p>
              • You can retry payment from your order details page or choose a different payment method.
            </p>
            <p>
              • For payment-related queries, contact us at{' '}
              <a href="mailto:support@myurawellness.com" className="text-slate-900 font-semibold underline">
                support@myurawellness.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailure;



