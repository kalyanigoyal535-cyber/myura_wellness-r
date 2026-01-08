import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
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
  const ShopifyBarRow = ({ label, value, subValue, percentage, max, rawValue }: any) => (
    <div className="bar-item">
      <div className="bar-label-row">
        <span className="truncate" title={label}>{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="bar-container">
        <div 
          className="bar-fill" 
          style={{ width: `${(percentage !== undefined ? percentage : (max ? (rawValue / max) * 100 : 0))}%` }}
        ></div>
      </div>
      <div className="bar-value-row">
        <span>{subValue}</span>
        {percentage !== undefined && (
          <span className={`growth-indicator ${percentage >= 0 ? 'positive' : 'negative'}`}>
            {percentage >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(percentage).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">Analytics Overview</h1>
          <p className="analytics-subtitle">Comprehensive insights into your business performance</p>
        </div>
        <div className="date-selector">
          <Calendar size={16} />
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
            <h3 className="card-title">💰 Total Sales Revenue</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{summary.total_sales.toLocaleString("en-IN")}</span>
            <span className="growth-indicator positive"><ArrowUpRight size={14} /> 11%</span>
          </div>
          <p className="card-subtext">Across all sales channels</p>
          <div style={{ height: 200, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sales_over_time}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">📈 Average Order Value</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">₹{summary.aov.toLocaleString("en-IN")}</span>
            <span className="growth-indicator negative"><ArrowDownRight size={14} /> 16%</span>
          </div>
          <p className="card-subtext">Per order over time</p>
          <div style={{ height: 200, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sales_over_time}>
                <defs>
                  <linearGradient id="colorAOV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#colorAOV)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">🏆 Top Products</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 16 }}>Best performing products by revenue</p>
          <div className="shopify-bar-list scroll-container">
            {charts.top_products.slice(0, 5).map((p, i) => (
              <ShopifyBarRow 
                key={i} 
                label={p.name} 
                value={`₹${p.revenue.toLocaleString()}`} 
                rawValue={p.revenue}
                subValue={`${p.orders} orders`} 
                max={Math.max(...charts.top_products.map(x => x.revenue), 1)} 
              />
            ))}
          </div>
        </div>

        {/* Row 2: Sessions over time, Conversion rate over time, Conversion rate breakdown */}
        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">👥 Total Sessions</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.sessions.toLocaleString()}</span>
            <span className="growth-indicator positive"><ArrowUpRight size={14} /> 41%</span>
          </div>
          <p className="card-subtext">User visits over time</p>
          <div style={{ height: 200, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sessions_over_time}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#colorSessions)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/conversion')}>
          <div className="card-header">
            <h3 className="card-title">🎯 Conversion Rate</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.conversion_rate}%</span>
            <span className="growth-indicator positive"><ArrowUpRight size={14} /> 3%</span>
          </div>
          <p className="card-subtext">Session to purchase conversion</p>
          <div style={{ height: 200, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.conversion_over_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${value}%`, 'Conversion Rate']}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/conversion')}>
          <div className="card-header">
            <h3 className="card-title">📩 Conversion Funnel</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 8 }}>Customer journey breakdown</p>
          <div className="funnel-container">
            {charts.funnel.map((step, i) => (
              <div key={i} className="funnel-step">
                <div className="funnel-info">
                  <span className="funnel-label">{step.name}</span>
                  <span className="funnel-percentage">
                    {i === 0 ? "100%" : `${((step.value / charts.funnel[0].value) * 100).toFixed(1)}%`}
                  </span>
                  <span className="funnel-count">{step.value.toLocaleString()}</span>
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
            <h3 className="card-title">📱 Device Breakdown</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.sessions.toLocaleString()}</span>
            <span className="growth-indicator positive"><ArrowUpRight size={14} /> 41%</span>
          </div>
          <p className="card-subtext">Sessions by device type</p>
          <div style={{ height: 200, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.devices}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value"
                >
                  {charts.devices.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/customers')}>
          <div className="card-header">
            <h3 className="card-title">🌍 Top Locations</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 12 }}>Sessions by geographic location</p>
          <div className="shopify-bar-list scroll-container">
            {charts.locations.map((loc, i) => (
              <ShopifyBarRow 
                key={i} 
                label={loc.name} 
                value={loc.value.toLocaleString()} 
                rawValue={loc.value}
                subValue="sessions" 
                max={Math.max(...charts.locations.map(x => x.value), 1)} 
              />
            ))}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/customers')}>
          <div className="card-header">
            <h3 className="card-title">🇮🇳 India Regions</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 12 }}>Top regions within India</p>
          <div className="shopify-bar-list scroll-container">
            {charts.india_regions.map((region, i) => (
              <ShopifyBarRow 
                key={i} 
                label={region.name} 
                value={region.value.toLocaleString()} 
                rawValue={region.value}
                subValue="sessions"
                max={Math.max(...charts.india_regions.map(x => x.value), 1)} 
              />
            ))}
            {charts.india_regions.length === 0 && <p className="empty-text">No India regional data available yet</p>}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">📱 Social Sales</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 12 }}>Revenue by social source</p>
          <div className="shopify-bar-list">
            {charts.sales_by_referrer.length > 0 ? charts.sales_by_referrer.map((r, i) => (
              <ShopifyBarRow 
                key={i} 
                label={r.name} 
                value={`₹${r.revenue.toLocaleString()}`} 
                rawValue={r.revenue}
                subValue="revenue" 
                max={Math.max(...charts.sales_by_referrer.map(x => x.revenue), 1)} 
              />
            )) : <p className="empty-text">No data for this date range</p>}
          </div>
        </div>

        {/* Row 4: Sessions by landing page, Sessions by social referrer, Products by sell-through rate */}
        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">📄 Landing Pages</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 12 }}>Performance by entry point</p>
          <div className="shopify-bar-list scroll-container">
            {charts.landing_pages.map((p, i) => (
              <ShopifyBarRow 
                key={i} 
                label={p.name} 
                value={p.sessions.toLocaleString()} 
                rawValue={p.sessions}
                subValue={`CR: ${p.conversion_rate}%`}
                percentage={parseFloat(p.conversion_rate)} 
                max={Math.max(...charts.landing_pages.map(x => x.sessions), 1)} 
              />
            ))}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/traffic')}>
          <div className="card-header">
            <h3 className="card-title">🔗 Social Sessions</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 12 }}>Traffic from social networks</p>
          <div className="shopify-bar-list">
            {charts.social_referrer_sessions.length > 0 ? charts.social_referrer_sessions.map((r, i) => (
              <ShopifyBarRow 
                key={i} 
                label={r.name} 
                value={r.sessions.toLocaleString()} 
                rawValue={r.sessions}
                subValue="sessions"
                max={Math.max(...charts.social_referrer_sessions.map(x => x.sessions), 1)} 
              />
            )) : <p className="empty-text">No data for this date range</p>}
          </div>
        </div>

        <div className="shopify-card clickable" onClick={() => navigate('/analytics/sales')}>
          <div className="card-header">
            <h3 className="card-title">📦 Sell-through Rate</h3>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
          <p className="card-subtext" style={{ marginTop: 0, marginBottom: 12 }}>Inventory turnover by product</p>
          <div className="shopify-bar-list scroll-container">
            {charts.top_products.map((p, i) => (
              <ShopifyBarRow 
                key={i} 
                label={p.name} 
                value={`${p.sell_through_rate}%`} 
                rawValue={parseFloat(p.sell_through_rate)}
                subValue="rate" 
                percentage={parseFloat(p.sell_through_rate)} 
                max={100}
              />
            ))}
          </div>
        </div>

        {/* Row 5: Customer cohort analysis */}
        <div className="shopify-card span-3">
          <div className="card-header">
            <h3 className="card-title">👥 Customer Retention (Cohort Analysis)</h3>
          </div>
          <p className="card-subtext" style={{ marginBottom: 20 }}>Percentage of returning customers by month of first purchase</p>
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
                    {[...Array(6-i)].map((_, j) => (
                      <td key={j} className={`retention-cell ${j === 0 ? 'first' : ''}`}>
                        {j === 0 ? '100%' : '0%'}
                      </td>
                    ))}
                    {[...Array(i)].map((_, j) => (
                      <td key={j} className="empty-cell"></td>
                    ))}
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
