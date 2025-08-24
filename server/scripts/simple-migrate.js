const db = require('../config/database');

const createSimpleTables = async () => {
  console.log('🚀 Creating simple tables without foreign keys...');
  
  try {
    await db.testConnection();
    
    // 1. Users table (no foreign keys)
    console.log('👥 Creating users table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type ENUM('user', 'business') DEFAULT 'user',
        neighborhood_id VARCHAR(100),
        avatar_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 2. Businesses table (no foreign keys)
    console.log('🏢 Creating businesses table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS businesses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        category VARCHAR(100) NOT NULL,
        neighborhood_id VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        website VARCHAR(500),
        description TEXT,
        working_hours TEXT,
        features TEXT,
        images TEXT,
        rating DECIMAL(3,2) DEFAULT 0.00,
        review_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 3. Community messages table (no foreign keys)
    console.log('💬 Creating community_messages table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS community_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        neighborhood_id VARCHAR(100),
        title VARCHAR(255),
        content TEXT NOT NULL,
        images TEXT,
        likes_count INT DEFAULT 0,
        replies_count INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 4. Emergency contacts table
    console.log('🚨 Creating emergency_contacts table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        description TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 5. Neighborhoods table
    console.log('🏘️ Creating neighborhoods table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS neighborhoods (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        emoji VARCHAR(10),
        population INT,
        postal_code VARCHAR(10),
        coordinates TEXT,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ All simple tables created successfully!');
    console.log('🎯 Database migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

// Run simple migration
if (require.main === module) {
  createSimpleTables()
    .then(() => {
      console.log('🎉 Simple migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Simple migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createSimpleTables };
