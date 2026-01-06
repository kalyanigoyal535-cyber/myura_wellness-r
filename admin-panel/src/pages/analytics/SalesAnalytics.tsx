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
        <div className="analytics-actions">
          <div className="date-selector">
            <Calendar size={16} />
            <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Total Sales</p>
            <h3 className="summary-value">₹{summary.total_sales.toLocaleString("en-IN")}</h3>
            <div className={`summary-growth ${summary.sales_growth >= 0 ? 'positive' : 'negative'}`}>
              {summary.sales_growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{Math.abs(summary.sales_growth)}%</span>
            </div>
          </div>
          <div className="summary-icon blue"><DollarSign size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Total Orders</p>
            <h3 className="summary-value">{summary.total_orders}</h3>
            <p className="summary-subtext">Completed purchases</p>
          </div>
          <div className="summary-icon purple"><Package size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Avg. Order Value (AOV)</p>
            <h3 className="summary-value">₹{summary.aov.toLocaleString("en-IN")}</h3>
            <p className="summary-subtext">Revenue per order</p>
          </div>
          <div className="summary-icon green"><TrendingUp size={24} /></div>
        </div>

        <div className="summary-card highlight">
          <div className="summary-card-info">
            <p className="summary-label">Best Seller</p>
            <h3 className="summary-value text-sm truncate max-w-[150px]">{bestSeller ? bestSeller.name : "N/A"}</h3>
            <p className="summary-subtext">{bestSeller ? `₹${bestSeller.revenue.toLocaleString()} revenue` : "No sales yet"}</p>
          </div>
          <div className="summary-icon amber"><Sparkles size={24} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card span-3">
          <h3 className="chart-title">Revenue Trends</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={charts.sales_over_time}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, "Sales"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card span-3">
          <h3 className="chart-title">Product Performance & Sell-Through Rate</h3>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Units Sold</th>
                  <th>Units Available</th>
                  <th>Revenue</th>
                  <th>Sell-Through Rate</th>
                </tr>
              </thead>
              <tbody>
                {charts.top_products.map((product, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{product.name}</td>
                    <td>{product.units}</td>
                    <td>{product.stock_available}</td>
                    <td>₹{product.revenue.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${Math.min(100, parseFloat(product.sell_through_rate))}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{product.sell_through_rate}%</span>
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

