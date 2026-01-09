import pool from "../config/database.js";

async function migrate() {
  console.log("🚀 Starting database migration...");
  let connection;

  try {
    connection = await pool.getConnection();
    console.log("✅ Connected to database.");

    // 1. Update user table
    console.log("Updating 'user' table...");
    const userColumns = [
      { name: "photo", type: "VARCHAR(255) NULL" },
      { name: "phone_number", type: "VARCHAR(20) NULL" },
      { name: "address", type: "TEXT NULL" },
      { name: "city", type: "VARCHAR(100) NULL" },
      { name: "state", type: "VARCHAR(100) NULL" },
      { name: "postal_code", type: "VARCHAR(20) NULL" },
      { name: "is_verified", type: "TINYINT(1) DEFAULT 0" },
      { name: "date_joined", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" }
    ];

    for (const col of userColumns) {
      try {
        await connection.execute(`ALTER TABLE user ADD COLUMN ${col.name} ${col.type}`);
        console.log(`   Added column '${col.name}' to 'user' table.`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          // console.log(`   Column '${col.name}' already exists in 'user' table.`);
        } else {
          console.error(`   Error adding column '${col.name}':`, err.message);
        }
      }
    }

    // 2. Create email_otps table
    console.log("Creating 'email_otps' table if not exists...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS email_otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
    `);
    console.log("✅ 'email_otps' table is ready.");

    // 3. Update contact_submissions table
    console.log("Updating 'contact_submissions' table...");
    try {
      await connection.execute("ALTER TABLE contact_submissions ADD COLUMN is_resolved TINYINT(1) DEFAULT 0");
      console.log("   Added column 'is_resolved' to 'contact_submissions' table.");
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        // console.log("   Column 'is_resolved' already exists in 'contact_submissions' table.");
      } else {
        console.error("   Error updating 'contact_submissions':", err.message);
      }
    }

    console.log("\n✨ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

migrate();
