import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ordersApi } from "../../services/orders";
import { Order } from "../../services/types";
import { useAuth } from "../../context/AuthContext";
import ResponsiveProductImage, { ResponsiveImageDescriptor } from "../../components/ResponsiveProductImage";
import { getProductById, productCatalog, type ProductRecord } from "../../data/products";

type Props = {};

const OrderDetails: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        navigate("/my-account", { state: { redirectTo: `/order-details/${id}` } });
        return;
      }

      try {
        setLoading(true);
        const orderData = await ordersApi.getOrder(parseInt(id));
        setOrder(orderData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err instanceof Error ? err.message : "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      cod: "Cash on Delivery (COD)",
      razorpay: "Razorpay",
      card: "Card Payment",
      upi: "UPI Payment",
    };
    return methodMap[method] || method;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; dot: string }> = {
      pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
      processing: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
      shipped: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
      delivered: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
      cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    };
    return statusMap[status.toLowerCase()] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  };

  const statusColors = getStatusColor(order.status);
  const shippingAddress = order.shipping_address;
  const totalAmount = parseFloat(order.total_amount);
  const orderDate = formatDate(order.created_at);

  // Calculate shipping cost (assuming free shipping if total > 799)
  const shippingCost = totalAmount > 799 ? 0 : 49;
  const subtotal = totalAmount - shippingCost;

  // Map product names to static product slugs for image lookup
  const productNameToSlugMap: Record<string, string> = {
    'DIA CARE': 'dia-care',
    'LIVER DETOX FORMULA': 'liver-detox',
    'BONE & JOINT SUPPORT': 'bone-joint-support',
    'GUT AND DIGESTION': 'gut-and-digestion',
    "WOMEN'S HEALTH PLUS": 'womens-health-plus',
    "MEN'S VITALITY BOOSTER": 'mens-vitality-booster',
    "PRO MEN'S MULTIVITAMIN": 'pro-mens-multivitamin',
    "PRO WOMEN'S HEALTH PLUS": 'pro-womens-health-plus',
  };

  // Map PRO product names to their image paths
  const proProductImageMap: Record<string, ResponsiveImageDescriptor> = {
    "PRO MEN'S MULTIVITAMIN": {
      alt: "PRO Men's Multivitamin supplement",
      fallback: "/Final Images/ProSeries/PRO MEN'S MULTIVITAMIN/optimized/main.png",
      sources: [
        {
          srcSet: "/Final Images/ProSeries/PRO MEN'S MULTIVITAMIN/optimized/main.png",
          media: '(min-width: 1024px)',
        },
        {
          srcSet: "/Final Images/ProSeries/PRO MEN'S MULTIVITAMIN/optimized/main.png",
          media: '(min-width: 768px)',
        },
        {
          srcSet: "/Final Images/ProSeries/PRO MEN'S MULTIVITAMIN/optimized/main.png",
          media: '(max-width: 767px)',
        },
      ],
    },
    "PRO WOMEN'S HEALTH PLUS": {
      alt: "PRO Women's Health Plus supplement",
      fallback: "/Final Images/ProSeries/PRO WOMEN'S HEALTH PLUS/optimized/main.png",
      sources: [
        {
          srcSet: "/Final Images/ProSeries/PRO WOMEN'S HEALTH PLUS/optimized/main.png",
          media: '(min-width: 1024px)',
        },
        {
          srcSet: "/Final Images/ProSeries/PRO WOMEN'S HEALTH PLUS/optimized/main.png",
          media: '(min-width: 768px)',
        },
        {
          srcSet: "/Final Images/ProSeries/PRO WOMEN'S HEALTH PLUS/optimized/main.png",
          media: '(max-width: 767px)',
        },
      ],
    },
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

  // Get product image for cart item (handles PRO products)
  const getProductImageForCart = (itemId: string, itemName?: string): ResponsiveImageDescriptor | null => {
    // First try to get product from static catalog
    const product = getProductForCartItem(itemId, itemName);
    if (product?.image) {
      return product.image;
    }
    
    // If not found, check if it's a PRO product
    if (itemName) {
      const normalizedName = itemName.toUpperCase().trim();
      const proImage = proProductImageMap[normalizedName];
      if (proImage) {
        return proImage;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Top header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Link
              to="/profile"
              className="text-sm text-gray-600 hover:underline inline-flex items-center gap-1"
            >
              <span>←</span> Back to orders
            </Link>
            <h1 className="text-2xl font-semibold text-[#1C2638]">
              Order #{order.order_number}
            </h1>
            <p className="text-sm text-gray-500">
              Confirmed {orderDate}
            </p>
          </div>

          <button className="rounded-lg border border-[#1C2638] px-4 py-2 text-sm font-medium text-[#1C2638] hover:bg-[#e3e4de] transition">
            Buy again
          </button>
        </div>

        {/* Top cards: status + payment */}
        <div className="mb-6 grid gap-4 md:grid-cols-[2fr,1.2fr]">
          {/* Status card */}
          <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full ${statusColors.bg} px-3 py-1 text-xs font-medium ${statusColors.text}`}>
              <span className={`h-2 w-2 rounded-full ${statusColors.dot}`} />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
            <p className="text-sm text-gray-700">
              {order.status === 'pending' && 'Your order is being processed'}
              {order.status === 'processing' && 'Your order is being prepared'}
              {order.status === 'shipped' && 'Your order has been shipped'}
              {order.status === 'delivered' && 'Your order has been delivered'}
              {order.status === 'cancelled' && 'Your order has been canceled'}
            </p>
            <p className="mt-1 text-xs text-gray-500">{orderDate}</p>
          </div>

          {/* Payment info small card */}
          <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-semibold text-gray-800">
              Payment {order.payment_status === 'paid' ? 'completed' : order.payment_status === 'pending' ? 'pending' : order.payment_status}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {order.payment_status === 'paid' ? 'Payment received' : order.payment_status === 'pending' ? 'Awaiting payment' : 'Payment issue'}
            </p>
          </div>
        </div>

        {/* Main content: left info + right summary */}
        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          {/* Left column: contact & addresses */}
          <div className="space-y-4">
            {/* Contact & Payment */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Contact information */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Contact information
                </h2>
                <p className="text-sm text-gray-800">{shippingAddress.full_name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.user_email || 'N/A'}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {shippingAddress.phone_number}
                </p>

                <h3 className="mt-4 text-sm font-semibold text-gray-800">
                  Shipping method
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Standard
                </p>
              </div>

              {/* Payment */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Payment
                </h2>
                <p className="text-sm text-gray-800">
                  {formatPaymentMethod(order.payment_method || 'cod')}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  ₹{totalAmount.toFixed(2)} INR
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {orderDate}
                </p>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Shipping address */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Shipping address
                </h2>
                <p className="text-sm text-gray-800">
                  {shippingAddress.full_name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {shippingAddress.address_line_1}
                </p>
                {shippingAddress.address_line_2 && (
                  <p className="text-sm text-gray-600">
                    {shippingAddress.address_line_2}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postal_code}
                </p>
                <p className="text-sm text-gray-600">
                  {shippingAddress.country}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {shippingAddress.phone_number}
                </p>
              </div>

              {/* Billing address (same as shipping for now) */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Billing address
                </h2>
                <p className="text-sm text-gray-800">
                  {shippingAddress.full_name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {shippingAddress.address_line_1}
                </p>
                {shippingAddress.address_line_2 && (
                  <p className="text-sm text-gray-600">
                    {shippingAddress.address_line_2}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postal_code}
                </p>
                <p className="text-sm text-gray-600">
                  {shippingAddress.country}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {shippingAddress.phone_number}
                </p>
              </div>
            </div>
          </div>

          {/* Right column: order summary */}
          <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm h-fit">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">
              Order summary
            </h2>

            {/* Product line items */}
            <div className="space-y-4 border-b border-gray-100 pb-4">
              {order.items.map((item) => {
                const itemPrice = parseFloat(item.price);
                const itemSubtotal = parseFloat(item.subtotal);
                // Get product image (handles both regular and PRO products)
                const productImage = getProductImageForCart(item.product.id?.toString() || '', item.product.name);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      <div className="h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
                        {productImage ? (
                          <ResponsiveProductImage
                            image={productImage}
                            className="w-full h-full"
                            imgClassName="object-contain p-2"
                          />
                        ) : item.product.image_url ? (
                          <img 
                            src={item.product.image_url} 
                            alt={item.product.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <span className="text-xs text-gray-400">Img</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">
                      ₹{itemSubtotal.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">
                  {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>
                  ₹{totalAmount.toFixed(2)} INR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links (optional) */}
        <div className="mt-10 flex flex-wrap gap-4 text-xs text-gray-500">
          <button className="hover:underline">Refund policy</button>
          <button className="hover:underline">Privacy policy</button>
          <button className="hover:underline">Terms of service</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
