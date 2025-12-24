import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function updateDatabaseSchema() {
  console.log('🚀 Starting database schema update...\n');

  let connection;
  let pool;

  try {
    // Connect to MySQL
    console.log('📡 Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });
    console.log('✅ Connected to MySQL server\n');

    const dbName = process.env.DB_NAME || 'myura_wellness';
    
    // Close connection and reconnect to specific database
    await connection.end();
    
    // Reconnect to the specific database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });
    
    console.log(`📦 Connected to database: ${dbName}\n`);

    // =====================================================
    // 1. PRODUCTS TABLE - Add slug column
    // =====================================================
    console.log('1️⃣  Updating products table...');
    try {
      await connection.execute(`
        ALTER TABLE \`products\` 
        ADD COLUMN \`slug\` VARCHAR(255) UNIQUE NULL AFTER \`product_id\`
      `);
      console.log('   ✅ Added slug column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('   ✓ slug column already exists');
      } else {
        console.log(`   ⚠️  Error: ${error.message}`);
      }
    }

    // =====================================================
    // 2. USER TABLE - Add new columns and remove name
    // =====================================================
    console.log('\n2️⃣  Updating user table...');
    
    // Add new columns
    const userColumns = [
      { name: 'username', sql: 'ADD COLUMN `username` VARCHAR(100) UNIQUE NULL AFTER `email`' },
      { name: 'first_name', sql: 'ADD COLUMN `first_name` VARCHAR(100) NULL AFTER `name`' },
      { name: 'last_name', sql: 'ADD COLUMN `last_name` VARCHAR(100) NULL AFTER `first_name`' },
      { name: 'phone_number', sql: 'ADD COLUMN `phone_number` VARCHAR(20) NULL AFTER `phone`' },
      { name: 'date_joined', sql: 'ADD COLUMN `date_joined` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `created_at`' },
    ];

    for (const col of userColumns) {
      try {
        await connection.execute(`ALTER TABLE \`user\` ${col.sql}`);
        console.log(`   ✅ Added ${col.name} column`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ✓ ${col.name} column already exists`);
        } else {
          console.log(`   ⚠️  Error adding ${col.name}: ${error.message}`);
        }
      }
    }

    // Migrate data from name to first_name and last_name
    try {
      await connection.execute(`
        UPDATE \`user\` 
        SET \`first_name\` = SUBSTRING_INDEX(\`name\`, ' ', 1),
            \`last_name\` = CASE 
              WHEN \`name\` LIKE '% %' THEN SUBSTRING_INDEX(\`name\`, ' ', -1)
              ELSE NULL
            END
        WHERE \`first_name\` IS NULL AND \`name\` IS NOT NULL
      `);
      console.log('   ✅ Migrated name to first_name and last_name');
    } catch (error) {
      console.log(`   ⚠️  Migration warning: ${error.message}`);
    }

    // Migrate phone to phone_number
    try {
      await connection.execute(`
        UPDATE \`user\` 
        SET \`phone_number\` = \`phone\`
        WHERE \`phone_number\` IS NULL AND \`phone\` IS NOT NULL
      `);
      console.log('   ✅ Migrated phone to phone_number');
    } catch (error) {
      console.log(`   ⚠️  Migration warning: ${error.message}`);
    }

    // Migrate created_at to date_joined
    try {
      await connection.execute(`
        UPDATE \`user\` 
        SET \`date_joined\` = \`created_at\`
        WHERE \`date_joined\` IS NULL
      `);
      console.log('   ✅ Migrated created_at to date_joined');
    } catch (error) {
      console.log(`   ⚠️  Migration warning: ${error.message}`);
    }

    // Remove name column
    try {
      await connection.execute(`ALTER TABLE \`user\` DROP COLUMN \`name\``);
      console.log('   ✅ Removed name column');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('   ⚠️  Cannot drop name column (may have dependencies)');
      } else {
        console.log(`   ⚠️  Error removing name: ${error.message}`);
      }
    }

    // =====================================================
    // 3. BLOGS TABLE - Add missing columns
    // =====================================================
    console.log('\n3️⃣  Updating blogs table...');
    
    const blogColumns = [
      { name: 'subtitle', sql: 'ADD COLUMN `subtitle` VARCHAR(255) NULL AFTER `title`' },
      { name: 'excerpt', sql: 'ADD COLUMN `excerpt` TEXT NULL AFTER `subtitle`' },
      { name: 'author', sql: 'ADD COLUMN `author` VARCHAR(100) NULL AFTER `author_id`' },
      { name: 'thumbnail', sql: 'ADD COLUMN `thumbnail` VARCHAR(500) NULL AFTER `featured_image`' },
      { name: 'content_blocks', sql: 'ADD COLUMN `content_blocks` JSON NULL AFTER `content`' },
      { name: 'date', sql: 'ADD COLUMN `date` DATE NULL AFTER `created_at`' },
    ];

    for (const col of blogColumns) {
      try {
        await connection.execute(`ALTER TABLE \`blogs\` ${col.sql}`);
        console.log(`   ✅ Added ${col.name} column`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ✓ ${col.name} column already exists`);
        } else {
          console.log(`   ⚠️  Error adding ${col.name}: ${error.message}`);
        }
      }
    }

    // Migrate existing data
    try {
      await connection.execute(`
        UPDATE \`blogs\` 
        SET \`thumbnail\` = \`featured_image\`
        WHERE \`thumbnail\` IS NULL AND \`featured_image\` IS NOT NULL
      `);
      console.log('   ✅ Migrated featured_image to thumbnail');
    } catch (error) {
      console.log(`   ⚠️  Migration warning: ${error.message}`);
    }

    try {
      await connection.execute(`
        UPDATE \`blogs\` 
        SET \`date\` = DATE(\`created_at\`)
        WHERE \`date\` IS NULL
      `);
      console.log('   ✅ Migrated created_at to date');
    } catch (error) {
      console.log(`   ⚠️  Migration warning: ${error.message}`);
    }

    try {
      await connection.execute(`
        UPDATE \`blogs\` b
        INNER JOIN \`admins\` a ON b.author_id = a.id
        SET b.author = a.name
        WHERE b.author IS NULL
      `);
      console.log('   ✅ Populated author from admins table');
    } catch (error) {
      console.log(`   ⚠️  Migration warning: ${error.message}`);
    }

    await connection.end();

    console.log('\n✅ Database schema update completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Products: Added slug column');
    console.log('   - User: Added username, first_name, last_name, phone_number, date_joined');
    console.log('   - User: Removed name column (migrated to first_name + last_name)');
    console.log('   - Blogs: Added subtitle, excerpt, author, thumbnail, content_blocks, date');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your server');
    console.log('   2. Test the admin panel');
    console.log('   3. Verify all fields are working correctly\n');

  } catch (error) {
    console.error('\n❌ Error updating database:', error.message);
    console.error(error.stack);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Tip: Check your MySQL credentials in .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure MySQL server is running');
    }
    
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    
    process.exit(1);
  }
}

// Run the update
updateDatabaseSchema();

