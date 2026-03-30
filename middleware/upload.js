const multer = require('multer');

const memoryStorage = multer.memoryStorage();

// Configure multer for multiple file uploads
const uploadMultiple = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 10 // Maximum 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/webm'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
  }
});

// Configure multer for single file upload (for thumbnails)
const uploadSingle = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for single file
  },
  fileFilter: (req, file, cb) => {
    // Accept images only for thumbnails
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed for thumbnails.'), false);
    }
  }
});

// Configure multer for about page photo
const uploadAboutPhoto = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for about photo
  },
  fileFilter: (req, file, cb) => {
    // Accept images only for about photo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed for profile photo.'), false);
    }
  }
});

module.exports = {
  uploadMultiple,
  uploadSingle,
  uploadAboutPhoto
};
