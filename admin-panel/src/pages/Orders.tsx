import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Search, Eye, Filter } from "lucide-react";
import { Order, InputChangeEvent, SelectChangeEvent } from "../types";
import "../styles/Orders.css";

export default function Orders(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<{ results: Order[] } | Order[]>(
        "/admin/orders"
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Orders</h1>
        <p className="orders-subtitle">Manage customer orders</p>
      </div>

      <div className="filters-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by order number or email..."
            value={searchTerm}
            onChange={(e: InputChangeEvent) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <Filter size={18} className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>
                      <span className="order-number">{order.order_number}</span>
                    </td>
                    <td>
                      <span className="order-customer">
                        {order.user_email || "Guest"}
                      </span>
                    </td>
                    <td>
                      <span className="order-amount">
                        ₹
                        {parseFloat(
                          order.total_amount.toString()
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.order_status}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`payment-status-badge ${order.payment_status}`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/orders/${order.order_id}`}
                        className="view-btn"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
