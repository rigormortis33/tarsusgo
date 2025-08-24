const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const createDemoUsers = async () => {
  console.log('🔧 Creating demo users...');
  
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

    // Demo şifreyi hash'le
    const passwordHash = await bcrypt.hash('demo123', 10);

    // Demo kullanıcıları ekle
    const demoUsers = [
      {
        email: 'ahmet@tarsus.com',
        password_hash: passwordHash,
        name: 'Ahmet Yılmaz',
        phone: '0555 123 45 67',
        user_type: 'individual'
      },
      {
        email: 'info@tarsuskebap.com',
        password_hash: passwordHash,
        name: 'Mehmet Özdemir',
        phone: '0324 123 45 67',
        user_type: 'business'
      }
    ];

    for (const user of demoUsers) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO tg_users (email, password_hash, name, phone, user_type) 
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           password_hash = VALUES(password_hash),
           name = VALUES(name),
           phone = VALUES(phone),
           user_type = VALUES(user_type)`,
          [user.email, user.password_hash, user.name, user.phone, user.user_type]
        );
        
        console.log(`✅ Demo user created/updated: ${user.email}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  Demo user already exists: ${user.email}`);
        } else {
          throw error;
        }
      }
    }

    // Demo işletmeleri ekle
    const demoBusinesses = [
      {
        name: 'Tarsus Lezzet Kebap',
        category: 'restoran',
        neighborhood: 'sehitkerim-mahallesi',
        address: 'Şehitkerim Mahallesi, Atatürk Caddesi No:45, Tarsus/Mersin',
        phone: '0324 123 45 67',
        description: 'Geleneksel lezzetler ve taze malzemelerle hazırlanmış nefis kebaplar.',
        rating: 4.5,
        is_approved: true
      },
      {
        name: 'Tarsus Pide Salonu',
        category: 'restoran',
        neighborhood: 'cumhuriyet-mahallesi',
        address: 'Cumhuriyet Mahallesi, İnönü Caddesi No:23, Tarsus/Mersin',
        phone: '0324 987 65 43',
        description: 'Taş fırında pişmiş özel pideler ve Türk mutfağı lezzetleri.',
        rating: 4.2,
        is_approved: true
      },
      {
        name: 'Çınar Pastanesi',
        category: 'restoran',
        neighborhood: 'yenisehir-mahallesi',
        address: 'Yenişehir Mahallesi, Gazi Caddesi No:78, Tarsus/Mersin',
        phone: '0324 456 78 90',
        description: 'Taze pasta, börek çeşitleri ve özel günler için pastalar.',
        rating: 4.7,
        is_approved: true
      }
    ];

    for (const business of demoBusinesses) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO tg_businesses (name, category, neighborhood, address, phone, description, rating, is_approved) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           category = VALUES(category),
           neighborhood = VALUES(neighborhood),
           address = VALUES(address),
           phone = VALUES(phone),
           description = VALUES(description),
           rating = VALUES(rating),
           is_approved = VALUES(is_approved)`,
          [business.name, business.category, business.neighborhood, business.address, business.phone, business.description, business.rating, business.is_approved]
        );
        
        console.log(`✅ Demo business created/updated: ${business.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  Demo business already exists: ${business.name}`);
        } else {
          throw error;
        }
      }
    }

    await connection.end();
    console.log('\n🎉 Demo data created successfully!');

  } catch (error) {
    console.error('❌ Error creating demo data:', error.message);
    console.error('🔍 Error code:', error.code);
    process.exit(1);
  }
};

createDemoUsers();
