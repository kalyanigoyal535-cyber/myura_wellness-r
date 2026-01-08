import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  UserX
} from "lucide-react";
import "../../styles/Analytics.css";

interface RecentActivity {
  session_id: string;
  created_at: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  user_email: string | null;
  user_phone: string | null;
  first_name: string | null;
  last_name: string | null;
  last_event: string;
  cart_adds: number;
  purchases: number;
}

interface AnalyticsData {
  charts: {
    detailed_locations: any[];
    india_regions: any[];
  };
  recent_activity: RecentActivity[];
}

export default function CustomerAnalytics() {
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
      setError(err.response?.data?.error || "Failed to load customer data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-message"><p>{error}</p></div>;
  if (!data) return null;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">Customer Analytics & Leads</h1>
          <p className="analytics-subtitle">Track your active users and their locations</p>
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
            <h3 className="card-title">👥 Total Active Leads</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">{data.recent_activity.length}</span>
          </div>
          <p className="card-subtext">Recent unique sessions</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">✅ Registered Users</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">
              {data.recent_activity.filter(a => a.first_name).length}
            </span>
          </div>
          <p className="card-subtext">Logged in accounts</p>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">📧 Guest Leads Captured</h3>
          </div>
          <div className="card-value-container">
            <span className="card-value">
              {data.recent_activity.filter(a => !a.first_name && (a.guest_email || a.guest_phone)).length}
            </span>
          </div>
          <p className="card-subtext">With contact information</p>
        </div>

        {/* Lead Table */}
        <div className="shopify-card span-2">
          <div className="card-header">
            <h3 className="card-title">📊 Recent Active Users (Leads)</h3>
          </div>
          <div className="activity-table-container" style={{ marginTop: 16 }}>
            <table className="activity-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>User / Guest</th>
                  <th style={{ textAlign: 'left' }}>Contact Details</th>
                  <th style={{ textAlign: 'center' }}>Last Action</th>
                  <th style={{ textAlign: 'right' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_activity.map((activity, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-name-cell">
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{activity.first_name ? `${activity.first_name} ${activity.last_name}` : activity.guest_name || "Anonymous"}</span>
                        {activity.first_name ? 
                          <span className="user-badge">User</span> : 
                          (activity.guest_name ? <span className="guest-badge">Guest</span> : null)
                        }
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                          <Mail size={12} style={{ color: '#3b82f6' }} /> {activity.user_email || activity.guest_email || "N/A"}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                          <Phone size={12} style={{ color: '#10b981' }} /> {activity.user_phone || activity.guest_phone || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`event-badge ${activity.last_event}`}>
                        {activity.last_event.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                      {new Date(activity.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Locations */}
        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">🌆 Top Locations (Cities)</h3>
          </div>
          <div className="locations-list" style={{ marginTop: 16 }}>
            {data.charts.detailed_locations.slice(0, 10).map((loc, idx) => (
              <div key={idx} className="location-item">
                <div className="location-info">
                  <MapPin size={18} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>{loc.city || "Unknown City"}</span>
                    <span className="text-xs text-slate-500">{loc.state}, {loc.country}</span>
                  </div>
                </div>
                <span className="location-value font-bold">{loc.sessions}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="shopify-card">
          <div className="card-header">
            <h3 className="card-title">🇮🇳 Top Regions (India)</h3>
          </div>
          <div className="locations-list" style={{ marginTop: 16 }}>
            {data.charts.india_regions.map((region, idx) => (
              <div key={idx} className="location-item">
                <div className="location-info">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>{region.name}</span>
                </div>
                <span className="location-value font-bold">{region.value} sessions</span>
              </div>
            ))}
            {data.charts.india_regions.length === 0 && (
              <p className="empty-text">No India regional data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

