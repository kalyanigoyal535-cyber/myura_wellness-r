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
            <h3 className="card-title">🎯 Overall Conversion Rate</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{summary.conversion_rate}%</span>
          </div>
          <p className="card-subtext">Session to purchase rate</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">🛍️ Add to Cart Rate</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">
              {charts.funnel[0].value > 0 ? ((charts.funnel[1].value / charts.funnel[0].value) * 100).toFixed(2) : 0}%
            </span>
          </div>
          <p className="card-subtext">Percentage of visitors adding to cart</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">💳 Checkout Reach Rate</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">
              {charts.funnel[1].value > 0 ? ((charts.funnel[2].value / charts.funnel[1].value) * 100).toFixed(2) : 0}%
            </span>
          </div>
          <p className="card-subtext">Percentage of cart additions reaching checkout</p>
        </div>

        {/* Funnel Graph */}
        <div className="shopify-card span-2">
          <div className="card-header">
            <h3 className="card-title">📩 Conversion Funnel</h3>
          </div>
          <div className="funnel-container" style={{ marginTop: 24 }}>
            {charts.funnel.map((step, i) => (
              <div key={i} className="funnel-step">
                <div className="funnel-info">
                  <span className="funnel-label">{step.name}</span>
                  <span className="funnel-percentage">
                    {i === 0 ? "100%" : `${((step.value / charts.funnel[0].value) * 100).toFixed(1)}%`}
                  </span>
                  <span className="funnel-count">{step.value.toLocaleString()} users</span>
                </div>
                <div className="funnel-bar-wrapper">
                  <div className="funnel-bar" style={{ width: `${(step.value / charts.funnel[0].value) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>📉 Funnel Drop-offs</h4>
            <div className="flex flex-col gap-2">
              {charts.funnel.slice(1).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded border border-slate-100" style={{ borderRadius: '10px', padding: '14px 16px' }}>
                  <span className="font-medium" style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>{charts.funnel[idx].name} → {item.name}</span>
                  <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                    {charts.funnel[idx].value > 0 ? (100 - (item.value / charts.funnel[idx].value * 100)).toFixed(1) : 0}% drop-off
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conv. Rate Trend */}
        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">📈 Conversion Rate Trend</h3>
          </div>
          <div style={{ height: 350, marginTop: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.conversion_over_time}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                  formatter={(value: any) => [`${value}%`, "Conv. Rate"]}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

