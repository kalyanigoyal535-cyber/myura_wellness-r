import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myura_wellness',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000 // 10 seconds delay before starting keep-alive
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.warn('⚠️  Could not connect to MySQL. Please ensure the MySQL service is running.');
    }
  });

// Handle pool errors to prevent app crashes
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.log('Database connection was closed. Pool will handle reconnection.');
  } else {
    throw err;
  }
});

export default pool;

