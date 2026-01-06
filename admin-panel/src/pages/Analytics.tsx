import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart2,
  PieChart as PieChartIcon,
  MapPin,
  DeviceMobile,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../styles/Analytics.css";

interface AnalyticsData {
  summary: {
    total_sales: number;
    total_orders: number;
    aov: number;
    sales_growth: number;
    sessions: number;
    conversion_rate: number;
  };
  charts: {
    sales_over_time: any[];
    sessions_over_time: any[];
    funnel: any[];
    devices: any[];
    locations: any[];
    referrers: any[];
    top_products: any[];
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Analytics() {
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
      setError(err.response?.data?.error || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-message"><p>{error}</p></div>;
  if (!data) return null;

  const { summary, charts } = data;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">Analytics</h1>
          <p className="analytics-subtitle">Detailed insights into your store's performance</p>
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
            <p className="summary-label">Sessions</p>
            <h3 className="summary-value">{summary.sessions.toLocaleString()}</h3>
            <p className="summary-subtext">Across all devices</p>
          </div>
          <div className="summary-icon purple"><Users size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Conversion Rate</p>
            <h3 className="summary-value">{summary.conversion_rate}%</h3>
            <p className="summary-subtext">Checkout completion</p>
          </div>
          <div className="summary-icon green"><TrendingUp size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Avg. Order Value</p>
            <h3 className="summary-value">₹{summary.aov.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</h3>
            <p className="summary-subtext">Per paid order</p>
          </div>
          <div className="summary-icon amber"><ShoppingCart size={24} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card span-2">
          <h3 className="chart-title">Total Sales Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
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
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Conversion Funnel</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.funnel} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {charts.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Sessions by Device</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={charts.devices}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top Locations</h3>
          <div className="locations-list">
            {charts.locations.length > 0 ? charts.locations.map((loc, idx) => (
              <div key={idx} className="location-item">
                <div className="location-info">
                  <Globe size={16} className="text-slate-400" />
                  <span>{loc.name || "Unknown"}</span>
                </div>
                <span className="location-value">{loc.value}</span>
              </div>
            )) : <p className="empty-text">No location data</p>}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Traffic Sources</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={charts.referrers}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {charts.referrers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


