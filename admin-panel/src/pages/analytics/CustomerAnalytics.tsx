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
            <p className="summary-label">Total Leads</p>
            <h3 className="summary-value">{data.recent_activity.length}</h3>
            <p className="summary-subtext">Recent active users</p>
          </div>
          <div className="summary-icon blue"><Users size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Logged In Users</p>
            <h3 className="summary-value">
              {data.recent_activity.filter(a => a.first_name).length}
            </h3>
            <p className="summary-subtext">Registered accounts</p>
          </div>
          <div className="summary-icon purple"><UserCheck size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Guest Leads</p>
            <h3 className="summary-value">
              {data.recent_activity.filter(a => !a.first_name && (a.guest_email || a.guest_phone)).length}
            </h3>
            <p className="summary-subtext">Captured guest info</p>
          </div>
          <div className="summary-icon amber"><UserX size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-card-info">
            <p className="summary-label">Top Location</p>
            <h3 className="summary-value text-sm truncate max-w-[150px]">
              {data.charts.detailed_locations[0]?.city || "N/A"}
            </h3>
            <p className="summary-subtext">{data.charts.detailed_locations[0]?.sessions || 0} sessions</p>
          </div>
          <div className="summary-icon green"><MapPin size={24} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card span-2">
          <h3 className="chart-title">Recent Active Users (Leads)</h3>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>User / Guest</th>
                  <th>Contact Info</th>
                  <th>Last Action</th>
                  <th>Cart/Purchase</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_activity.map((activity, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-name-cell">
                        {activity.first_name ? `${activity.first_name} ${activity.last_name}` : activity.guest_name || "Anonymous"}
                        {activity.first_name ? 
                          <span className="user-badge">User</span> : 
                          (activity.guest_name ? <span className="guest-badge">Guest</span> : null)
                        }
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-xs"><Mail size={10} /> {activity.user_email || activity.guest_email || "N/A"}</span>
                        <span className="flex items-center gap-1 text-xs"><Phone size={10} /> {activity.user_phone || activity.guest_phone || "N/A"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`event-badge ${activity.last_event}`}>
                        {activity.last_event.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <span className="text-xs">🛒 {activity.cart_adds}</span>
                        <span className="text-xs">💰 {activity.purchases > 0 ? "Yes" : "No"}</span>
                      </div>
                    </td>
                    <td className="text-xs">{new Date(activity.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top Locations Breakdown</h3>
          <div className="locations-list">
            {data.charts.detailed_locations.map((loc, idx) => (
              <div key={idx} className="location-item">
                <div className="location-info">
                  <MapPin size={16} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{loc.city || "Unknown City"}</span>
                    <span className="text-xs text-slate-500">{loc.state}, {loc.country}</span>
                  </div>
                </div>
                <span className="location-value font-bold">{loc.sessions} <span className="text-xs font-normal">sessions</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

