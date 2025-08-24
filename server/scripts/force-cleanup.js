const db = require('../config/database');

const forceCleanup = async () => {
  console.log('🔧 Force cleanup starting...');
  
  try {
    await db.testConnection();
    
    // Disable foreign key checks temporarily
    console.log('🔓 Disabling foreign key checks...');
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop all TarsusGo tables
    const tables = ['users', 'businesses', 'community_messages', 'message_replies', 'reviews', 'emergency_contacts', 'neighborhoods'];
    
    for (const table of tables) {
      try {
        console.log(`🗑️ Force dropping: ${table}`);
        await db.execute(`DROP TABLE IF EXISTS ${table}`);
      } catch (error) {
        console.log(`⚠️ Could not drop ${table}:`, error.message);
      }
    }
    
    // Re-enable foreign key checks
    console.log('🔒 Re-enabling foreign key checks...');
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Force cleanup completed!');
    
  } catch (error) {
    console.error('❌ Force cleanup failed:', error.message);
    throw error;
  }
};

forceCleanup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
