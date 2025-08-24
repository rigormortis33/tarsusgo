const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const createDatabase = async () => {
  console.log('🗄️ Creating new database: u588148465_tarsusgo33');
  
  try {
    // Connect without database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: 'utf8mb4'
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS u588148465_tarsusgo33 
                             CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log('✅ Database u588148465_tarsusgo33 created successfully!');

    // Test connection to new database
    await connection.changeUser({
      database: 'u588148465_tarsusgo33'
    });

    console.log('✅ Successfully connected to new database');
    
    await connection.end();
    console.log('🎉 Database creation completed!');

  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    throw error;
  }
};

// Run database creation
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('✅ Database ready for migration!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createDatabase };
