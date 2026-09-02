const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'v54mgxrb',
  api_key: process.env.CLOUDINARY_API_KEY || '546863892515234',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'AB_ja-peN2zQBQ19Nal8ML2GaBY',
  secure: true
});

/**
 * Upload a memory buffer to Cloudinary with application-specific tagging
 * @param {Buffer} buffer - File buffer from multer
 * @param {Object} options - { fileName, folder, resourceType, tags }
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const isPdf = (options.fileName || '').toLowerCase().endsWith('.pdf');
    const resourceType = isPdf ? 'raw' : (options.resourceType || 'auto');

    const uploadOptions = {
      folder: options.folder || 'vmax/kyc',
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      tags: options.tags || ['vmax', 'kyc']
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadBufferToCloudinary
};
