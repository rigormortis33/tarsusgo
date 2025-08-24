const db = require('../config/database');

const createTables = async () => {
  console.log('🚀 Starting database migration...');
  
  try {
    // Test connection first
    await db.testConnection();
    
    // 1. Users table
    console.log('📋 Creating users table...');
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_neighborhood (neighborhood_id),
        INDEX idx_user_type (user_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 2. Businesses table
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
        working_hours JSON,
        features JSON,
        images JSON,
        rating DECIMAL(3,2) DEFAULT 0.00,
        review_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_category (category),
        INDEX idx_neighborhood (neighborhood_id),
        INDEX idx_rating (rating),
        INDEX idx_active (is_active),
        FULLTEXT idx_search (name, description, address)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 3. Community messages table
    console.log('💬 Creating community_messages table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS community_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        neighborhood_id VARCHAR(100),
        title VARCHAR(255),
        content TEXT NOT NULL,
        images JSON,
        likes_count INT DEFAULT 0,
        replies_count INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_category (category),
        INDEX idx_neighborhood (neighborhood_id),
        INDEX idx_created (created_at DESC),
        INDEX idx_active (is_active),
        FULLTEXT idx_search (title, content)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 4. Message replies table
    console.log('↩️ Creating message_replies table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS message_replies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        message_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        likes_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES community_messages(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_message (message_id),
        INDEX idx_user (user_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 5. Reviews table
    console.log('⭐ Creating reviews table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        business_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        images JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_business (user_id, business_id),
        INDEX idx_business (business_id),
        INDEX idx_user (user_id),
        INDEX idx_rating (rating),
        INDEX idx_created (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 6. Emergency contacts table
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_featured (is_featured),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 7. Neighborhoods reference table
    console.log('🏘️ Creating neighborhoods table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS neighborhoods (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        emoji VARCHAR(10),
        population INT,
        postal_code VARCHAR(10),
        coordinates JSON,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        FULLTEXT idx_search (name, full_name, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ All tables created successfully!');
    console.log('🎯 Database migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

// Run migration
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
