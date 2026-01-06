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

    // 6. Sales by Product (Top 5)
    const [productSales] = await pool.execute(`
      SELECT p.name, SUM(oi.price * oi.quantity) as revenue, SUM(oi.quantity) as units
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.created_at >= ? AND o.payment_status = 'paid'
      GROUP BY p.product_id
      ORDER BY revenue DESC
      LIMIT 5
    `, [startDateStr]);

    // 7. Sessions by Referrer
    const [referrerBreakdown] = await pool.execute(`
      SELECT referrer_source as name, COUNT(*) as value
      FROM analytics_sessions
      WHERE created_at >= ?
      GROUP BY referrer_source
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
        sessions_over_time: sessionsOverTime,
        funnel: [
          { name: 'Sessions', value: funnelData[0].sessions },
          { name: 'Added to Cart', value: funnelData[0].added_to_cart },
          { name: 'Reached Checkout', value: funnelData[0].reached_checkout },
          { name: 'Purchases', value: funnelData[0].purchases }
        ],
        devices: deviceBreakdown,
        locations: locationBreakdown,
        referrers: referrerBreakdown,
        top_products: productSales
      }
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return sendError(res, "Failed to fetch analytics stats", 500);
  }
};


