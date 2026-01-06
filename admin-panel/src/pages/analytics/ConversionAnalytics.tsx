import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  TrendingUp,
  Calendar,
  Filter,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  BarChart2
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../../styles/Analytics.css";

interface AnalyticsData {
  summary: {
    conversion_rate: number;
  };
  charts: {
    conversion_over_time: any[];
    funnel: any[];
  };
}

export default function ConversionAnalytics() {
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
      setError(err.response?.data?.error || "Failed to load conversion data");
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
          <h1 className="analytics-title">Conversion Analytics</h1>
          <p className="analytics-subtitle">Analyze your customer journey and funnel efficiency</p>
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
            <p className="summary-label">Overall Conv. Rate</p>
            <h3 className="summary-value">{summary.conversion_rate}%</h3>
            <p className="summary-subtext">Session to purchase</p>
          </div>
          <div className="summary-icon green"><TrendingUp size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Cart Add Rate</p>
            <h3 className="summary-value">
              {charts.funnel[0].value > 0 ? ((charts.funnel[1].value / charts.funnel[0].value) * 100).toFixed(2) : 0}%
            </h3>
            <p className="summary-subtext">Session to cart</p>
          </div>
          <div className="summary-icon blue"><ShoppingCart size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Checkout Reach Rate</p>
            <h3 className="summary-value">
              {charts.funnel[1].value > 0 ? ((charts.funnel[2].value / charts.funnel[1].value) * 100).toFixed(2) : 0}%
            </h3>
            <p className="summary-subtext">Cart to checkout</p>
          </div>
          <div className="summary-icon purple"><CreditCard size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Purchase Completion</p>
            <h3 className="summary-value">
              {charts.funnel[2].value > 0 ? ((charts.funnel[3].value / charts.funnel[2].value) * 100).toFixed(2) : 0}%
            </h3>
            <p className="summary-subtext">Checkout to paid</p>
          </div>
          <div className="summary-icon amber"><CheckCircle size={24} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card span-2">
          <h3 className="chart-title">Conversion Rate Trend</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={charts.conversion_over_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, "Conv. Rate"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Purchase Funnel</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={charts.funnel} layout="vertical" margin={{ left: 20, right: 40 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: any) => [value, "Users"]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40}>
                  {charts.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="funnel-stats mt-4 flex flex-col gap-2">
              {charts.funnel.slice(1).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded">
                  <span className="font-medium">{charts.funnel[idx].name} → {item.name}</span>
                  <span className="font-bold text-blue-600">
                    {charts.funnel[idx].value > 0 ? ((item.value / charts.funnel[idx].value) * 100).toFixed(1) : 0}% drop-off
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

