const { uploadBufferToCloudinary } = require('../config/cloudinary');

/**
 * Handle single document upload (Aadhaar or PAN)
 * Body params: appId, customerId, docType ('aadhaar' | 'pan')
 * File: req.file (multer memory buffer)
 */
const uploadSingleDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was uploaded. Please provide a valid PDF or image file.'
      });
    }

    const { appId = 'VMF-APP-TEMP', customerId = 'ANONYMOUS', docType = 'document' } = req.body;
    const originalName = req.file.originalname || `${docType}_document`;

    console.log(`[Upload Request] App ID: ${appId}, Type: ${docType}, File: ${originalName}, Size: ${req.file.size} bytes`);

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      fileName: originalName,
      folder: `vmax/applications/${appId}`,
      tags: ['vmax', 'kyc', docType, appId, customerId]
    });

    return res.status(200).json({
      success: true,
      message: `${docType.toUpperCase()} document uploaded successfully.`,
      data: {
        appId,
        customerId,
        docType,
        fileName: originalName,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        createdAt: result.created_at
      }
    });
  } catch (error) {
    console.error('[Upload Single Document Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document to Cloudinary.',
      error: error.message || error
    });
  }
};

/**
 * Handle batch upload of Aadhaar and PAN documents in a single request
 * Files: req.files.aadhaar, req.files.pan
 * Body: appId, customerId, applicantName, requestedAmount, productType
 */
const uploadBatchApplicationDocs = async (req, res) => {
  try {
    const { appId = 'VMF-APP-TEMP', customerId = 'ANONYMOUS' } = req.body;
    const files = req.files || {};

    const aadhaarFile = files.aadhaar ? files.aadhaar[0] : null;
    const panFile = files.pan ? files.pan[0] : null;

    if (!aadhaarFile && !panFile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one document (aadhaar or pan).'
      });
    }

    const uploadPromises = [];

    if (aadhaarFile) {
      uploadPromises.push(
        uploadBufferToCloudinary(aadhaarFile.buffer, {
          fileName: aadhaarFile.originalname || 'aadhaar_doc',
          folder: `vmax/applications/${appId}`,
          tags: ['vmax', 'kyc', 'aadhaar', appId, customerId]
        }).then(r => ({ type: 'aadhaar', url: r.secure_url, publicId: r.public_id }))
      );
    }

    if (panFile) {
      uploadPromises.push(
        uploadBufferToCloudinary(panFile.buffer, {
          fileName: panFile.originalname || 'pan_doc',
          folder: `vmax/applications/${appId}`,
          tags: ['vmax', 'kyc', 'pan', appId, customerId]
        }).then(r => ({ type: 'pan', url: r.secure_url, publicId: r.public_id }))
      );
    }

    const results = await Promise.all(uploadPromises);

    const responseData = {
      appId,
      customerId,
      aadhaarUrl: results.find(r => r.type === 'aadhaar')?.url || null,
      panUrl: results.find(r => r.type === 'pan')?.url || null,
      uploadedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Application documents uploaded and indexed successfully.',
      data: responseData
    });
  } catch (error) {
    console.error('[Upload Batch Docs Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to batch upload KYC documents.',
      error: error.message || error
    });
  }
};

module.exports = {
  uploadSingleDocument,
  uploadBatchApplicationDocs
};
