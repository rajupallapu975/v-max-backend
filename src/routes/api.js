const express = require('express');
const multer = require('multer');
const { uploadSingleDocument, uploadBatchApplicationDocs } = require('../controllers/uploadController');

const router = express.Router();

// Memory storage so files are streamed directly to Cloudinary without writing to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB max file size
  },
  fileFilter: (req, file, cb) => {
    const originalName = (file.originalname || '').toLowerCase();
    const ext = originalName.split('.').pop();
    const allowedExts = ['pdf', 'jpeg', 'jpg', 'png', 'webp'];
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/octet-stream'
    ];
    if (allowedExts.includes(ext) || allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format (${file.mimetype || ext}). Only PDF, JPEG, JPG, and PNG are allowed.`));
    }
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'V-Max Digital Lending Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Single document upload: POST /api/documents/upload
// Form-data: 'file' (Binary), 'appId', 'customerId', 'docType'
router.post('/documents/upload', upload.single('file'), uploadSingleDocument);

// Batch document upload: POST /api/loans/upload-docs
// Form-data: 'aadhaar' (Binary), 'pan' (Binary), 'appId', 'customerId'
router.post(
  '/loans/upload-docs',
  upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 }
  ]),
  uploadBatchApplicationDocs
);

module.exports = router;
