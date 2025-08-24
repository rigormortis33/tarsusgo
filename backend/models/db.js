// MySQL veritabanı bağlantısı
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'tarsusgo'
});

connection.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
    return;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı.');
});

module.exports = connection;
