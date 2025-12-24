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
} from "lucide-react";
import { DashboardStats } from "../types";
import "../styles/Dashboard.css";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconClass: "blue" | "purple" | "green" | "amber";
}

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <AlertCircle className="error-icon" size={20} />
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, monthly, recent_orders, pending_contacts } = stats;

  const statCards: StatCard[] = [
    {
      title: "Total Users",
      value: overview.total_users,
      icon: Users,
      iconClass: "blue",
    },
    {
      title: "Total Products",
      value: overview.total_products,
      icon: Package,
      iconClass: "purple",
    },
    {
      title: "Total Orders",
      value: overview.total_orders,
      icon: ShoppingCart,
      iconClass: "green",
    },
    {
      title: "Total Revenue",
      value: `₹${overview.total_revenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      iconClass: "amber",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome to Myura Wellness Admin Panel
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-card-header">
                <div>
                  <p className="stat-card-title">{stat.title}</p>
                  <p className="stat-card-value">{stat.value}</p>
                </div>
                <div className={`stat-card-icon ${stat.iconClass}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="monthly-stats-grid">
        <div className="monthly-stat-card">
          <h2 className="monthly-stat-title">Monthly Orders</h2>
          <div className="monthly-stat-content">
            <div>
              <p className="monthly-stat-value">{monthly.orders}</p>
              <p className="monthly-stat-label">This month</p>
            </div>
            {monthly.orders_growth !== 0 && (
              <div
                className={`monthly-stat-growth ${
                  monthly.orders_growth > 0 ? "positive" : "negative"
                }`}
              >
                {monthly.orders_growth > 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span>{Math.abs(monthly.orders_growth)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="monthly-stat-card">
          <h2 className="monthly-stat-title">Monthly Revenue</h2>
          <div className="monthly-stat-content">
            <div>
              <p className="monthly-stat-value">
                ₹{monthly.revenue.toLocaleString("en-IN")}
              </p>
              <p className="monthly-stat-label">This month</p>
            </div>
            {monthly.revenue_growth !== 0 && (
              <div
                className={`monthly-stat-growth ${
                  monthly.revenue_growth > 0 ? "positive" : "negative"
                }`}
              >
                {monthly.revenue_growth > 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span>
                  ₹{Math.abs(monthly.revenue_growth).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-section">
          <h2 className="section-title">Recent Orders</h2>
          <div className="recent-orders-list">
            {recent_orders && recent_orders.length > 0 ? (
              recent_orders.slice(0, 5).map((order) => (
                <div key={order.order_id} className="order-item">
                  <div className="order-info">
                    <p className="order-number">{order.order_number}</p>
                    <p className="order-amount">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`order-status ${order.order_status}`}>
                    {order.order_status}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">No recent orders</div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Alerts</h2>
          <div className="recent-orders-list">
            {pending_contacts > 0 && (
              <div className="alert-item">
                <AlertCircle className="alert-icon" size={20} />
                <div className="alert-content">
                  <p className="alert-title">
                    {pending_contacts} unread contact submission
                    {pending_contacts > 1 ? "s" : ""}
                  </p>
                  <p className="alert-message">Review in Contacts section</p>
                </div>
              </div>
            )}
            {pending_contacts === 0 && (
              <div className="empty-state">No pending alerts</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
