import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { DashboardStats } from "../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get<DashboardStats>("/admin/dashboard/stats");
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-message"><AlertCircle size={20} /><p>{error}</p></div>;
  if (!stats) return null;

  const { overview, monthly, recent_orders, pending_contacts } = stats;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="date-selector">
          <Calendar size={14} />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="shopify-grid">
        {/* Row 1: Key Metrics */}
        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Total Revenue</h3>
            <DollarSign size={14} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{overview.total_revenue.toLocaleString("en-IN")}</span>
            {monthly.revenue_growth > 0 && (
              <span className="growth-indicator positive"><TrendingUp size={12} /> {((monthly.revenue_growth / (monthly.revenue - monthly.revenue_growth)) * 100).toFixed(0)}%</span>
            )}
          </div>
          <p className="card-subtext">Total earnings from all orders</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Total Orders</h3>
            <ShoppingCart size={14} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">{overview.total_orders}</span>
            {monthly.orders_growth > 0 && (
              <span className="growth-indicator positive"><TrendingUp size={12} /> {((monthly.orders_growth / (monthly.orders - monthly.orders_growth)) * 100).toFixed(0)}%</span>
            )}
          </div>
          <p className="card-subtext">Cumulative order count</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Total Customers</h3>
            <Users size={14} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">{overview.total_users}</span>
          </div>
          <p className="card-subtext">Registered user accounts</p>
        </div>

        {/* Row 2: Recent Activity & Alerts */}
        <div className="shopify-card span-2">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <button className="text-xs text-blue-600 font-medium">View all</button>
          </div>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent_orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id}>
                    <td className="font-semibold">{order.order_number}</td>
                    <td>{order.customer_name || "Guest"}</td>
                    <td>₹{Number(order.total_amount).toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`order-status ${order.order_status}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '12px', color: '#6d7175' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Pending Alerts</h3>
          </div>
          <div className="alerts-list">
            {pending_contacts > 0 ? (
              <div className="alert-item-box warning">
                <AlertCircle size={20} />
                <div>
                  <p className="alert-box-title">{pending_contacts} New Contacts</p>
                  <p className="alert-box-msg">Review unread messages from customers.</p>
                </div>
              </div>
            ) : (
              <p className="empty-text">No pending alerts</p>
            )}
            
            <div className="alert-item-box info">
              <Package size={20} />
              <div>
                <p className="alert-box-title">{overview.total_products} Products</p>
                <p className="alert-box-msg">Your inventory is healthy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
