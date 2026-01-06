import pool from "./config/database.js";

async function setupAnalyticsTables() {
  try {
    console.log("Checking analytics tables...");

    // Create analytics_sessions table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT NULL,
        device_type VARCHAR(50) DEFAULT 'desktop',
        browser VARCHAR(100) NULL,
        os VARCHAR(100) NULL,
        location_country VARCHAR(100) NULL,
        location_state VARCHAR(100) NULL,
        location_city VARCHAR(100) NULL,
        referrer_url TEXT NULL,
        referrer_source VARCHAR(100) DEFAULT 'Direct',
        utm_source VARCHAR(100) NULL,
        utm_medium VARCHAR(100) NULL,
        utm_campaign VARCHAR(100) NULL,
        landing_page TEXT NULL,
        ip_address VARCHAR(45) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
      )
    `);
    console.log("✅ analytics_sessions table verified");

    // Create analytics_events table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        page_path TEXT NULL,
        product_id INT NULL,
        order_id INT NULL,
        metadata JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES analytics_sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
      )
    `);
    console.log("✅ analytics_events table verified");

  } catch (error) {
    console.error("❌ Setup analytics tables error:", error);
  } finally {
    process.exit();
  }
}

setupAnalyticsTables();

