import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Save } from "lucide-react";
import {
  Order,
  ShippingAddress,
  FormSubmitEvent,
  SelectChangeEvent,
} from "../types";
import "../styles/OrderDetail.css";

export default function OrderDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get<Order>(`/admin/orders/${id}`);
      const orderData = response.data;
      setOrder(orderData);
      setStatus(orderData.order_status || orderData.status);
      setPaymentStatus(orderData.payment_status);
    } catch (err) {
      alert("Failed to load order");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (): Promise<void> => {
    if (!id) return;
    try {
      setSaving(true);
      await api.patch(`/admin/orders/${id}/update_status`, {
        status: status,
        order_status: status,
        payment_status: paymentStatus,
      });
      await fetchOrder();
      alert("Order updated successfully");
    } catch (err) {
      alert("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="order-detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-loading">
        <div>Order not found</div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <button
          onClick={() => navigate("/orders")}
          className="back-btn"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="order-detail-title">Order Details</h1>
          <p className="order-detail-subtitle">Order #{order.order_number}</p>
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-left">
          <div className="order-info-card">
            <h2 className="card-title">Order Information</h2>
            <div className="info-list">
              <div className="info-row">
                <span className="info-label">Order Number:</span>
                <span className="info-value">{order.order_number}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Customer:</span>
                <span className="info-value">
                  {order.user_email || "Guest"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Amount:</span>
                <span className="info-value">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">
                  {order.payment_method || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Created:</span>
                <span className="info-value">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="shipping-card">
            <h2 className="card-title">Shipping Address</h2>
            {order.shipping_address &&
              (() => {
                const address: ShippingAddress =
                  typeof order.shipping_address === "string"
                    ? JSON.parse(order.shipping_address)
                    : order.shipping_address;
                return (
                  <div className="shipping-address">
                    <p className="name">{address.full_name}</p>
                    <p className="line">{address.address_line_1}</p>
                    {address.address_line_2 && (
                      <p className="line">{address.address_line_2}</p>
                    )}
                    <p className="line">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="line">{address.country}</p>
                    <p className="phone">Phone: {address.phone_number}</p>
                  </div>
                );
              })()}
          </div>

          <div className="items-card">
            <h2 className="card-title">Order Items</h2>
            <div className="items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.order_item_id} className="order-item-card">
                    <div className="item-info">
                      <p className="item-name">
                        {item.product?.name ||
                          item.product_name ||
                          "Unknown Product"}
                      </p>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <p className="item-price">
                      ₹
                      {Number(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <div className="empty-state">No items found</div>
              )}
            </div>
          </div>
        </div>

        <div className="status-card">
          <h2 className="card-title">Update Status</h2>
          <form
            className="status-form"
            onSubmit={(e: FormSubmitEvent) => {
              e.preventDefault();
              void handleUpdateStatus();
            }}
          >
            <div className="status-form-group">
              <label htmlFor="order-status" className="status-label">
                Order Status
              </label>
              <select
                id="order-status"
                value={status}
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            <div className="status-form-group">
              <label htmlFor="payment-status" className="status-label">
                Payment Status
              </label>
              <select
                id="payment-status"
                value={paymentStatus}
                onChange={(e: SelectChangeEvent) =>
                  setPaymentStatus(e.target.value)
                }
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="update-status-btn"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Update Status"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
