const cloudinary = require('cloudinary').v2;
const createCloudinaryStorage = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = createCloudinaryStorage({
  cloudinary,
  folder: 'portfolio',
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'webm'],
  transformation: [{ width: 1200, crop: "limit" }]
});

module.exports = {
  cloudinary,
  storage
};
