import pool from "../config/database.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Track a new session or update existing one
export const trackSession = async (req, res) => {
  const {
    id,
    userId,
    guestEmail,
    guestName,
    guestPhone,
    deviceType,
    browser,
    os,
    location,
    referrerUrl,
    referrerSource,
    utm,
    landingPage,
    ipAddress
  } = req.body;

  try {
    const [existing] = await pool.execute(
      "SELECT id FROM analytics_sessions WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      const country = location?.country || null;
      const state = location?.state || null;
      const city = location?.city || null;
      const utmSource = utm?.source || null;
      const utmMedium = utm?.medium || null;
      const utmCampaign = utm?.campaign || null;

      await pool.execute(
        `INSERT INTO analytics_sessions (
          id, user_id, guest_email, guest_name, guest_phone, device_type, browser, os, 
          location_country, location_state, location_city, 
          referrer_url, referrer_source, 
          utm_source, utm_medium, utm_campaign, 
          landing_page, ip_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, 
          userId || null,
          guestEmail || null,
          guestName || null,
          guestPhone || null,
          deviceType || 'desktop', 
          browser || null, 
          os || null,
          country, 
          state, 
          city,
          referrerUrl || null, 
          referrerSource || 'Direct',
          utmSource, 
          utmMedium, 
          utmCampaign,
          landingPage || null, 
          ipAddress || req.ip || null
        ]
      );
    } else {
      // Update existing session with new info (userId or guest info)
      const updates = [];
      const params = [];

      if (userId) {
        updates.push("user_id = ?");
        params.push(userId);
      }
      if (guestEmail) {
        updates.push("guest_email = ?");
        params.push(guestEmail);
      }
      if (guestName) {
        updates.push("guest_name = ?");
        params.push(guestName);
      }
      if (guestPhone) {
        updates.push("guest_phone = ?");
        params.push(guestPhone);
      }
      if (location?.country) {
        updates.push("location_country = ?");
        params.push(location.country);
      }
      if (location?.state) {
        updates.push("location_state = ?");
        params.push(location.state);
      }
      if (location?.city) {
        updates.push("location_city = ?");
        params.push(location.city);
      }

      if (updates.length > 0) {
        params.push(id);
        await pool.execute(
          `UPDATE analytics_sessions SET ${updates.join(", ")} WHERE id = ?`,
          params
        );
      }
    }

    return sendSuccess(res, { id }, "Session tracked");
  } catch (error) {
    console.error("Track session error:", error);
    return sendError(res, "Failed to track session", 500);
  }
};

// Track an event
export const trackEvent = async (req, res) => {
  const { sessionId, type, path, productId, orderId, metadata } = req.body;

  try {
    await pool.execute(
      `INSERT INTO analytics_events (
        session_id, event_type, page_path, product_id, order_id, metadata
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        type,
        path || '/',
        productId || null,
        orderId || null,
        metadata ? JSON.stringify(metadata) : null
      ]
    );

    return sendSuccess(res, {}, "Event tracked");
  } catch (error) {
    console.error("Track event error:", error);
    return sendError(res, "Failed to track event", 500);
  }
};


