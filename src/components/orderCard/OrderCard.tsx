import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../../services/orders";
import { Order } from "../../services/types";
import { useAuth } from "../../context/AuthContext";
import { Package, Calendar, ArrowRight, ShoppingBag, CheckCircle2, Clock, Truck, XCircle, Eye } from "lucide-react";
import ResponsiveProductImage, { ResponsiveImageDescriptor } from "../ResponsiveProductImage";
import { getProductById, productCatalog, type ProductRecord } from "../../data/products";

const OrderCard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordersData = await ordersApi.getOrders();
        // Ensure ordersData is always an array
        // Handle case where API might return data wrapped in an object
        let ordersArray: Order[] = [];
        if (Array.isArray(ordersData)) {
          ordersArray = ordersData;
        } else if (ordersData && typeof ordersData === 'object') {
          // Handle paginated response (e.g., { results: [...] })
          const dataObj = ordersData as { results?: Order[]; data?: Order[] };
          if ('results' in dataObj && Array.isArray(dataObj.results)) {
            ordersArray = dataObj.results;
          } else if ('data' in dataObj && Array.isArray(dataObj.data)) {
            // Handle wrapped response (e.g., { data: [...] })
            ordersArray = dataObj.data;
          } else {
            console.warn('Unexpected orders data format:', ordersData);
            ordersArray = [];
          }
        } else {
          console.warn('Unexpected orders data format:', ordersData);
          ordersArray = [];
        }
        setOrders(ordersArray);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err instanceof Error ? err.message : "Failed to load orders");
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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
    let product = getProductById(itemId);
    if (!product && itemName) {
      const normalizedName = itemName.toUpperCase().trim();
      const slug = productNameToSlugMap[normalizedName];
      if (slug) {
        product = getProductById(slug);
      }
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
    const product = getProductForCartItem(itemId, itemName);
    if (product?.image) {
      return product.image;
    }
    if (itemName) {
      const normalizedName = itemName.toUpperCase().trim();
      const proImage = proProductImageMap[normalizedName];
      if (proImage) {
        return proImage;
      }
    }
    return null;
  };

  // Get status display text
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Canceled",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Get status color and icon
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { 
      bg: string; 
      text: string; 
      border: string;
      icon: React.ReactNode;
      gradient: string;
    }> = {
      pending: { 
        bg: "bg-gradient-to-br from-amber-50 to-yellow-50", 
        text: "text-amber-700", 
        border: "border-amber-200",
        icon: <Clock className="h-4 w-4" />,
        gradient: "from-amber-500 to-yellow-500"
      },
      processing: { 
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50", 
        text: "text-blue-700", 
        border: "border-blue-200",
        icon: <Package className="h-4 w-4" />,
        gradient: "from-blue-500 to-indigo-500"
      },
      shipped: { 
        bg: "bg-gradient-to-br from-purple-50 to-violet-50", 
        text: "text-purple-700", 
        border: "border-purple-200",
        icon: <Truck className="h-4 w-4" />,
        gradient: "from-purple-500 to-violet-500"
      },
      delivered: { 
        bg: "bg-gradient-to-br from-emerald-50 to-green-50", 
        text: "text-emerald-700", 
        border: "border-emerald-200",
        icon: <CheckCircle2 className="h-4 w-4" />,
        gradient: "from-emerald-500 to-green-500"
      },
      cancelled: { 
        bg: "bg-gradient-to-br from-red-50 to-rose-50", 
        text: "text-red-700", 
        border: "border-red-200",
        icon: <XCircle className="h-4 w-4" />,
        gradient: "from-red-500 to-rose-500"
      },
    };
    return statusMap[status.toLowerCase()] || { 
      bg: "bg-gradient-to-br from-gray-50 to-slate-50", 
      text: "text-gray-700", 
      border: "border-gray-200",
      icon: <Package className="h-4 w-4" />,
      gradient: "from-gray-500 to-slate-500"
    };
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Orders</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Orders</h2>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 shadow-sm">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Orders</h2>
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200">
          <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-2">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  // Safety check: ensure orders is always an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (safeOrders.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Orders</h2>
        </div>
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">Start your wellness journey by placing your first order</p>
          <button
            onClick={() => navigate('/product')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Package className="h-4 w-4" />
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Orders</h2>
          <p className="text-slate-600 text-sm mt-1">{safeOrders.length} {safeOrders.length === 1 ? 'order' : 'orders'} total</p>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {safeOrders.map((order) => {
          const firstItem = order.items[0];
          const productImage = firstItem 
            ? getProductImageForCart(firstItem.product.id?.toString() || '', firstItem.product.name)
            : null;
          const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = parseFloat(order.total_amount);
          const statusConfig = getStatusConfig(order.status);

          return (
            <div
              key={order.id}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              {/* Premium Status Badge */}
              <div className={`px-4 py-3 ${statusConfig.bg} border-b ${statusConfig.border} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${statusConfig.gradient} text-white`}>
                    {statusConfig.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${statusConfig.text}`}>{getStatusText(order.status)}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <p className="text-xs text-slate-600">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Image with Overlay */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                {productImage ? (
                  <ResponsiveProductImage
                    image={productImage}
                    className="w-full h-full"
                    imgClassName="object-contain p-4"
                  />
                ) : firstItem?.product.image_url ? (
                  <img
                    src={firstItem.product.image_url}
                    alt={firstItem.product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Bottom Section */}
              <div className="px-5 py-5 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/30">
                <div className="mb-4">
                  <p className="font-bold text-slate-900 text-base mb-1">
                    {itemsCount} {itemsCount === 1 ? "item" : "items"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Order #{order.order_number}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Total</span>
                    <p className="text-xl font-bold text-slate-900">
                      ₹{totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold text-sm py-3 hover:from-slate-800 hover:to-slate-700 transition-all shadow-md hover:shadow-lg group/btn"
                      onClick={() => navigate(`/order-details/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      View Details
                    </button>
                    {order.status !== 'cancelled' && (
                      <button 
                        className="w-full rounded-xl border-2 border-slate-300 text-slate-700 font-semibold text-sm py-2.5 hover:bg-slate-50 hover:border-slate-400 transition-all"
                        onClick={() => {
                          navigate('/product');
                        }}
                      >
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
