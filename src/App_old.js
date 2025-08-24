import React, { useState, useEffect } from 'react';
import EmergencyContact from './components/EmergencyContact';
import Community from './components/Community';
import Business from './components/Business';
import Auth from './components/Auth';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const savedUser = localStorage.getItem('tarsusgo-auth');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('tarsusgo-auth');
    setUser(null);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'emergency':
        return <EmergencyContact />;
      case 'community':
        return <Community user={user} />;
      case 'business':
        return <Business user={user} />;
      case 'home':
        return (
          <div className="home-content">
            <div className="hero-section">
              <h1>🏛️ TarsusGo</h1>
              <p>Tarsus şehrinin dijital rehberi</p>
              <p>Şehrimizin güzelliklerini keşfedin, ihtiyacınız olan tüm bilgilere kolayca ulaşın</p>
            </div>
            
            <div className="progress-container">
              <div className="progress-card">
                <div className="progress-header">
                  <h2>🚧 Platform Geliştiriliyor</h2>
                  <p>TarsusGo platformu aktif olarak geliştirilmektedir</p>
                </div>
                
                <div className="progress-content">
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '95%'}}></div>
                    </div>
                    <span className="progress-text">Tamamlanıyor %95</span>
                  </div>
                  
                  <div className="progress-details">
                    <div className="progress-item completed">
                      <span className="progress-icon">✅</span>
                      <span>Acil Durum Rehberi</span>
                    </div>
                    <div className="progress-item completed">
                      <span className="progress-icon">✅</span>
                      <span>Topluluk Platformu</span>
                    </div>
                    <div className="progress-item completed">
                      <span className="progress-icon">✅</span>
                      <span>İşletmeler Rehberi</span>
                    </div>
                    <div className="progress-item in-progress">
                      <span className="progress-icon">🔄</span>
                      <span>Ulaşım Bilgileri</span>
                    </div>
                    <div className="progress-item pending">
                      <span className="progress-icon">⏳</span>
                      <span>Resmi Kurumlar</span>
                    </div>
                  </div>
                  
                  <div className="quick-access">
                    <p>Mevcut özellikler:</p>
                    <div className="quick-buttons">
                      <button 
                        onClick={() => setActiveTab('emergency')}
                        className="quick-button"
                      >
                        🚨 Acil Durum
                      </button>
                      <button 
                        onClick={() => setActiveTab('community')}
                        className="quick-button"
                      >
                        🏘️ Topluluk
                      </button>
                      <button 
                        onClick={() => setActiveTab('business')}
                        className="quick-button"
                      >
                        🏪 İşletmeler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
                </button>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">�️</span>
                <h3>Topluluk</h3>
                <p>Mahalle komşularınızla iletişim kurun, yardımlaşın ve sosyalleşin</p>
                <button 
                  onClick={() => setActiveTab('community')}
                  className="feature-button"
                >
                  Topluluğa Katıl
                </button>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">�🏪</span>
                <h3>İşletmeler</h3>
                <p>Yerel işletmeler, restoranlar ve hizmet sağlayıcıları</p>
                <button className="feature-button">Yakında</button>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🏪</span>
                <h3>İşletmeler</h3>
                <p>Yerel işletmeler, restoranlar ve hizmet sağlayıcıları rehberi</p>
                <button 
                  onClick={() => setActiveTab('business')}
                  className="feature-button"
                >
                  İşletmeleri Keşfet
                </button>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🚌</span>
                <h3>Ulaşım</h3>
                <p>Otobüs saatleri, güzergahlar ve ulaşım bilgileri</p>
                <button className="feature-button">Yakında</button>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🏛️</span>
                <h3>Resmi Kurumlar</h3>
                <p>Belediye, kaymakamlık ve diğer resmi kurumlar</p>
                <button className="feature-button">Yakında</button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">TarsusGo</span>
          </div>
          
          <div className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              🏠 Ana Sayfa
            </button>
            <button 
              className={`nav-item ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              🚨 Acil Durum
            </button>
            <button 
              className={`nav-item ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => setActiveTab('community')}
            >
              🏘️ Topluluk
            </button>
            <button 
              className={`nav-item ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              🏪 İşletmeler
            </button>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-icon">
                    {user.userType === 'business' ? '🏢' : '👤'}
                  </span>
                  <span className="user-name">
                    {user.userType === 'business' ? user.businessName : user.name}
                  </span>
                </div>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Çıkış Yap"
                >
                  🚪
                </button>
              </div>
            ) : (
              <button 
                className="login-btn"
                onClick={() => setIsAuthOpen(true)}
              >
                👤 Giriş / Kayıt
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        {renderContent()}
      </main>

      {isAuthOpen && (
        <Auth 
          onLogin={handleLogin}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
      
      <footer className="footer">
        <p>&copy; 2025 TarsusGo - Tarsus şehrinin dijital rehberi</p>
        <p>Geliştirildi: Tarsus için ❤️ ile</p>
      </footer>
    </div>
  );
};

export default App;
