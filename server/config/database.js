const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

console.log('🔧 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  charset: dbConfig.charset
});

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection established');
    
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log('🐬 MySQL Version:', rows[0].version);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    throw error;
  }
};

// Helper function for executing queries
const execute = async (sql, params = []) => {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return [rows, fields];
  } catch (error) {
    console.error('❌ Query execution failed:', error.message);
    console.error('📝 SQL:', sql);
    console.error('📊 Params:', params);
    throw error;
  }
};

// Helper function for transactions
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  execute,
  transaction,
  testConnection
};
