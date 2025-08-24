import React, { useState, useEffect } from 'react';
import { emergencyAPI } from '../services/api';
import './EmergencyContact.css';

const EmergencyContact = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const response = await emergencyAPI.getAll();
      setEmergencyContacts(response.data || response);
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
      // Fallback to hardcoded data if API fails
      setEmergencyContacts(getDefaultEmergencyContacts());
    }
  };

  const getDefaultEmergencyContacts = () => [
    {
      id: 1,
      category: "Acil Sağlık",
      name: "112 Acil Çağrı Merkezi",
      phone: "112",
      description: "Ambulans, itfaiye, polis - 7/24 acil yardım",
      address: "Tüm Türkiye",
      icon: "🚑"
    },
    {
      id: 2,
      category: "Emniyet",
      name: "Tarsus İlçe Emniyet Müdürlüğü",
      phone: "324 614 10 19",
      description: "İlçe emniyet müdürlüğü",
      address: "Adnan Menderes Cad. No:2 Tarsus/Mersin",
      icon: "👮"
    },
    {
      id: 3,
      category: "Emniyet",
      name: "Polis İmdat",
      phone: "155",
      description: "Polis imdat hattı - 7/24",
      address: "Tüm Türkiye",
      icon: "🚔"
    },
    {
      id: 4,
      category: "İtfaiye",
      name: "Tarsus Belediyesi İtfaiye Müdürlüğü",
      phone: "324 614 28 41",
      description: "İtfaiye eri - yangın ve kurtarma",
      address: "Cumhuriyet Mah. İtfaiye Sok. Tarsus/Mersin",
      icon: "🚒"
    },
    {
      id: 5,
      category: "İtfaiye",
      name: "İtfaiye İmdat",
      phone: "110",
      description: "İtfaiye imdat hattı - 7/24",
      address: "Tüm Türkiye",
      icon: "🔥"
    },
    {
      id: 6,
      category: "Hastane",
      name: "Tarsus Devlet Hastanesi",
      phone: "324 614 10 90",
      description: "Devlet hastanesi - acil servis mevcut",
      address: "Cumhuriyet Mah. Dr. Sadık Ahmet Cad. Tarsus/Mersin",
      icon: "🏥"
    },
    {
      id: 7,
      category: "Hastane",
      name: "Tarsus Kadın Doğum ve Çocuk Hastanesi",
      phone: "324 614 15 50",
      description: "Kadın doğum ve çocuk sağlığı",
      address: "Bahşiş Mah. Fevzi Çakmak Cad. Tarsus/Mersin",
      icon: "👶"
    },
    {
      id: 8,
      category: "Hastane",
      name: "Tarsus Ağız ve Diş Sağlığı Merkezi",
      phone: "324 614 12 34",
      description: "Diş sağlığı hizmetleri",
      address: "Şehit Fethi Bey Cad. Tarsus/Mersin",
      icon: "🦷"
    },
    {
      id: 9,
      category: "Belediye",
      name: "Tarsus Belediyesi",
      phone: "324 614 10 00",
      description: "Belediye hizmetleri",
      address: "Cumhuriyet Mah. Atatürk Cad. Tarsus/Mersin",
      icon: "🏛️"
    },
    {
      id: 10,
      category: "Hastane",
      name: "Özel Tarsus Yaşam Hastanesi",
      phone: "324 623 33 33",
      description: "Özel hastane - 7/24 acil servis",
      address: "Vilayet Mah. Mersin Cad. Tarsus/Mersin",
      icon: "🏥"
    },
    {
      id: 11,
      category: "Acil Sağlık",
      name: "Tarsus 112 İstasyonu",
      phone: "324 614 11 22",
      description: "112 ambulans istasyonu",
      address: "Devlet Hastanesi Bahçesi Tarsus/Mersin",
      icon: "🚑"
    },
    {
      id: 12,
      category: "Eczane",
      name: "Nöbetçi Eczane Bilgi",
      phone: "0850 888 0 112",
      description: "Nöbetçi eczane bilgi hattı",
      address: "Türkiye geneli",
      icon: "💊"
    },
    {
      id: 13,
      category: "Acil Sağlık",
      name: "Zehir Bilgi Merkezi",
      phone: "114",
      description: "Zehirlenme acil yardım hattı - 7/24",
      address: "Türkiye geneli",
      icon: "☠️"
    },
    {
      id: 14,
      category: "Destek",
      name: "ALO 183 Sosyal Destek",
      phone: "183",
      description: "Sosyal yardım ve destek hattı",
      address: "Türkiye geneli",
      icon: "🤝"
    },
    {
      id: 15,
      category: "Destek",
      name: "Kadın Destek Hattı",
      phone: "0312 518 31 83",
      description: "Kadına yönelik şiddet destek hattı",
      address: "Türkiye geneli",
      icon: "👩"
    },
    {
      id: 16,
      category: "Hastane",
      name: "Mersin Şehir Hastanesi",
      phone: "324 341 20 00",
      description: "Bölgenin en büyük hastanesi - tüm branşlar",
      address: "Toroslar/Mersin (Tarsus'a 45 km)",
      icon: "🏥"
    },
    {
      id: 17,
      category: "Eczane",
      name: "Tarsus Eczacılar Odası",
      phone: "324 614 35 67",
      description: "Eczane bilgi ve şikayet hattı",
      address: "Cumhuriyet Mah. Tarsus/Mersin",
      icon: "💊"
    },
    {
      id: 18,
      category: "Belediye",
      name: "Tarsus Su ve Kanalizasyon",
      phone: "324 614 28 55",
      description: "Su arızaları ve kanalizasyon sorunları",
      address: "Tarsus Belediyesi",
      icon: "💧"
    },
    {
      id: 19,
      category: "Destek",
      name: "Veteriner Hekim Odası",
      phone: "324 614 41 23",
      description: "Veteriner acil durumları",
      address: "Tarsus/Mersin",
      icon: "🐕"
    },
    {
      id: 20,
      category: "Ulaşım",
      name: "Tarsus Otogar",
      phone: "324 614 26 78",
      description: "Otobüs bilgi ve rezervasyon",
      address: "Şehit Fevzi Çakmak Cad. Tarsus/Mersin",
      icon: "🚌"
    },
    {
      id: 21,
      category: "Belediye",
      name: "Tarsus Belediye Zabıtası",
      phone: "324 614 10 01",
      description: "Belediye zabıta hizmetleri",
      address: "Tarsus Belediyesi",
      icon: "👷"
    },
    {
      id: 22,
      category: "Emniyet",
      name: "Tarsus Jandarma Komutanlığı",
      phone: "324 614 10 41",
      description: "Jandarma karakolu",
      address: "Bahşiş Mah. Tarsus/Mersin",
      icon: "🪖"
    },
    {
      id: 23,
      category: "Altyapı",
      name: "TEDAŞ Elektrik Arıza",
      phone: "186",
      description: "Elektrik kesintisi ve arıza bildirimi - 7/24",
      address: "Türkiye geneli",
      icon: "⚡"
    },
    {
      id: 24,
      category: "Altyapı",
      name: "TEDAŞ Mersin Müdürlüğü",
      phone: "324 338 40 00",
      description: "TEDAŞ Mersin bölge müdürlüğü",
      address: "Mersin (Tarsus dahil)",
      icon: "🔌"
    },
    {
      id: 25,
      category: "Altyapı",
      name: "MESKİ Su Arıza",
      phone: "185",
      description: "Su kesintisi ve arıza bildirimi - 7/24",
      address: "Mersin geneli",
      icon: "💧"
    },
    {
      id: 26,
      category: "Altyapı",
      name: "MESKİ Tarsus Şubesi",
      phone: "324 614 36 90",
      description: "Mersin Su ve Kanalizasyon İdaresi - Tarsus",
      address: "Cumhuriyet Mah. Tarsus/Mersin",
      icon: "🚰"
    },
    {
      id: 27,
      category: "Altyapı",
      name: "BOTAŞ Doğalgaz Acil",
      phone: "187",
      description: "Doğalgaz kaçağı ve acil durumlar - 7/24",
      address: "Türkiye geneli",
      icon: "🔥"
    },
    {
      id: 28,
      category: "Altyapı",
      name: "Aygaz Acil Servis",
      phone: "444 0 996",
      description: "Tüp gaz acil servisi ve kaçak bildirimi",
      address: "Türkiye geneli",
      icon: "🛢️"
    },
    {
      id: 29,
      category: "Altyapı",
      name: "Türk Telekom Arıza",
      phone: "121",
      description: "Telefon ve internet arıza bildirimi",
      address: "Türkiye geneli",
      icon: "📞"
    },
    {
      id: 30,
      category: "Altyapı",
      name: "Türksat Kablo TV Arıza",
      phone: "444 0 466",
      description: "Kablo TV ve internet arıza servisi",
      address: "Türkiye geneli",
      icon: "📺"
    },
    {
      id: 31,
      category: "Belediye",
      name: "Tarsus Temizlik İşleri",
      phone: "324 614 28 60",
      description: "Çöp toplama ve temizlik hizmetleri",
      address: "Tarsus Belediyesi",
      icon: "🗑️"
    },
    {
      id: 32,
      category: "Altyapı",
      name: "Karayolları 1. Bölge Müdürlüğü",
      phone: "324 336 12 34",
      description: "Yol bakım ve trafik sorunları",
      address: "Mersin (Tarsus-Mersin yolu dahil)",
      icon: "🛣️"
    },
    {
      id: 33,
      category: "Altyapı",
      name: "MESKİ Kanalizasyon Tıkanıklığı",
      phone: "324 614 36 91",
      description: "Kanalizasyon tıkanıklığı ve taşma",
      address: "Tarsus/Mersin",
      icon: "🚽"
    },
    {
      id: 34,
      category: "Altyapı",
      name: "Superonline Teknik Destek",
      phone: "444 0 466",
      description: "İnternet ve telefon arıza servisi",
      address: "Türkiye geneli",
      icon: "🌐"
    },
    {
      id: 35,
      category: "Destek",
      name: "AFAD İl Müdürlüğü",
      phone: "324 325 60 33",
      description: "Afet ve Acil Durum Yönetimi - Mersin",
      address: "Mersin (Tarsus dahil)",
      icon: "🌊"
    }
  ];

  const categories = [...new Set(emergencyContacts.map(contact => contact.category))];

  const filteredContacts = emergencyContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const groupedContacts = categories.reduce((acc, category) => {
    acc[category] = filteredContacts.filter(contact => contact.category === category);
    return acc;
  }, {});

  return (
    <div className="emergency-contact-container">
      <div className="emergency-header">
        <h1>🚨 Acil Durum Rehberi</h1>
        <p>Tarsus için önemli acil durum numaraları</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Arama yapın (hastane, polis, itfaiye...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="quick-dial">
        <h2>Hızlı Arama</h2>
        <div className="quick-dial-buttons">
          <button onClick={() => handleCall('112')} className="quick-dial-btn emergency">
            <span className="icon">🚑</span>
            <span className="number">112</span>
            <span className="label">Acil</span>
          </button>
          <button onClick={() => handleCall('155')} className="quick-dial-btn police">
            <span className="icon">👮</span>
            <span className="number">155</span>
            <span className="label">Polis</span>
          </button>
          <button onClick={() => handleCall('110')} className="quick-dial-btn fire">
            <span className="icon">🚒</span>
            <span className="number">110</span>
            <span className="label">İtfaiye</span>
          </button>
          <button onClick={() => handleCall('186')} className="quick-dial-btn utility">
            <span className="icon">⚡</span>
            <span className="number">186</span>
            <span className="label">Elektrik</span>
          </button>
          <button onClick={() => handleCall('185')} className="quick-dial-btn water">
            <span className="icon">💧</span>
            <span className="number">185</span>
            <span className="label">Su</span>
          </button>
          <button onClick={() => handleCall('187')} className="quick-dial-btn gas">
            <span className="icon">🔥</span>
            <span className="number">187</span>
            <span className="label">Doğalgaz</span>
          </button>
        </div>
      </div>

      <div className="contacts-grid">
        {Object.keys(groupedContacts).map(category => 
          groupedContacts[category].length > 0 && (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <div className="contacts-list">
                {groupedContacts[category].map(contact => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-header">
                      <span className="contact-icon">{contact.icon}</span>
                      <h4 className="contact-name">{contact.name}</h4>
                    </div>
                    <p className="contact-description">{contact.description}</p>
                    <p className="contact-address">{contact.address}</p>
                    <div className="contact-actions">
                      <button 
                        onClick={() => handleCall(contact.phone)}
                        className="call-button"
                      >
                        📞 {contact.phone}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="emergency-info">
        <h3>⚠️ Önemli Bilgiler</h3>
        <ul>
          <li><strong>112:</strong> Ambulans, İtfaiye ve Polis için tek numara</li>
          <li><strong>Konum bilgisi:</strong> Acil durumlarda mümkün olduğunca detaylı adres bilgisi verin</li>
          <li><strong>Sakin kalın:</strong> Panik yapmadan durumu açık bir şekilde anlatın</li>
          <li><strong>Telefonu kapatmayın:</strong> Operatör kapatana kadar hattan ayrılmayın</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyContact;
