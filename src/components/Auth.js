import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

const Auth = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user'); // 'user' veya 'business'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    businessName: '',
    businessCategory: '',
    businessAddress: '',
    neighborhood: 'cumhuriyet-mahallesi'
  });
  const [errors, setErrors] = useState({});

  const businessCategories = [
    { id: 'restoran', name: 'Restoran & Cafe' },
    { id: 'market', name: 'Market & Bakkal' },
    { id: 'eczane', name: 'Eczane & Sağlık' },
    { id: 'berber', name: 'Berber & Kuaför' },
    { id: 'tamirci', name: 'Tamirci & Servis' },
    { id: 'giyim', name: 'Giyim & Tekstil' },
    { id: 'ayakkabi', name: 'Ayakkabı & Çanta' },
    { id: 'elektronik', name: 'Elektronik' },
    { id: 'mobilya', name: 'Mobilya & Ev' },
    { id: 'otomotiv', name: 'Otomotiv' },
    { id: 'egitim', name: 'Eğitim & Kurs' },
    { id: 'guzellik', name: 'Güzellik & Bakım' },
    { id: 'spor', name: 'Spor & Fitness' },
    { id: 'hizmet', name: 'Diğer Hizmetler' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email kontrolü
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    // Şifre kontrolü
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    // Kayıt olma kontrolü
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      }

      if (!formData.name) {
        newErrors.name = 'Ad Soyad gereklidir';
      }

      // İşletme kayıt kontrolü
      if (userType === 'business') {
        if (!formData.businessName) {
          newErrors.businessName = 'İşletme adı gereklidir';
        }
        if (!formData.businessCategory) {
          newErrors.businessCategory = 'İşletme kategorisi seçiniz';
        }
        if (!formData.businessAddress) {
          newErrors.businessAddress = 'İşletme adresi gereklidir';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let response;

      if (isLogin) {
        // Giriş yap
        response = await authAPI.login(formData.email, formData.password);
      } else {
        // Kayıt ol
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone || null,
          user_type: userType === 'business' ? 'business' : 'individual'
        };

        response = await authAPI.register(userData);
      }

      if (response.token) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', response.token);
        localStorage.setItem('tarsusgo-auth', JSON.stringify(response.user));
        
        // Callback'i çağır
        onLogin(response.user);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({
        submit: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      businessName: '',
      businessCategory: '',
      businessAddress: '',
      neighborhood: 'cumhuriyet-mahallesi'
    });
  };

  // Örnek kullanıcılarla giriş
  const loginWithDemo = async (userType) => {
    try {
      let email, password;
      
      if (userType === 'user') {
        email = 'ahmet@tarsus.com';
        password = 'demo123';
      } else {
        email = 'info@tarsuskebap.com';
        password = 'demo123';
      }

      const response = await authAPI.login(email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('tarsusgo-auth', JSON.stringify(response.user));
        onLogin(response.user);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      // Fallback to localStorage demo data if backend fails
      const demoUsers = {
        user: {
          id: 'demo-user-1',
          email: 'ahmet@tarsus.com',
          name: 'Ahmet Yılmaz',
          phone: '0555 123 45 67',
          userType: 'individual',
          neighborhood: 'cumhuriyet-mahallesi'
        },
        business: {
          id: 'demo-business-1',
          email: 'info@tarsuskebap.com',
          name: 'Mehmet Özdemir',
          phone: '0324 123 45 67',
          userType: 'business',
          neighborhood: 'sehitkerim-mahallesi',
          businessName: 'Tarsus Lezzet Kebap',
          businessCategory: 'restoran',
          businessAddress: 'Şehitkerim Mahallesi, Atatürk Caddesi No:45, Tarsus/Mersin'
        }
      };

      const demoUser = demoUsers[userType];
      localStorage.setItem('tarsusgo-auth', JSON.stringify(demoUser));
      onLogin(demoUser);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
          <p>{isLogin ? 'TarsusGo hesabınıza giriş yapın' : 'TarsusGo\'ya katılın'}</p>
        </div>

        {!isLogin && (
          <div className="user-type-selector">
            <button
              type="button"
              className={`user-type-btn ${userType === 'user' ? 'active' : ''}`}
              onClick={() => setUserType('user')}
            >
              👤 Bireysel Kullanıcı
            </button>
            <button
              type="button"
              className={`user-type-btn ${userType === 'business' ? 'active' : ''}`}
              onClick={() => setUserType('business')}
            >
              🏢 İşletme
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-posta Adresi</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ornek@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Şifrenizi giriniz"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Şifre Tekrar</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Şifrenizi tekrar giriniz"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Adınız ve soyadınız"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Telefon (İsteğe Bağlı)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0555 123 45 67 (opsiyonel)"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {userType === 'business' && (
                <>
                  <div className="form-group">
                    <label>İşletme Adı</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="İşletmenizin adı"
                      className={errors.businessName ? 'error' : ''}
                    />
                    {errors.businessName && <span className="error-text">{errors.businessName}</span>}
                  </div>

                  <div className="form-group">
                    <label>İşletme Kategorisi</label>
                    <select
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleInputChange}
                      className={errors.businessCategory ? 'error' : ''}
                    >
                      <option value="">Kategori seçiniz</option>
                      {businessCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.businessCategory && <span className="error-text">{errors.businessCategory}</span>}
                  </div>

                  <div className="form-group">
                    <label>İşletme Adresi</label>
                    <textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      placeholder="İşletmenizin tam adresi"
                      rows={3}
                      className={errors.businessAddress ? 'error' : ''}
                    />
                    {errors.businessAddress && <span className="error-text">{errors.businessAddress}</span>}
                  </div>
                </>
              )}
            </>
          )}

          {errors.submit && (
            <div className="form-error" style={{marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee', color: '#d32f2f', borderRadius: '4px', fontSize: '0.9rem'}}>
              {errors.submit}
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin && (
            <div className="demo-login-section">
              <p className="demo-title">🚀 Demo Hesaplarla Hızlı Giriş:</p>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="demo-btn user-demo"
                  onClick={() => loginWithDemo('user')}
                >
                  👤 Kullanıcı Olarak Gir
                  <small>Ahmet Yılmaz</small>
                </button>
                <button
                  type="button"
                  className="demo-btn business-demo"
                  onClick={() => loginWithDemo('business')}
                >
                  🏢 İşletme Olarak Gir
                  <small>Tarsus Lezzet Kebap</small>
                </button>
              </div>
            </div>
          )}
          
          <div className="auth-toggle-section">
            <p>
              {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={toggleMode}
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
