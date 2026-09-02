# Virat Micro Finance (V-Max) Backend API

Dedicated Node.js / Express backend service for KYC file uploads, Cloudinary media processing, and digital lending application workflows.

## Features
- **Server-Side Cloudinary Uploads:** Securely uploads Aadhaar & PAN files to Cloudinary using private API keys.
- **Application ID Tagging:** Automatically categorizes KYC documents in folders by `appId` (`vmax/applications/VMF-APP-XXXXX`).
- **REST Endpoints:**
  - `GET /api/health`: Health status.
  - `POST /api/documents/upload`: Single KYC document upload (`file`, `appId`, `customerId`, `docType`).
  - `POST /api/loans/upload-docs`: Batch KYC document upload (`aadhaar`, `pan`, `appId`, `customerId`).

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (`.env`)
```env
PORT=4000
CLOUDINARY_CLOUD_NAME=v54mgxrb
CLOUDINARY_API_KEY=546863892515234
CLOUDINARY_API_SECRET=AB_ja-peN2zQBQ19Nal8ML2GaBY
```

### 3. Run Server
```bash
npm start
# or development with auto-reload:
npm run dev
```
