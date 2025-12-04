import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { phonepeApi, cashfreeApi } from '../services/payment';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Check which payment gateway was used
        const transactionId = searchParams.get('transactionId'); // PhonePe
        const orderIdParam = searchParams.get('orderId');
        const code = searchParams.get('code'); // PhonePe
        const cashfreeOrderId = searchParams.get('order_id'); // Cashfree
        const orderIdParamCashfree = searchParams.get('order_id'); // Cashfree uses order_id

        // Determine payment gateway
        const isCashfree = !!cashfreeOrderId || !!orderIdParamCashfree;
        const isPhonePe = !!transactionId && !!orderIdParam;

        if (!isPhonePe && !isCashfree) {
          setStatus('failed');
          setMessage('Missing payment information');
          return;
        }

        let orderIdNum: number;
        let result: any;

        if (isCashfree) {
          // Cashfree callback
          orderIdNum = parseInt(orderIdParamCashfree || '0', 10);
          if (!orderIdNum) {
            setStatus('failed');
            setMessage('Invalid order ID');
            return;
          }
          setOrderId(orderIdNum);

          // For Cashfree, we need the order ID from URL
          const cashfreeOrderIdFromUrl = cashfreeOrderId || orderIdParamCashfree || '';
          result = await cashfreeApi.verifyPayment({
            order_id: cashfreeOrderIdFromUrl,
            order_db_id: orderIdNum,
          });
        } else {
          // PhonePe callback
          orderIdNum = parseInt(orderIdParam || '0', 10);
          if (!orderIdNum || !transactionId) {
            setStatus('failed');
            setMessage('Missing payment information');
            return;
          }
          setOrderId(orderIdNum);

          result = await phonepeApi.verifyPayment({
            transaction_id: transactionId,
            order_id: orderIdNum,
          });
        }

        if (result.success && result.payment_status === 'paid') {
          setStatus('success');
          setMessage('Payment successful! Redirecting to order details...');
          
          // Redirect to order details after 2 seconds
          setTimeout(() => {
            navigate(`/order-details/${orderIdNum}`, {
              state: { orderId: orderIdNum, success: true },
            });
          }, 2000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed or payment is still pending');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-spin" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Verifying Payment</h1>
            <p className="text-slate-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-6">{message}</p>
            {orderId && (
              <button
                onClick={() => navigate(`/order-details/${orderId}`)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                View Order Details
              </button>
            )}
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Payment Failed</h1>
            <p className="text-slate-500 mb-6">{message}</p>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              Back to Cart
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default PaymentCallback;

