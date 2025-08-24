const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const createTables = async () => {
  console.log('🔧 Creating database tables...');
  console.log(`📍 Database: ${process.env.DB_NAME}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4'
    });

    console.log('✅ Connected to database successfully!');

    // Kullanıcılar tablosu
    const usersTable = `
      CREATE TABLE IF NOT EXISTS tg_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        user_type ENUM('individual', 'business') DEFAULT 'individual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(usersTable);
    console.log('✅ Users table created/verified');

    // İşletmeler tablosu
    const businessesTable = `
      CREATE TABLE IF NOT EXISTS tg_businesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        neighborhood VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        description TEXT,
        rating DECIMAL(2,1) DEFAULT 0.0,
        image_url TEXT,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_neighborhood (neighborhood),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(businessesTable);
    console.log('✅ Businesses table created/verified');

    // Topluluk mesajları tablosu
    const communityTable = `
      CREATE TABLE IF NOT EXISTS tg_community_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        neighborhood VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_neighborhood (neighborhood),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(communityTable);
    console.log('✅ Community messages table created/verified');

    // Acil durumlar tablosu
    const emergencyTable = `
      CREATE TABLE IF NOT EXISTS tg_emergency_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        description TEXT,
        is_24_7 BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(emergencyTable);
    console.log('✅ Emergency contacts table created/verified');

    // Mahalleler tablosu
    const neighborhoodsTable = `
      CREATE TABLE IF NOT EXISTS tg_neighborhoods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        population INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(neighborhoodsTable);
    console.log('✅ Neighborhoods table created/verified');

    // Tabloları listele
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log('\n🎉 All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.error('🔍 Error code:', error.code);
    process.exit(1);
  }
};

createTables();
