import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { ordersApi } from '../services/orders';
import { phonepeApi, cashfreeApi } from '../services/payment';
import { Order } from '../services/types';
import { useAuth } from '../context/AuthContext';
import { analytics } from '../services/analytics';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const orderId = searchParams.get('order_id');
  const transactionId = searchParams.get('transaction_id');
  const paymentGateway = searchParams.get('gateway') || 'phonepe';
  const cashfreeOrderId = searchParams.get('cf_order_id');

  useEffect(() => {
    if (orderId && !transactionId && !cashfreeOrderId) {
      const storedPaymentInfo = sessionStorage.getItem(`payment_${orderId}`);
      if (storedPaymentInfo) {
        try {
          const paymentInfo = JSON.parse(storedPaymentInfo);
          sessionStorage.removeItem(`payment_${orderId}`);
        } catch (e) {
        }
      }
    }
  }, [orderId, transactionId, cashfreeOrderId]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setVerificationError('Order ID is missing');
        setVerifying(false);
        return;
      }

      if (!isAuthenticated) {
        navigate('/my-account', { state: { redirectTo: `/payment/success?order_id=${orderId}` } });
        return;
      }

      try {
        setVerifying(true);
        setVerificationError(null);

        const orderData = await ordersApi.getOrder(parseInt(orderId));
        setOrder(orderData);

        const isPaid = orderData.payment_status === 'paid';
        if (isPaid) {
          setPaymentVerified(true);
          setVerifying(false);
          
          // Track purchase event if already paid (e.g. on refresh)
          analytics.trackEvent('purchase', {
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            total: parseFloat(orderData.total_amount),
            paymentMethod: orderData.payment_method
          });
          return;
        }

        if (paymentGateway === 'cashfree' && cashfreeOrderId) {
          const verifyResponse = await cashfreeApi.verifyPayment({
            order_id: cashfreeOrderId,
            order_db_id: parseInt(orderId),
          });

          if (verifyResponse.success && verifyResponse.payment_status === 'paid') {
            setPaymentVerified(true);
            const updatedOrder = await ordersApi.getOrder(parseInt(orderId));
            setOrder(updatedOrder);

            // Track purchase event
            analytics.trackEvent('purchase', {
              orderId: updatedOrder.id,
              orderNumber: updatedOrder.order_number,
              total: parseFloat(updatedOrder.total_amount),
              paymentMethod: 'cashfree'
            });
          } else {
            setVerificationError('Payment verification failed. Please contact support if payment was deducted.');
          }
        } else if (paymentGateway === 'phonepe' && transactionId) {
          const verifyResponse = await phonepeApi.verifyPayment({
            transaction_id: transactionId,
            order_id: parseInt(orderId),
          });

          if (verifyResponse.success && verifyResponse.payment_status === 'paid') {
            setPaymentVerified(true);
            const updatedOrder = await ordersApi.getOrder(parseInt(orderId));
            setOrder(updatedOrder);

            // Track purchase event
            analytics.trackEvent('purchase', {
              orderId: updatedOrder.id,
              orderNumber: updatedOrder.order_number,
              total: parseFloat(updatedOrder.total_amount),
              paymentMethod: 'phonepe'
            });
          } else {
            setVerificationError('Payment verification failed. Please contact support if payment was deducted.');
          }
        } else {
          const isAlreadyPaid = orderData.payment_status === 'paid';
          if (isAlreadyPaid) {
            setPaymentVerified(true);
            setVerifying(false);
            
            // Track purchase event
            analytics.trackEvent('purchase', {
              orderId: orderData.id,
              orderNumber: orderData.order_number,
              total: parseFloat(orderData.total_amount),
              paymentMethod: orderData.payment_method
            });
          } else {
            setVerificationError('Payment verification parameters are missing. If payment was successful, your order will be updated shortly. Please contact support if you have concerns.');
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationError(
          error instanceof Error
            ? error.message
            : 'Failed to verify payment. Please contact support if payment was deducted.'
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, transactionId, paymentGateway, cashfreeOrderId, isAuthenticated, navigate]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  if (verifying) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
          <Loader2 className="w-12 h-12 mx-auto text-slate-400 mb-4 animate-spin" />
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Verifying Payment</h1>
          <p className="text-slate-600">Please wait while we verify your payment...</p>
        </div>
      </main>
    );
  }

  if (verificationError && !paymentVerified) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Verification Issue</h1>
          <p className="text-slate-600 mb-6">{verificationError}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              View Orders
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600">Your order has been confirmed and payment received.</p>
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
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-2xl font-bold text-slate-900">{formatAmount(order.total_amount)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Order Date</p>
                  <p className="font-semibold text-slate-900">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Payment Status</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid
                  </span>
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-1 text-sm">Payment Method</p>
                <p className="font-semibold text-slate-900 capitalize">
                  {order.payment_method === 'phonepe' ? 'PhonePe' : order.payment_method === 'cashfree' ? 'Cashfree' : order.payment_method || 'Online Payment'}
                </p>
              </div>

              {order.payment_id && (
                <div>
                  <p className="text-slate-500 mb-1 text-sm">Transaction ID</p>
                  <p className="font-mono text-sm text-slate-700">{order.payment_id}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-500 mb-2 text-sm">Delivery Address</p>
                <div className="text-slate-900">
                  <p className="font-semibold">{order.shipping_address.full_name}</p>
                  <p className="text-sm">{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && (
                    <p className="text-sm">{order.shipping_address.address_line_2}</p>
                  )}
                  <p className="text-sm">
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p className="text-sm">{order.shipping_address.country}</p>
                  <p className="text-sm mt-1">{order.shipping_address.phone_number}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        {order && order.items && order.items.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.product.name}</p>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">{formatAmount(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/order-details/${order?.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            View Order Details
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/product"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            You will receive an order confirmation email shortly. For any queries, please{' '}
            <Link to="/contact" className="text-slate-900 font-semibold underline hover:text-slate-700">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;

