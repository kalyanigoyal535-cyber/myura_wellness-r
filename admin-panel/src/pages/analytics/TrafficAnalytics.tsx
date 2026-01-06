import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  Calendar,
  PieChart as PieChartIcon,
  Globe,
  Monitor,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  AreaChart,
  Area,
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
import "../../styles/Analytics.css";

interface AnalyticsData {
  summary: {
    sessions: number;
  };
  charts: {
    sessions_over_time: any[];
    devices: any[];
    referrers: any[];
    landing_pages: any[];
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function TrafficAnalytics() {
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
      setError(err.response?.data?.error || "Failed to load traffic data");
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
          <h1 className="analytics-title">Traffic Analytics</h1>
          <p className="analytics-subtitle">Understand where your visitors are coming from</p>
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
            <h3 className="card-title">Total Sessions</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.sessions.toLocaleString()}</span>
          </div>
          <p className="card-subtext">Visitor sessions in period</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Mobile Traffic</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">
              {charts.devices.find(d => d.name === 'mobile')?.value || 0}%
            </span>
          </div>
          <p className="card-subtext">Percentage of mobile users</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Direct Traffic</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">
              {charts.referrers.find(r => r.name === 'Direct')?.value || 0}%
            </span>
          </div>
          <p className="card-subtext">Users visiting via URL</p>
        </div>

        {/* Sessions Over Time */}
        <div className="shopify-card span-3">
          <div className="card-header">
            <h3 className="card-title">Sessions Over Time</h3>
          </div>
          <div style={{ height: 300, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.sessions_over_time}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f2f3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 12, fill: '#6d7175' }}
                  axisLine={{ stroke: '#e1e3e5' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6d7175' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e1e3e5', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [value, "Sessions"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSessions)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Landing Pages */}
        <div className="shopify-card span-2">
          <div className="card-header">
            <h3 className="card-title">Landing Page Performance</h3>
          </div>
          <div className="activity-table-container" style={{ marginTop: 10 }}>
            <table className="activity-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Landing Page</th>
                  <th style={{ textAlign: 'center' }}>Sessions</th>
                  <th style={{ textAlign: 'center' }}>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {charts.landing_pages.map((page, idx) => (
                  <tr key={idx}>
                    <td className="truncate" style={{ maxWidth: '300px', fontWeight: 500 }} title={page.name}>{page.name}</td>
                    <td style={{ textAlign: 'center' }}>{page.sessions.toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${parseFloat(page.conversion_rate) > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {parseFloat(page.conversion_rate).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">Traffic Source Breakdown</h3>
          </div>
          <div style={{ height: 250, marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.referrers}
                  cx="50%" cy="50%" outerRadius={70} dataKey="value"
                >
                  {charts.referrers.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

