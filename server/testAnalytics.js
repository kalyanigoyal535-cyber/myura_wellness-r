import { getDashboardAnalytics } from './controllers/adminAnalyticsController.js';
import pool from './config/database.js';

async function testAnalytics() {
  const req = {
    query: { days: 30 }
  };
  const res = {
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) { this.data = data; return this; }
  };

  try {
    console.log("Testing getDashboardAnalytics...");
    await getDashboardAnalytics(req, res);
    console.log("Response Status:", res.statusCode || 200);
    console.log("Summary:", JSON.stringify(res.data.summary, null, 2));
    console.log("Charts Keys:", Object.keys(res.data.charts));
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    process.exit();
  }
}

testAnalytics();

