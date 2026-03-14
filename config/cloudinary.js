const cloudinary = require('cloudinary');
const createCloudinaryStorage = require('multer-storage-cloudinary');

const cloudinaryV2 = cloudinary.v2;

// Configure Cloudinary
cloudinaryV2.config({
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
  cloudinary: cloudinaryV2,
  storage
};
