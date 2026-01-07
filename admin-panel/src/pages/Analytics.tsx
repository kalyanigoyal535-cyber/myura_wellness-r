import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  MoreHorizontal,
  Info
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
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
    conversion_over_time: any[];
    funnel: { name: string; value: number }[];
    devices: { name: string; value: number }[];
    locations: { name: string; value: number }[];
    detailed_locations: any[];
    india_regions: any[];
    referrers: { name: string; value: number }[];
    landing_pages: any[];
    top_products: any[];
    social_referrer_sessions: any[];
    sales_by_referrer: any[];
    marketing_sales: any[];
  };
}

const COLORS = ["#00a0dc", "#8b5cf6", "#f43f5e", "#fbbf24", "#10b981"];

export default function Analytics() {
  const navigate = useNavigate();
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
      setError(err.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-message"><p>{error}</p></div>;
  if (!data) return null;

  const { summary, charts } = data;

  // Horizontal Bar Component for Shopify style lists
  const ShopifyBarRow = ({ label, value, subValue, percentage, max }: any) => (
    <div className="bar-item">
      <div className="bar-label-row">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="bar-container">
        <div className="bar-fill" style={{ width: `${(percentage || (max ? (parseFloat(value) / max) * 100 : 0))}%` }}></div>
      </div>
      <div className="bar-value-row">
        <span>{subValue}</span>
        {percentage !== undefined && (
          <span className="growth-indicator positive">
            <ArrowUpRight size={10} /> {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
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
        {/* Row 1: Sales Channel, AOV, Total Sales by Product */}
        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">Total sales by sales channel</h3>
            <Info size={14} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{summary.total_sales.toLocaleString("en-IN")}</span>
            <span className="growth-indicator positive"><ArrowUpRight size={12} /> 11%</span>
          </div>
          <div style={{ height: 200, marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ name: 'Online Store', value: summary.total_sales }]}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                >
                  <Cell fill="#00a0dc" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">Average order value over time</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{summary.aov.toLocaleString("en-IN")}</span>
            <span className="growth-indicator negative"><ArrowDownRight size={12} /> 16%</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sales_over_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#00a0dc" fill="#eef2ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">Total sales by product</h3>
            <MoreHorizontal size={14} />
          </div>
          <div className="shopify-bar-list scroll-container">
            {charts.top_products.slice(0, 5).map((p, i) => (
              <ShopifyBarRow 
                key={i} 
                label={p.name} 
                value={`₹${p.revenue.toLocaleString()}`} 
                subValue="₹0" 
                max={Math.max(...charts.top_products.map(x => x.revenue))} 
              />
            ))}
          </div>
        </div>

        {/* Row 2: Sessions over time, Conversion rate over time, Conversion rate breakdown */}
        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">Sessions over time</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.sessions.toLocaleString()}</span>
            <span className="growth-indicator positive"><ArrowUpRight size={12} /> 41%</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sessions_over_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#00a0dc" fill="#eef2ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/conversion')}>
          <div className="card-header">
            <h3 className="card-title">Conversion rate over time</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.conversion_rate}%</span>
            <span className="growth-indicator positive"><ArrowUpRight size={12} /> 3%</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.conversion_over_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#00a0dc" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/conversion')}>
          <div className="card-header">
            <h3 className="card-title">Conversion rate breakdown</h3>
          </div>
          <div className="funnel-container">
            {charts.funnel.map((step, i) => (
              <div key={i} className="funnel-step">
                <div className="funnel-info">
                  <span className="funnel-label">{step.name}</span>
                  <span className="funnel-percentage">
                    {i === 0 ? "100%" : `${((step.value / charts.funnel[0].value) * 100).toFixed(2)}%`}
                  </span>
                  <span className="funnel-count">{step.value}</span>
                </div>
                <div className="funnel-bar-wrapper">
                  <div className="funnel-bar" style={{ width: `${(step.value / charts.funnel[0].value) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Sessions by device, Sessions by location, Total sales by social referrer */}
        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">Sessions by device type</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.sessions.toLocaleString()}</span>
            <span className="growth-indicator positive"><ArrowUpRight size={12} /> 41%</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.devices}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                >
                  {charts.devices.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/customers')}>
          <div className="card-header">
            <h3 className="card-title">Sessions by location</h3>
          </div>
          <div className="shopify-bar-list scroll-container">
            {charts.locations.map((loc, i) => (
              <ShopifyBarRow 
                key={i} 
                label={loc.name} 
                value={loc.value.toLocaleString()} 
                subValue="1" 
                max={Math.max(...charts.locations.map(x => x.value))} 
              />
            ))}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/customers')}>
          <div className="card-header">
            <h3 className="card-title">Top Regions (India)</h3>
          </div>
          <div className="shopify-bar-list scroll-container">
            {charts.india_regions.map((region, i) => (
              <ShopifyBarRow 
                key={i} 
                label={region.name} 
                value={region.value.toLocaleString()} 
                max={Math.max(...charts.india_regions.map(x => x.value), 1)} 
              />
            ))}
            {charts.india_regions.length === 0 && <p className="empty-text">No data for India regions yet</p>}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">Total sales by social referrer</h3>
          </div>
          <div className="shopify-bar-list">
            {charts.sales_by_referrer.length > 0 ? charts.sales_by_referrer.map((r, i) => (
              <ShopifyBarRow 
                key={i} 
                label={r.name} 
                value={`₹${r.revenue.toLocaleString()}`} 
                subValue="₹0" 
                max={Math.max(...charts.sales_by_referrer.map(x => x.revenue))} 
              />
            )) : <p className="empty-text">No data for this date range</p>}
          </div>
        </div>

        {/* Row 4: Sessions by landing page, Sessions by social referrer, Products by sell-through rate */}
        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">Sessions by landing page</h3>
          </div>
          <div className="shopify-bar-list scroll-container">
            {charts.landing_pages.map((p, i) => (
              <ShopifyBarRow 
                key={i} 
                label={p.name} 
                value={p.sessions.toLocaleString()} 
                percentage={parseFloat(p.conversion_rate)} 
                max={Math.max(...charts.landing_pages.map(x => x.sessions))} 
              />
            ))}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">Sessions by social referrer</h3>
          </div>
          <div className="shopify-bar-list">
            {charts.social_referrer_sessions.length > 0 ? charts.social_referrer_sessions.map((r, i) => (
              <ShopifyBarRow 
                key={i} 
                label={r.name} 
                value={r.sessions.toLocaleString()} 
                max={Math.max(...charts.social_referrer_sessions.map(x => x.sessions))} 
              />
            )) : <p className="empty-text">No data for this date range</p>}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">Products by sell-through rate</h3>
          </div>
          <div className="shopify-bar-list scroll-container">
            {charts.top_products.map((p, i) => (
              <ShopifyBarRow 
                key={i} 
                label={p.name} 
                value={`${p.sell_through_rate}%`} 
                subValue="0%" 
                percentage={parseFloat(p.sell_through_rate)} 
              />
            ))}
          </div>
        </div>

        {/* Row 5: Customer cohort analysis (Placeholder/Mock) */}
        <div className="shopify-card span-3">
          <div className="card-header">
            <h3 className="card-title">Customer cohort analysis</h3>
          </div>
          <div className="activity-table-container">
            <table className="cohort-matrix">
              <thead>
                <tr>
                  <th className="cohort-label">Cohort</th>
                  <th>Month 1</th>
                  <th>Month 2</th>
                  <th>Month 3</th>
                  <th>Month 4</th>
                  <th>Month 5</th>
                  <th>Month 6</th>
                </tr>
              </thead>
              <tbody>
                {['Jan 2026', 'Dec 2025', 'Nov 2025', 'Oct 2025'].map((month, i) => (
                  <tr key={i}>
                    <td className="cohort-label">{month}</td>
                    {[...Array(6-i)].map((_, j) => <td key={j}>0%</td>)}
                    {[...Array(i)].map((_, j) => <td key={j} style={{ background: '#f9fafb' }}></td>)}
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
