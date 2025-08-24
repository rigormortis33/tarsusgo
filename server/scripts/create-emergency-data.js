const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const createEmergencyData = async () => {
  console.log('🔧 Creating emergency contacts...');
  
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

    const emergencyContacts = [
      {
        name: "112 Acil Çağrı Merkezi",
        category: "Acil Sağlık",
        phone: "112",
        description: "Ambulans, itfaiye, polis - 7/24 acil yardım",
        address: "Tüm Türkiye",
        is_24_7: true
      },
      {
        name: "Tarsus İlçe Emniyet Müdürlüğü",
        category: "Emniyet",
        phone: "0324 614 10 55",
        description: "Tarsus merkez emniyet müdürlüğü",
        address: "Cumhuriyet Mahallesi, Emniyet Caddesi, Tarsus/Mersin",
        is_24_7: true
      },
      {
        name: "Tarsus İtfaiyesi",
        category: "İtfaiye",
        phone: "0324 614 13 66",
        description: "Yangın ve acil kurtarma hizmetleri",
        address: "Yenişehir Mahallesi, İtfaiye Caddesi, Tarsus/Mersin",
        is_24_7: true
      },
      {
        name: "Tarsus Devlet Hastanesi",
        category: "Hastane",
        phone: "0324 614 20 00",
        description: "24 saat acil servis hizmeti",
        address: "Şehitkerim Mahallesi, Devlet Hastanesi Caddesi, Tarsus/Mersin",
        is_24_7: true
      },
      {
        name: "Tarsus Özel Hastanesi",
        category: "Hastane",
        phone: "0324 614 25 25",
        description: "Özel hastane acil servis",
        address: "Cumhuriyet Mahallesi, Hastane Sokağı, Tarsus/Mersin",
        is_24_7: false
      }
    ];

    for (const contact of emergencyContacts) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO tg_emergency_contacts (name, category, phone, description, address, is_24_7) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           category = VALUES(category),
           phone = VALUES(phone),
           description = VALUES(description),
           address = VALUES(address),
           is_24_7 = VALUES(is_24_7)`,
          [contact.name, contact.category, contact.phone, contact.description, contact.address, contact.is_24_7]
        );
        
        console.log(`✅ Emergency contact created/updated: ${contact.name}`);
      } catch (error) {
        console.error(`❌ Error creating ${contact.name}:`, error.message);
      }
    }

    await connection.end();
    console.log('\n🎉 Emergency contacts created successfully!');

  } catch (error) {
    console.error('❌ Error creating emergency data:', error.message);
    console.error('🔍 Error code:', error.code);
    process.exit(1);
  }
};

createEmergencyData();
