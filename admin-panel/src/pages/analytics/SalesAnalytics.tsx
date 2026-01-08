import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  Package,
  TrendingUp
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../../styles/Analytics.css";

interface AnalyticsData {
  summary: {
    total_sales: number;
    total_orders: number;
    aov: number;
    sales_growth: number;
  };
  charts: {
    sales_over_time: any[];
    top_products: {
      name: string;
      revenue: number;
      units: number;
      stock_available: number;
      sell_through_rate: string;
    }[];
  };
}

export default function SalesAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get<AnalyticsData>(`/admin/analytics?days=${days}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-message"><p>{error}</p></div>;
  if (!data) return null;

  const { summary, charts } = data;
  const bestSeller = charts.top_products.length > 0 ? charts.top_products[0] : null;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">Sales Analytics</h1>
          <p className="analytics-subtitle">Monitor your revenue and product performance</p>
        </div>
        <div className="date-selector">
          <Calendar size={14} />
          <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="shopify-grid">
        {/* Summary Cards */}
        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">💰 Total Sales</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{summary.total_sales.toLocaleString("en-IN")}</span>
            <div className={`growth-indicator ${summary.sales_growth >= 0 ? 'positive' : 'negative'}`}>
              {summary.sales_growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{Math.abs(summary.sales_growth)}%</span>
            </div>
          </div>
          <p className="card-subtext">Net revenue in selected period</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">📎 Total Orders</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.total_orders}</span>
          </div>
          <p className="card-subtext">Completed purchases</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">📊 Avg. Order Value</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{summary.aov.toLocaleString("en-IN")}</span>
          </div>
          <p className="card-subtext">Average revenue per order</p>
        </div>

        {/* Charts */}
        <div className="shopify-card span-3">
          <div className="card-header">
            <h3 className="card-title">📈 Revenue Over Time</h3>
          </div>
          <div style={{ height: 350, marginTop: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sales_over_time}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a0dc" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00a0dc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, "Sales"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area type="monotone" dataKey="sales" stroke="#00a0dc" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Table */}
        <div className="shopify-card span-3">
          <div className="card-header">
            <h3 className="card-title">🏆 Product Performance & Sell-Through Rate</h3>
          </div>
          <div className="activity-table-container" style={{ marginTop: 16 }}>
            <table className="activity-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Product Name</th>
                  <th style={{ textAlign: 'center' }}>Units Sold</th>
                  <th style={{ textAlign: 'center' }}>Units Available</th>
                  <th style={{ textAlign: 'right' }}>Revenue</th>
                  <th style={{ textAlign: 'left', paddingLeft: '40px' }}>Sell-Through Rate</th>
                </tr>
              </thead>
              <tbody>
                {charts.top_products.map((product, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td style={{ textAlign: 'center' }}>{product.units}</td>
                    <td style={{ textAlign: 'center' }}>{product.stock_available}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#10b981' }}>₹{product.revenue.toLocaleString()}</td>
                    <td style={{ paddingLeft: '40px' }}>
                      <div className="flex items-center gap-2" style={{ width: '200px' }}>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ 
                              width: `${Math.min(100, parseFloat(product.sell_through_rate))}%`,
                              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ minWidth: '50px', color: '#3b82f6' }}>{product.sell_through_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

