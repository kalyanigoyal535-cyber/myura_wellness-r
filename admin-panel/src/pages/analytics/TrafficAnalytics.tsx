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
            <p className="summary-label">Total Sessions</p>
            <h3 className="summary-value">{summary.sessions.toLocaleString()}</h3>
            <p className="summary-subtext">Across all sources</p>
          </div>
          <div className="summary-icon blue"><Users size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Mobile Traffic</p>
            <h3 className="summary-value">
              {charts.devices.find(d => d.name === 'mobile')?.value || 0}%
            </h3>
            <p className="summary-subtext">Percentage of users</p>
          </div>
          <div className="summary-icon purple"><Monitor size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Direct Traffic</p>
            <h3 className="summary-value">
              {charts.referrers.find(r => r.name === 'Direct')?.value || 0}%
            </h3>
            <p className="summary-subtext">Users via URL</p>
          </div>
          <div className="summary-icon green"><Globe size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Top Landing Page</p>
            <h3 className="summary-value text-sm truncate max-w-[150px]">
              {charts.landing_pages[0]?.name || "N/A"}
            </h3>
            <p className="summary-subtext">Most frequent entry</p>
          </div>
          <div className="summary-icon amber"><PieChartIcon size={24} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card span-3">
          <h3 className="chart-title">Sessions Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.sessions_over_time}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, "Sessions"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSessions)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card span-2">
          <h3 className="chart-title">Landing Page Performance</h3>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Landing Page</th>
                  <th>Sessions</th>
                  <th>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {charts.landing_pages.map((page, idx) => (
                  <tr key={idx}>
                    <td className="truncate max-w-[200px]" title={page.name}>{page.name}</td>
                    <td>{page.sessions}</td>
                    <td>
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

        <div className="chart-card">
          <h3 className="chart-title">Device & Source Breakdown</h3>
          <div className="chart-container flex flex-col gap-8">
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.referrers}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {charts.referrers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

