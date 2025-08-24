# 🏛️ TarsusGo

Modern ve kullanıcı dostu Tarsus şehir rehberi platformu.

## 🌟 Özellikler

### ✅ Mevcut Özellikler (%95 Tamamlandı)

- **🚨 Acil Durum Rehberi**: Hastane, polis, itfaiye ve diğer acil durum numaraları
- **🏘️ Topluluk Platformu**: Mahalle bazında sosyal iletişim ve yardımlaşma
- **🏪 İşletmeler Rehberi**: Yerel işletmeler, restoranlar ve hizmet sağlayıcıları
- **👤 Kullanıcı Sistemi**: Bireysel ve işletme hesapları
- **🔐 Güvenli Giriş**: JWT tabanlı authentication

### 🔄 Geliştiriliyor

- **🚌 Ulaşım Bilgileri**: Otobüs saatleri ve güzergahları
- **🏛️ Resmi Kurumlar**: Belediye, kaymakamlık rehberi

## 🛠️ Teknoloji Stack

### Frontend
- **React.js 18.2.0**: Modern UI framework
- **CSS3**: Responsive design with animations
- **Progressive Web App**: Offline-ready features

### Backend
- **Node.js & Express.js**: RESTful API server
- **MySQL**: Database with 5 core tables
- **JWT Authentication**: Secure user sessions
- **bcrypt**: Password hashing

### DevOps
- **VPS Deployment**: Production server on 72.60.36.213
- **SSL/HTTPS**: Let's Encrypt certificates
- **Nginx**: Reverse proxy and static file serving
- **PM2**: Process management and monitoring
- **Domain**: https://tarsusgo.com

## 🚀 Canlı Demo

**Website**: [https://tarsusgo.com](https://tarsusgo.com)

### Demo Hesapları

**Bireysel Kullanıcı:**
- Email: `demo@example.com`
- Şifre: `demo123`

**İşletme Hesabı:**
- Email: `restaurant@example.com`
- Şifre: `demo123`

## 📱 Ekran Görüntüleri

- Modern progress göstergesi (%95 tamamlanma)
- Responsive mobile tasarım
- Kullanıcı dostu arayüz
- SSL güvenliği

## ⚡ Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- MySQL 8.0+
- npm veya yarn

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/rigormortis33/tarsusgo.git
cd tarsusgo

# Frontend bağımlılıklarını yükleyin
npm install

# Backend bağımlılıklarını yükleyin
cd server
npm install

# Database yapısını oluşturun
node scripts/create-tables.js
node scripts/create-demo-data.js

# Backend'i başlatın
npm start

# Yeni terminal'de frontend'i başlatın
cd ..
npm start
```

### Environment Variables

**.env** (Ana dizin):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**server/.env**:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=tarsusgo
JWT_SECRET=your_jwt_secret
```

## 📊 Database Schema

- **tg_users**: Kullanıcı bilgileri
- **tg_businesses**: İşletme rehberi
- **tg_community_messages**: Topluluk mesajları
- **tg_emergency_contacts**: Acil durum numaraları
- **tg_neighborhoods**: Mahalle listesi (180 mahalle)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı

### Business
- `GET /api/business` - İşletme listesi
- `POST /api/business` - Yeni işletme ekleme

### Community
- `GET /api/community/messages` - Topluluk mesajları
- `POST /api/community/messages` - Yeni mesaj

### Emergency
- `GET /api/emergency` - Acil durum numaraları

### Health
- `GET /api/health` - Server durumu

## 🌟 Öne Çıkan Özellikler

- **Modern Progress UI**: %95 tamamlanma göstergesi
- **Real-time Updates**: Canlı veri güncellemeleri
- **Mobile-First**: Responsive tasarım
- **SSL Security**: HTTPS güvenliği
- **Production Ready**: Canlı deployment
- **Monitoring**: PM2 ile süreç izleme

## 📈 Production Monitoring

- **Health Check**: `/api/health` endpoint
- **Process Management**: PM2 monitoring
- **Log Rotation**: Otomatik log yönetimi
- **SSL Auto-Renewal**: Let's Encrypt otomatik yenileme

## 👥 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Website**: [https://tarsusgo.com](https://tarsusgo.com)
- **GitHub**: [https://github.com/rigormortis33/tarsusgo](https://github.com/rigormortis33/tarsusgo)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
