import pool from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Helper to get date range
const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - parseInt(days || 30));
  return { start, end };
};

export const getDashboardAnalytics = async (req, res) => {
  const { days = 30 } = req.query;
  const { start } = getDateRange(days);
  const startDateStr = start.toISOString().slice(0, 19).replace('T', ' ');

  try {
    // 1. Sales & Revenue Over Time
    const [salesOverTime] = await pool.execute(`
      SELECT DATE(created_at) as date, SUM(total_amount) as sales, COUNT(*) as orders
      FROM orders
      WHERE created_at >= ? AND payment_status = 'paid'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [startDateStr]);

    // 2. Sessions Over Time
    const [sessionsOverTime] = await pool.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as sessions
      FROM analytics_sessions
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [startDateStr]);

    // 3. Conversion Funnel
    const [funnelData] = await pool.execute(`
      SELECT 
        (SELECT COUNT(DISTINCT id) FROM analytics_sessions WHERE created_at >= ?) as sessions,
        (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_type = 'add_to_cart' AND created_at >= ?) as added_to_cart,
        (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_type = 'reached_checkout' AND created_at >= ?) as reached_checkout,
        (SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE event_type = 'purchase' AND created_at >= ?) as purchases
    `, [startDateStr, startDateStr, startDateStr, startDateStr]);

    // 4. Sessions by Device Type
    const [deviceBreakdown] = await pool.execute(`
      SELECT device_type as name, COUNT(*) as value
      FROM analytics_sessions
      WHERE created_at >= ?
      GROUP BY device_type
    `, [startDateStr]);

    // 5. Sessions by Location (Top 5 countries)
    const [locationBreakdown] = await pool.execute(`
      SELECT location_country as name, COUNT(*) as value
      FROM analytics_sessions
      WHERE created_at >= ? AND location_country IS NOT NULL
      GROUP BY location_country
      ORDER BY value DESC
      LIMIT 5
    `, [startDateStr]);

    // 5a. Social Referrer Breakdown (Sessions)
    const [socialReferrerSessions] = await pool.execute(`
      SELECT 
        referrer_source as name, 
        COUNT(*) as sessions
      FROM analytics_sessions
      WHERE created_at >= ? AND referrer_source IN ('Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Youtube', 'Pinterest')
      GROUP BY referrer_source
      ORDER BY sessions DESC
    `, [startDateStr]);

    // 5b. Sales by Referrer
    const [salesByReferrer] = await pool.execute(`
      SELECT 
        s.referrer_source as name, 
        SUM(o.total_amount) as revenue
      FROM analytics_sessions s
      JOIN analytics_events e ON s.id = e.session_id AND e.event_type = 'purchase'
      JOIN orders o ON e.order_id = o.order_id
      WHERE s.created_at >= ?
      GROUP BY s.referrer_source
      ORDER BY revenue DESC
    `, [startDateStr]);

    // 5c. Marketing Attribution (UTM Source)
    const [marketingSales] = await pool.execute(`
      SELECT 
        utm_source as name, 
        SUM(o.total_amount) as revenue
      FROM analytics_sessions s
      JOIN analytics_events e ON s.id = e.session_id AND e.event_type = 'purchase'
      JOIN orders o ON e.order_id = o.order_id
      WHERE s.created_at >= ? AND utm_source IS NOT NULL
      GROUP BY utm_source
      ORDER BY revenue DESC
    `, [startDateStr]);

    // 6. Sales by Product (Detailed)
    const [productSales] = await pool.execute(`
      SELECT 
        p.name, 
        p.stock_quantity,
        p.initial_stock,
        SUM(oi.price * oi.quantity) as revenue, 
        SUM(oi.quantity) as units,
        (SUM(oi.quantity) / NULLIF(p.initial_stock, 0)) * 100 as sell_through_rate
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id AND o.payment_status = 'paid' AND o.created_at >= ?
      GROUP BY p.product_id
      ORDER BY revenue DESC
    `, [startDateStr]);

    // 7. Sessions by Referrer
    const [referrerBreakdown] = await pool.execute(`
      SELECT referrer_source as name, COUNT(*) as value
      FROM analytics_sessions
      WHERE created_at >= ?
      GROUP BY referrer_source
    `, [startDateStr]);

    // 7a. Sessions by Landing Page with Conversion
    const [landingPageBreakdown] = await pool.execute(`
      SELECT 
        s.landing_page as name, 
        COUNT(DISTINCT s.id) as sessions,
        COUNT(DISTINCT e.id) as conversions,
        (COUNT(DISTINCT e.id) / COUNT(DISTINCT s.id)) * 100 as conversion_rate
      FROM analytics_sessions s
      LEFT JOIN analytics_events e ON s.id = e.session_id AND e.event_type = 'purchase'
      WHERE s.created_at >= ?
      GROUP BY s.landing_page
      ORDER BY sessions DESC
      LIMIT 10
    `, [startDateStr]);

    // 7b. Detailed Location Breakdown
    const [locationStats] = await pool.execute(`
      SELECT 
        location_country as country, 
        location_state as state, 
        location_city as city,
        COUNT(*) as sessions
      FROM analytics_sessions
      WHERE created_at >= ? AND location_country IS NOT NULL
      GROUP BY location_country, location_state, location_city
      ORDER BY sessions DESC
      LIMIT 20
    `, [startDateStr]);

    // 7c. Conversion & Sessions Over Time
    const [trendOverTime] = await pool.execute(`
      SELECT 
        DATE(s.created_at) as date,
        COUNT(DISTINCT s.id) as sessions,
        COUNT(DISTINCT e.id) as purchases
      FROM analytics_sessions s
      LEFT JOIN analytics_events e ON s.id = e.session_id AND e.event_type = 'purchase'
      WHERE s.created_at >= ?
      GROUP BY DATE(s.created_at)
      ORDER BY date ASC
    `, [startDateStr]);

    // 8. Total Sales, Orders, AOV
    const [totals] = await pool.execute(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_sales,
        COUNT(*) as total_orders,
        COALESCE(AVG(total_amount), 0) as aov
      FROM orders
      WHERE created_at >= ? AND payment_status = 'paid'
    `, [startDateStr]);

    // 9. Comparison totals (previous period)
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - parseInt(days || 30));
    const prevStartStr = prevStart.toISOString().slice(0, 19).replace('T', ' ');
    
    const [prevTotals] = await pool.execute(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_sales,
        COUNT(*) as total_orders
      FROM orders
      WHERE created_at >= ? AND created_at < ? AND payment_status = 'paid'
    `, [prevStartStr, startDateStr]);

    const salesGrowth = prevTotals[0].total_sales > 0 
      ? ((totals[0].total_sales - prevTotals[0].total_sales) / prevTotals[0].total_sales) * 100 
      : 0;

    // 10. Recent Active Users (Leads)
    const [recentActivity] = await pool.execute(`
      SELECT 
        s.id as session_id,
        s.created_at,
        s.guest_name,
        s.guest_email,
        s.guest_phone,
        u.email as user_email,
        u.phone_number as user_phone,
        u.first_name,
        u.last_name,
        (SELECT event_type FROM analytics_events WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_event,
        (SELECT COUNT(*) FROM analytics_events WHERE session_id = s.id AND event_type = 'add_to_cart') as cart_adds,
        (SELECT COUNT(*) FROM analytics_events WHERE session_id = s.id AND event_type = 'purchase') as purchases
      FROM analytics_sessions s
      LEFT JOIN user u ON s.user_id = u.id
      WHERE s.created_at >= ?
      HAVING cart_adds > 0 OR purchases > 0 OR guest_email IS NOT NULL OR guest_phone IS NOT NULL
      ORDER BY s.created_at DESC
      LIMIT 20
    `, [startDateStr]);

    return sendSuccess(res, {
      summary: {
        total_sales: parseFloat(totals[0].total_sales),
        total_orders: totals[0].total_orders,
        aov: parseFloat(totals[0].aov),
        sales_growth: parseFloat(salesGrowth.toFixed(2)),
        sessions: funnelData[0].sessions,
        conversion_rate: funnelData[0].sessions > 0 
          ? parseFloat(((funnelData[0].purchases / funnelData[0].sessions) * 100).toFixed(2))
          : 0
      },
      charts: {
        sales_over_time: salesOverTime,
        sessions_over_time: trendOverTime.map(d => ({ date: d.date, value: d.sessions })),
        conversion_over_time: trendOverTime.map(d => ({
          date: d.date,
          rate: d.sessions > 0 ? parseFloat(((d.purchases / d.sessions) * 100).toFixed(2)) : 0
        })),
        funnel: [
          { name: 'Sessions', value: funnelData[0].sessions },
          { name: 'Added to Cart', value: funnelData[0].added_to_cart },
          { name: 'Reached Checkout', value: funnelData[0].reached_checkout },
          { name: 'Purchases', value: funnelData[0].purchases }
        ],
        devices: deviceBreakdown,
        locations: locationBreakdown,
        detailed_locations: locationStats,
        referrers: referrerBreakdown,
        landing_pages: landingPageBreakdown,
        top_products: productSales.map(p => ({
          name: p.name,
          revenue: parseFloat(p.revenue || 0),
          units: parseInt(p.units || 0),
          stock_available: parseInt(p.stock_quantity || 0),
          sell_through_rate: parseFloat(p.sell_through_rate || 0).toFixed(2)
        })),
        social_referrer_sessions: socialReferrerSessions,
        sales_by_referrer: salesByReferrer,
        marketing_sales: marketingSales
      },
      recent_activity: recentActivity
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return sendError(res, "Failed to fetch analytics stats", 500);
  }
};
