import React, { useState, useEffect } from 'react';
import { mahalleler, createNeighborhoodId, getNeighborhoodEmoji } from '../data/neighborhoods';
import { communityAPI } from '../services/api';
import './Community.css';

const Community = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('genel');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('tümü');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [showNeighborhoodSuggestions, setShowNeighborhoodSuggestions] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    neighborhood: 'cumhuriyet-mahallesi',
    isSet: false
  });

  // Tarsus'un tüm mahalleleri - gerçek listeden (180 mahalle)
  const neighborhoods = mahalleler.map(mahalle => ({
    id: createNeighborhoodId(mahalle),
    name: mahalle.replace(' Mahallesi', ''),
    fullName: mahalle,
    emoji: getNeighborhoodEmoji(mahalle)
  })).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  const categories = [
    { id: 'genel', name: 'Genel Sohbet', icon: '💬', color: '#007bff' },
    { id: 'yardim', name: 'Yardımlaşma', icon: '🤝', color: '#28a745' },
    { id: 'kayip-bulundu', name: 'Kayıp/Bulundu', icon: '🔍', color: '#dc3545' },
    { id: 'alisveris', name: 'Alışveriş', icon: '🛒', color: '#fd7e14' },
    { id: 'etkinlik', name: 'Etkinlikler', icon: '🎉', color: '#6f42c1' },
    { id: 'tavsiye', name: 'Tavsiye', icon: '⭐', color: '#20c997' }
  ];

  // Mahalle arama fonksiyonları
  const handleNeighborhoodSearch = (search) => {
    setNeighborhoodSearch(search);
    if (search.trim() === '') {
      setSelectedNeighborhood('tümü');
      setShowNeighborhoodSuggestions(false);
    } else {
      setShowNeighborhoodSuggestions(true);
    }
  };

  const selectNeighborhood = (neighborhood) => {
    if (neighborhood.id === 'tümü') {
      setSelectedNeighborhood('tümü');
      setNeighborhoodSearch('');
    } else {
      setSelectedNeighborhood(neighborhood.id);
      setNeighborhoodSearch(neighborhood.name);
    }
    setShowNeighborhoodSuggestions(false);
  };

  const clearNeighborhoodSearch = () => {
    setNeighborhoodSearch('');
    setSelectedNeighborhood('tümü');
    setShowNeighborhoodSuggestions(false);
  };

  const getNeighborhoodInfo = (neighborhoodId) => {
    if (neighborhoodId === 'tümü') return { name: 'Tüm Mahalleler', emoji: '🏘️' };
    return neighborhoods.find(n => n.id === neighborhoodId) || 
           { name: 'Bilinmeyen Mahalle', emoji: '❓' };
  };

  // Filtrelenmiş mahalle önerileri
  const filteredNeighborhoods = [
    { id: 'tümü', name: 'Tüm Mahalleler', emoji: '🏘️' },
    ...neighborhoods.filter(neighborhood =>
      neighborhood.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
    ).slice(0, 10)
  ];

  // Örnek mesajlar - güncellenmiş mahalle ID'leri ile
  const sampleMessages = [
    {
      id: 1,
      author: 'Ahmet K.',
      neighborhood: 'cumhuriyet-mahallesi',
      category: 'yardim',
      content: 'Bugün akşam hastaneye gitmem gerekiyor, araçım yok. Yardımcı olabilecek var mı?',
      timestamp: new Date(2025, 7, 24, 14, 30),
      likes: 3,
      replies: 1
    },
    {
      id: 2,
      author: 'Fatma S.',
      neighborhood: 'bahsis-mahallesi',
      category: 'kayip-bulundu',
      content: 'Gri kedi kayboldu. Bahşiş mahallesi çevresinde görürseniz lütfen haber verin. Adı Pamuk.',
      timestamp: new Date(2025, 7, 24, 12, 15),
      likes: 7,
      replies: 2
    },
    {
      id: 3,
      author: 'Mehmet Y.',
      neighborhood: 'gazipaşa-mahallesi',
      category: 'alisveris',
      content: 'BİM\'e gidiyorum, kimsenin ihtiyacı var mı? Gazipaşa mahallesi civarı.',
      timestamp: new Date(2025, 7, 24, 16, 45),
      likes: 2,
      replies: 0
    },
    {
      id: 4,
      author: 'Elif D.',
      neighborhood: 'yesil-mahallesi',
      category: 'etkinlik',
      content: 'Bu akşam parkta çocuklar için oyun organizasyonu yapıyoruz. 19:00\'da Yeşil Mahallesi Parkı\'nda.',
      timestamp: new Date(2025, 7, 24, 11, 20),
      likes: 12,
      replies: 4
    },
    {
      id: 5,
      author: 'Ali R.',
      neighborhood: 'fevzi-cakmak-mahallesi',
      category: 'tavsiye',
      content: 'İyi bir elektrikçi tavsiye edebilecek var mı? Fevzi Çakmak mahallesi civarında.',
      timestamp: new Date(2025, 7, 24, 9, 10),
      likes: 1,
      replies: 3
    },
    {
      id: 6,
      author: 'Zeynep M.',
      neighborhood: 'fatih-mahallesi',
      category: 'yardim',
      content: 'Yaşlı annem için market alışverişi yapacak gönüllü arıyorum. Fatih mahallesinde oturuyorum.',
      timestamp: new Date(2025, 7, 24, 8, 30),
      likes: 8,
      replies: 2
    },
    {
      id: 7,
      author: 'Osman T.',
      neighborhood: 'atatürk-mahallesi',
      category: 'kayip-bulundu',
      content: 'Atatürk mahallesinde köpek tasması buldum. Mavi renkte, üzerinde "Max" yazıyor.',
      timestamp: new Date(2025, 7, 24, 7, 45),
      likes: 4,
      replies: 1
    }
  ];

  useEffect(() => {
    loadMessages();
    
    // Load user info from localStorage if available
    const savedUserInfo = localStorage.getItem('tarsusgo-user');
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [selectedNeighborhood]);

  const loadMessages = async () => {
    try {
      const neighborhood = selectedNeighborhood === 'tümü' ? null : selectedNeighborhood;
      const response = await communityAPI.getMessages(neighborhood);
      setMessages(response.data || response);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to sample data if API fails
      setMessages(sampleMessages);
    }
  };

  const handleUserSetup = (e) => {
    e.preventDefault();
    if (userInfo.name.trim()) {
      const updatedUserInfo = { ...userInfo, isSet: true };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('tarsusgo-user', JSON.stringify(updatedUserInfo));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && userInfo.isSet) {
      try {
        const messageData = {
          title: newMessage.substring(0, 50) + (newMessage.length > 50 ? '...' : ''),
          content: newMessage,
          neighborhood: userInfo.neighborhood
        };

        await communityAPI.createMessage(messageData);
        
        // Mesajları yenile
        await loadMessages();
        
        // Formu temizle
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const categoryMatch = selectedCategory === 'genel' || message.category === selectedCategory;
    const neighborhoodMatch = selectedNeighborhood === 'tümü' || message.neighborhood === selectedNeighborhood;
    return categoryMatch && neighborhoodMatch;
  });

  const getCategoryInfo = (id) => {
    return categories.find(c => c.id === id) || { name: 'Genel', icon: '💬', color: '#007bff' };
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  if (!userInfo.isSet) {
    return (
      <div className="community-setup">
        <div className="setup-container">
          <h2>🏘️ Tarsus Topluluk</h2>
          <p>Mahallenizdeki komşularınızla iletişim kurmak için profil bilgilerinizi girin</p>
          
          <form onSubmit={handleUserSetup} className="setup-form">
            <div className="form-group">
              <label>Adınız Soyadınız:</label>
              <input
                type="text"
                placeholder="örn: Ahmet K."
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Mahalleniz:</label>
              <input
                type="text"
                placeholder="Mahalle ara..."
                value={neighborhoodSearch}
                onChange={(e) => setNeighborhoodSearch(e.target.value)}
                className="neighborhood-search-input"
              />
              <select
                value={userInfo.neighborhood}
                onChange={(e) => setUserInfo({...userInfo, neighborhood: e.target.value})}
                className="neighborhood-setup-select"
              >
                {neighborhoods
                  .filter(neighborhood => 
                    neighborhood.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
                  )
                  .slice(0, 15)
                  .map(neighborhood => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.emoji} {neighborhood.name}
                    </option>
                  ))}
              </select>
              {neighborhoodSearch && (
                <small className="search-info">
                  {neighborhoods.filter(n => 
                    n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
                  ).length} mahalle bulundu
                </small>
              )}
            </div>
            
            <button type="submit" className="setup-button">
              Topluma Katıl 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>🏘️ Tarsus Topluluk</h1>
        <div className="user-badge">
          <span className="user-name">{userInfo.name}</span>
          <span className="user-neighborhood">
            {getNeighborhoodInfo(userInfo.neighborhood).emoji} {getNeighborhoodInfo(userInfo.neighborhood).name}
          </span>
        </div>
      </div>

      <div className="community-filters">
        <div className="filter-section">
          <h3>Kategori:</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                style={selectedCategory === category.id ? { backgroundColor: category.color } : {}}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Mahalle:</h3>
          <div className="neighborhood-filter-container">
            <input
              type="text"
              placeholder="Mahalle ara..."
              value={neighborhoodSearch}
              onChange={(e) => handleNeighborhoodSearch(e.target.value)}
              onFocus={() => setShowNeighborhoodSuggestions(true)}
              className="neighborhood-search"
            />
            
            {neighborhoodSearch && (
              <button
                onClick={clearNeighborhoodSearch}
                className="clear-search-btn"
                title="Aramayı temizle"
              >
                ×
              </button>
            )}
            
            {showNeighborhoodSuggestions && filteredNeighborhoods.length > 0 && (
              <div className="neighborhood-suggestions">
                {filteredNeighborhoods.map(neighborhood => (
                  <div
                    key={neighborhood.id}
                    className="neighborhood-suggestion"
                    onClick={() => selectNeighborhood(neighborhood)}
                  >
                    <span className="suggestion-icon">{neighborhood.emoji}</span>
                    <span className="suggestion-text">{neighborhood.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {selectedNeighborhood !== 'tümü' && (
              <div className="selected-neighborhood">
                Seçili: {getNeighborhoodInfo(selectedNeighborhood).emoji} {getNeighborhoodInfo(selectedNeighborhood).name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="message-composer">
        <h3>Yeni Mesaj</h3>
        <form onSubmit={handleSendMessage}>
          <div className="composer-header">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Komşularınızla paylaşmak istediğiniz bir şey var mı?"
            rows="3"
            required
          />
          
          <button type="submit" className="send-button">
            📤 Gönder
          </button>
        </form>
      </div>

      <div className="messages-container">
        <h3>
          Mesajlar 
          <span className="message-count">({filteredMessages.length})</span>
        </h3>
        
        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            <p>Bu filtreleme için henüz mesaj yok.</p>
            <p>İlk mesajı siz paylaşın! 😊</p>
          </div>
        ) : (
          <div className="messages-list">
            {filteredMessages.map(message => {
              const neighborhoodInfo = getNeighborhoodInfo(message.neighborhood);
              const categoryInfo = getCategoryInfo(message.category);
              
              return (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div className="author-info">
                      <span className="author-name">{message.author}</span>
                      <span className="author-neighborhood">
                        {neighborhoodInfo.emoji} {neighborhoodInfo.name}
                      </span>
                    </div>
                    <div className="message-meta">
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: categoryInfo.color }}
                      >
                        {categoryInfo.icon} {categoryInfo.name}
                      </span>
                      <span className="timestamp">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="message-content">
                    {message.content}
                  </div>
                  
                  <div className="message-actions">
                    <button className="action-btn like-btn">
                      👍 {message.likes}
                    </button>
                    <button className="action-btn reply-btn">
                      💬 {message.replies} Yanıt
                    </button>
                    <button className="action-btn share-btn">
                      📤 Paylaş
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="community-info">
        <h3>ℹ️ Topluluk Kuralları</h3>
        <ul>
          <li>🤝 Saygılı ve nazik olun</li>
          <li>🏘️ Mahalle komşularınıza yardımcı olun</li>
          <li>🚫 Spam ve reklam yapmayın</li>
          <li>✅ Gerçek ve yararlı bilgiler paylaşın</li>
          <li>🙏 Teşekkür etmeyi unutmayın</li>
        </ul>
      </div>
    </div>
  );
};

export default Community;
