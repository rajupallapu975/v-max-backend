const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for Flutter Web & API Clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger
app.use(morgan('dev'));

// Body parsers for JSON and URL-encoded payloads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API Routes mount
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Virat Micro Finance (V-Max) Backend API is running.',
    endpoints: {
      health: 'GET /api/health',
      uploadSingle: 'POST /api/documents/upload',
      uploadBatch: 'POST /api/loans/upload-docs'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  V-Max Backend Server is running on port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME || 'v54mgxrb'}`);
  console.log(`=================================================`);
});
