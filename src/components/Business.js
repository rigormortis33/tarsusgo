import React, { useState, useEffect } from 'react';
import { mahalleler, createNeighborhoodId, getNeighborhoodEmoji } from '../data/neighborhoods';
import { businessAPI } from '../services/api';
import './Business.css';

const Business = ({ user }) => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('tümü');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('tümü');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [showNeighborhoodSuggestions, setShowNeighborhoodSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormNeighborhoodSearch, setAddFormNeighborhoodSearch] = useState('');
  const [showAddFormSuggestions, setShowAddFormSuggestions] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    category: 'restoran',
    neighborhood: 'cumhuriyet-mahallesi',
    phone: '',
    address: '',
    description: '',
    workingHours: '',
    features: []
  });

  // Mahalle arama ve seçim fonksiyonları
  const handleNeighborhoodSearch = (value) => {
    setNeighborhoodSearch(value);
    setShowNeighborhoodSuggestions(value.length > 0);
    if (value === '') {
      setSelectedNeighborhood('tümü');
    }
  };

  const selectNeighborhood = (neighborhood) => {
    setSelectedNeighborhood(neighborhood.id);
    setNeighborhoodSearch(neighborhood.name);
    setShowNeighborhoodSuggestions(false);
  };

  const clearNeighborhoodSearch = () => {
    setNeighborhoodSearch('');
    setSelectedNeighborhood('tümü');
    setShowNeighborhoodSuggestions(false);
  };

    // İşletme kategorileri
  const categories = [
    { id: 'restoran', name: 'Restoran & Cafe', icon: '🍽️', color: '#dc3545' },
    { id: 'market', name: 'Market & Bakkal', icon: '🛒', color: '#28a745' },
    { id: 'eczane', name: 'Eczane & Sağlık', icon: '💊', color: '#007bff' },
    { id: 'berber', name: 'Berber & Kuaför', icon: '✂️', color: '#fd7e14' },
    { id: 'tamirci', name: 'Tamirci & Servis', icon: '🔧', color: '#6c757d' },
    { id: 'giyim', name: 'Giyim & Tekstil', icon: '👕', color: '#e83e8c' },
    { id: 'ayakkabi', name: 'Ayakkabı & Çanta', icon: '👞', color: '#795548' },
    { id: 'elektronik', name: 'Elektronik', icon: '📱', color: '#17a2b8' },
    { id: 'mobilya', name: 'Mobilya & Ev', icon: '🛋️', color: '#6f42c1' },
    { id: 'otomotiv', name: 'Otomotiv', icon: '🚗', color: '#343a40' },
    { id: 'egitim', name: 'Eğitim & Kurs', icon: '📚', color: '#20c997' },
    { id: 'guzellik', name: 'Güzellik & Bakım', icon: '💄', color: '#f8d7da' },
    { id: 'spor', name: 'Spor & Fitness', icon: '🏋️', color: '#d4edda' },
    { id: 'hizmet', name: 'Diğer Hizmetler', icon: '🏢', color: '#666' }
  ];

  // Mahalleler
  const neighborhoods = mahalleler.map(mahalle => ({
    id: createNeighborhoodId(mahalle),
    name: mahalle.replace(' Mahallesi', ''),
    fullName: mahalle,
    emoji: getNeighborhoodEmoji(mahalle)
  })).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  // Ekleme formu için mahalle fonksiyonları
  const handleAddFormNeighborhoodSearch = (search) => {
    setAddFormNeighborhoodSearch(search);
    setShowAddFormSuggestions(search.length > 0);
  };

  const selectAddFormNeighborhood = (neighborhood) => {
    setNewBusiness(prev => ({ ...prev, neighborhood: neighborhood.id }));
    setAddFormNeighborhoodSearch(neighborhood.name);
    setShowAddFormSuggestions(false);
  };

  const filteredAddFormNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.name.toLowerCase().includes(addFormNeighborhoodSearch.toLowerCase())
  ).slice(0, 10);

  // Filtrelenmiş mahalle önerileri
  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
  ).slice(0, 10);

  // Gerçek işletmeler - Tarsus Restoranları
  const sampleBusinesses = [
    {
      id: 1,
      name: "Tarihi Kubbe Cafe Restaurant",
      category: "restoran",
      neighborhood: "sehitkerim-mahallesi",
      phone: "Bilgi yok",
      address: "Şehitkerim Mah. Şehir Merkezi",
      description: "Tarihi atmosferde yemek deneyimi.",
      workingHours: "Bilgi yok",
      features: ["Tarihi Mekan"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 2,
      name: "Sofioğlu Fındık Lahmacun & Humus",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Geleneksel lahmacun ve humus uzmanı.",
      workingHours: "Bilgi yok",
      features: ["Lahmacun", "Humus"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 3,
      name: "Kervan Humus",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Özel humus çeşitleri.",
      workingHours: "Bilgi yok",
      features: ["Humus", "Geleneksel"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 4,
      name: "Günaydın Döner & Et Lokantası",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Döner ve et yemekleri uzmanı.",
      workingHours: "Bilgi yok",
      features: ["Döner", "Et Yemekleri"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 5,
      name: "Eshab-ı Kehf Bağ Restaurant",
      category: "restoran",
      neighborhood: "dedeler-mahallesi",
      phone: "0538 724 45 30",
      address: "Dedeler Mah.",
      description: "Doğal bağ ortamında yemek keyfi.",
      workingHours: "Bilgi yok",
      features: ["Bağ Ortamı", "Doğal Mekan"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 6,
      name: "Kaburgacı Yaşar Usta",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Usta ellerde pişen kaburga çeşitleri.",
      workingHours: "Bilgi yok",
      features: ["Kaburga", "Usta Yemekleri"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 7,
      name: "Beyzade Restoran",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Klasik Türk mutfağı.",
      workingHours: "Bilgi yok",
      features: ["Türk Mutfağı"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 8,
      name: "Yeni Ada Kebap Salonu",
      category: "restoran",
      neighborhood: "sehitkerim-mahallesi",
      phone: "0324 624 20 03",
      address: "Şehitkerim Mah.",
      description: "Taze kebap çeşitleri ve sıcak yemekler.",
      workingHours: "Bilgi yok",
      features: ["Kebap", "Sıcak Yemek"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 9,
      name: "Ketchap Burger's",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Burger ve fast food çeşitleri.",
      workingHours: "Bilgi yok",
      features: ["Burger", "Fast Food"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 10,
      name: "Sbarro Pizza",
      category: "restoran",
      neighborhood: "gazipasa-mahallesi",
      phone: "Bilgi yok",
      address: "Gazipaşa Mah.",
      description: "İtalyan usulü pizza çeşitleri.",
      workingHours: "Bilgi yok",
      features: ["Pizza", "İtalyan"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 11,
      name: "Usta Dönerci",
      category: "restoran",
      neighborhood: "gazipasa-mahallesi",
      phone: "Bilgi yok",
      address: "Gazipaşa Mah.",
      description: "Geleneksel döner ve pide.",
      workingHours: "Bilgi yok",
      features: ["Döner", "Pide"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 12,
      name: "Erbey Restaurant",
      category: "restoran",
      neighborhood: "kaleburcu-mahallesi",
      phone: "0533 947 75 02",
      address: "Kaleburcu Mah.",
      description: "Özel yemek çeşitleri ve aile ortamı.",
      workingHours: "Bilgi yok",
      features: ["Aile Ortamı", "Özel Yemekler"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 13,
      name: "Baydöner",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Lezzetli döner ve yan ürünler.",
      workingHours: "Bilgi yok",
      features: ["Döner"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 14,
      name: "Terra Pizza",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Özel pizza tarifleri ve İtalyan lezzetleri.",
      workingHours: "Bilgi yok",
      features: ["Pizza", "İtalyan"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 15,
      name: "Burger King",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "444 54 64",
      address: "Merkez",
      description: "Dünya markası fast food zinciri.",
      workingHours: "Bilgi yok",
      features: ["Fast Food", "Zincir Marka"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 16,
      name: "Öncü Döner",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Kaliteli döner ve Türk mutfağı.",
      workingHours: "Bilgi yok",
      features: ["Döner", "Türk Mutfağı"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 17,
      name: "Tarsus Şelale Restaurant",
      category: "restoran",
      neighborhood: "caglayan-mahallesi",
      phone: "Bilgi yok",
      address: "Çağlayan Mah. Şelale Yakını",
      description: "Tarsus Şelalesi manzarasında yemek keyfi.",
      workingHours: "Bilgi yok",
      features: ["Şelale Manzarası", "Doğal Ortam"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 18,
      name: "Mobil Restoran",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Mobil yemek hizmeti.",
      workingHours: "Bilgi yok",
      features: ["Mobil Servis"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 19,
      name: "Gözenler Restoran",
      category: "restoran",
      neighborhood: "barbaros-mahallesi",
      phone: "Bilgi yok",
      address: "Barbaros Mah.",
      description: "Aile işletmesi restoran.",
      workingHours: "Bilgi yok",
      features: ["Aile İşletmesi"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 20,
      name: "Yeşilova Restaurant",
      category: "restoran",
      neighborhood: "cumhuriyet-mahallesi", // varsayılan
      phone: "Bilgi yok",
      address: "Merkez",
      description: "Geleneksel Türk mutfağı ve yerel lezzetler.",
      workingHours: "Bilgi yok",
      features: ["Yerel Lezzetler", "Türk Mutfağı"],
      rating: 0,
      reviewCount: 0
    },
    {
      id: 21,
      name: "Şelale Has Bahçe Restaurant",
      category: "restoran",
      neighborhood: "caglayan-mahallesi",
      phone: "Bilgi yok",
      address: "Çağlayan Mah. Şelale Bölgesi",
      description: "Bahçe ortamında doğal yemek deneyimi.",
      workingHours: "Bilgi yok",
      features: ["Bahçe Ortamı", "Doğal Mekan", "Şelale Yakını"],
      rating: 0,
      reviewCount: 0
    }
  ];

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory, selectedNeighborhood]);

  const loadBusinesses = async () => {
    try {
      const filters = {};
      if (selectedNeighborhood && selectedNeighborhood !== 'tümü') {
        filters.neighborhood = selectedNeighborhood;
      }
      if (selectedCategory && selectedCategory !== 'tümü') {
        filters.category = selectedCategory;
      }

      const response = await businessAPI.getAll(filters);
      setBusinesses(response.data || response);
    } catch (error) {
      console.error('Error loading businesses:', error);
      // Fallback to sample data if API fails
      setBusinesses(sampleBusinesses);
    }
  };

  const handleAddBusiness = async (e) => {
    e.preventDefault();
    
    try {
      const businessData = {
        name: newBusiness.name,
        category: newBusiness.category,
        neighborhood: newBusiness.neighborhood,
        phone: newBusiness.phone || null,
        address: newBusiness.address || null,
        description: newBusiness.description || null
      };

      const response = await businessAPI.create(businessData);
      
      // Başarılı ekleme sonrası listeyi yenile
      await loadBusinesses();
      
      // Formu temizle
      setNewBusiness({
        name: '',
        category: 'restoran',
        neighborhood: 'cumhuriyet-mahallesi',
        phone: '',
        address: '',
        description: '',
        workingHours: '',
        features: []
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding business:', error);
      alert('İşletme eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const categoryMatch = selectedCategory === 'tümü' || business.category === selectedCategory;
    const neighborhoodMatch = selectedNeighborhood === 'tümü' || business.neighborhood === selectedNeighborhood;
    const searchMatch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       business.address.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && neighborhoodMatch && searchMatch;
  });

  const getCategoryInfo = (id) => {
    return categories.find(c => c.id === id) || { name: 'Diğer', icon: '🏢', color: '#666' };
  };

  const getNeighborhoodInfo = (id) => {
    return neighborhoods.find(n => n.id === id) || { name: 'Bilinmeyen', emoji: '❓' };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  return (
    <div className="business-container">
      <div className="business-header">
        <h1>🏪 Tarsus Esnaf & İşletme Rehberi</h1>
        <p>Şehrimizdeki yerel işletmeleri keşfedin ve destekleyin</p>
        
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="İşletme, adres veya hizmet ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="business-search"
            />
          </div>
          {user ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="add-business-btn"
            >
              ➕ İşletme Ekle
            </button>
          ) : (
            <div className="login-prompt">
              <p>İşletme eklemek için giriş yapmalısınız</p>
            </div>
          )}
        </div>
      </div>

      <div className="business-stats">
        <div className="stat-card">
          <span className="stat-number">{businesses.length}</span>
          <span className="stat-label">Kayıtlı İşletme</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{categories.length}</span>
          <span className="stat-label">Farklı Kategori</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">180</span>
          <span className="stat-label">Mahalle Kapsamı</span>
        </div>
      </div>

      <div className="business-filters">
        <div className="filter-section">
          <h3>Kategori:</h3>
          <div className="category-filters">
            <button
              className={`category-filter ${selectedCategory === 'tümü' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('tümü')}
            >
              🌟 Tümü
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                style={selectedCategory === category.id ? { 
                  backgroundColor: category.color,
                  color: 'white'
                } : { borderColor: category.color }}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Mahalle:</h3>
          <div className="neighborhood-search-container">
            <div className="neighborhood-input-wrapper">
              <input
                type="text"
                placeholder="Mahalle ara (örn: Cumhuriyet, Gazipaşa...)"
                value={neighborhoodSearch}
                onChange={(e) => handleNeighborhoodSearch(e.target.value)}
                onFocus={() => setShowNeighborhoodSuggestions(neighborhoodSearch.length > 0)}
                className="neighborhood-search-input"
              />
              {neighborhoodSearch && (
                <button
                  onClick={clearNeighborhoodSearch}
                  className="clear-search-btn"
                  title="Temizle"
                >
                  ✕
                </button>
              )}
            </div>
            
            {showNeighborhoodSuggestions && filteredNeighborhoods.length > 0 && (
              <div className="neighborhood-suggestions">
                <div
                  className="neighborhood-suggestion all-neighborhoods"
                  onClick={() => {
                    setSelectedNeighborhood('tümü');
                    setNeighborhoodSearch('');
                    setShowNeighborhoodSuggestions(false);
                  }}
                >
                  <span className="suggestion-icon">🌍</span>
                  <span className="suggestion-text">Tüm Mahalleler</span>
                </div>
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
                {neighborhoods.filter(n => 
                  n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
                ).length > 10 && (
                  <div className="more-results">
                    ve {neighborhoods.filter(n => 
                      n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
                    ).length - 10} mahalle daha...
                  </div>
                )}
              </div>
            )}
            
            {selectedNeighborhood !== 'tümü' && (
              <div className="selected-neighborhood">
                <span className="selected-label">Seçili:</span>
                <span className="selected-value">
                  {getNeighborhoodInfo(selectedNeighborhood).emoji} {getNeighborhoodInfo(selectedNeighborhood).name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="businesses-container">
        <h3>
          İşletmeler 
          <span className="business-count">({filteredBusinesses.length})</span>
        </h3>

        {filteredBusinesses.length === 0 ? (
          <div className="no-businesses">
            {businesses.length === 0 ? (
              <>
                <p>Henüz hiç işletme eklenmemiş!</p>
                <p>İlk işletmeyi siz ekleyin ve Tarsus esnaf rehberini oluşturmaya başlayın! 🏪</p>
              </>
            ) : (
              <>
                <p>Bu filtreleme için işletme bulunamadı.</p>
                <p>Aramayı değiştirin veya yeni işletme ekleyin! 🏪</p>
              </>
            )}
          </div>
        ) : (
          <div className="business-grid">
            {filteredBusinesses.map(business => {
              const categoryInfo = getCategoryInfo(business.category);
              const neighborhoodInfo = getNeighborhoodInfo(business.neighborhood);

              return (
                <div key={business.id} className="business-card">
                  <div className="business-card-header">
                    <div className="business-title">
                      <h4 className="business-name">{business.name}</h4>
                      <span 
                        className="business-category-badge"
                        style={{ backgroundColor: categoryInfo.color }}
                      >
                        {categoryInfo.icon} {categoryInfo.name}
                      </span>
                    </div>
                    <div className="business-rating">
                      {business.rating > 0 && (
                        <>
                          <div className="stars">
                            {renderStars(business.rating)}
                          </div>
                          <span className="rating-text">
                            {business.rating} ({business.reviewCount} değerlendirme)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="business-info">
                    <div className="info-row">
                      <span className="info-icon">📍</span>
                      <span className="info-text">{business.address}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">🏘️</span>
                      <span className="info-text">
                        {neighborhoodInfo.emoji} {neighborhoodInfo.name}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">🕒</span>
                      <span className="info-text">{business.workingHours}</span>
                    </div>
                  </div>

                  <div className="business-description">
                    <p>{business.description}</p>
                  </div>

                  {business.features && business.features.length > 0 && (
                    <div className="business-features">
                      {business.features.map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="business-actions">
                    <button 
                      onClick={() => window.location.href = `tel:${business.phone}`}
                      className="action-btn call-btn"
                    >
                      📞 {business.phone}
                    </button>
                    <button className="action-btn direction-btn">
                      🗺️ Yol Tarifi
                    </button>
                    <button className="action-btn review-btn">
                      ⭐ Değerlendir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="add-form-overlay">
          <div className="add-form-container">
            <h3>Yeni İşletme Ekle</h3>
            <form onSubmit={handleAddBusiness}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="İşletme adı"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  value={newBusiness.category}
                  onChange={(e) => setNewBusiness({...newBusiness, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Mahalle:</label>
                <div className="add-form-neighborhood-container">
                  <input
                    type="text"
                    placeholder="Mahalle ara..."
                    value={addFormNeighborhoodSearch}
                    onChange={(e) => handleAddFormNeighborhoodSearch(e.target.value)}
                    onFocus={() => setShowAddFormSuggestions(addFormNeighborhoodSearch.length > 0)}
                    className="add-form-neighborhood-input"
                  />
                  
                  {showAddFormSuggestions && filteredAddFormNeighborhoods.length > 0 && (
                    <div className="add-form-suggestions">
                      {filteredAddFormNeighborhoods.map(neighborhood => (
                        <div
                          key={neighborhood.id}
                          className="add-form-suggestion"
                          onClick={() => selectAddFormNeighborhood(neighborhood)}
                        >
                          <span className="suggestion-icon">{neighborhood.emoji}</span>
                          <span className="suggestion-text">{neighborhood.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {newBusiness.neighborhood !== 'cumhuriyet-mahallesi' && (
                    <div className="selected-add-neighborhood">
                      Seçili: {getNeighborhoodInfo(newBusiness.neighborhood).emoji} {getNeighborhoodInfo(newBusiness.neighborhood).name}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Telefon numarası"
                  value={newBusiness.phone}
                  onChange={(e) => setNewBusiness({...newBusiness, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Adres"
                  value={newBusiness.address}
                  onChange={(e) => setNewBusiness({...newBusiness, address: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <textarea
                  placeholder="Açıklama"
                  value={newBusiness.description}
                  onChange={(e) => setNewBusiness({...newBusiness, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Çalışma saatleri (örn: 09:00 - 18:00)"
                  value={newBusiness.workingHours}
                  onChange={(e) => setNewBusiness({...newBusiness, workingHours: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  ✅ Ekle
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="cancel-btn"
                >
                  ❌ İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="business-info-section">
        <h3>ℹ️ İşletme Sahipleri İçin</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>🆓 Ücretsiz Kayıt</h4>
            <p>İşletmenizi tamamen ücretsiz olarak sisteme ekleyebilirsiniz</p>
          </div>
          <div className="info-card">
            <h4>📈 Görünürlük</h4>
            <p>Müşterilerinizin sizi daha kolay bulmasını sağlayın</p>
          </div>
          <div className="info-card">
            <h4>⭐ Değerlendirme</h4>
            <p>Müşteri yorumları ile güvenir bir profil oluşturun</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
