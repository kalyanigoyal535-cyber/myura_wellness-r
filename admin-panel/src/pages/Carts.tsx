import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Search, Eye, Trash2, ShoppingCart } from "lucide-react";
import { Cart, InputChangeEvent } from "../types";
import "../styles/Carts.css";

export default function Carts(): React.JSX.Element {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ results: Cart[] } | Cart[]>(
        "/admin/carts"
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setCarts(data);
    } catch (err) {
      setError("Failed to load carts");
      console.error("Failed to load carts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this cart?")) return;

    try {
      await api.delete(`/admin/carts/${id}`);
      await fetchCarts();
    } catch (err) {
      alert("Failed to delete cart");
      console.error(err);
    }
  };

  const filteredCarts = carts.filter((cart) => {
    const matchesSearch =
      cart.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.session_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.cart_id.toString().includes(searchTerm);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="carts-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="carts-container">
      <div className="carts-header">
        <div>
          <h1 className="carts-title">Carts</h1>
          <p className="carts-subtitle">
            Manage customer shopping carts ({carts.length} total)
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p className="error-text">{error}</p>
        </div>
      )}

      <div className="carts-search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by email, session key, or cart ID..."
            value={searchTerm}
            onChange={(e: InputChangeEvent) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredCarts.length === 0 ? (
        <div className="empty-state-carts">
          <ShoppingCart className="empty-state-icon-carts" size={64} />
          <p className="empty-state-text-carts">
            {searchTerm ? "No carts match your search" : "No carts found"}
          </p>
        </div>
      ) : (
        <div className="carts-table-container">
          <div className="table-wrapper">
            <table className="carts-table">
              <thead>
                <tr>
                  <th>Cart ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Type</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.map((cart) => (
                  <tr key={cart.cart_id}>
                    <td>
                      <span className="cart-id">#{cart.cart_id}</span>
                    </td>
                    <td>
                      <span className="cart-customer">
                        {cart.user_email || "Guest"}
                      </span>
                    </td>
                    <td>
                      <span className="cart-items-count">
                        {cart.items_count || 0} items
                      </span>
                    </td>
                    <td>
                      <span className="cart-amount">
                        ₹
                        {Number(cart.total_amount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`cart-type-badge ${
                          cart.user_id ? "user-cart" : "session-cart"
                        }`}
                      >
                        {cart.user_id ? "User" : "Session"}
                      </span>
                    </td>
                    <td>
                      <span className="cart-date">
                        {new Date(cart.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <Link
                          to={`/carts/${cart.cart_id}`}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(cart.cart_id)}
                          className="action-btn delete-btn"
                          title="Delete"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

