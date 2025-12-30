import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Trash2, ShoppingCart, Package } from "lucide-react";
import { Cart, CartItem } from "../types";
import "../styles/Carts.css";

export default function CartDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCart();
    }
  }, [id]);

  const fetchCart = async (): Promise<void> => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Cart>(`/admin/carts/${id}`);
      setCart(response.data);
    } catch (err) {
      setError("Failed to load cart details");
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!cart || !window.confirm("Are you sure you want to delete this cart?"))
      return;

    try {
      await api.delete(`/admin/carts/${cart.cart_id}`);
      window.location.href = "/carts";
    } catch (err) {
      alert("Failed to delete cart");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="cart-detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !cart) {
    return (
      <div className="cart-detail-container">
        <div className="cart-detail-header">
          <Link to="/carts" className="back-link">
            <ArrowLeft size={20} />
            Back to Carts
          </Link>
        </div>
        <div className="error-message">
          <p className="error-text">{error || "Cart not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-detail-container">
      <div className="cart-detail-header">
        <div className="header-left">
          <Link to="/carts" className="back-link">
            <ArrowLeft size={20} />
            Back to Carts
          </Link>
          <div>
            <h1 className="cart-detail-title">Cart #{cart.cart_id}</h1>
            <p className="cart-detail-subtitle">
              {cart.user_email || "Guest Cart"}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="delete-cart-btn"
          type="button"
        >
          <Trash2 size={18} />
          Delete Cart
        </button>
      </div>

      <div className="cart-detail-content">
        <div className="cart-info-section">
          <div className="info-card">
            <h3 className="info-card-title">Cart Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Cart ID</span>
                <span className="info-value">#{cart.cart_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Customer</span>
                <span className="info-value">
                  {cart.user_email || "Guest"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Type</span>
                <span
                  className={`info-badge ${
                    cart.user_id ? "user-cart" : "session-cart"
                  }`}
                >
                  {cart.user_id ? "User Cart" : "Session Cart"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Items Count</span>
                <span className="info-value">
                  {cart.items_count || 0} items
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Amount</span>
                <span className="info-value amount">
                  ₹
                  {Number(cart.total_amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Created</span>
                <span className="info-value">
                  {new Date(cart.created_at).toLocaleString()}
                </span>
              </div>
              {cart.session_key && (
                <div className="info-item">
                  <span className="info-label">Session Key</span>
                  <span className="info-value session-key">
                    {cart.session_key}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cart-items-section">
          <h2 className="section-title">Cart Items</h2>
          {!cart.items || cart.items.length === 0 ? (
            <div className="empty-cart-items">
              <Package className="empty-icon" size={48} />
              <p className="empty-text">This cart is empty</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.items.map((item: CartItem) => (
                <div key={item.cart_item_id} className="cart-item-card">
                  <div className="item-image">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product_name || "Product"}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">
                      {item.product_name || "Unknown Product"}
                    </h3>
                    <div className="item-meta">
                      <span className="item-price">
                        ₹
                        {Number(item.product_price || 0).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                      <span className="item-quantity">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="item-subtotal">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-value">
                      ₹
                      {Number(item.subtotal || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items && cart.items.length > 0 && (
          <div className="cart-summary-section">
            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Total Items</span>
                <span className="summary-value">{cart.items_count || 0}</span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value">
                  ₹
                  {Number(cart.total_amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

