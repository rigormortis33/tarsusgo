const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tarsusgo.com/api' 
  : 'http://localhost:5000/api';

// API çağrıları için yardımcı fonksiyon
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async () => {
    return makeRequest('/auth/profile');
  }
};

// Business API
export const businessAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.neighborhood) {
      queryParams.append('neighborhood', filters.neighborhood);
    }
    if (filters.category) {
      queryParams.append('category', filters.category);
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/business${queryString ? `?${queryString}` : ''}`;
    
    return makeRequest(endpoint);
  },

  create: async (businessData) => {
    return makeRequest('/business', {
      method: 'POST',
      body: JSON.stringify(businessData)
    });
  },

  update: async (id, businessData) => {
    return makeRequest(`/business/${id}`, {
      method: 'PUT',
      body: JSON.stringify(businessData)
    });
  },

  delete: async (id) => {
    return makeRequest(`/business/${id}`, {
      method: 'DELETE'
    });
  }
};

// Community API
export const communityAPI = {
  getMessages: async (neighborhood = null) => {
    const endpoint = neighborhood 
      ? `/community/messages?neighborhood=${encodeURIComponent(neighborhood)}`
      : '/community/messages';
    
    return makeRequest(endpoint);
  },

  createMessage: async (messageData) => {
    return makeRequest('/community/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  },

  updateMessage: async (id, messageData) => {
    return makeRequest(`/community/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(messageData)
    });
  },

  deleteMessage: async (id) => {
    return makeRequest(`/community/messages/${id}`, {
      method: 'DELETE'
    });
  }
};

// Emergency API
export const emergencyAPI = {
  getAll: async (category = null) => {
    const endpoint = category 
      ? `/emergency?category=${encodeURIComponent(category)}`
      : '/emergency';
    
    return makeRequest(endpoint);
  },

  create: async (contactData) => {
    return makeRequest('/emergency', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  },

  update: async (id, contactData) => {
    return makeRequest(`/emergency/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  },

  delete: async (id) => {
    return makeRequest(`/emergency/${id}`, {
      method: 'DELETE'
    });
  }
};

// Neighborhoods API
export const neighborhoodsAPI = {
  getAll: async () => {
    return makeRequest('/neighborhoods');
  },

  create: async (neighborhoodData) => {
    return makeRequest('/neighborhoods', {
      method: 'POST',
      body: JSON.stringify(neighborhoodData)
    });
  }
};

// Health check
export const healthCheck = async () => {
  return makeRequest('/health');
};
