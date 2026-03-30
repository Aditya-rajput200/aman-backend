const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');
const { uploadMultiple, uploadSingle, uploadAboutPhoto } = require('../middleware/upload');
const { requireAdminAuth } = require('../middleware/adminAuth');

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'portfolio', transformation: [{ width: 1200, crop: 'limit' }], ...options },
      (error, result) => (error ? reject(error) : resolve(result))
    ).end(buffer);
  });

// Upload multiple files
router.post('/multiple', requireAdminAuth, uploadMultiple.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = await Promise.all(req.files.map(async (file) => {
      const result = await uploadBufferToCloudinary(file.buffer);
      return {
        url: result.secure_url,
        filename: result.public_id,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: result.bytes,
        public_id: result.public_id,
        folder: 'portfolio'
      };
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Upload single file (for thumbnails, icons, etc.)
router.post('/single', requireAdminAuth, uploadSingle.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);
    const uploadedFile = {
      url: result.secure_url,
      filename: result.public_id,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: result.bytes,
      public_id: result.public_id,
      folder: 'portfolio'
    };

    res.json({
      message: 'File uploaded successfully',
      file: uploadedFile
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload about page photo
router.post('/about-photo', requireAdminAuth, uploadAboutPhoto.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);
    const uploadedFile = {
      url: result.secure_url,
      filename: result.public_id,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: result.bytes,
      public_id: result.public_id,
      folder: 'portfolio'
    };

    res.json({
      message: 'About photo uploaded successfully',
      file: uploadedFile
    });
  } catch (error) {
    console.error('Error uploading about photo:', error);
    res.status(500).json({ error: 'Failed to upload about photo' });
  }
});

// Delete file from Cloudinary
router.delete('/delete', requireAdminAuth, async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete file' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get file info
router.get('/info/:public_id', requireAdminAuth, async (req, res) => {
  try {
    const { public_id } = req.params;
    
    const result = await cloudinary.api.resource(public_id);
    
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
      created_at: result.created_at
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Search files in Cloudinary
router.get('/search', requireAdminAuth, async (req, res) => {
  try {
    const { folder = 'portfolio', prefix, max_results = 50 } = req.query;
    
    const searchParams = {
      type: 'upload',
      prefix: prefix || '',
      max_results: parseInt(max_results)
    };

    if (folder) {
      searchParams.prefix = folder + '/' + (prefix || '');
    }

    const result = await cloudinary.api.resources(searchParams);
    
    const files = result.resources.map(resource => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      format: resource.format,
      size: resource.bytes,
      created_at: resource.created_at,
      folder: resource.folder
    }));

    res.json({
      files,
      total_count: result.total_count
    });
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({ error: 'Failed to search files' });
  }
});

module.exports = router;
