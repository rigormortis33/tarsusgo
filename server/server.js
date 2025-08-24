const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../.env' });

const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const communityRoutes = require('./routes/community');
const emergencyRoutes = require('./routes/emergency');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tarsusgo.com'] 
    : ['http://localhost:3000', 'http://localhost:5002'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/emergency', emergencyRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Database connection test
db.execute('SELECT 1')
  .then(() => {
    console.log('✅ Database connection successful');
    
    app.listen(PORT, () => {
      console.log(`🚀 TarsusGo API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
