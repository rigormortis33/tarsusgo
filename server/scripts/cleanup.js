const db = require('../config/database');

const cleanDatabase = async () => {
  console.log('🧹 Starting database cleanup...');
  
  try {
    await db.testConnection();
    
    // Check existing tables
    console.log('📋 Checking existing tables...');
    const [tables] = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      ORDER BY table_name
    `, [process.env.DB_NAME]);
    
    console.log('📊 Existing tables:', tables.map(t => t.table_name || t.TABLE_NAME));
    
    if (tables.length === 0) {
      console.log('✅ Database is clean, no tables to drop');
      return;
    }
    
    // Drop TarsusGo related tables in correct order (reverse dependency order)
    const tarsusgoTables = [
      'reviews',
      'message_replies', 
      'community_messages',
      'businesses',
      'users',
      'emergency_contacts',
      'neighborhoods'
    ];
    
    for (const table of tarsusgoTables) {
      try {
        console.log(`🗑️ Dropping table: ${table}`);
        await db.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`✅ Dropped: ${table}`);
      } catch (error) {
        console.log(`⚠️ Could not drop ${table}:`, error.message);
      }
    }
    
    // Verify cleanup
    const [remainingTables] = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      ORDER BY table_name
    `, [process.env.DB_NAME]);
    
    console.log('📊 Remaining tables:', remainingTables.map(t => t.table_name || t.TABLE_NAME));
    console.log('🎉 Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  }
};

// Run cleanup
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('✅ Cleanup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanDatabase };
