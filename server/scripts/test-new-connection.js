const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const testNewConnection = async () => {
  console.log('🔧 Testing connection to new database...');
  console.log(`📍 Host: ${process.env.DB_HOST}`);
  console.log(`📍 Database: ${process.env.DB_NAME}`);
  console.log(`📍 User: ${process.env.DB_USER}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4'
    });

    console.log('✅ Connected successfully!');

    // Test with a simple query
    const [rows] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as version');
    console.log('🐬 Current Database:', rows[0].current_db);
    console.log('🐬 MySQL Version:', rows[0].version);

    // Check existing tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Existing tables:', tables.length);
    
    if (tables.length > 0) {
      console.log('📋 Tables found:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('✨ Database is clean - ready for migration!');
    }

    await connection.end();
    console.log('🎉 Connection test completed successfully!');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Error code:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🚫 Access denied - check credentials');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('🗄️ Database does not exist');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Host not found - check host address');
    }
    
    throw error;
  }
};

testNewConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
